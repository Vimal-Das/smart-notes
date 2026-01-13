const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function initDb() {
    const db = await open({
        filename: path.join(__dirname, 'notes.db'),
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT,
      content TEXT,
      updatedAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL,
      isEncrypted INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_notes_userId ON notes(userId);
  `);

    return db;
}

module.exports = { initDb };
