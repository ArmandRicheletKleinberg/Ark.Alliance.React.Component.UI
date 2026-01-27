/**
 * @fileoverview Component Panel
 * @module presentation/components/Catalogue/ComponentPanel
 */

import React, { useState, useMemo } from 'react';
import { ComponentPanelConfig, ControlDefinition } from '@/domain/entities';
import { PropControl } from './PropControl';
import { generateCode } from '@/Helpers/codeGenerator';
import { Copy, Check, Code, Eye, BookOpen, Smartphone, Monitor } from 'lucide-react';
import clsx from 'clsx';
// import { useTheme } from '@/presentation/context/ThemeContext';

interface ComponentPanelProps {
    config: ComponentPanelConfig;
    ComponentToRender: React.ComponentType<any>;
}

export const ComponentPanel: React.FC<ComponentPanelProps> = ({ config, ComponentToRender }) => {
    // const { mode } = useTheme(); // Unused
    const [props, setProps] = useState(config.defaultProps);
    const [mainTab, setMainTab] = useState<'preview' | 'code' | 'docs'>('preview');
    const [codeLang, setCodeLang] = useState<'ts' | 'js' | 'go' | 'blazor'>('ts');
    const [copied, setCopied] = useState(false);
    const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
    const [bgPattern, setBgPattern] = useState<'grid' | 'dots' | 'dark' | 'glass'>('glass');

    // Sync props when config changes
    React.useEffect(() => {
        setProps(config.defaultProps);
    }, [config]);

    const handlePropChange = (name: string, value: any) => {
        setProps(prev => ({ ...prev, [name]: value }));
    };

    const code = useMemo(() => generateCode(config.componentId, props, codeLang), [config.componentId, props, codeLang]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Group controls
    const groupedControls = useMemo(() => {
        const groups: Record<string, ControlDefinition[]> = {};
        config.controls.forEach(c => {
            const g = c.group || 'General';
            if (!groups[g]) groups[g] = [];
            groups[g].push(c);
        });
        return groups;
    }, [config.controls]);

    const mainTabs = [
        { tabKey: 'preview', label: 'Preview', icon: 'eye' },
        { tabKey: 'code', label: 'Code', icon: 'code' },
        { tabKey: 'docs', label: 'Docs', icon: 'file-text' },
    ];

    return (
        <div className="flex flex-col h-full animate-ark-fade-in gap-4">
            {/* Component Header Card */}
            <div className="rounded-xl border border-ark-border bg-ark-bg-secondary/30 backdrop-blur-md p-6 shadow-ark-glass relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-32 h-32 bg-ark-primary rounded-full blur-[80px]" />
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ark-primary to-ark-secondary mb-2">
                    {config.title}
                </h2>
                <p className="text-ark-text-secondary max-w-2xl">
                    {config.description}
                </p>

                {/* Main Tabs Navigation */}
                <div className="mt-6 flex items-center space-x-1 border-b border-ark-border/30">
                    {mainTabs.map(tab => (
                        <button
                            key={tab.tabKey}
                            onClick={() => setMainTab(tab.tabKey as any)}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 flex items-center gap-2",
                                mainTab === tab.tabKey
                                    ? "bg-ark-primary/10 text-ark-primary border-b-2 border-ark-primary"
                                    : "text-ark-text-muted hover:text-ark-text-primary hover:bg-ark-bg-tertiary/30"
                            )}
                        >
                            {tab.tabKey === 'preview' && <Eye size={16} />}
                            {tab.tabKey === 'code' && <Code size={16} />}
                            {tab.tabKey === 'docs' && <BookOpen size={16} />}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 rounded-xl border border-ark-border bg-ark-bg-primary shadow-ark relative overflow-hidden flex flex-col xl:flex-row">

                {mainTab === 'preview' && (
                    <>
                        {/* Canvas Area (Left/Top) */}
                        <div className="flex-1 flex flex-col min-h-[500px] xl:min-h-auto relative">
                            {/* Toolbar */}
                            <div className="h-12 border-b border-ark-border bg-ark-bg-secondary/20 flex items-center justify-between px-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setViewport('desktop')}
                                        className={clsx("p-1.5 rounded hover:bg-ark-bg-tertiary transition-colors", viewport === 'desktop' ? 'text-ark-primary' : 'text-ark-text-muted')}
                                        title="Desktop View"
                                    >
                                        <Monitor size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewport('mobile')}
                                        className={clsx("p-1.5 rounded hover:bg-ark-bg-tertiary transition-colors", viewport === 'mobile' ? 'text-ark-primary' : 'text-ark-text-muted')}
                                        title="Mobile View"
                                    >
                                        <Smartphone size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2 text-xs">
                                    <span className="text-ark-text-muted">Background:</span>
                                    {(['grid', 'dots', 'dark', 'glass'] as const).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setBgPattern(p)}
                                            className={clsx(
                                                "w-4 h-4 rounded-full border border-ark-border transition-all",
                                                p === 'grid' && "bg-[url('@/assets/grid.svg')]",
                                                p === 'dots' && "bg-ark-bg-tertiary",
                                                p === 'dark' && "bg-black",
                                                p === 'glass' && "bg-gradient-to-br from-ark-bg-secondary to-transparent",
                                                bgPattern === p && "ring-2 ring-ark-primary ring-offset-1 ring-offset-ark-bg-primary"
                                            )}
                                            title={p}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Canvas */}
                            <div className={clsx(
                                "flex-1 overflow-auto flex items-center justify-center p-8 transition-colors duration-300 relative",
                                bgPattern === 'grid' && "bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-ark-bg-primary/50", // Fallback noise or grid
                                bgPattern === 'dark' && "bg-[#050510]",
                                bgPattern === 'dots' && "bg-ark-bg-secondary/50 radial-dot",
                                bgPattern === 'glass' && "bg-gradient-to-br from-gray-900 to-black"
                            )}>
                                {/* Grid Overlay for 'grid' pattern */}
                                {bgPattern === 'grid' && (
                                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                                    />
                                )}

                                <div
                                    className={clsx(
                                        "transition-all duration-300 transform relative z-10",
                                        viewport === 'mobile' ? "w-[375px] h-[667px] border-8 border-ark-bg-tertiary rounded-[3rem] shadow-2xl overflow-hidden bg-ark-bg-primary" : "w-full h-full p-8 flex items-center justify-center"
                                    )}
                                >
                                    <div className={clsx("w-full h-full overflow-auto flex items-center justify-center", viewport === 'mobile' ? "bg-ark-bg-primary" : "")}>
                                        {ComponentToRender ? <ComponentToRender {...props} /> : <div className="text-ark-error">Component not found</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls Panel (Right/Bottom) */}
                        <div className="w-full xl:w-96 border-t xl:border-t-0 xl:border-l border-ark-border bg-ark-bg-secondary/30 backdrop-blur-sm flex flex-col">
                            <div className="p-4 border-b border-ark-border/50 bg-ark-bg-secondary/50">
                                <h3 className="font-semibold text-ark-text-primary text-sm uppercase tracking-wide">Properties</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-ark-border">
                                {Object.entries(groupedControls).map(([group, controls]) => (
                                    <div key={group} className="space-y-4">
                                        <div className="flex items-center space-x-2 text-ark-text-muted">
                                            <div className="h-px flex-1 bg-ark-border/50"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{group}</span>
                                            <div className="h-px flex-1 bg-ark-border/50"></div>
                                        </div>
                                        <div className="space-y-5">
                                            {controls.map(control => (
                                                <PropControl
                                                    key={control.propName}
                                                    definition={{
                                                        name: control.label || control.propName,
                                                        type: control.type,
                                                        options: control.options,
                                                        min: control.min,
                                                        max: control.max,
                                                        step: control.step
                                                    }}
                                                    value={props[control.propName]}
                                                    onChange={(val) => handlePropChange(control.propName, val)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {mainTab === 'code' && (
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center space-x-2 p-4 border-b border-ark-border bg-ark-bg-secondary/20">
                            {(['ts', 'js', 'go', 'blazor'] as const).map(l => (
                                <button
                                    key={l}
                                    onClick={() => setCodeLang(l)}
                                    className={clsx(
                                        "px-3 py-1.5 rounded text-xs font-mono transition-colors",
                                        codeLang === l ? "bg-ark-primary text-ark-text-primary" : "text-ark-text-secondary hover:text-ark-primary hover:bg-ark-bg-secondary"
                                    )}
                                >
                                    {l.toUpperCase()}
                                </button>
                            ))}
                            <div className="flex-1" />
                            <button
                                onClick={handleCopy}
                                className="flex items-center space-x-2 px-3 py-1.5 rounded bg-ark-bg-secondary hover:bg-ark-bg-tertiary transition-colors text-xs font-medium text-ark-text-primary"
                            >
                                {copied ? <Check size={14} className="text-ark-success" /> : <Copy size={14} />}
                                <span>{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto bg-[#0d1117] p-6 font-mono text-sm leading-relaxed">
                            <pre className="text-ark-text-muted whitespace-pre-wrap">{code}</pre>
                        </div>
                    </div>
                )}

                {mainTab === 'docs' && (
                    <div className="flex-1 p-8 flex items-center justify-center text-ark-text-muted">
                        <div className="text-center">
                            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">Documentation coming soon</p>
                            <p className="text-sm opacity-60">Full API references and usage guidelines will appear here.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
