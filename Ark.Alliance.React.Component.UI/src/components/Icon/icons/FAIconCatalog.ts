/**
 * @fileoverview Font Awesome Icon Catalog
 * @module components/Icon/icons/FAIconCatalog
 * 
 * Catalog of commonly used Font Awesome 6 Free icons with metadata.
 * Use this for icon picker components and documentation.
 * 
 * Full icon list: https://fontawesome.com/search?o=r&m=free
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Font Awesome icon metadata
 */
export interface FAIconMeta {
    /** Icon name (kebab-case) */
    name: string;
    /** Icon style: solid, regular, or brands */
    style: 'solid' | 'regular' | 'brands';
    /** Category for organization */
    category: string;
    /** Search tags */
    tags?: string[];
    /** Unicode code point */
    unicode?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SOLID ICONS (fas)
// ═══════════════════════════════════════════════════════════════════════════

export const SOLID_ICONS: FAIconMeta[] = [
    // Navigation
    { name: 'arrow-left', style: 'solid', category: 'navigation', tags: ['back', 'previous'] },
    { name: 'arrow-right', style: 'solid', category: 'navigation', tags: ['next', 'forward'] },
    { name: 'arrow-up', style: 'solid', category: 'navigation', tags: ['up'] },
    { name: 'arrow-down', style: 'solid', category: 'navigation', tags: ['down'] },
    { name: 'chevron-left', style: 'solid', category: 'navigation' },
    { name: 'chevron-right', style: 'solid', category: 'navigation' },
    { name: 'chevron-up', style: 'solid', category: 'navigation' },
    { name: 'chevron-down', style: 'solid', category: 'navigation' },
    { name: 'angles-left', style: 'solid', category: 'navigation', tags: ['double-arrow'] },
    { name: 'angles-right', style: 'solid', category: 'navigation', tags: ['double-arrow'] },

    // Actions
    { name: 'check', style: 'solid', category: 'actions', tags: ['confirm', 'success', 'done'] },
    { name: 'xmark', style: 'solid', category: 'actions', tags: ['close', 'cancel', 'remove'] },
    { name: 'plus', style: 'solid', category: 'actions', tags: ['add', 'create', 'new'] },
    { name: 'minus', style: 'solid', category: 'actions', tags: ['remove', 'subtract'] },
    { name: 'pen', style: 'solid', category: 'actions', tags: ['edit', 'write'] },
    { name: 'trash', style: 'solid', category: 'actions', tags: ['delete', 'remove'] },
    { name: 'copy', style: 'solid', category: 'actions', tags: ['duplicate', 'clipboard'] },
    { name: 'paste', style: 'solid', category: 'actions', tags: ['clipboard'] },
    { name: 'magnifying-glass', style: 'solid', category: 'actions', tags: ['search', 'find'] },
    { name: 'rotate', style: 'solid', category: 'actions', tags: ['refresh', 'reload'] },
    { name: 'rotate-right', style: 'solid', category: 'actions', tags: ['redo'] },
    { name: 'rotate-left', style: 'solid', category: 'actions', tags: ['undo'] },
    { name: 'download', style: 'solid', category: 'actions' },
    { name: 'upload', style: 'solid', category: 'actions' },
    { name: 'share', style: 'solid', category: 'actions' },
    { name: 'save', style: 'solid', category: 'actions', tags: ['floppy-disk'] },
    { name: 'print', style: 'solid', category: 'actions' },
    { name: 'filter', style: 'solid', category: 'actions' },
    { name: 'sort', style: 'solid', category: 'actions' },

    // Interface
    { name: 'bars', style: 'solid', category: 'interface', tags: ['menu', 'hamburger'] },
    { name: 'ellipsis', style: 'solid', category: 'interface', tags: ['more', 'options'] },
    { name: 'ellipsis-vertical', style: 'solid', category: 'interface', tags: ['more', 'options'] },
    { name: 'gear', style: 'solid', category: 'interface', tags: ['settings', 'cog'] },
    { name: 'sliders', style: 'solid', category: 'interface', tags: ['settings', 'controls'] },
    { name: 'circle-info', style: 'solid', category: 'interface', tags: ['info', 'help'] },
    { name: 'circle-question', style: 'solid', category: 'interface', tags: ['help', 'faq'] },
    { name: 'circle-exclamation', style: 'solid', category: 'interface', tags: ['warning', 'alert'] },
    { name: 'triangle-exclamation', style: 'solid', category: 'interface', tags: ['warning', 'alert'] },
    { name: 'circle-check', style: 'solid', category: 'interface', tags: ['success', 'done'] },
    { name: 'circle-xmark', style: 'solid', category: 'interface', tags: ['error', 'close'] },
    { name: 'grip', style: 'solid', category: 'interface', tags: ['drag', 'handle'] },
    { name: 'grip-vertical', style: 'solid', category: 'interface', tags: ['drag', 'handle'] },
    { name: 'list', style: 'solid', category: 'interface', tags: ['menu', 'items'] },
    { name: 'table', style: 'solid', category: 'interface', tags: ['grid', 'data'] },
    { name: 'expand', style: 'solid', category: 'interface', tags: ['fullscreen', 'maximize'] },
    { name: 'compress', style: 'solid', category: 'interface', tags: ['minimize'] },

    // User
    { name: 'user', style: 'solid', category: 'user', tags: ['person', 'account', 'profile'] },
    { name: 'users', style: 'solid', category: 'user', tags: ['people', 'team', 'group'] },
    { name: 'user-plus', style: 'solid', category: 'user', tags: ['add-user', 'register'] },
    { name: 'user-minus', style: 'solid', category: 'user', tags: ['remove-user'] },
    { name: 'user-gear', style: 'solid', category: 'user', tags: ['user-settings'] },
    { name: 'circle-user', style: 'solid', category: 'user', tags: ['avatar'] },

    // Communication
    { name: 'envelope', style: 'solid', category: 'communication', tags: ['email', 'mail'] },
    { name: 'bell', style: 'solid', category: 'communication', tags: ['notification', 'alert'] },
    { name: 'comment', style: 'solid', category: 'communication', tags: ['chat', 'message'] },
    { name: 'comments', style: 'solid', category: 'communication', tags: ['chat', 'discussion'] },
    { name: 'phone', style: 'solid', category: 'communication', tags: ['call', 'contact'] },

    // Files & Folders
    { name: 'file', style: 'solid', category: 'files', tags: ['document'] },
    { name: 'file-lines', style: 'solid', category: 'files', tags: ['document', 'text'] },
    { name: 'file-pdf', style: 'solid', category: 'files', tags: ['pdf', 'document'] },
    { name: 'file-image', style: 'solid', category: 'files', tags: ['image', 'photo'] },
    { name: 'file-code', style: 'solid', category: 'files', tags: ['code', 'programming'] },
    { name: 'file-excel', style: 'solid', category: 'files', tags: ['spreadsheet', 'excel'] },
    { name: 'folder', style: 'solid', category: 'files', tags: ['directory'] },
    { name: 'folder-open', style: 'solid', category: 'files', tags: ['directory'] },
    { name: 'folder-plus', style: 'solid', category: 'files', tags: ['new-folder'] },

    // Media
    { name: 'play', style: 'solid', category: 'media', tags: ['start', 'video', 'audio'] },
    { name: 'pause', style: 'solid', category: 'media', tags: ['stop'] },
    { name: 'stop', style: 'solid', category: 'media' },
    { name: 'forward', style: 'solid', category: 'media', tags: ['skip'] },
    { name: 'backward', style: 'solid', category: 'media', tags: ['rewind'] },
    { name: 'volume-high', style: 'solid', category: 'media', tags: ['sound', 'audio'] },
    { name: 'volume-low', style: 'solid', category: 'media', tags: ['sound', 'audio'] },
    { name: 'volume-off', style: 'solid', category: 'media', tags: ['mute', 'silent'] },
    { name: 'volume-xmark', style: 'solid', category: 'media', tags: ['mute', 'silent'] },
    { name: 'image', style: 'solid', category: 'media', tags: ['photo', 'picture'] },
    { name: 'video', style: 'solid', category: 'media', tags: ['camera', 'movie'] },
    { name: 'music', style: 'solid', category: 'media', tags: ['audio', 'song'] },

    // Status & Indicators
    { name: 'spinner', style: 'solid', category: 'status', tags: ['loading', 'wait'] },
    { name: 'circle-notch', style: 'solid', category: 'status', tags: ['loading'] },
    { name: 'hourglass', style: 'solid', category: 'status', tags: ['loading', 'wait'] },
    { name: 'check-circle', style: 'solid', category: 'status', tags: ['success', 'done'] },
    { name: 'times-circle', style: 'solid', category: 'status', tags: ['error', 'fail'] },
    { name: 'exclamation-circle', style: 'solid', category: 'status', tags: ['warning'] },
    { name: 'star', style: 'solid', category: 'status', tags: ['favorite', 'rating'] },
    { name: 'heart', style: 'solid', category: 'status', tags: ['love', 'like', 'favorite'] },
    { name: 'thumbs-up', style: 'solid', category: 'status', tags: ['like', 'approve'] },
    { name: 'thumbs-down', style: 'solid', category: 'status', tags: ['dislike', 'reject'] },
    { name: 'flag', style: 'solid', category: 'status', tags: ['report', 'mark'] },
    { name: 'bookmark', style: 'solid', category: 'status', tags: ['save', 'favorite'] },

    // Trading & Finance
    { name: 'chart-line', style: 'solid', category: 'trading', tags: ['chart', 'graph', 'trend'] },
    { name: 'chart-pie', style: 'solid', category: 'trading', tags: ['chart', 'graph'] },
    { name: 'chart-bar', style: 'solid', category: 'trading', tags: ['chart', 'graph'] },
    { name: 'chart-column', style: 'solid', category: 'trading', tags: ['chart', 'graph'] },
    { name: 'arrow-trend-up', style: 'solid', category: 'trading', tags: ['bullish', 'growth'] },
    { name: 'arrow-trend-down', style: 'solid', category: 'trading', tags: ['bearish', 'decline'] },
    { name: 'dollar-sign', style: 'solid', category: 'trading', tags: ['money', 'currency', 'usd'] },
    { name: 'euro-sign', style: 'solid', category: 'trading', tags: ['money', 'currency', 'eur'] },
    { name: 'sterling-sign', style: 'solid', category: 'trading', tags: ['money', 'currency', 'gbp'] },
    { name: 'bitcoin-sign', style: 'solid', category: 'trading', tags: ['crypto', 'btc'] },
    { name: 'coins', style: 'solid', category: 'trading', tags: ['money', 'currency'] },
    { name: 'wallet', style: 'solid', category: 'trading', tags: ['money', 'balance'] },
    { name: 'credit-card', style: 'solid', category: 'trading', tags: ['payment', 'card'] },
    { name: 'money-bill', style: 'solid', category: 'trading', tags: ['cash', 'money'] },
    { name: 'sack-dollar', style: 'solid', category: 'trading', tags: ['money', 'profit'] },
    { name: 'piggy-bank', style: 'solid', category: 'trading', tags: ['savings', 'money'] },
    { name: 'building-columns', style: 'solid', category: 'trading', tags: ['bank', 'institution'] },
    { name: 'scale-balanced', style: 'solid', category: 'trading', tags: ['balance', 'justice'] },
    { name: 'percent', style: 'solid', category: 'trading', tags: ['percentage', 'rate'] },
    { name: 'calculator', style: 'solid', category: 'trading', tags: ['math', 'calculate'] },

    // Security
    { name: 'lock', style: 'solid', category: 'security', tags: ['secure', 'protected'] },
    { name: 'unlock', style: 'solid', category: 'security' },
    { name: 'key', style: 'solid', category: 'security', tags: ['password', 'access'] },
    { name: 'shield', style: 'solid', category: 'security', tags: ['protect', 'secure'] },
    { name: 'shield-halved', style: 'solid', category: 'security', tags: ['protect'] },
    { name: 'eye', style: 'solid', category: 'security', tags: ['view', 'visible'] },
    { name: 'eye-slash', style: 'solid', category: 'security', tags: ['hide', 'invisible'] },
    { name: 'fingerprint', style: 'solid', category: 'security', tags: ['biometric', 'auth'] },

    // Development
    { name: 'code', style: 'solid', category: 'development', tags: ['programming'] },
    { name: 'terminal', style: 'solid', category: 'development', tags: ['console', 'cli'] },
    { name: 'database', style: 'solid', category: 'development', tags: ['data', 'storage'] },
    { name: 'server', style: 'solid', category: 'development', tags: ['hosting'] },
    { name: 'cloud', style: 'solid', category: 'development', tags: ['hosting', 'storage'] },
    { name: 'bug', style: 'solid', category: 'development', tags: ['error', 'issue'] },
    { name: 'robot', style: 'solid', category: 'development', tags: ['ai', 'automation'] },
    { name: 'microchip', style: 'solid', category: 'development', tags: ['hardware', 'cpu'] },
    { name: 'network-wired', style: 'solid', category: 'development', tags: ['network', 'lan'] },
    { name: 'wifi', style: 'solid', category: 'development', tags: ['network', 'wireless'] },

    // Misc
    { name: 'home', style: 'solid', category: 'misc', tags: ['house', 'dashboard'] },
    { name: 'calendar', style: 'solid', category: 'misc', tags: ['date', 'schedule'] },
    { name: 'clock', style: 'solid', category: 'misc', tags: ['time', 'schedule'] },
    { name: 'location-dot', style: 'solid', category: 'misc', tags: ['map', 'pin', 'marker'] },
    { name: 'globe', style: 'solid', category: 'misc', tags: ['world', 'earth', 'web'] },
    { name: 'link', style: 'solid', category: 'misc', tags: ['url', 'chain'] },
    { name: 'link-slash', style: 'solid', category: 'misc', tags: ['unlink', 'broken'] },
    { name: 'language', style: 'solid', category: 'misc', tags: ['translate', 'i18n'] },
    { name: 'palette', style: 'solid', category: 'misc', tags: ['color', 'design', 'theme'] },
    { name: 'sun', style: 'solid', category: 'misc', tags: ['light', 'day', 'bright'] },
    { name: 'moon', style: 'solid', category: 'misc', tags: ['dark', 'night', 'theme'] },
    { name: 'bolt', style: 'solid', category: 'misc', tags: ['lightning', 'power', 'flash'] },
    { name: 'fire', style: 'solid', category: 'misc', tags: ['hot', 'trending'] },
    { name: 'gift', style: 'solid', category: 'misc', tags: ['present', 'reward'] },
    { name: 'trophy', style: 'solid', category: 'misc', tags: ['award', 'win', 'prize'] },
];

// ═══════════════════════════════════════════════════════════════════════════
// REGULAR ICONS (far)
// ═══════════════════════════════════════════════════════════════════════════

export const REGULAR_ICONS: FAIconMeta[] = [
    { name: 'bell', style: 'regular', category: 'communication', tags: ['notification'] },
    { name: 'bookmark', style: 'regular', category: 'status', tags: ['save'] },
    { name: 'calendar', style: 'regular', category: 'misc', tags: ['date'] },
    { name: 'circle', style: 'regular', category: 'shapes' },
    { name: 'circle-check', style: 'regular', category: 'status', tags: ['success'] },
    { name: 'circle-xmark', style: 'regular', category: 'status', tags: ['error'] },
    { name: 'clock', style: 'regular', category: 'misc', tags: ['time'] },
    { name: 'comment', style: 'regular', category: 'communication' },
    { name: 'comments', style: 'regular', category: 'communication' },
    { name: 'copy', style: 'regular', category: 'actions' },
    { name: 'envelope', style: 'regular', category: 'communication', tags: ['email'] },
    { name: 'eye', style: 'regular', category: 'security', tags: ['view'] },
    { name: 'eye-slash', style: 'regular', category: 'security', tags: ['hide'] },
    { name: 'file', style: 'regular', category: 'files' },
    { name: 'file-lines', style: 'regular', category: 'files' },
    { name: 'folder', style: 'regular', category: 'files' },
    { name: 'folder-open', style: 'regular', category: 'files' },
    { name: 'heart', style: 'regular', category: 'status', tags: ['like'] },
    { name: 'image', style: 'regular', category: 'media', tags: ['photo'] },
    { name: 'square', style: 'regular', category: 'shapes' },
    { name: 'square-check', style: 'regular', category: 'forms', tags: ['checkbox'] },
    { name: 'star', style: 'regular', category: 'status', tags: ['rating'] },
    { name: 'thumbs-up', style: 'regular', category: 'status' },
    { name: 'thumbs-down', style: 'regular', category: 'status' },
    { name: 'trash-can', style: 'regular', category: 'actions', tags: ['delete'] },
    { name: 'user', style: 'regular', category: 'user' },
];

// ═══════════════════════════════════════════════════════════════════════════
// BRAND ICONS (fab)
// ═══════════════════════════════════════════════════════════════════════════

export const BRAND_ICONS: FAIconMeta[] = [
    // Social Media
    { name: 'facebook', style: 'brands', category: 'social', tags: ['fb', 'meta'] },
    { name: 'facebook-f', style: 'brands', category: 'social', tags: ['fb'] },
    { name: 'twitter', style: 'brands', category: 'social', tags: ['x'] },
    { name: 'x-twitter', style: 'brands', category: 'social', tags: ['twitter'] },
    { name: 'instagram', style: 'brands', category: 'social', tags: ['ig', 'insta'] },
    { name: 'linkedin', style: 'brands', category: 'social', tags: ['professional'] },
    { name: 'linkedin-in', style: 'brands', category: 'social' },
    { name: 'youtube', style: 'brands', category: 'social', tags: ['video'] },
    { name: 'tiktok', style: 'brands', category: 'social' },
    { name: 'whatsapp', style: 'brands', category: 'social', tags: ['messaging'] },
    { name: 'telegram', style: 'brands', category: 'social', tags: ['messaging'] },
    { name: 'discord', style: 'brands', category: 'social', tags: ['chat'] },
    { name: 'slack', style: 'brands', category: 'social', tags: ['chat', 'work'] },
    { name: 'reddit', style: 'brands', category: 'social' },
    { name: 'pinterest', style: 'brands', category: 'social' },
    { name: 'snapchat', style: 'brands', category: 'social' },
    { name: 'threads', style: 'brands', category: 'social' },

    // Development
    { name: 'github', style: 'brands', category: 'development', tags: ['git', 'code'] },
    { name: 'gitlab', style: 'brands', category: 'development', tags: ['git', 'code'] },
    { name: 'bitbucket', style: 'brands', category: 'development', tags: ['git'] },
    { name: 'stack-overflow', style: 'brands', category: 'development', tags: ['qa'] },
    { name: 'npm', style: 'brands', category: 'development', tags: ['node', 'package'] },
    { name: 'node-js', style: 'brands', category: 'development', tags: ['javascript'] },
    { name: 'js', style: 'brands', category: 'development', tags: ['javascript'] },
    { name: 'react', style: 'brands', category: 'development', tags: ['frontend'] },
    { name: 'angular', style: 'brands', category: 'development', tags: ['frontend'] },
    { name: 'vuejs', style: 'brands', category: 'development', tags: ['frontend', 'vue'] },
    { name: 'python', style: 'brands', category: 'development' },
    { name: 'java', style: 'brands', category: 'development' },
    { name: 'php', style: 'brands', category: 'development' },
    { name: 'rust', style: 'brands', category: 'development' },
    { name: 'golang', style: 'brands', category: 'development', tags: ['go'] },
    { name: 'docker', style: 'brands', category: 'development', tags: ['containers'] },
    { name: 'kubernetes', style: 'brands', category: 'development', tags: ['k8s'] },
    { name: 'aws', style: 'brands', category: 'development', tags: ['cloud', 'amazon'] },
    { name: 'google', style: 'brands', category: 'development', tags: ['gcp', 'cloud'] },
    { name: 'microsoft', style: 'brands', category: 'development', tags: ['azure'] },
    { name: 'linux', style: 'brands', category: 'development', tags: ['os'] },
    { name: 'ubuntu', style: 'brands', category: 'development', tags: ['linux'] },
    { name: 'windows', style: 'brands', category: 'development', tags: ['os'] },
    { name: 'apple', style: 'brands', category: 'development', tags: ['macos', 'ios'] },
    { name: 'android', style: 'brands', category: 'development', tags: ['mobile'] },

    // Crypto
    { name: 'bitcoin', style: 'brands', category: 'crypto', tags: ['btc', 'cryptocurrency'] },
    { name: 'ethereum', style: 'brands', category: 'crypto', tags: ['eth', 'cryptocurrency'] },

    // Payments
    { name: 'paypal', style: 'brands', category: 'payments' },
    { name: 'stripe', style: 'brands', category: 'payments' },
    { name: 'cc-visa', style: 'brands', category: 'payments', tags: ['credit-card'] },
    { name: 'cc-mastercard', style: 'brands', category: 'payments', tags: ['credit-card'] },
    { name: 'cc-amex', style: 'brands', category: 'payments', tags: ['credit-card'] },
    { name: 'cc-apple-pay', style: 'brands', category: 'payments' },
    { name: 'google-pay', style: 'brands', category: 'payments' },

    // Other
    { name: 'chrome', style: 'brands', category: 'browsers' },
    { name: 'firefox', style: 'brands', category: 'browsers' },
    { name: 'safari', style: 'brands', category: 'browsers' },
    { name: 'edge', style: 'brands', category: 'browsers' },
    { name: 'spotify', style: 'brands', category: 'media', tags: ['music'] },
    { name: 'dribbble', style: 'brands', category: 'design' },
    { name: 'figma', style: 'brands', category: 'design' },
    { name: 'sketch', style: 'brands', category: 'design' },
    { name: 'trello', style: 'brands', category: 'productivity' },
    { name: 'jira', style: 'brands', category: 'productivity' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED CATALOG
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All Font Awesome icons in the catalog
 */
export const FA_ICON_CATALOG: FAIconMeta[] = [
    ...SOLID_ICONS,
    ...REGULAR_ICONS,
    ...BRAND_ICONS,
];

/**
 * Get icons by category
 */
export function getFAIconsByCategory(category: string): FAIconMeta[] {
    return FA_ICON_CATALOG.filter(icon => icon.category === category);
}

/**
 * Get icons by style
 */
export function getFAIconsByStyle(style: 'solid' | 'regular' | 'brands'): FAIconMeta[] {
    return FA_ICON_CATALOG.filter(icon => icon.style === style);
}

/**
 * Search icons by name or tags
 */
export function searchFAIcons(query: string): FAIconMeta[] {
    const lowerQuery = query.toLowerCase();
    return FA_ICON_CATALOG.filter(icon => {
        const nameMatch = icon.name.includes(lowerQuery);
        const tagMatch = icon.tags?.some(tag => tag.includes(lowerQuery));
        const categoryMatch = icon.category.includes(lowerQuery);
        return nameMatch || tagMatch || categoryMatch;
    });
}

/**
 * Get all unique categories
 */
export function getFAIconCategories(): string[] {
    return [...new Set(FA_ICON_CATALOG.map(icon => icon.category))];
}

export default FA_ICON_CATALOG;
