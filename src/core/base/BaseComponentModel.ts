/**
 * @fileoverview Base Component Model
 * @module core/base/BaseComponentModel
 * 
 * Abstract base class for all component models in the library.
 * Provides common properties, validation, and serialization.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// BASE MODEL SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base schema that all component models extend
 */
export const BaseModelSchema = z.object({
    /** Unique identifier for the component instance */
    id: z.string().optional(),

    /** Whether the component is disabled */
    disabled: z.boolean().default(false),

    /** Whether the component is in a loading state */
    loading: z.boolean().default(false),

    /** Additional CSS class names */
    className: z.string().optional(),

    /** Inline styles */
    style: z.record(z.string(), z.any()).optional(),

    /** Test ID for automated testing */
    testId: z.string().optional(),

    /** ARIA label for accessibility */
    ariaLabel: z.string().optional(),

    /** Additional metadata */
    metadata: z.record(z.string(), z.unknown()).optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base model interface derived from schema
 */
export type BaseModel = z.infer<typeof BaseModelSchema>;

/**
 * Validation result type
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// BASE MODEL CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Abstract base class for component models.
 * Provides validation, serialization, and common utilities.
 */
export abstract class BaseComponentModel<T extends BaseModel = BaseModel> {
    protected data: T;
    protected schema: z.ZodType<T>;

    constructor(data: Partial<T>, schema: z.ZodType<T>) {
        this.schema = schema;
        this.data = this.parseWithDefaults(data);
    }

    /**
     * Parse data with schema defaults
     */
    protected parseWithDefaults(data: Partial<T>): T {
        const result = this.schema.safeParse(data);
        if (result.success) {
            return result.data;
        }
        // Fall back to parsing with empty object to get defaults
        const defaults = this.schema.parse({});
        return { ...defaults, ...data } as T;
    }

    /**
     * Validate the current data
     */
    validate(): ValidationResult {
        const result = this.schema.safeParse(this.data);

        if (result.success) {
            return { isValid: true, errors: [] };
        }

        return {
            isValid: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            errors: result.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`),
        };
    }

    /**
     * Get a copy of the model data
     */
    getData(): T {
        return { ...this.data };
    }

    /**
     * Update model data
     */
    update(updates: Partial<T>): void {
        this.data = this.parseWithDefaults({ ...this.data, ...updates });
    }

    /**
     * Serialize to JSON
     */
    toJSON(): string {
        return JSON.stringify(this.data);
    }

    /**
     * Create instance from JSON
     */
    static fromJSON<M extends BaseComponentModel>(
        this: new (data: Partial<BaseModel>) => M,
        json: string
    ): M {
        return new this(JSON.parse(json));
    }

    /**
     * Get a specific property
     */
    get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }

    /**
     * Check if component is disabled
     */
    get isDisabled(): boolean {
        return this.data.disabled || false;
    }

    /**
     * Check if component is loading
     */
    get isLoading(): boolean {
        return this.data.loading || false;
    }

    /**
     * Generate a unique ID if not provided
     */
    protected generateId(): string {
        return `ark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a model factory function
 */
export function createModelFactory<T extends BaseModel>(
    schema: z.ZodType<T>,
    defaults: Partial<T> = {}
) {
    return (data: Partial<T> = {}): T => {
        return schema.parse({ ...defaults, ...data });
    };
}

/**
 * Extend the base schema with additional fields
 */
export function extendSchema<T extends z.ZodRawShape>(
    extension: T
): z.ZodObject<typeof BaseModelSchema.shape & T> {
    return BaseModelSchema.extend(extension);
}

export default BaseComponentModel;
