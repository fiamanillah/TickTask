import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    onAuthStateChanged,
} from 'firebase/auth';

import { auth } from '../utils/firebase';
import axiosInstance from '@/utils/axiosInstence';

const AuthContext = createContext({
    user: null,
    loading: true,
    registerWithEmail: () => {},
    loginWithEmail: () => {},
    loginWithGoogle: () => {},
    logout: () => {},
    resetPassword: () => {},
    updateUserProfile: () => {},
});

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const addUserToDB = async user => {
        try {
            await axiosInstance.post('/api/users/add-user', user);
        } catch (error) {
            console.error('Failed to add user to DB:', error.response?.data || error.message);
        }
    };

    const updateUserProfile = async (displayName, photoURL) => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName, photoURL });
                setUser({ ...auth.currentUser, displayName, photoURL });
            }
        } catch (error) {
            console.error('Error updating user profile:', error.message);
        }
    };

    const registerWithEmail = async (email, password, displayName, photoURL) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            await updateUserProfile(displayName, photoURL);
            await addUserToDB(newUser);
            setUser(newUser);
        } catch (error) {
            console.error('Error registering user:', error.message);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const googleUser = result.user;
            await addUserToDB(googleUser);
            setUser(googleUser);
        } catch (error) {
            console.error('Error logging in with Google:', error.message);
            throw error;
        }
    };

    const loginWithEmail = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error('Error logging in with email:', error.message);
            throw error;
        }
    };

    const resetPassword = async email => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Error resetting password:', error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authContextValue = {
        user,
        loading,
        registerWithEmail,
        loginWithGoogle,
        loginWithEmail,
        resetPassword,
        logout,
        updateUserProfile,
    };

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
