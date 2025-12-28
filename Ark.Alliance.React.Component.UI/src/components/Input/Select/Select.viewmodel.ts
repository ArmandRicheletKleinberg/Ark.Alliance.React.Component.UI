/**
 * @fileoverview Select Component ViewModel
 * @module components/Input/Select
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { SelectModel, SelectOption } from './Select.model';
import { SelectModelSchema, defaultSelectModel } from './Select.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseSelectOptions extends Partial<SelectModel> {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string, option: SelectOption) => void;
    onOpen?: () => void;
    onClose?: () => void;
}

export interface UseSelectResult extends BaseViewModelResult<SelectModel> {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredOptions: SelectOption[];
    selectedOption: SelectOption | undefined;
    handleSelect: (option: SelectOption) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    highlightedIndex: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useSelect(options: UseSelectOptions): UseSelectResult {
    const { onChange, onOpen, onClose, ...modelData } = options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modelOptions = useMemo(() => {
        return SelectModelSchema.parse({ ...defaultSelectModel, ...modelData });
    }, [JSON.stringify(modelData)]);

    const base = useBaseViewModel<SelectModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'select',
    });

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Filtered options
    const filteredOptions = useMemo(() => {
        if (!base.model.searchable || !searchQuery) {
            return base.model.options;
        }
        return base.model.options.filter(opt =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [base.model.options, base.model.searchable, searchQuery]);

    // Selected option
    const selectedOption = useMemo(() => {
        return base.model.options.find(opt => opt.value === base.model.value);
    }, [base.model.options, base.model.value]);

    // Handlers
    const toggle = useCallback(() => {
        setIsOpen(prev => {
            if (!prev) onOpen?.();
            else onClose?.();
            return !prev;
        });
    }, [onOpen, onClose]);

    const handleSelect = useCallback((option: SelectOption) => {
        if (option.disabled) return;
        onChange?.(option.value, option);
        setIsOpen(false);
        setSearchQuery('');
        onClose?.();
    }, [onChange, onClose]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(i => Math.min(i + 1, filteredOptions.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(i => Math.max(i - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (isOpen && filteredOptions[highlightedIndex]) {
                    handleSelect(filteredOptions[highlightedIndex]);
                } else {
                    setIsOpen(true);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSearchQuery('');
                break;
        }
    }, [filteredOptions, highlightedIndex, isOpen, handleSelect]);

    // Click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return {
        ...base,
        isOpen,
        setOpen: setIsOpen,
        toggle,
        searchQuery,
        setSearchQuery,
        filteredOptions,
        selectedOption,
        handleSelect,
        handleKeyDown,
        highlightedIndex,
        containerRef,
    };
}

export default useSelect;
