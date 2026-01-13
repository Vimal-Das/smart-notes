const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const { authenticate } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db;

async function startServer() {
    db = await initDb();

    // Health check
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    // Sync endpoint
    app.post('/api/sync', authenticate, async (req, res) => {
        const { notes } = req.body;
        const userId = req.userId;

        try {
            // 1. Process client updates
            if (notes && Array.isArray(notes)) {
                for (const note of notes) {
                    // Check if note exists and if the client version is newer
                    const existing = await db.get('SELECT updatedAt FROM notes WHERE id = ? AND userId = ?', [note.id, userId]);

                    if (!existing || note.updatedAt > existing.updatedAt) {
                        await db.run(
                            `INSERT OR REPLACE INTO notes (id, userId, title, content, updatedAt, createdAt, isEncrypted) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [note.id, userId, note.title, note.content, note.updatedAt, note.createdAt, note.isEncrypted ? 1 : 0]
                        );
                    }
                }
            }

            // 2. Fetch all notes for this user to return to client
            const allNotes = await db.all('SELECT * FROM notes WHERE userId = ?', [userId]);

            // Clean up for client (handle sqlite 1/0 for boolean)
            const sanitizedNotes = allNotes.map(n => ({
                ...n,
                isEncrypted: !!n.isEncrypted
            }));

            res.json({ success: true, notes: sanitizedNotes });
        } catch (error) {
            console.error('Sync Error:', error);
            res.status(500).json({ error: 'Failed to synchronize notes' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

startServer();
