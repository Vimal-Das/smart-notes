import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    NotebookPen,
    Share2,
    ShieldCheck,
    Zap,
    ArrowRight,
    Github,
    Layers,
    Lock,
    Globe,
    Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
    const navigate = useNavigate();
    const { user, isGuest } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user || isGuest) {
            navigate('/');
        }
    }, [user, isGuest, navigate]);

    const features = [
        {
            icon: <Cpu className="w-6 h-6 text-indigo-400" />,
            title: "Local-First Architecture",
            description: "Instant load times and full offline support. Your notes are always accessible, even without internet."
        },
        {
            icon: <Globe className="w-6 h-6 text-blue-400" />,
            title: "Real-time Sync",
            description: "Powered by Firebase. Seamlessly synchronize your thoughts across all your devices in milliseconds."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
            title: "Military-Grade Privacy",
            description: "Client-side encryption ensures that only you hold the keys to your knowledge. We can't read your notes."
        },
        {
            icon: <Layers className="w-6 h-6 text-violet-400" />,
            title: "Knowledge Graph",
            description: "Visualize relationships between your thoughts with interactive 2D graphs and bi-directional linking."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 md:pt-32 md:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 blur-[120px]">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-violet-600 rounded-full animate-pulse delay-700" />
                </div>

                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700/50 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-sm">
                        <Zap size={14} className="fill-indigo-300" />
                        <span>Now powered by Firebase</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                        Second Brain for <br />
                        <span className="text-indigo-400">Deep Thinkers.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
                        Notes Manager isn't just a place to write. It's an encrypted, local-first knowledge base
                        that helps you connect ideas and sync them securely everywhere.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center gap-2 overflow-hidden"
                        >
                            <span className="relative z-10">Get Started Free</span>
                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                        <button
                            onClick={() => window.open('https://github.com', '_blank')}
                            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50 rounded-xl font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
                        >
                            <Github size={18} />
                            <span>Star on GitHub</span>
                        </button>
                    </div>

                    {/* App Preview Mockup */}
                    <div className="mt-20 relative px-4">
                        <div className="max-w-5xl mx-auto bg-slate-900/80 rounded-2xl border border-slate-700/50 p-2 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-md">
                            <div className="bg-[#0f1117] rounded-xl border border-slate-800/50 overflow-hidden aspect-[16/10] flex items-center justify-center group">
                                <img
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                                    alt="Product Preview"
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/30 mx-auto">
                                        <NotebookPen size={32} />
                                    </div>
                                    <p className="text-xl font-semibold text-white">Interactive Editor</p>
                                    <p className="text-slate-400 text-sm">Markdown + LaTeX + Code blocks</p>
                                </div>
                            </div>
                        </div>
                        {/* Decorative side lights */}
                        <div className="absolute top-1/4 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
                        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to <span className="text-indigo-400">think clearly.</span></h2>
                    <p className="text-slate-400">Minimal tools, maximal focus.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/50 transition-all hover:-translate-y-1 backdrop-blur-sm">
                            <div className="mb-6 p-3 w-fit rounded-lg bg-slate-800/50 group-hover:bg-indigo-500/10 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 px-6">
                <div className="max-w-4xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Start building your graph today.</h2>
                        <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
                            Join over 0 users (and counting!) who are organizing their digital life with Notes Manager.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl"
                        >
                            Try it Out
                        </button>
                    </div>
                    {/* Decorative patterns */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-800/50 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
                        <NotebookPen size={20} />
                    </div>
                    <span className="font-bold text-white tracking-tight">Notes Manager</span>
                </div>
                <p className="text-slate-500 text-sm">
                    © 2026 Created with ❤️ for personal knowledge management.
                </p>
            </footer>
        </div>
    );
}
