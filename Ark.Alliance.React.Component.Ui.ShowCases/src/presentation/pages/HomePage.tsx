/**
 * @fileoverview Home Page
 * @module presentation/pages/HomePage
 */

import React from 'react';
import { ConfigLoader } from '@/infrastructure/ConfigLoader';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { MVVMDiagram } from '@/presentation/components/Home/MVVMDiagram';

export const HomePage: React.FC = () => {
    const catalogue = ConfigLoader.getCatalogue();

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-ark-fade-in">
            {/* Intro Section */}
            <div className="mb-16 text-center space-y-6">
                <span className="inline-block py-1 px-3 rounded-full bg-ark-primary/10 border border-ark-primary/30 text-ark-primary text-xs font-bold uppercase tracking-widest mb-4">
                    Architecture First
                </span>
                <h1 className="text-5xl md:text-6xl font-black text-ark-text-primary tracking-tight leading-tight">
                    Model - View - <span className="text-transparent bg-clip-text bg-gradient-to-r from-ark-primary to-ark-secondary">ViewModel</span>
                </h1>
                <p className="text-lg md:text-xl text-ark-text-secondary max-w-3xl mx-auto leading-relaxed">
                    <span className="text-ark-text-primary font-semibold">Ark.Alliance.React.Component.Ui</span> enforces a strict <span className="text-ark-text-primary font-semibold">MVVM pattern</span> to ensure scalability and maintainability.
                    We check separation of concerns by isolating business logic (ViewModel) from UI presentation (View) and data structures (Model).
                </p>

                {/* Visual Diagram */}
                <MVVMDiagram />
            </div>

            {/* Component Library Grid */}
            <div className="space-y-8">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ark-border to-transparent"></div>
                    <span className="text-sm font-bold text-ark-text-muted uppercase tracking-[0.2em]">Component Library</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ark-border to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {catalogue.categories.map(family => (
                        <Link
                            key={family.name}
                            to={`/catalogue/${family.name}`}
                            className="group relative p-6 bg-ark-bg-secondary/20 rounded-2xl border border-ark-border/50 hover:border-ark-primary/50 shadow-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all duration-300 overflow-hidden backdrop-blur-sm"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <FontAwesomeIcon icon={family.icon as any} size="5x" className="text-ark-primary" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-5 w-14 h-14 rounded-xl bg-ark-bg-secondary flex items-center justify-center text-ark-primary group-hover:bg-ark-primary group-hover:text-ark-bg-primary transition-colors duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                                    <FontAwesomeIcon icon={family.icon as any} size="lg" />
                                </div>

                                <h2 className="text-xl font-bold text-ark-text-primary mb-2 group-hover:text-ark-primary transition-colors">
                                    {family.name}
                                </h2>

                                <p className="text-sm text-ark-text-secondary mb-6 flex-1 opacity-80 leading-relaxed">
                                    {family.description}
                                </p>

                                <div className="flex items-center text-xs font-bold text-ark-primary uppercase tracking-wider opacity-60 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    Browse Components
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-24 text-center">
                <p className="text-xs text-ark-text-muted opacity-50">
                    Designed for High-Performance Enterprise Applications
                </p>
            </div>
        </div>
    );
};
