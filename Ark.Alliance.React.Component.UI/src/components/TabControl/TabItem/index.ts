/**
 * @fileoverview TabItem Barrel Export
 * @module components/TabControl/TabItem
 */

// Model
export {
    TabItemModelSchema,
    defaultTabItemModel,
    createTabItemModel,
} from './TabItem.model';
export type { TabItemModel } from './TabItem.model';

// ViewModel
export { useTabItem, default as useTabItemHook } from './TabItem.viewmodel';
export type { UseTabItemOptions, UseTabItemResult } from './TabItem.viewmodel';

// View
export { TabItem, default } from './TabItem';
export type { TabItemProps } from './TabItem';
