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

export { SubscriptionPage, type SubscriptionPageProps } from './SubscriptionPage';
export {
    SubscriptionPageModelSchema,
    createSubscriptionPageModel,
    defaultSubscriptionPageModel,
    type SubscriptionPageModel,
} from './SubscriptionPage/SubscriptionPage.model';
export {
    useSubscriptionPage,
    type UseSubscriptionPageOptions,
    type UseSubscriptionPageResult,
} from './SubscriptionPage/SubscriptionPage.viewmodel';

export {
    SubscriptionPannel,
    SubscriptionPannel as SubscriptionPanel,
    type SubscriptionPannelProps,
    type SubscriptionPannelProps as SubscriptionPanelProps,
} from './SubscriptionPage/SubscriptionPannel';

export { LoadingPage, type LoadingPageProps } from './LoadingPage';
export { useLoadingPage, type UseLoadingPageOptions, type UseLoadingPageResult } from './LoadingPage/LoadingPage.viewmodel';
export {
    LoadingPageModelSchema,
    createLoadingPageModel,
    defaultLoadingPageModel,
    type LoadingPageModel,
} from './LoadingPage/LoadingPage.model';

export { default } from './Page';
