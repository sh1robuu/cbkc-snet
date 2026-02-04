// Teacher Dashboard Page - Main page for teachers to manage consultations
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, CheckCircle, ArrowRight, AlertCircle, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ChatQueue from '../../components/Dashboard/ChatQueue';
import AISummaryPanel from '../../components/Dashboard/AISummaryPanel';
import {
    subscribeToTeacherChats,
    subscribeToMessages,
    addMessage,
    updateChatStatus,
    updateTeacherNotes
} from '../../services/chatService';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, userProfile, isTeacher, logout } = useAuth();

    // State
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const messagesEndRef = useRef(null);

    // Redirect if not teacher
    useEffect(() => {
        if (isAuthenticated && userProfile && !isTeacher()) {
            navigate('/');
        }
    }, [isAuthenticated, userProfile, isTeacher, navigate]);

    // Subscribe to teacher's chats
    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = subscribeToTeacherChats(user.uid, (newChats) => {
            setChats(newChats);

            // Check for high priority notifications
            const highPriorityChats = newChats.filter(
                c => (c.priority === 'critical' || c.priority === 'high') &&
                    (c.status === 'waiting' || c.status === 'ai_active')
            );

            if (highPriorityChats.length > 0) {
                // Add notification
                setNotifications(prev => {
                    const newNoti = highPriorityChats
                        .filter(c => !prev.some(n => n.chatId === c.id))
                        .map(c => ({
                            id: Date.now() + Math.random(),
                            chatId: c.id,
                            message: `Học sinh ${c.studentName || 'ẩn danh'} cần hỗ trợ khẩn cấp!`,
                            priority: c.priority
                        }));
                    return [...prev, ...newNoti];
                });
            }
        });

        return () => unsubscribe();
    }, [user?.uid]);

    // Subscribe to selected chat messages
    useEffect(() => {
        if (!selectedChat?.id) {
            setMessages([]);
            return;
        }

        const unsubscribe = subscribeToMessages(selectedChat.id, (newMessages) => {
            setMessages(newMessages);
        });

        // Mark as teacher_active when teacher selects chat
        if (selectedChat.status === 'waiting' || selectedChat.status === 'ai_active') {
            updateChatStatus(selectedChat.id, 'teacher_active');
        }

        return () => unsubscribe();
    }, [selectedChat?.id]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle send message
    const handleSendMessage = async () => {
        if (!input.trim() || !selectedChat?.id || isSendingMessage) return;

        const content = input.trim();
        setInput('');
        setIsSendingMessage(true);

        await addMessage(selectedChat.id, {
            senderId: user?.uid,
            senderType: 'teacher',
            content,
            isVisible: true
        });

        setIsSendingMessage(false);
    };

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle save notes
    const handleSaveNotes = async (notes) => {
        if (!selectedChat?.id) return;
        setIsSavingNotes(true);
        await updateTeacherNotes(selectedChat.id, notes);
        setIsSavingNotes(false);
    };

    // Handle mark as resolved
    const handleMarkResolved = async () => {
        if (!selectedChat?.id) return;
        await updateChatStatus(selectedChat.id, 'resolved');
        setSelectedChat(null);
    };

    // Handle select chat
    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        // Remove notification for this chat
        setNotifications(prev => prev.filter(n => n.chatId !== chat.id));
    };

    // If not authenticated or not teacher, show access denied
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen gradient-mesh-bg flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
                    <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Truy cập bị từ chối</h2>
                    <p className="text-gray-600 mb-6">Bạn cần đăng nhập với tài khoản giáo viên</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary w-full"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-mesh-bg">
            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <img src="/icon.svg" alt="S-Net" className="w-10 h-10" />
                        <div>
                            <h1 className="font-bold text-xl text-gray-800">Dashboard Giáo viên</h1>
                            <p className="text-sm text-gray-500">Quản lý tư vấn học sinh</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                                <Bell className="w-6 h-6 text-gray-600" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Profile */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                {userProfile?.displayName?.charAt(0) || 'T'}
                            </div>
                            <span className="font-semibold text-gray-700">{userProfile?.displayName || 'Giáo viên'}</span>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <LogOut className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - 3 Column Layout */}
            <div className="pt-20 px-4 pb-4 h-screen">
                <div className="h-full max-w-[1600px] mx-auto grid grid-cols-12 gap-4">
                    {/* Left Panel - Chat Queue */}
                    <div className="col-span-3 h-full">
                        <ChatQueue
                            chats={chats}
                            selectedChatId={selectedChat?.id}
                            onSelectChat={handleSelectChat}
                        />
                    </div>

                    {/* Center Panel - Chat Room */}
                    <div className="col-span-6 h-full">
                        <div className="h-full flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                            {selectedChat ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={selectedChat.studentAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedChat.id}`}
                                                alt={selectedChat.studentName}
                                                className="w-10 h-10 rounded-full border-2 border-white shadow"
                                            />
                                            <div>
                                                <h3 className="font-bold text-gray-800">{selectedChat.studentName || 'Học sinh ẩn danh'}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {selectedChat.status === 'teacher_active' ? 'Đang chat' : 'Chờ phản hồi'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleMarkResolved}
                                                className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold text-sm 
                                                         hover:bg-green-200 transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Đánh dấu đã tư vấn
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                                        {messages.map((message) => (
                                            <DashboardMessageBubble key={message.id} message={message} />
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="p-4 border-t border-gray-100 bg-white">
                                        <div className="flex items-end gap-3">
                                            <textarea
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Nhập tin nhắn..."
                                                rows={1}
                                                className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 border-none resize-none 
                                                         focus:outline-none focus:ring-2 focus:ring-purple-300"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!input.trim() || isSendingMessage}
                                                className={`
                                                    p-3 rounded-2xl transition-all
                                                    ${input.trim() && !isSendingMessage
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <ArrowRight className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Chọn một học sinh từ danh sách bên trái</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - AI Summary & Notes */}
                    <div className="col-span-3 h-full">
                        <AISummaryPanel
                            chat={selectedChat}
                            onSaveNotes={handleSaveNotes}
                            isSaving={isSavingNotes}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Message Bubble for Dashboard
const DashboardMessageBubble = ({ message }) => {
    const { senderType, content } = message;

    const isStudent = senderType === 'student';
    const isAI = senderType === 'ai';
    const isSystem = senderType === 'system';
    const isTeacher = senderType === 'teacher';

    // System message
    if (isSystem) {
        return (
            <div className="flex justify-center">
                <div className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isStudent ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex items-end gap-2 max-w-[75%] ${isStudent ? '' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                    ${isStudent
                        ? 'bg-gray-300'
                        : isAI
                            ? 'bg-gradient-to-br from-purple-400 to-pink-400'
                            : 'bg-gradient-to-br from-blue-400 to-cyan-400'
                    }
                `}>
                    {isStudent
                        ? <User className="w-4 h-4 text-gray-600" />
                        : isAI
                            ? <Bot className="w-4 h-4 text-white" />
                            : <User className="w-4 h-4 text-white" />
                    }
                </div>

                {/* Bubble */}
                <div>
                    {/* Label */}
                    <span className={`text-[10px] font-medium mb-0.5 block ${isStudent ? 'text-left' : 'text-right'}`}>
                        {isStudent ? 'Học sinh' : isAI ? 'AI' : 'Bạn'}
                    </span>
                    <div className={`
                        px-3 py-2 rounded-xl text-sm whitespace-pre-wrap
                        ${isStudent
                            ? 'bg-gray-200 text-gray-800 rounded-bl-md'
                            : isAI
                                ? 'bg-purple-100 text-purple-900 rounded-br-md border border-purple-200'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-md'
                        }
                    `}>
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
