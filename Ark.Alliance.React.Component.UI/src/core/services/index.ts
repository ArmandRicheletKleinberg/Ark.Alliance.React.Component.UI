/**
 * @fileoverview Services Barrel Export
 * @module core/services
 * 
 * Exports all data services and providers for the component library.
 */

// Data Provider Interface
export type {
    IDataProvider,
    StreamConfig,
    FetchConfig,
    DataCallback,
    ConnectionCallback,
    DataTransform,
    DataProviderConfig,
} from './DataProviderInterface';
export { DEFAULT_PROVIDER_CONFIG } from './DataProviderInterface';

// Data Provider Hook
export { useDataProvider } from './useDataProvider';
export type {
    ConnectionStatus,
    UseDataProviderOptions,
    UseDataProviderResult,
} from './useDataProvider';

// Provider Implementations
export * from './providers';
