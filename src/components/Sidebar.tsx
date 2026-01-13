import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { FileText, Search, Settings, Plus, Network, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTabs } from '../context/TabContext';
import { useAuth } from '../context/AuthContext';
import { SyncService } from '../services/SyncService';

export function Sidebar() {
    const navigate = useNavigate();
    const { openTab } = useTabs();
    const { user, guestId, logout } = useAuth();
    const notes = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().toArray());

    const createNote = async () => {
        const id = crypto.randomUUID();
        await db.notes.add({
            id,
            title: 'Untitled Note',
            content: '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isEncrypted: false
        });
        SyncService.sync(user, guestId);
        openTab(id);
        navigate(`/note/${id}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 h-screen bg-secondary/30 border-r flex flex-col shrink-0">
            <div className="p-4 border-b flex items-center justify-between">
                <h1 className="font-bold text-lg">My Vault</h1>
                <button className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors">
                    <Settings size={18} />
                </button>
            </div>

            <div className="p-2">
                <button
                    onClick={createNote}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus size={16} />
                    <span>New Note</span>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Explorer
                </div>

                <div className="space-y-0.5">
                    {notes?.map(note => (
                        <NavLink
                            key={note.id}
                            to={`/note/${note.id}`}
                            onClick={() => openTab(note.id)}
                            className={({ isActive }) => cn(
                                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors truncate",
                                isActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <FileText size={14} className="shrink-0" />
                            <span className="truncate">{note.title || 'Untitled'}</span>
                        </NavLink>
                    ))}
                    {notes?.length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground italic">No notes created</div>
                    )}
                </div>
            </nav>

            <div className="p-2 border-t space-y-1">
                <NavLink
                    to="/graph"
                    onClick={() => openTab('graph')}
                    className={({ isActive }) => cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <Network size={18} />
                    <span>Graph View</span>
                </NavLink>
                <NavLink
                    to="/search"
                    className={({ isActive }) => cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <Search size={18} />
                    <span>Search</span>
                </NavLink>
            </div>

            {/* User Profile Section */}
            <div className="p-3 border-t bg-muted/20">
                <div className="flex items-center gap-3 mb-2 px-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 border">
                        {user?.picture ? (
                            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon size={16} className="text-primary" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors mt-1"
                >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}

