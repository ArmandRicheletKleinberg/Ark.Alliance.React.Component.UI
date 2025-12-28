/**
 * @fileoverview DataGrid Primitive Types
 * @module components/Grids/DataGrid
 * 
 * Basic type definitions for grid data.
 */

// ═══════════════════════════════════════════════════════════════════════════
// DATA TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Supported grid data types for cell rendering.
 */
export type GridDataType =
    // Primitive types
    | 'string'
    | 'integer'
    | 'decimal'
    | 'currency'
    | 'date'
    | 'datetime'
    | 'time'
    | 'boolean'
    // Complex types
    | 'json'
    | 'xml'
    | 'guid'
    | 'url'
    | 'email'
    // Visual types
    | 'gauge'
    | 'timeseries'
    | 'image'
    | 'icon'
    | 'badge'
    | 'pnl'
    | 'actions';

/**
 * Field attribute for schema metadata.
 */
export type FieldAttribute =
    | 'primary_key'
    | 'foreign_key'
    | 'unique'
    | 'not_null'
    | 'auto_increment'
    | 'default'
    | 'index';
