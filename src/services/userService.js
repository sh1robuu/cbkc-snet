// User Management Service for Admin
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';

// Get all users (optionally filter by role)
export const getAllUsers = async (role = null) => {
    try {
        let q;
        if (role) {
            q = query(
                collection(db, 'users'),
                where('role', '==', role),
                orderBy('createdAt', 'desc')
            );
        } else {
            q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to localStorage for demo
        const users = JSON.parse(localStorage.getItem('snet_users') || '[]');
        if (role) {
            return users.filter(u => u.role === role);
        }
        return users;
    }
};

// Get all teachers that are active for counseling
export const getActiveTeachers = async () => {
    try {
        const q = query(
            collection(db, 'users'),
            where('role', '==', 'teacher'),
            where('isActiveForCounseling', '==', true)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching active teachers:', error);
        const users = JSON.parse(localStorage.getItem('snet_users') || '[]');
        return users.filter(u => u.role === 'teacher' && u.isActiveForCounseling);
    }
};

// Create a new user (admin only)
export const createUser = async (userData) => {
    const { email, password, displayName, role, ...extraData } = userData;

    try {
        // Create Firebase auth user
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        // Create user profile in Firestore
        const profile = {
            uid: user.uid,
            email,
            displayName,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            createdAt: new Date().toISOString(),
            isActiveForCounseling: role === 'teacher' ? true : false,
            ...extraData,
            ...(role === 'teacher' && {
                specialties: extraData.specialties || [],
                bio: extraData.bio || '',
                availableHours: extraData.availableHours || [],
                totalConsultations: 0,
                rating: 5.0,
                isOnline: false
            })
        };

        await setDoc(doc(db, 'users', user.uid), profile);

        // Also save to localStorage for demo fallback
        const users = JSON.parse(localStorage.getItem('snet_users') || '[]');
        users.push(profile);
        localStorage.setItem('snet_users', JSON.stringify(users));

        return { success: true, user: profile };
    } catch (error) {
        console.error('Error creating user:', error);

        // Fallback: Create in localStorage only for demo
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, error: 'Email đã được sử dụng' };
        }

        // Create mock user for demo
        const mockProfile = {
            uid: `mock-${Date.now()}`,
            email,
            displayName,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
            createdAt: new Date().toISOString(),
            isActiveForCounseling: role === 'teacher' ? true : false,
            ...extraData,
            ...(role === 'teacher' && {
                specialties: extraData.specialties || [],
                bio: extraData.bio || '',
                availableHours: extraData.availableHours || [],
                totalConsultations: 0,
                rating: 5.0,
                isOnline: false
            })
        };

        const users = JSON.parse(localStorage.getItem('snet_users') || '[]');
        users.push(mockProfile);
        localStorage.setItem('snet_users', JSON.stringify(users));

        return { success: true, user: mockProfile };
    }
};

// Update user profile
export const updateUser = async (userId, updates) => {
    try {
        await updateDoc(doc(db, 'users', userId), updates);

        // Also update localStorage
        const users = JSON.parse(localStorage.getItem('snet_users') || '[]');
        const index = users.findIndex(u => u.uid === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('snet_users', JSON.stringify(users));
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating user:', error);

        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('snet_users') || '[]');
        const index = users.findIndex(u => u.uid === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('snet_users', JSON.stringify(users));
        }

        return { success: true };
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        await deleteDoc(doc(db, 'users', userId));

        // Also remove from localStorage
        const users = JSON.parse(localStorage.getItem('snet_users') || '[]');
        const filtered = users.filter(u => u.uid !== userId);
        localStorage.setItem('snet_users', JSON.stringify(filtered));

        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);

        const users = JSON.parse(localStorage.getItem('snet_users') || '[]');
        const filtered = users.filter(u => u.uid !== userId);
        localStorage.setItem('snet_users', JSON.stringify(filtered));

        return { success: true };
    }
};

// Toggle teacher's counseling availability
export const toggleTeacherCounseling = async (teacherId, isActive) => {
    return updateUser(teacherId, { isActiveForCounseling: isActive });
};

export default {
    getAllUsers,
    getActiveTeachers,
    createUser,
    updateUser,
    deleteUser,
    toggleTeacherCounseling
};
