/**
 * @fileoverview Instrument Type Definitions
 * @module components/Finance/Trading/common
 * 
 * Comprehensive instrument type definitions for all financial markets.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// INSTRUMENT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Supported financial instrument types across all markets.
 */
export const InstrumentTypeSchema = z.enum([
    // Cryptocurrency
    'CRYPTO_SPOT',        // Crypto spot trading (BTC/USDT)
    'CRYPTO_PERP',        // Perpetual futures (BTCUSDT-PERP)
    'CRYPTO_FUTURES',     // Dated crypto futures
    'CRYPTO_OPTIONS',     // Crypto options (Deribit, etc.)

    // Traditional Securities
    'STOCK',              // Equities/shares
    'ETF',                // Exchange-traded funds
    'BOND',               // Fixed income securities
    'SICAV',              // Investment fund shares
    'WARRANT',            // Warrants
    'ADR',                // American Depositary Receipts

    // Derivatives
    'FUTURES',            // Traditional futures contracts
    'OPTIONS',            // Traditional options
    'CFD',                // Contracts for difference

    // Forex
    'FOREX',              // Currency pairs
    'FOREX_FUTURES',      // Currency futures
]);

export type InstrumentType = z.infer<typeof InstrumentTypeSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// INSTRUMENT CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Instrument category for grouping.
 */
export const InstrumentCategorySchema = z.enum([
    'CRYPTO',
    'EQUITIES',
    'FIXED_INCOME',
    'DERIVATIVES',
    'FOREX',
    'FUNDS',
]);

export type InstrumentCategory = z.infer<typeof InstrumentCategorySchema>;

/**
 * Get category for an instrument type.
 */
export function getInstrumentCategory(type: InstrumentType): InstrumentCategory {
    switch (type) {
        case 'CRYPTO_SPOT':
        case 'CRYPTO_PERP':
        case 'CRYPTO_FUTURES':
        case 'CRYPTO_OPTIONS':
            return 'CRYPTO';
        case 'STOCK':
        case 'ADR':
            return 'EQUITIES';
        case 'BOND':
            return 'FIXED_INCOME';
        case 'ETF':
        case 'SICAV':
            return 'FUNDS';
        case 'FUTURES':
        case 'OPTIONS':
        case 'CFD':
        case 'WARRANT':
            return 'DERIVATIVES';
        case 'FOREX':
        case 'FOREX_FUTURES':
            return 'FOREX';
        default:
            return 'DERIVATIVES';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INSTRUMENT FEATURES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Features available for instrument type.
 */
export interface InstrumentFeatures {
    hasLeverage: boolean;
    hasMargin: boolean;
    hasExpiry: boolean;
    hasStrikePrice: boolean;
    hasPositionSide: boolean;
    hasGreeks: boolean;
    hasFunding: boolean;
    hasSettlement: boolean;
}

/**
 * Get features for an instrument type.
 */
export function getInstrumentFeatures(type: InstrumentType): InstrumentFeatures {
    const base: InstrumentFeatures = {
        hasLeverage: false,
        hasMargin: false,
        hasExpiry: false,
        hasStrikePrice: false,
        hasPositionSide: false,
        hasGreeks: false,
        hasFunding: false,
        hasSettlement: false,
    };

    switch (type) {
        case 'CRYPTO_PERP':
            return { ...base, hasLeverage: true, hasMargin: true, hasPositionSide: true, hasFunding: true };
        case 'CRYPTO_FUTURES':
        case 'FUTURES':
        case 'FOREX_FUTURES':
            return { ...base, hasLeverage: true, hasMargin: true, hasPositionSide: true, hasExpiry: true, hasSettlement: true };
        case 'CRYPTO_OPTIONS':
        case 'OPTIONS':
            return { ...base, hasExpiry: true, hasStrikePrice: true, hasGreeks: true };
        case 'CFD':
            return { ...base, hasLeverage: true, hasMargin: true };
        case 'WARRANT':
            return { ...base, hasExpiry: true, hasStrikePrice: true };
        default:
            return base;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// CURRENCY & ASSET SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Quote currency types.
 */
export const QuoteCurrencySchema = z.enum([
    'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY',
    'USDT', 'USDC', 'BUSD', 'DAI', 'BTC', 'ETH',
]);

export type QuoteCurrency = z.infer<typeof QuoteCurrencySchema>;
