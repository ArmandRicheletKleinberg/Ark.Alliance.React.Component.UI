/**
 * @fileoverview DataGrid Example with Formatters
 * @module examples/formatters
 * 
 * Example demonstrating formatter usage in DataGrid components.
 * 
 * @author Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5
 */

import { formatCurrency, formatDate, formatPercentage, formatBytes } from '@core/formatters';
import type { FieldModel } from '@components/Grids/DataGrid/FieldModel';

// ═══════════════════════════════════════════════════════════════════════════
// Example 1: E-commerce Order Grid
// ═══════════════════════════════════════════════════════════════════════════

export const orderFields: FieldModel[] = [
    {
        fieldKey: 'orderId',
        displayName: 'Order ID',
        dataType: 'string',
        width: 120,
    },
    {
        fieldKey: 'customer',
        displayName: 'Customer',
        dataType: 'string',
        width: 200,
    },
    {
        fieldKey: 'totalAmount',
        displayName: 'Total',
        dataType: 'number',
        width: 120,
        horizontalAlign: 'right',
        // Format as USD currency
        formatter: (value) => formatCurrency(value as number, { currency: 'USD' }),
    },
    {
        fieldKey: 'discountPercent',
        displayName: 'Discount',
        dataType: 'number',
        width: 100,
        horizontalAlign: 'right',
        // Format as percentage
        formatter: (value) => formatPercentage(value as number),
    },
    {
        fieldKey: 'orderDate',
        displayName: 'Date',
        dataType: 'date',
        width: 150,
        // Format as medium date
        formatter: (value) => formatDate(value, { dateStyle: 'medium' }),
    },
    {
        fieldKey: 'lastUpdated',
        displayName: 'Last Updated',
        dataType: 'date',
        width: 150,
        // Format as relative time
        formatter: (value) => formatDate(value, { format: 'relative' }),
    },
];

// ═══════════════════════════════════════════════════════════════════════════
// Example 2: File Manager Grid
// ═══════════════════════════════════════════════════════════════════════════

export const fileFields: FieldModel[] = [
    {
        fieldKey: 'fileName',
        displayName: 'Name',
        dataType: 'string',
        width: 250,
    },
    {
        fieldKey: 'fileSize',
        displayName: 'Size',
        dataType: 'number',
        width: 120,
        horizontalAlign: 'right',
        // Format as human-readable bytes
        formatter: (value) => formatBytes(value as number),
    },
    {
        fieldKey: 'modifiedDate',
        displayName: 'Modified',
        dataType: 'date',
        width: 180,
        // Format as datetime
        formatter: (value) => formatDate(value, { format: 'datetime', timeStyle: 'short' }),
    },
];

// ═══════════════════════════════════════════════════════════════════════════
// Example 3: Analytics Dashboard Grid with Multi-Currency
// ═══════════════════════════════════════════════════════════════════════════

export const analyticsFields: FieldModel[] = [
    {
        fieldKey: 'region',
        displayName: 'Region',
        dataType: 'string',
        width: 150,
    },
    {
        fieldKey: 'revenue',
        displayName: 'Revenue',
        dataType: 'number',
        width: 150,
        horizontalAlign: 'right',
        // Context-aware formatting based on region
        formatter: (value, row) => {
            const currency = row?.region === 'Europe' ? 'EUR' :
                row?.region === 'Japan' ? 'JPY' : 'USD';
            const locale = row?.region === 'Europe' ? 'de-DE' :
                row?.region === 'Japan' ? 'ja-JP' : 'en-US';

            return formatCurrency(value as number, { currency, locale });
        },
    },
    {
        fieldKey: 'conversionRate',
        displayName: 'Conversion',
        dataType: 'number',
        width: 120,
        horizontalAlign: 'right',
        // Format with 2 decimal places
        formatter: (value) => formatPercentage(value as number, { maximumFractionDigits: 2 }),
    },
];

// ═══════════════════════════════════════════════════════════════════════════
// Example 4: Using useFormatter Hook in Components
// ═══════════════════════════════════════════════════════════════════════════

/*
import { useFormatter } from '@core/formatters';

export function ProductCard({ product }) {
    const { currency, date, number } = useFormatter({
        locale: 'en-US',
        currency: 'USD'
    });

    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <p className="price">{currency(product.price)}</p>
            <p className="stock">In Stock: {number(product.stockQuantity)}</p>
            <p className="created">Added {date(product.createdAt, { format: 'relative' })}</p>
        </div>
    );
}
*/
