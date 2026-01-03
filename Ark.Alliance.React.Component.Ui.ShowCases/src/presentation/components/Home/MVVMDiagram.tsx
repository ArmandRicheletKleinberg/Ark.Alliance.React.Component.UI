import React from 'react';
import { motion } from 'framer-motion';
import { Database, Layout, Code2, ArrowRight } from 'lucide-react';

export const MVVMDiagram: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto my-12 p-8 rounded-2xl bg-ark-bg-secondary/20 backdrop-blur-sm border border-ark-border/30 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-ark-primary/5 rounded-full blur-[80px] -translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-ark-secondary/5 rounded-full blur-[80px] -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-center">

                {/* MODEL */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <Database size={40} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-ark-text-primary mb-2">Model</h3>
                    <p className="text-xs text-center text-ark-text-secondary max-w-[200px]">
                        Data Structure & Business Logic
                        <br /><span className="opacity-50">(State, Entities)</span>
                    </p>
                </motion.div>

                {/* VIEW MODEL */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col items-center relative"
                >
                    {/* Arrows Left */}
                    <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -left-12 top-10 hidden md:flex text-ark-text-muted/30"
                    >
                        <ArrowRight size={24} className="rotate-180" />
                    </motion.div>

                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-ark-primary/20 to-ark-secondary/10 border border-ark-primary/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,212,255,0.2)] z-10 relative">
                        <div className="absolute inset-0 rounded-full border border-ark-primary/20 animate-ping opacity-20" />
                        <Code2 size={48} className="text-ark-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ark-primary to-ark-secondary mb-2">ViewModel</h3>
                    <p className="text-xs text-center text-ark-text-secondary max-w-[200px]">
                        State Management & Data Binding
                        <br /><span className="opacity-50">(Hooks, Context, Logic)</span>
                    </p>

                    {/* Arrows Right */}
                    <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -right-12 top-10 hidden md:flex text-ark-text-muted/30"
                    >
                        <ArrowRight size={24} />
                    </motion.div>
                </motion.div>

                {/* VIEW */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/10 border border-purple-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <Layout size={40} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-ark-text-primary mb-2">View</h3>
                    <p className="text-xs text-center text-ark-text-secondary max-w-[200px]">
                        UI Representation
                        <br /><span className="opacity-50">(Components, JSX)</span>
                    </p>
                </motion.div>

            </div>

            {/* Connecting Lines (Mobile hidden) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0" style={{ overflow: 'visible' }}>
                <motion.path
                    d="M 280 100 L 380 100"
                    fill="transparent"
                    stroke="url(#gradient-line)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1, delay: 0.8 }}
                />
                <motion.path
                    d="M 540 100 L 640 100"
                    fill="transparent"
                    stroke="url(#gradient-line)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1, delay: 1 }}
                />
                <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};
