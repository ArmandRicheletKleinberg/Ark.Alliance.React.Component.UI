/**
 * @fileoverview Breadcrumb Component View
 * @module components/SEO/Breadcrumb
 * @description SEO-optimized breadcrumb navigation with BreadcrumbList schema.org JSON-LD markup.
 * 
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { key: '1', label: 'Home', href: '/', position: 1 },
 *     { key: '2', label: 'Projects', href: '/projects', position: 2 },
 *     { key: '3', label: 'Ark Portfolio', current: true, position: 3 }
 *   ]}
 *   generateSchema={true}
 *   baseUrl="https://example.com"
 * />
 * ```
 */

import { forwardRef, memo } from 'react';
import { useBreadcrumb, type UseBreadcrumbOptions } from './Breadcrumb.viewmodel';
import { Icon } from '../../Icon';
import './Breadcrumb.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BreadcrumbProps extends UseBreadcrumbOptions {
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Breadcrumb = memo(forwardRef<HTMLElement, BreadcrumbProps>(
    function Breadcrumb(props, ref) {
        const { className = '', ...breadcrumbOptions } = props;
        const vm = useBreadcrumb(breadcrumbOptions);

        if (!vm.model.items || vm.model.items.length === 0) {
            return null;
        }

        return (
            <>
                {/* Breadcrumb Navigation */}
                <nav
                    ref={ref}
                    className={`${vm.breadcrumbClasses} ${className}`}
                    aria-label="Breadcrumb"
                    data-testid={vm.model.testId}
                >
                    <ol className="ark-breadcrumb__list">
                        {vm.model.items.map((item, index) => {
                            const isFirst = index === 0;
                            const isLast = index === vm.model.items.length - 1;
                            const showIcon = item.icon || (isFirst && vm.model.showHomeIcon);

                            return (
                                <li
                                    key={item.key}
                                    className={`ark-breadcrumb__item ${item.current ? 'ark-breadcrumb__item--current' : ''}`}
                                >
                                    {/* Separator */}
                                    {!isFirst && (
                                        <span className="ark-breadcrumb__separator" aria-hidden="true">
                                            {vm.separatorDisplay}
                                        </span>
                                    )}

                                    {/* Breadcrumb Link/Span */}
                                    {item.href && !item.current ? (
                                        <a
                                            href={item.href}
                                            className="ark-breadcrumb__link"
                                            aria-current={item.current ? 'page' : undefined}
                                            onClick={(e) => vm.handleItemClick(item, index, e)}
                                        >
                                            {showIcon && (
                                                <Icon
                                                    name={item.icon || 'home'}
                                                    size="sm"
                                                    className="ark-breadcrumb__icon"
                                                />
                                            )}
                                            <span className="ark-breadcrumb__label">{item.label}</span>
                                        </a>
                                    ) : (
                                        <span
                                            className={`ark-breadcrumb__text ${item.current ? 'ark-breadcrumb__text--current' : ''}`}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {showIcon && (
                                                <Icon
                                                    name={item.icon || 'home'}
                                                    size="sm"
                                                    className="ark-breadcrumb__icon"
                                                />
                                            )}
                                            <span className="ark-breadcrumb__label">{item.label}</span>
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                {/* JSON-LD Schema */}
                {vm.jsonLdSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(vm.jsonLdSchema, null, 2),
                        }}
                    />
                )}
            </>
        );
    }
));

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
