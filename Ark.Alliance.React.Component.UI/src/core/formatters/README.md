# Formatters Module

**Module:** `@core/formatters`  
**Purpose:** Centralized formatting utilities for numbers, currencies, dates, bytes, percentages, and strings with full locale support.

---

## Features

✅ **Number Formatting** - Locale-specific separators, precision control  
✅ **Currency Formatting** - Multi-currency support (USD, EUR, JPY, etc.)  
✅ **Date Formatting** - Relative time, date styles, timezone support  
✅ **Byte Formatting** - Human-readable file sizes (KB, MB, GB)  
✅ **Percentage Formatting** - Locale-aware percentage display  
✅ **String Utilities** - Truncate, capitalize, toTitleCase  
✅ **React Hook** - `useFormatter()` with memoization  
✅ **DataGrid Integration** - Column-level formatters  

---

## Installation

The formatters module is part of `@core` and available via:

```typescript
import { formatCurrency, formatDate, useFormatter } from '@core/formatters';
```

---

## API Reference

### Number Formatters

#### `formatNumber(value, options?)`

Format number with locale-specific separators.

```typescript
formatNumber(1234.56)
// => "1,234.56" (en-US)

formatNumber(1234.56, { locale: 'de-DE' })
// => "1.234,56"

formatNumber(1234.56, { maximumFractionDigits: 0 })
// => "1,235"
```

#### `formatCurrency(value, options?)`

Format currency with symbol.

```typescript
formatCurrency(1234.56)
// => "$1,234.56"

formatCurrency(1234.56, { currency: 'EUR', locale: 'fr-FR' })
// => "1 234,56 €"

formatCurrency(1234, { currency: 'JPY' })
// => "¥1,234"
```

#### `formatCompact(value, options?)`

Format as compact notation (K, M, B).

```typescript
formatCompact(1234)
// => "1.2K"

formatCompact(1234567)
// => "1.2M"
```

---

### Date Formatters

#### `formatDate(value, options?)`

Format date with locale-specific style.

```typescript
formatDate(new Date('2026-01-27'), { dateStyle: 'medium' })
// => "Jan 27, 2026"

formatDate(new Date(), { format: 'datetime', timeStyle: 'short' })
// => "Jan 27, 2026, 1:30 PM"

formatDate(new Date(), { format: 'relative' })
// => "2 hours ago"
```

#### `formatRelativeTime(date, locale?)`

Format as relative time.

```typescript
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
formatRelativeTime(twoHoursAgo)
// => "2 hours ago"
```

---

### Other Formatters

#### `formatBytes(bytes, decimals?)`

```typescript
formatBytes(1024)
// => "1 KB"

formatBytes(1048576)
// => "1 MB"
```

#### `formatPercentage(value, options?)`

```typescript
formatPercentage(0.1234)
// => "12.34%"

formatPercentage(0.5, { maximumFractionDigits: 0 })
// => "50%"
```

#### `truncate(text, maxLength, ellipsis?)`

```typescript
truncate('Hello World', 8)
// => "Hello..."
```

---

## React Hook

### `useFormatter(options?)`

Returns memoized formatter functions with consistent locale settings.

```typescript
function ProductList() {
    const { currency, date, number } = useFormatter({
        locale: 'en-US',
        currency: 'USD'
    });

    return (
        <div>
            <p>Price: {currency(product.price)}</p>
            <p>Quantity: {number(product.quantity)}</p>
            <p>Created: {date(product.createdAt, { dateStyle: 'medium' })}</p>
        </div>
    );
}
```

---

## DataGrid Integration

Add `formatter` to field definitions:

```typescript
import { formatCurrency, formatDate, formatPercentage } from '@core/formatters';

const orderGridModel = {
    fields: [
        {
            fieldKey: 'price',
            displayName: 'Price',
            dataType: 'number',
            formatter: (value) => formatCurrency(value as number),
        },
        {
            fieldKey: 'discount',
            displayName: 'Discount',
            dataType: 'number',
            formatter: (value) => formatPercentage(value as number),
        },
        {
            fieldKey: 'orderDate',
            displayName: 'Order Date',
            dataType: 'date',
            formatter: (value) => formatDate(value, { dateStyle: 'medium' }),
        },
    ],
};
```

---

## Locale Support

All formatters use `Intl` APIs for standards-compliant, locale-aware formatting:

| Locale | Example Currency | Example Number | Example Date |
|--------|-----------------|----------------|--------------|
| `en-US` | $1,234.56 | 1,234.56 | Jan 27, 2026 |
| `fr-FR` | 1 234,56 € | 1 234,56 | 27 janv. 2026 |
| `de-DE` | 1.234,56 € | 1.234,56 | 27. Jan. 2026 |
| `ja-JP` | ¥1,235 | 1,234.56 | 2026年1月27日 |

---

## Type Safety

All formatters include TypeScript definitions:

```typescript
import type {
    NumberFormatOptions,
    CurrencyFormatOptions,
    DateFormatOptions,
    ColumnFormatter,
} from '@core/formatters';
```

---

## Best Practices

1. **Use `useFormatter` in React components** for consistent locale across all formatters
2. **Set formatter at field level** in DataGrid for column-specific formatting
3. **Handle null/undefined gracefully** - all formatters return '—' for missing values
4. **Leverage locale defaults** - specify locale once in `useFormatter()` options
5. **Override per call** - can override locale/currency on individual formatter calls

---

## Migration from `toLocaleString()`

**Before:**
```typescript
const price = `$${value.toFixed(2)}`;
const date = new Date(value).toLocaleDateString();
const size = `${(bytes / 1024).toFixed(2)} KB`;
```

**After:**
```typescript
import { formatCurrency, formatDate, formatBytes } from '@core/formatters';

const price = formatCurrency(value);
const date = formatDate(value, { dateStyle: 'short' });
const size = formatBytes(bytes);
```

---

## Architecture

**Module Location:** `src/core/formatters/`  
**Pattern:** Pure functions + React hook  
**Dependencies:** None (uses native `Intl` APIs)  
**Bundle Size:** ~2KB gzipped

---

**M2H.IO (c) 2025 - Ark.Alliance Ecosystem**  
**Armand Richelet-Kleinberg with Anthropic Claude Opus 4.5**
