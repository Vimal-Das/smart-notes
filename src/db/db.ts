import Dexie, { type Table } from 'dexie';
import type { Note, Folder } from '../types';

export class NotesDatabase extends Dexie {
    notes!: Table<Note>;
    folders!: Table<Folder>;

    constructor() {
        super('NotesManagerDB');
        this.version(1).stores({
            notes: 'id, title, folderId, createdAt, updatedAt', // Primary key and indexed props
            folders: 'id, name, parentId'
        });
    }

    async updateNoteReferences(oldTitle: string, newTitle: string) {
        if (!oldTitle || oldTitle === newTitle) return;

        await this.transaction('rw', [this.notes], async () => {
            const allNotes = await this.notes.toArray();
            const escapedOldTitle = oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Regex matches [[Old Title]] or [[Old Title|Alias]]
            const regex = new RegExp(`\\[\\[${escapedOldTitle}(\\|.*?)?\\]\\]`, 'g');

            const updates = allNotes
                .filter(note => regex.test(note.content))
                .map(note => ({
                    ...note,
                    content: note.content.replace(regex, (_, alias) => {
                        return `[[${newTitle}${alias || ''}]]`;
                    }),
                    updatedAt: Date.now()
                }));

            if (updates.length > 0) {
                await this.notes.bulkPut(updates);
            }
        });
    }
}

export const db = new NotesDatabase();
