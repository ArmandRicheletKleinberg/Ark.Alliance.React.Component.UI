/**
 * @fileoverview Page Component Barrel Export
 * @module components/Page
 */

export { Page, type PageProps } from './Page';
export { usePage, type UsePageOptions, type UsePageResult } from './Page.viewmodel';
export {
    PageModelSchema,
    BreadcrumbItemSchema,
    defaultPageModel,
    createPageModel,
    type PageModel,
    type BreadcrumbItem,
} from './Page.model';

export { default } from './Page';
