import { db } from '../db/db';
import type { Note } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export class SyncService {
    private static isSyncing = false;

    static async sync(user: any, guestId: string | null) {
        if (this.isSyncing) return;
        this.isSyncing = true;

        try {
            // 1. Get all local notes
            const localNotes = await db.notes.toArray();

            // 2. Prepare headers
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (user?.token) {
                // We'll need to store the raw google token in the user object
                headers['Authorization'] = `Bearer ${user.token}`;
            } else if (guestId) {
                headers['x-guest-id'] = guestId;
            } else {
                console.warn('Sync skipped: No user or guest ID');
                return;
            }

            // 3. Send to server
            const response = await fetch(`${API_BASE_URL}/sync`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ notes: localNotes }),
            });

            if (!response.ok) {
                throw new Error(`Sync failed: ${response.statusText}`);
            }

            const data = await response.json();
            const serverNotes: Note[] = data.notes;

            // 4. Update local DB with server versions (Last Write Wins)
            if (serverNotes && Array.isArray(serverNotes)) {
                for (const sNote of serverNotes) {
                    const lNote = localNotes.find(n => n.id === sNote.id);

                    if (!lNote || sNote.updatedAt > lNote.updatedAt) {
                        await db.notes.put(sNote);
                    }
                }
            }

            console.log('Sync completed successfully');
        } catch (error) {
            console.error('Sync Error:', error);
        } finally {
            this.isSyncing = false;
        }
    }
}
