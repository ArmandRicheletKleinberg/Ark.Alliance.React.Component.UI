/**
 * @fileoverview DesktopIcon Component ViewModel
 * @module components/Desktop/DesktopIcon
 * 
 * Business logic and state management for the DesktopIcon component.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { DesktopIconModel } from './DesktopIcon.model';
import { defaultDesktopIconModel, DesktopIconModelSchema, parseIconString } from './DesktopIcon.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DesktopIcon ViewModel options
 */
export interface UseDesktopIconOptions extends Partial<DesktopIconModel> {
    /** Required label */
    label: string;

    /** 
     * Required icon - can be:
     * - Emoji: "📁"
     * - FontAwesome: "fa:folder" or "fa:brands:github"
     * - SVG registry: "svg:chevron-right"
     * - Image URL: "img:https://..." or just "https://..."
     */
    icon: string;

    /** Required app ID */
    appId: string;

    /** Callback when icon is clicked */
    onClick?: (e: React.MouseEvent) => void;

    /** Callback when icon is double-clicked */
    onDoubleClick?: (appId: string) => void;

    /** Callback when icon is right-clicked */
    onContextMenu?: (e: React.MouseEvent, appId: string) => void;

    /** Callback when selection changes */
    onSelect?: (selected: boolean) => void;
}

/**
 * DesktopIcon ViewModel return type
 */
export interface UseDesktopIconResult extends BaseViewModelResult<DesktopIconModel> {
    /** Whether icon is selected */
    isSelected: boolean;

    /** Handle click event */
    handleClick: (e: React.MouseEvent) => void;

    /** Handle double-click event */
    handleDoubleClick: (e: React.MouseEvent) => void;

    /** Handle context menu event */
    handleContextMenu: (e: React.MouseEvent) => void;

    /** Computed container classes */
    containerClasses: string;

    /** Icon ref */
    iconRef: React.RefObject<HTMLDivElement>;
}

// ═══════════════════════════════════════════════════════════════════════════
// DOUBLE-CLICK DETECTION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const DOUBLE_CLICK_DELAY = 300; // ms

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DesktopIcon ViewModel hook
 */
export function useDesktopIcon(options: UseDesktopIconOptions): UseDesktopIconResult {
    const {
        onClick,
        onDoubleClick,
        onContextMenu,
        onSelect,
        icon,
        ...restOptions
    } = options;

    // Auto-detect icon type from shorthand notation if not explicitly set
    const parsedIcon = useMemo(() => {
        if (restOptions.iconType) {
            return { type: restOptions.iconType, value: icon, faStyle: restOptions.faStyle };
        }
        return parseIconString(icon);
    }, [icon, restOptions.iconType, restOptions.faStyle]);

    // Merge parsed icon data with model
    const modelData = useMemo(() => ({
        ...restOptions,
        icon: parsedIcon.value,
        iconType: parsedIcon.type,
        faStyle: parsedIcon.faStyle || restOptions.faStyle,
    }), [restOptions, parsedIcon]);

    // Parse model options
    const modelOptions = useMemo(() => {
        return DesktopIconModelSchema.parse({ ...defaultDesktopIconModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<DesktopIconModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'desktop-icon',
    });

    // Local state
    const [isSelected, setIsSelected] = useState(modelOptions.selected);
    const iconRef = useRef<HTMLDivElement>(null);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clickCountRef = useRef(0);

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        clickCountRef.current += 1;

        if (clickCountRef.current === 1) {
            // First click - select and start timer
            setIsSelected(true);
            onSelect?.(true);
            onClick?.(e);
            base.emit('click', { id: base.model.id, appId: base.model.appId });

            clickTimeoutRef.current = setTimeout(() => {
                clickCountRef.current = 0;
            }, DOUBLE_CLICK_DELAY);
        } else if (clickCountRef.current === 2) {
            // Double click detected
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
                clickTimeoutRef.current = null;
            }
            clickCountRef.current = 0;

            onDoubleClick?.(base.model.appId);
            base.emit('doubleClick', { id: base.model.id, appId: base.model.appId });
        }
    }, [base, onClick, onDoubleClick, onSelect]);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        // Native double-click event (backup)
        e.stopPropagation();
        // Handled by click logic above
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSelected(true);
        onSelect?.(true);
        onContextMenu?.(e, base.model.appId);
        base.emit('contextMenu', { id: base.model.id, appId: base.model.appId, x: e.clientX, y: e.clientY });
    }, [base, onContextMenu, onSelect]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const containerClasses = useMemo(() => {
        const classes = [
            'ark-desktop-icon',
            `ark-desktop-icon--${base.model.size}`,
            `ark-desktop-icon--${base.model.visualMode}`,
            `ark-desktop-icon--type-${base.model.iconType}`,
        ];
        if (isSelected) classes.push('ark-desktop-icon--selected');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model, isSelected]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        isSelected,
        handleClick,
        handleDoubleClick,
        handleContextMenu,
        containerClasses,
        iconRef: iconRef as React.RefObject<HTMLDivElement>,
    };
}

export default useDesktopIcon;
