import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Sidebar } from './Sidebar';
import { TabBar } from './TabBar';
import { useTabs } from '../context/TabContext';

export function Layout() {
    const { openNoteIds, activeNoteId, openTab, setActiveTab } = useTabs();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // URL Synchronization: Keep tabs in sync with the current URL
    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/note/')) {
            const id = path.split('/note/')[1];
            if (id) openTab(id);
        } else if (path === '/graph') {
            openTab('graph');
        } else if (path === '/search') {
            openTab('search');
        }
    }, [location.pathname, openTab]);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Sidebar with mobile overlay logic */}
            <div className={cn(
                "fixed inset-0 z-50 md:relative md:z-0 transition-opacity duration-300 md:opacity-100 md:visible md:h-full",
                isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible md:visible"
            )}>
                {/* Backdrop for mobile */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />

                <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-72 bg-background border-r transition-transform duration-300 transform md:translate-x-0 md:relative md:w-64 md:h-full",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}>
                    {/* Mobile Close Button */}
                    <div className="md:hidden absolute top-4 right-4 z-50">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 hover:bg-muted rounded-md text-muted-foreground"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <Sidebar />
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center border-b bg-secondary/10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-3 pl-4 text-muted-foreground hover:text-foreground"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex-1 overflow-hidden">
                        <TabBar />
                    </div>
                </div>
                <main className="flex-1 overflow-hidden relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
