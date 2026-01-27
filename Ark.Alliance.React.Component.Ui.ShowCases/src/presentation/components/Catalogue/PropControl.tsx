/**
 * @fileoverview Property Control Component
 * @module presentation/components/Catalogue/PropControl
 */

import React from 'react';
import { ControlType } from '@/domain/entities';

interface PropDefinition {
    name: string;
    type: ControlType;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
}

interface PropControlProps {
    definition: PropDefinition;
    value: any;
    onChange: (value: any) => void;
}

export const PropControl: React.FC<PropControlProps> = ({ definition, value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let val: any = e.target.value;

        if (definition.type === 'boolean') {
            val = (e.target as HTMLInputElement).checked;
        } else if (definition.type === 'slider' || definition.type === 'number') {
            const num = parseFloat(e.target.value);
            val = isNaN(num) ? (definition.min || 0) : num;
        }

        onChange(val);
    };

    switch (definition.type) {
        case 'boolean':
            return (
                <div className="flex items-center justify-between group">
                    <label className="text-sm font-medium text-ark-text-primary group-hover:text-ark-primary transition-colors cursor-pointer" onClick={() => onChange(!value)}>
                        {definition.name}
                    </label>
                    <div
                        onClick={() => onChange(!value)}
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${value ? 'bg-ark-primary shadow-[0_0_10px_rgba(0,212,255,0.4)]' : 'bg-ark-bg-tertiary'}`}
                    >
                        <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>
            );
        case 'select':
            return (
                <div className="flex flex-col space-y-1.5 group">
                    <label className="text-[10px] font-bold text-ark-text-muted uppercase tracking-wider group-hover:text-ark-primary transition-colors">{definition.name}</label>
                    <div className="relative">
                        <select
                            value={value}
                            onChange={handleChange}
                            className="block w-full rounded-lg border border-ark-border bg-ark-bg-tertiary/30 py-2 px-3 text-xs text-ark-text-primary focus:border-ark-primary focus:ring-1 focus:ring-ark-primary outline-none transition-all cursor-pointer appearance-none hover:bg-ark-bg-tertiary/50"
                        >
                            {definition.options?.map(opt => (
                                <option key={opt} value={opt} className="bg-ark-bg-secondary text-ark-text-primary">{opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <svg className="w-3 h-3 text-ark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            );
        case 'text':
            return (
                <div className="flex flex-col space-y-1.5 group">
                    <label className="text-[10px] font-bold text-ark-text-muted uppercase tracking-wider group-hover:text-ark-primary transition-colors">{definition.name}</label>
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        className="block w-full rounded-lg border border-ark-border bg-ark-bg-tertiary/30 py-2 px-3 text-xs text-ark-text-primary focus:border-ark-primary focus:ring-1 focus:ring-ark-primary outline-none transition-all placeholder-ark-text-muted/50 hover:bg-ark-bg-tertiary/50"
                    />
                </div>
            );
        case 'color':
            return (
                <div className="flex flex-col space-y-1.5 group">
                    <label className="text-[10px] font-bold text-ark-text-muted uppercase tracking-wider group-hover:text-ark-primary transition-colors">{definition.name}</label>
                    <div className="flex space-x-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-ark-border shadow-sm cursor-pointer hover:scale-105 transition-transform">
                            <input
                                type="color"
                                value={value}
                                onChange={handleChange}
                                className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
                            />
                        </div>
                        <input
                            type="text"
                            value={value}
                            onChange={handleChange}
                            className="block flex-1 rounded-lg border border-ark-border bg-ark-bg-tertiary/30 py-2 px-3 text-xs text-ark-text-primary focus:border-ark-primary focus:ring-1 focus:ring-ark-primary outline-none transition-all font-mono"
                        />
                    </div>
                </div>
            );
        case 'slider':
            return (
                <div className="flex flex-col space-y-2 group">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-ark-text-muted uppercase tracking-wider group-hover:text-ark-primary transition-colors">{definition.name}</label>
                        <span className="text-xs text-ark-primary font-mono bg-ark-primary/10 px-1.5 py-0.5 rounded border border-ark-primary/20">{value}</span>
                    </div>
                    <input
                        type="range"
                        min={definition.min || 0}
                        max={definition.max || 100}
                        step={definition.step || 1}
                        value={value}
                        onChange={handleChange}
                        className="w-full h-1.5 bg-ark-bg-tertiary/80 rounded-lg appearance-none cursor-pointer accent-ark-primary hover:accent-ark-primary-hover focus:outline-none focus:ring-2 focus:ring-ark-primary/30 border border-ark-border/50"
                    />
                </div>
            );
        case 'icon':
            const iconOptions = [
                // Navigation
                'house', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'chevron-left', 'chevron-right',
                // Actions  
                'check', 'xmark', 'plus', 'minus', 'pen', 'trash', 'download', 'upload', 'share', 'copy',
                // UI
                'gear', 'bell', 'user', 'magnifying-glass', 'bars', 'ellipsis-vertical',
                // Status
                'circle-check', 'circle-xmark', 'triangle-exclamation', 'circle-info',
                // Media
                'play', 'pause', 'stop', 'volume-high', 'volume-low', 'volume-xmark',
                // Finance
                'chart-line', 'chart-bar', 'wallet', 'credit-card', 'dollar-sign',
                // Files
                'file', 'folder', 'image', 'file-pdf', 'file-code',
                // Communication
                'envelope', 'comment', 'phone', 'video',
                // Misc
                'bolt', 'star', 'heart', 'bookmark', 'clock', 'calendar', 'lock', 'unlock'
            ];
            return (
                <div className="flex flex-col space-y-1.5 group">
                    <label className="text-[10px] font-bold text-ark-text-muted uppercase tracking-wider group-hover:text-ark-primary transition-colors">{definition.name}</label>
                    <div className="relative">
                        <select
                            value={value || ''}
                            onChange={handleChange}
                            className="block w-full rounded-lg border border-ark-border bg-ark-bg-tertiary/30 py-2 px-3 text-xs text-ark-text-primary focus:border-ark-primary focus:ring-1 focus:ring-ark-primary outline-none transition-all cursor-pointer appearance-none hover:bg-ark-bg-tertiary/50"
                        >
                            <option value="">None</option>
                            {iconOptions.map(opt => (
                                <option key={opt} value={opt} className="bg-ark-bg-secondary text-ark-text-primary">{opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                            <svg className="w-3 h-3 text-ark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            );
        case 'number':
            return (
                <div className="flex flex-col space-y-1.5 group">
                    <label className="text-[10px] font-bold text-ark-text-muted uppercase tracking-wider group-hover:text-ark-primary transition-colors">
                        {definition.name}
                    </label>
                    <input
                        type="number"
                        min={definition.min}
                        max={definition.max}
                        step={definition.step || 1}
                        value={value}
                        onChange={handleChange}
                        className="block w-full rounded-lg border border-ark-border bg-ark-bg-tertiary/30 py-2 px-3 text-xs text-ark-text-primary focus:border-ark-primary focus:ring-1 focus:ring-ark-primary outline-none transition-all placeholder-ark-text-muted/50 hover:bg-ark-bg-tertiary/50"
                    />
                </div>
            );
        case 'divider':
            return (
                <div className="flex items-center space-x-2 text-ark-text-muted pt-4 pb-2">
                    <div className="h-px flex-1 bg-ark-border/50"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{definition.name}</span>
                    <div className="h-px flex-1 bg-ark-border/50"></div>
                </div>
            );
        default:
            return null;
    }
};
