export interface Note {
    id: string;
    title: string;
    content: string;
    folderId?: string;
    createdAt: number;
    updatedAt: number;
    isEncrypted: boolean;
}

export interface Folder {
    id: string;
    name: string;
    parentId?: string;
    createdAt: number;
}

export type Theme = 'dark' | 'light' | 'system';
