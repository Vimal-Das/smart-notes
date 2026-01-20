import { db } from '../db/db';
import { db as firestore } from '../lib/firebase';
import { collection, doc, writeBatch, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import type { Note } from '../types';

export class FirebaseSyncService {
    private static isSyncing = false;

    static async sync(user: any) {
        if (!user || this.isSyncing) return;
        this.isSyncing = true;

        try {
            const notesCollection = collection(firestore, `users/${user.id}/notes`);

            // 1. Get all local notes
            const localNotes = await db.notes.toArray();

            // 2. Push local changes to Firestore (Last Write Wins)
            const batch = writeBatch(firestore);
            for (const note of localNotes) {
                const noteRef = doc(notesCollection, note.id);
                batch.set(noteRef, {
                    ...note,
                    updatedAt: note.updatedAt || new Date().toISOString()
                }, { merge: true });
            }
            await batch.commit();

            // 3. Pull updates from Firestore
            const q = query(notesCollection);
            const querySnapshot = await getDocs(q);

            const serverNotes: Note[] = [];
            querySnapshot.forEach((doc) => {
                serverNotes.push(doc.data() as Note);
            });

            // 4. Update local DB
            for (const sNote of serverNotes) {
                const lNote = localNotes.find(n => n.id === sNote.id);
                if (!lNote || sNote.updatedAt > lNote.updatedAt) {
                    await db.notes.put(sNote);
                }
            }

            console.log('Firebase Sync completed successfully');
        } catch (error) {
            console.error('Firebase Sync Error:', error);
        } finally {
            this.isSyncing = false;
        }
    }
}
