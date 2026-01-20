import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { firebaseAuth } from '../services/firebaseAuth';

interface AuthContextType {
    user: User | null;
    isGuest: boolean;
    guestId: string | null;
    isLoading: boolean;
    loginGuest: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [guestId, setGuestId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Handle Guest ID
        let gid = localStorage.getItem('notes_guest_id');
        if (!gid) {
            gid = crypto.randomUUID();
            localStorage.setItem('notes_guest_id', gid);
        }
        setGuestId(gid);

        // Check if was previously a guest
        const wasGuest = localStorage.getItem('notes_is_guest') === 'true';

        // Listen for Firebase Auth changes
        const unsubscribe = firebaseAuth.onAuthChange((fbUser) => {
            if (fbUser) {
                setUser(fbUser);
                setIsGuest(false);
                localStorage.removeItem('notes_is_guest');
            } else if (wasGuest) {
                setIsGuest(true);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginGuest = () => {
        setIsGuest(true);
        localStorage.setItem('notes_is_guest', 'true');
    };

    const logout = async () => {
        await firebaseAuth.logout();
        setUser(null);
        setIsGuest(false);
        localStorage.removeItem('notes_is_guest');
    };

    return (
        <AuthContext.Provider value={{ user, isGuest, guestId, isLoading, loginGuest, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Protected Route Component
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, isGuest, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="h-screen w-screen flex items-center justify-center">Loading session...</div>;
    }

    if (!user && !isGuest) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
