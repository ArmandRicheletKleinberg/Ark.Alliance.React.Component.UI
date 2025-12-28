/**
 * @fileoverview EditorMenuBar Sub-Component
 * @module components/Input/TextEditor/EditorMenuBar
 * 
 * Menu bar for the TextEditor that extends/wraps the Header component.
 * Provides File, Edit, View, Insert, Format menus.
 */

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Header } from '../../../Header';
import './EditorMenuBar.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface MenuItem {
    id: string;
    label: string;
    shortcut?: string;
    icon?: string;
    disabled?: boolean;
    separator?: boolean;
    onClick?: () => void;
    children?: MenuItem[];
}

export interface MenuConfig {
    id: string;
    label: string;
    items: MenuItem[];
}

export interface EditorMenuBarProps {
    /** Document title */
    title?: string;

    /** Visual mode */
    visualMode?: 'normal' | 'neon' | 'minimal' | 'light';

    /** Menu configurations */
    menus?: MenuConfig[];

    /** On new document */
    onNew?: () => void;

    /** On open document */
    onOpen?: () => void;

    /** On save document */
    onSave?: () => void;

    /** On save as */
    onSaveAs?: () => void;

    /** On print */
    onPrint?: () => void;

    /** On undo */
    onUndo?: () => void;

    /** On redo */
    onRedo?: () => void;

    /** On cut */
    onCut?: () => void;

    /** On copy */
    onCopy?: () => void;

    /** On paste */
    onPaste?: () => void;

    /** On select all */
    onSelectAll?: () => void;

    /** On find */
    onFind?: () => void;

    /** On replace */
    onReplace?: () => void;

    /** On insert image */
    onInsertImage?: () => void;

    /** On insert table */
    onInsertTable?: () => void;

    /** On insert link */
    onInsertLink?: () => void;

    /** On toggle word count */
    onToggleWordCount?: () => void;

    /** On toggle fullscreen */
    onToggleFullscreen?: () => void;

    /** On show version history */
    onShowHistory?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT MENUS
// ═══════════════════════════════════════════════════════════════════════════

function createDefaultMenus(props: EditorMenuBarProps): MenuConfig[] {
    return [
        {
            id: 'file',
            label: 'File',
            items: [
                { id: 'new', label: 'New', shortcut: 'Ctrl+N', onClick: props.onNew },
                { id: 'open', label: 'Open...', shortcut: 'Ctrl+O', onClick: props.onOpen },
                { id: 'sep1', label: '', separator: true },
                { id: 'save', label: 'Save', shortcut: 'Ctrl+S', onClick: props.onSave },
                { id: 'saveas', label: 'Save As...', shortcut: 'Ctrl+Shift+S', onClick: props.onSaveAs },
                { id: 'sep2', label: '', separator: true },
                { id: 'print', label: 'Print...', shortcut: 'Ctrl+P', onClick: props.onPrint },
            ],
        },
        {
            id: 'edit',
            label: 'Edit',
            items: [
                { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', onClick: props.onUndo },
                { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', onClick: props.onRedo },
                { id: 'sep1', label: '', separator: true },
                { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', onClick: props.onCut },
                { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', onClick: props.onCopy },
                { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', onClick: props.onPaste },
                { id: 'sep2', label: '', separator: true },
                { id: 'selectall', label: 'Select All', shortcut: 'Ctrl+A', onClick: props.onSelectAll },
                { id: 'sep3', label: '', separator: true },
                { id: 'find', label: 'Find...', shortcut: 'Ctrl+F', onClick: props.onFind },
                { id: 'replace', label: 'Replace...', shortcut: 'Ctrl+H', onClick: props.onReplace },
            ],
        },
        {
            id: 'insert',
            label: 'Insert',
            items: [
                { id: 'image', label: 'Image...', onClick: props.onInsertImage },
                { id: 'table', label: 'Table...', onClick: props.onInsertTable },
                { id: 'link', label: 'Link...', shortcut: 'Ctrl+K', onClick: props.onInsertLink },
            ],
        },
        {
            id: 'view',
            label: 'View',
            items: [
                { id: 'wordcount', label: 'Word Count', onClick: props.onToggleWordCount },
                { id: 'fullscreen', label: 'Fullscreen', shortcut: 'F11', onClick: props.onToggleFullscreen },
                { id: 'sep1', label: '', separator: true },
                { id: 'history', label: 'Version History', onClick: props.onShowHistory },
            ],
        },
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// DROPDOWN MENU COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface DropdownMenuProps {
    menu: MenuConfig;
    isOpen: boolean;
    onToggle: (menuId: string) => void;
    onClose: () => void;
    visualMode: string;
}

const DropdownMenu = memo<DropdownMenuProps>(function DropdownMenu({
    menu,
    isOpen,
    onToggle,
    onClose,
    visualMode,
}) {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleItemClick = (item: MenuItem) => {
        if (item.disabled || item.separator) return;
        item.onClick?.();
        onClose();
    };

    return (
        <div ref={menuRef} className="ark-editor-menubar__menu">
            <button
                className={`ark-editor-menubar__menu-trigger ${isOpen ? 'ark-editor-menubar__menu-trigger--active' : ''}`}
                onClick={() => onToggle(menu.id)}
            >
                {menu.label}
            </button>
            {isOpen && (
                <div className={`ark-editor-menubar__dropdown ark-editor-menubar__dropdown--${visualMode}`}>
                    {menu.items.map((item) => (
                        item.separator ? (
                            <div key={item.id} className="ark-editor-menubar__separator" />
                        ) : (
                            <button
                                key={item.id}
                                className={`ark-editor-menubar__item ${item.disabled ? 'ark-editor-menubar__item--disabled' : ''}`}
                                onClick={() => handleItemClick(item)}
                                disabled={item.disabled}
                            >
                                <span className="ark-editor-menubar__item-label">{item.label}</span>
                                {item.shortcut && (
                                    <span className="ark-editor-menubar__item-shortcut">{item.shortcut}</span>
                                )}
                            </button>
                        )
                    ))}
                </div>
            )}
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * EditorMenuBar - Menu bar extending Header for TextEditor
 * 
 * Provides traditional File/Edit/View/Insert menus with keyboard shortcuts.
 * Wraps the Header component for consistent styling.
 */
export const EditorMenuBar = memo<EditorMenuBarProps>(function EditorMenuBar(props) {
    const {
        title = 'Untitled Document',
        visualMode = 'neon',
        menus: customMenus,
    } = props;

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menus = customMenus || createDefaultMenus(props);

    const handleMenuToggle = useCallback((menuId: string) => {
        setOpenMenuId(prev => prev === menuId ? null : menuId);
    }, []);

    const handleCloseMenus = useCallback(() => {
        setOpenMenuId(null);
    }, []);

    // Menu bar content as prefix for Header
    const menuContent = (
        <div className={`ark-editor-menubar__menus ark-editor-menubar__menus--${visualMode}`}>
            {menus.map((menu) => (
                <DropdownMenu
                    key={menu.id}
                    menu={menu}
                    isOpen={openMenuId === menu.id}
                    onToggle={handleMenuToggle}
                    onClose={handleCloseMenus}
                    visualMode={visualMode}
                />
            ))}
        </div>
    );

    return (
        <Header
            title={title}
            icon="📝"
            visualMode={visualMode === 'light' ? 'minimal' : visualMode}
            variant="panel"
            height="compact"
            isDark={visualMode !== 'light'}
            prefix={menuContent}
            className={`ark-editor-menubar ark-editor-menubar--${visualMode}`}
        />
    );
});

export default EditorMenuBar;
