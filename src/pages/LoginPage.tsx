import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, NotebookPen } from 'lucide-react';
import { firebaseAuth } from '../services/firebaseAuth';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
    const { loginGuest } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/";

    const handleGoogleLogin = async () => {
        try {
            await firebaseAuth.login();
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login Failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-8 bg-card p-8 rounded-xl border shadow-lg">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                        <NotebookPen size={28} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome to Notes Manager</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to sync your notes across devices securely with Firebase
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        <span>Sign in with Google</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or try the demo</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            loginGuest();
                            navigate(from, { replace: true });
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium"
                    >
                        <LogIn size={16} />
                        <span>Enter as Guest</span>
                    </button>
                </div>

                <p className="text-center text-xs text-muted-foreground pt-4">
                    Your notes are synced to Firestore with client-side encryption support.
                </p>
            </div>
        </div>
    );
}
