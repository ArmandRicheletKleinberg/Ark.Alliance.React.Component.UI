/**
 * @fileoverview Footer Component Model
 * @module components/Footer
 * 
 * Enterprise-grade Footer with paging, visual modes, and Grid integration.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { BackgroundConfigSchema, VisualMode } from '../Header/Header.model';

// ═══════════════════════════════════════════════════════════════════════════
// PAGING SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const PagingConfigSchema = z.object({
    currentPage: z.number().min(1).default(1),
    totalPages: z.number().min(0).default(1),
    pageSize: z.number().min(1).default(10),
    totalItems: z.number().min(0).default(0),
    pageSizeOptions: z.array(z.number()).default([10, 25, 50, 100]),
    showPageSize: z.boolean().default(true),
    showTotal: z.boolean().default(true),
    showQuickJump: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const FooterVariant = z.enum(['panel', 'page', 'section', 'card', 'grid']);

export const FooterModelSchema = extendSchema({
    // ─── Content ──────────────────────────────────────────────────────────
    text: z.string().optional(),

    // ─── Paging ───────────────────────────────────────────────────────────
    showPaging: z.boolean().default(false),
    paging: PagingConfigSchema.optional(),

    // ─── Visual ───────────────────────────────────────────────────────────
    visualMode: VisualMode.default('normal'),
    variant: FooterVariant.default('panel'),
    isDark: z.boolean().default(true),
    background: BackgroundConfigSchema.optional(),
    borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).default('none'),

    // ─── Layout ───────────────────────────────────────────────────────────
    height: z.enum(['compact', 'normal', 'large']).default('normal'),
    sticky: z.boolean().default(false),
    alignment: z.enum(['left', 'center', 'right', 'space-between']).default('center'),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type PagingConfig = z.infer<typeof PagingConfigSchema>;
export type FooterVariantType = z.infer<typeof FooterVariant>;
export type FooterModel = z.infer<typeof FooterModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

export const defaultPagingConfig: PagingConfig = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
    pageSizeOptions: [10, 25, 50, 100],
    showPageSize: true,
    showTotal: true,
    showQuickJump: false,
};

export const defaultFooterModel: FooterModel = {
    text: undefined,
    showPaging: false,
    paging: undefined,
    visualMode: 'normal',
    variant: 'panel',
    isDark: true,
    background: undefined,
    borderRadius: 'none',
    height: 'normal',
    sticky: false,
    alignment: 'center',
    disabled: false,
    loading: false,
};

export function createFooterModel(data: Partial<FooterModel>): FooterModel {
    return FooterModelSchema.parse({ ...defaultFooterModel, ...data });
}
