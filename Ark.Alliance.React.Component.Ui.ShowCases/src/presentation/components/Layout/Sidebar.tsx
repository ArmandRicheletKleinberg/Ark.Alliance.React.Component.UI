/**
 * @fileoverview Application Sidebar
 * @module presentation/components/Layout/Sidebar
 */

import React from 'react';
import { CategoryConfig } from '@/domain/entities';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLayerGroup, faCircleDot, faVial, faChartSimple, faBox, faCircleInfo, faBars, faChevronLeft, faGaugeHigh } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas, faHouse, faLayerGroup, faCircleDot, faVial, faChartSimple, faBox, faCircleInfo, faBars, faChevronLeft, faGaugeHigh);

interface SidebarProps {
    families: CategoryConfig[];
    collapsed: boolean;
    onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ families, collapsed, onToggle }) => {
    return (
        <aside
            className={clsx(
                "border-r border-ark-border bg-ark-bg-secondary/30 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 pt-16 z-40 transition-all duration-300 ease-out shadow-ark-glass",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className={clsx("px-3 py-4 flex", collapsed ? "justify-center" : "justify-end")}>
                <button
                    onClick={onToggle}
                    className={clsx(
                        "p-2 rounded-lg transition-all duration-200 border border-transparent",
                        "text-ark-text-secondary hover:text-ark-primary hover:bg-ark-primary/10 hover:border-ark-primary/30 hover:shadow-[0_0_10px_rgba(0,212,255,0.2)]"
                    )}
                    aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <div className="min-w-[1.5rem] flex justify-center">
                        <FontAwesomeIcon icon={collapsed ? faBars : faChevronLeft} />
                    </div>
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-ark-border scrollbar-track-transparent">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => clsx(
                        "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative border border-transparent",
                        isActive
                            ? 'bg-ark-primary/10 text-ark-primary border-ark-primary/40 shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                            : 'text-ark-text-secondary hover:text-ark-text-primary hover:bg-ark-bg-tertiary/50'
                    )}
                    title={collapsed ? "Home" : undefined}
                >
                    <div className="min-w-[1.5rem] flex justify-center">
                        <FontAwesomeIcon icon={faHouse} className={clsx("w-5 h-5 transition-transform group-hover:scale-110", collapsed ? "" : "")} />
                    </div>
                    <span className={clsx("ml-3 font-medium text-sm whitespace-nowrap transition-all duration-200", collapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
                        Home
                    </span>

                    {collapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-ark-bg-primary text-ark-text-primary text-xs rounded border border-ark-border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-ark-lg backdrop-blur-md">
                            Home
                        </div>
                    )}
                </NavLink>

                <div className={clsx("pt-6 pb-2 px-3 text-[10px] font-bold text-ark-text-muted uppercase tracking-[0.2em] transition-opacity duration-200 border-b border-ark-border/30 mb-2", collapsed ? "opacity-0 hidden" : "opacity-100")}>
                    Component Library
                </div>

                {families.map(family => (
                    <NavLink
                        key={family.name}
                        to={`/catalogue/${family.name}`}
                        className={({ isActive }) => clsx(
                            "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative border border-transparent",
                            isActive
                                ? 'bg-ark-primary/10 text-ark-primary border-ark-primary/40 shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                                : 'text-ark-text-secondary hover:text-ark-text-primary hover:bg-ark-bg-tertiary/50'
                        )}
                        title={collapsed ? family.name : undefined}
                    >
                        <div className="min-w-[1.5rem] flex justify-center">
                            <FontAwesomeIcon icon={family.icon as any} className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:text-ark-accent transition-all" />
                        </div>

                        <span className={clsx("ml-3 flex-1 font-medium text-sm whitespace-nowrap transition-all duration-200", collapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
                            {family.name}
                        </span>

                        {!collapsed && (
                            <span className="bg-ark-bg-tertiary/50 text-ark-text-muted py-0.5 px-2 rounded-md text-[10px] font-mono border border-ark-border/20">
                                {family.componentIds.length}
                            </span>
                        )}

                        {collapsed && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-ark-bg-primary text-ark-text-primary text-xs rounded border border-ark-border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-ark-lg backdrop-blur-md">
                                {family.name}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className={clsx("p-4 border-t border-ark-border mt-auto bg-ark-bg-secondary/20", collapsed ? "hidden" : "block")}>
                <div className="text-xs text-ark-text-muted text-center">
                    v2.0.0 &bull; Cyber-Glass UI
                </div>
            </div>
        </aside>
    );
};
