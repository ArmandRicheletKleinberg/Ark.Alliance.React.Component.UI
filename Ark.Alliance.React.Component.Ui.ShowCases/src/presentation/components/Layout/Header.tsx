/**
 * @fileoverview Application Header
 * @module presentation/components/Layout/Header
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/presentation/context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBolt, faGhost, faCube, faSun } from '@fortawesome/free-solid-svg-icons';
import { ThemeMode } from '@/presentation/context/ThemeContext';

export const Header: React.FC = () => {
    const { mode, setMode } = useTheme();

    const themes: { id: ThemeMode; icon: any; label: string }[] = [
        { id: 'normal', icon: faSun, label: 'Normal' },
        { id: 'neon', icon: faBolt, label: 'Neon' },
        { id: 'minimal', icon: faCube, label: 'Minimal' },
        { id: 'glass', icon: faGhost, label: 'Glass' },
    ];

    return (
        <header className="h-16 border-b border-ark-border bg-ark-bg-primary/80 backdrop-blur-xl fixed top-0 w-full z-50 flex items-center px-4 md:px-6 justify-between transition-all duration-300 shadow-ark-glass">
            {/* Logo Area */}
            <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="relative w-10 h-10 rounded-full bg-ark-bg-secondary p-0.5 shadow-[0_0_15px_rgba(30,212,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,212,255,0.6)] transition-all duration-300 overflow-hidden border border-ark-primary/30">
                        <img
                            src="/src/assets/LogoArkAlliance.png"
                            alt="Ark Alliance Logo"
                            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex flex-col hidden sm:flex">
                        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-ark-primary via-ark-secondary to-ark-accent tracking-wide font-ark-sans">
                            Ark.Alliance.React.Component.Ui.ShowCases
                        </span>
                        <span className="text-[10px] text-ark-text-muted font-ark-mono tracking-tight">
                            M2H.IO (c) 2026 - Armand Richelet-Kleinberg
                        </span>
                    </div>
                </Link>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="text-ark-text-muted group-focus-within:text-ark-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search components..."
                        className="block w-full pl-10 pr-3 py-2 border border-ark-border rounded-lg leading-5 bg-ark-bg-secondary/50 text-ark-text-primary placeholder-ark-text-muted focus:outline-none focus:bg-ark-bg-secondary focus:border-ark-primary focus:ring-1 focus:ring-ark-primary sm:text-sm transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* Theme Switcher & Actions */}
            <div className="flex items-center space-x-4">
                <div className="flex bg-ark-bg-secondary/50 rounded-lg p-1 border border-ark-border backdrop-blur-sm">
                    {themes.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setMode(t.id)}
                            className={`p-1.5 px-3 rounded-md text-xs font-medium transition-all duration-200 flex items-center space-x-2 ${mode === t.id
                                ? 'bg-ark-primary text-ark-bg-primary shadow-[0_0_10px_rgba(0,212,255,0.4)]'
                                : 'text-ark-text-secondary hover:text-ark-primary hover:bg-ark-bg-tertiary'
                                }`}
                            title={`Switch to ${t.label} theme`}
                        >
                            <FontAwesomeIcon icon={t.icon} />
                            <span className="hidden xl:inline">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};
