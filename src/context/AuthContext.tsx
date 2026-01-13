import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../services/auth';

interface AuthContextType {
    user: User | null;
    guestId: string | null;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [guestId, setGuestId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored user
        const storedUser = localStorage.getItem('notes_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse stored user', e);
            }
        }

        // Handle Guest ID
        let gid = localStorage.getItem('notes_guest_id');
        if (!gid) {
            gid = crypto.randomUUID();
            localStorage.setItem('notes_guest_id', gid);
        }
        setGuestId(gid);

        setIsLoading(false);
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('notes_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('notes_user');
        // Also clear any other session data if needed
    };

    return (
        <AuthContext.Provider value={{ user, guestId, isLoading, login, logout }}>
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
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="h-screen w-screen flex items-center justify-center">Loading session...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
