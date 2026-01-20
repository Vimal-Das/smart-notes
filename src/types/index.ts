export interface Note {
    id: string;
    title: string;
    content: string;
    folderId?: string;
    createdAt: number;
    updatedAt: string | number;
    isEncrypted: boolean;
}

export interface Folder {
    id: string;
    name: string;
    parentId?: string;
    createdAt: number;
}

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

export type Theme = 'dark' | 'light' | 'system';
