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

export { LoadingPage, type LoadingPageProps } from './LoadingPage';
export { useLoadingPage, type UseLoadingPageOptions, type UseLoadingPageResult } from './LoadingPage/LoadingPage.viewmodel';
export {
    LoadingPageModelSchema,
    createLoadingPageModel,
    defaultLoadingPageModel,
    type LoadingPageModel,
} from './LoadingPage/LoadingPage.model';

export { default } from './Page';

