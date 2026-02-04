import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Fetch additional user profile from Firestore
                try {
                    const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (profileDoc.exists()) {
                        setUserProfile(profileDoc.data());
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    // Fallback for demo without Firebase
                    const cached = localStorage.getItem(`profile_${firebaseUser.uid}`);
                    if (cached) {
                        setUserProfile(JSON.parse(cached));
                    }
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Register new user
    const register = async (email, password, displayName, role = 'student') => {
        try {
            const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(newUser, { displayName });

            // Create user profile in Firestore
            const profile = {
                uid: newUser.uid,
                email,
                displayName,
                role,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.uid}`,
                isAnonymous: role === 'student',
                createdAt: new Date().toISOString(),
                ...(role === 'teacher' && {
                    specialties: [],
                    bio: '',
                    availableHours: [],
                    totalConsultations: 0
                })
            };

            try {
                await setDoc(doc(db, 'users', newUser.uid), profile);
            } catch (error) {
                console.error('Firestore error, using localStorage:', error);
                localStorage.setItem(`profile_${newUser.uid}`, JSON.stringify(profile));
            }

            setUserProfile(profile);
            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            const { user: loggedUser } = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: loggedUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Update user profile
    const updateUserProfile = async (updates) => {
        if (!user) return { success: false, error: 'No user logged in' };

        try {
            const newProfile = { ...userProfile, ...updates };
            await setDoc(doc(db, 'users', user.uid), newProfile, { merge: true });
            setUserProfile(newProfile);
            return { success: true };
        } catch (error) {
            // Fallback to localStorage
            const newProfile = { ...userProfile, ...updates };
            localStorage.setItem(`profile_${user.uid}`, JSON.stringify(newProfile));
            setUserProfile(newProfile);
            return { success: true };
        }
    };

    // Check if user has specific role
    const hasRole = (role) => userProfile?.role === role;
    const isStudent = () => hasRole('student');
    const isTeacher = () => hasRole('teacher');
    const isAdmin = () => hasRole('admin');

    const value = {
        user,
        userProfile,
        loading,
        register,
        login,
        logout,
        updateUserProfile,
        hasRole,
        isStudent,
        isTeacher,
        isAdmin,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
