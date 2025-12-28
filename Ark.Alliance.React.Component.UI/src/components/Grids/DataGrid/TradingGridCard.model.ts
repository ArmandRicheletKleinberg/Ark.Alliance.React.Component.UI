/**
 * @fileoverview TradingGridCard Component Model
 * @module components/Grids/DataGrid/TradingGridCard
 * 
 * Extends Card model for grid-specific card wrapper with trading-focused styling.
 */

import { z } from 'zod';
import { CardModelSchema } from '../../Cards/Card.model';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TradingGridCard model schema extending Card model
 * Inherits all base card properties and adds trading-specific properties
 */
export const TradingGridCardModelSchema = CardModelSchema.extend({
    /** Dark mode flag (inherited from usage pattern) */
    isDark: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TradingGridCardModel = z.infer<typeof TradingGridCardModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default TradingGridCard model values
 */
export const defaultTradingGridCardModel: Omit<TradingGridCardModel, 'title'> & { title?: string } = {
    title: undefined,
    status: 'idle',
    compact: false,
    showHeader: true,
    disabled: false,
    loading: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    focusable: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
    isDark: true,
};

/**
 * Create a TradingGridCard model with custom values
 */
export function createTradingGridCardModel(data: Partial<TradingGridCardModel> & { title: string }): TradingGridCardModel {
    return TradingGridCardModelSchema.parse(data);
}
