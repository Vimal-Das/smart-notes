import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, NotebookPen } from 'lucide-react';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || "/";

    const handleGoogleSuccess = (credentialResponse: any) => {
        const decoded: any = jwtDecode(credentialResponse.credential);
        const user = {
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            provider: 'google' as const,
            token: credentialResponse.credential
        };
        login(user);
        navigate(from, { replace: true });
    };

    const handleDemoLogin = () => {
        const demoUser = {
            id: 'demo-user-123',
            name: 'Demo User',
            email: 'demo@example.com',
            picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            provider: 'google' as const
        };
        login(demoUser);
        navigate(from, { replace: true });
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
                        Sign in to sync your notes across devices
                    </p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            useOneTap
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or try the demo</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDemoLogin}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors text-sm font-medium"
                    >
                        <LogIn size={16} />
                        <span>Enter as Guest</span>
                    </button>
                </div>

                <p className="text-center text-xs text-muted-foreground pt-4">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
