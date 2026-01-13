export interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
    provider: 'google' | 'github' | 'email';
    token?: string;
}

export interface AuthResponse {
    user: User;
    token?: string;
}

export interface AuthProvider {
    id: string;
    name: string;
    login: () => Promise<AuthResponse>;
}

class AuthService {
    private providers: Map<string, AuthProvider> = new Map();

    registerProvider(provider: AuthProvider) {
        this.providers.set(provider.id, provider);
    }

    async login(providerId: string): Promise<AuthResponse> {
        const provider = this.providers.get(providerId);
        if (!provider) {
            throw new Error(`Auth provider ${providerId} not registered`);
        }
        return provider.login();
    }
}

export const authService = new AuthService();
