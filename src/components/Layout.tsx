import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';
import { useTabs } from '../context/TabContext';

export function Layout() {
    const { openNoteIds, activeNoteId, openTab, setActiveTab } = useTabs();
    const location = useLocation();
    const navigate = useNavigate();

    // 1. URL -> Tabs: Trigger ONLY when the user navigates (location.key changes)
    // This prevents the "re-opening closed tab" race condition
    useEffect(() => {
        if (location.pathname === '/graph') {
            if (!openNoteIds.includes('graph')) {
                openTab('graph');
            } else if (activeNoteId !== 'graph') {
                setActiveTab('graph');
            }
        } else if (location.pathname.startsWith('/note/')) {
            const id = location.pathname.split('/').pop();
            if (id) {
                if (!openNoteIds.includes(id)) {
                    openTab(id);
                } else if (activeNoteId !== id) {
                    setActiveTab(id);
                }
            }
        }
    }, [location.key]); // Key changes on navigation, but NOT on tab state changes

    // 2. Tabs -> URL: Active tab drives the navigation
    // This handles tab switching and tab CLOSURE
    useEffect(() => {
        if (activeNoteId === 'graph') {
            if (location.pathname !== '/graph') {
                navigate('/graph');
            }
        } else if (activeNoteId) {
            const targetPath = `/note/${activeNoteId}`;
            if (location.pathname !== targetPath) {
                navigate(targetPath);
            }
        } else if (!activeNoteId && location.pathname !== '/' && location.pathname !== '/graph' && !location.pathname.startsWith('/note/')) {
            // No active tab and we are sitting on a tab's URL? Go home.
        } else if (!activeNoteId && (location.pathname === '/graph' || location.pathname.startsWith('/note/'))) {
            navigate('/');
        }
    }, [activeNoteId, navigate, location.pathname]);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <TabBar />
                <main className="flex-1 overflow-hidden relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
