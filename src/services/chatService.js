// Chat Service - Firebase Realtime Chat Operations
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ===== CHAT OPERATIONS =====

// Create a new chat room when student selects a teacher
export const createChatRoom = async (studentId, teacherId, studentProfile) => {
    try {
        const chatData = {
            studentId,
            teacherId,
            studentName: studentProfile?.displayName || 'Học sinh ẩn danh',
            studentAvatar: studentProfile?.avatar || null,

            status: 'waiting', // waiting | ai_active | teacher_active | resolved
            priority: 'medium',
            priorityScore: 50,

            aiSummary: null,
            teacherNotes: '',

            createdAt: serverTimestamp(),
            lastMessageAt: serverTimestamp(),
            resolvedAt: null,

            teacherJoinedAt: null,
            aiActivatedAt: null
        };

        const chatRef = await addDoc(collection(db, 'chats'), chatData);

        // Add system welcome message
        await addMessage(chatRef.id, {
            senderId: 'system',
            senderType: 'system',
            content: 'Chào em, S-Net đang kết nối em đến với các thầy cô. Em vui lòng chờ trong giây lát nhé 💙',
            isVisible: true
        });

        return { success: true, chatId: chatRef.id };
    } catch (error) {
        console.error('Error creating chat room:', error);
        return { success: false, error: error.message };
    }
};

// Add a message to chat
export const addMessage = async (chatId, messageData) => {
    try {
        const message = {
            chatId,
            senderId: messageData.senderId,
            senderType: messageData.senderType, // student | teacher | ai | system
            content: messageData.content,
            isVisible: messageData.isVisible !== false, // Default true
            timestamp: serverTimestamp()
        };

        const messageRef = await addDoc(collection(db, 'messages'), message);

        // Update chat lastMessageAt
        await updateDoc(doc(db, 'chats', chatId), {
            lastMessageAt: serverTimestamp()
        });

        return { success: true, messageId: messageRef.id };
    } catch (error) {
        console.error('Error adding message:', error);
        return { success: false, error: error.message };
    }
};

// Update chat status
export const updateChatStatus = async (chatId, status, additionalData = {}) => {
    try {
        const updateData = {
            status,
            ...additionalData
        };

        if (status === 'ai_active') {
            updateData.aiActivatedAt = serverTimestamp();
        } else if (status === 'teacher_active') {
            updateData.teacherJoinedAt = serverTimestamp();
        } else if (status === 'resolved') {
            updateData.resolvedAt = serverTimestamp();
        }

        await updateDoc(doc(db, 'chats', chatId), updateData);
        return { success: true };
    } catch (error) {
        console.error('Error updating chat status:', error);
        return { success: false, error: error.message };
    }
};

// Update AI summary for a chat
export const updateAISummary = async (chatId, summary) => {
    try {
        await updateDoc(doc(db, 'chats', chatId), {
            aiSummary: summary,
            priority: summary.severity,
            priorityScore: calculatePriorityScore(summary)
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating AI summary:', error);
        return { success: false, error: error.message };
    }
};

// Update teacher notes
export const updateTeacherNotes = async (chatId, notes) => {
    try {
        await updateDoc(doc(db, 'chats', chatId), {
            teacherNotes: notes
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating teacher notes:', error);
        return { success: false, error: error.message };
    }
};

// Get chat by ID
export const getChatById = async (chatId) => {
    try {
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (chatDoc.exists()) {
            return { success: true, chat: { id: chatDoc.id, ...chatDoc.data() } };
        }
        return { success: false, error: 'Chat not found' };
    } catch (error) {
        console.error('Error getting chat:', error);
        return { success: false, error: error.message };
    }
};

// ===== TEACHER DASHBOARD OPERATIONS =====

// Get all chats for a teacher (sorted by priority)
export const getTeacherChats = async (teacherId) => {
    try {
        const q = query(
            collection(db, 'chats'),
            where('teacherId', '==', teacherId),
            orderBy('priorityScore', 'desc'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const chats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, chats };
    } catch (error) {
        console.error('Error getting teacher chats:', error);
        return { success: false, error: error.message };
    }
};

// Subscribe to teacher's chat queue (realtime)
export const subscribeToTeacherChats = (teacherId, callback) => {
    const q = query(
        collection(db, 'chats'),
        where('teacherId', '==', teacherId)
    );

    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => {
                // Sort by: status (waiting first) -> priorityScore -> createdAt
                const statusOrder = { waiting: 0, ai_active: 1, teacher_active: 2, resolved: 3 };
                if (statusOrder[a.status] !== statusOrder[b.status]) {
                    return statusOrder[a.status] - statusOrder[b.status];
                }
                if (b.priorityScore !== a.priorityScore) {
                    return b.priorityScore - a.priorityScore;
                }
                return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
            });
        callback(chats);
    });
};

// Subscribe to messages in a chat (realtime)
export const subscribeToMessages = (chatId, callback) => {
    const q = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId),
        orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(messages);
    });
};

// ===== PRIORITY CALCULATION =====

export const calculatePriorityScore = (aiSummary) => {
    if (!aiSummary) return 50;

    let score = 0;

    // Severity base score
    const severityScores = {
        critical: 100,
        high: 75,
        medium: 50,
        low: 25
    };
    score += severityScores[aiSummary.severity] || 50;

    // Urgent signs bonus
    if (aiSummary.urgentSigns && aiSummary.urgentSigns.length > 0) {
        score += 20;
    }

    // Cap at 150
    return Math.min(score, 150);
};

// ===== TEACHER OPERATIONS =====

// Get all teachers
export const getAllTeachers = async () => {
    try {
        const q = query(
            collection(db, 'users'),
            where('role', '==', 'teacher')
        );

        const snapshot = await getDocs(q);
        const teachers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, teachers };
    } catch (error) {
        console.error('Error getting teachers:', error);
        return { success: false, error: error.message };
    }
};

// Get teacher by ID
export const getTeacherById = async (teacherId) => {
    try {
        const teacherDoc = await getDoc(doc(db, 'users', teacherId));
        if (teacherDoc.exists() && teacherDoc.data().role === 'teacher') {
            return { success: true, teacher: { id: teacherDoc.id, ...teacherDoc.data() } };
        }
        return { success: false, error: 'Teacher not found' };
    } catch (error) {
        console.error('Error getting teacher:', error);
        return { success: false, error: error.message };
    }
};

// Check if student has active chat with teacher
export const getActiveChat = async (studentId, teacherId) => {
    try {
        const q = query(
            collection(db, 'chats'),
            where('studentId', '==', studentId),
            where('teacherId', '==', teacherId),
            where('status', 'in', ['waiting', 'ai_active', 'teacher_active'])
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const chatDoc = snapshot.docs[0];
            return { success: true, chat: { id: chatDoc.id, ...chatDoc.data() } };
        }
        return { success: true, chat: null };
    } catch (error) {
        console.error('Error getting active chat:', error);
        return { success: false, error: error.message };
    }
};

export default {
    createChatRoom,
    addMessage,
    updateChatStatus,
    updateAISummary,
    updateTeacherNotes,
    getChatById,
    getTeacherChats,
    subscribeToTeacherChats,
    subscribeToMessages,
    calculatePriorityScore,
    getAllTeachers,
    getTeacherById,
    getActiveChat
};
