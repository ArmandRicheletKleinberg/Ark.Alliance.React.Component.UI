/**
 * @fileoverview Enhanced Header Component ViewModel
 * @module components/Header
 */

import { useState, useMemo, useCallback, type CSSProperties } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { HeaderModel, BackgroundConfig, TypographyConfig } from './Header.model';
import { defaultHeaderModel, HeaderModelSchema } from './Header.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseHeaderOptions extends Partial<HeaderModel> {
    title: string;
    onSearchChange?: (value: string) => void;
}

export interface UseHeaderResult extends BaseViewModelResult<HeaderModel> {
    /** Combined CSS classes */
    headerClasses: string;
    /** Inline styles for background */
    backgroundStyles: CSSProperties;
    /** Inline styles for typography */
    titleStyles: CSSProperties;
    subtitleStyles: CSSProperties;
    /** Search state */
    searchValue: string;
    setSearchValue: (value: string) => void;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Icon size in pixels */
    iconSizePx: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const ICON_SIZES: Record<string, number> = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
};

const TITLE_SIZES: Record<string, string> = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '1.875rem',
    '3xl': '2.25rem',
};

const FONT_WEIGHTS: Record<string, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
};

function buildBackgroundStyles(bg?: BackgroundConfig): CSSProperties {
    if (!bg) return {};

    const styles: CSSProperties = {};

    switch (bg.type) {
        case 'solid':
            if (bg.color) styles.backgroundColor = bg.color;
            break;
        case 'gradient':
            styles.background = `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientStart || '#00d4ff'}, ${bg.gradientEnd || '#7c3aed'})`;
            break;
        case 'image':
            if (bg.imageUrl) {
                styles.backgroundImage = `url(${bg.imageUrl})`;
                styles.backgroundSize = 'cover';
                styles.backgroundPosition = 'center';
                if (bg.imageOpacity < 100) {
                    styles.opacity = bg.imageOpacity / 100;
                }
            }
            break;
        case 'animated':
            // Animated backgrounds handled via CSS classes
            break;
        case 'pattern':
            // Pattern backgrounds handled via CSS classes
            break;
    }

    return styles;
}

function buildTypographyStyles(
    config?: TypographyConfig,
    type: 'title' | 'subtitle' = 'title'
): CSSProperties {
    if (!config) return {};

    const styles: CSSProperties = {};

    if (type === 'title') {
        if (config.titleFont) styles.fontFamily = config.titleFont;
        if (config.titleSize) styles.fontSize = TITLE_SIZES[config.titleSize];
        if (config.titleWeight) styles.fontWeight = FONT_WEIGHTS[config.titleWeight];
        if (config.titleColor) styles.color = config.titleColor;
        if (config.textAlign) styles.textAlign = config.textAlign;
    } else {
        if (config.subtitleFont) styles.fontFamily = config.subtitleFont;
        if (config.subtitleSize) styles.fontSize = TITLE_SIZES[config.subtitleSize];
        if (config.subtitleColor) styles.color = config.subtitleColor;
        if (config.textAlign) styles.textAlign = config.textAlign;
    }

    return styles;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useHeader(options: UseHeaderOptions): UseHeaderResult {
    const { onSearchChange, ...modelData } = options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modelOptions = useMemo(() => {
        return HeaderModelSchema.parse({ ...defaultHeaderModel, ...modelData });
    }, [JSON.stringify(modelData)]);

    const base = useBaseViewModel<HeaderModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'header',
    });

    // Search state
    const [searchValue, setSearchValue] = useState(base.model.searchValue || '');

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearchChange?.(value);
    }, [onSearchChange]);

    // CSS classes
    const headerClasses = useMemo(() => {
        const classes = [
            'ark-header',
            `ark-header--${base.model.variant}`,
            `ark-header--${base.model.visualMode}`,
            `ark-header--${base.model.height}`,
            base.model.isDark ? 'ark-header--dark' : 'ark-header--light',
        ];

        if (base.model.borderRadius !== 'none') {
            classes.push(`ark-header--radius-${base.model.borderRadius}`);
        }
        if (base.model.sticky) {
            classes.push('ark-header--sticky');
        }
        if (base.model.alignment !== 'space-between') {
            classes.push(`ark-header--align-${base.model.alignment}`);
        }
        if (base.model.background?.animationType) {
            classes.push(`ark-header--bg-${base.model.background.animationType}`);
        }
        if (base.model.className) {
            classes.push(base.model.className);
        }

        return classes.join(' ');
    }, [base.model]);

    // Background styles
    const backgroundStyles = useMemo(() => {
        return buildBackgroundStyles(base.model.background);
    }, [base.model.background]);

    // Typography styles
    const titleStyles = useMemo(() => {
        return buildTypographyStyles(base.model.typography, 'title');
    }, [base.model.typography]);

    const subtitleStyles = useMemo(() => {
        return buildTypographyStyles(base.model.typography, 'subtitle');
    }, [base.model.typography]);

    // Icon size
    const iconSizePx = ICON_SIZES[base.model.iconSize] || 24;

    return {
        ...base,
        headerClasses,
        backgroundStyles,
        titleStyles,
        subtitleStyles,
        searchValue,
        setSearchValue,
        handleSearchChange,
        iconSizePx,
    };
}

export default useHeader;
