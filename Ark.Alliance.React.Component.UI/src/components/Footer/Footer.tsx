/**
 * @fileoverview Footer Component View
 * @module components/Footer
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { useFooter, type UseFooterOptions } from './Footer.viewmodel';
import './Footer.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface FooterProps extends UseFooterOptions {
    /** Left content slot */
    left?: ReactNode;
    /** Right content slot */
    right?: ReactNode;
    /** Center content slot (overrides default paging) */
    center?: ReactNode;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface PagingControlsProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    pageSizeOptions: number[];
    showPageSize: boolean;
    showTotal: boolean;
    pageNumbers: number[];
    startItem: number;
    endItem: number;
    canGoPrevious: boolean;
    canGoNext: boolean;
    onPageChange: (page: number) => void;
    onPrevious: () => void;
    onNext: () => void;
    onFirst: () => void;
    onLast: () => void;
    onPageSizeChange: (size: number) => void;
}

const PagingControls = memo(function PagingControls(props: PagingControlsProps) {
    const {
        currentPage,
        totalPages,
        pageSize,
        totalItems,
        pageSizeOptions,
        showPageSize,
        showTotal,
        pageNumbers,
        startItem,
        endItem,
        canGoPrevious,
        canGoNext,
        onPageChange,
        onPrevious,
        onNext,
        onFirst,
        onLast,
        onPageSizeChange,
    } = props;

    return (
        <div className="ark-footer__paging">
            {/* Info section */}
            {showTotal && (
                <div className="ark-footer__paging-info">
                    <span className="ark-footer__paging-range">
                        {totalItems > 0 ? `${startItem}-${endItem}` : '0'}
                    </span>
                    <span className="ark-footer__paging-of">of</span>
                    <span className="ark-footer__paging-total">{totalItems}</span>
                </div>
            )}

            {/* Page size selector */}
            {showPageSize && (
                <div className="ark-footer__page-size">
                    <span className="ark-footer__page-size-label">Show:</span>
                    <select
                        className="ark-footer__page-size-select"
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        aria-label="Items per page"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Navigation */}
            <nav className="ark-footer__paging-nav" aria-label="Pagination">
                <button
                    className="ark-footer__paging-btn"
                    onClick={onFirst}
                    disabled={!canGoPrevious}
                    aria-label="First page"
                    title="First page"
                >
                    «
                </button>
                <button
                    className="ark-footer__paging-btn"
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    aria-label="Previous page"
                    title="Previous page"
                >
                    ‹
                </button>

                <div className="ark-footer__paging-pages">
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            className={`ark-footer__paging-page ${page === currentPage ? 'ark-footer__paging-page--active' : ''}`}
                            onClick={() => onPageChange(page)}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className="ark-footer__paging-btn"
                    onClick={onNext}
                    disabled={!canGoNext}
                    aria-label="Next page"
                    title="Next page"
                >
                    ›
                </button>
                <button
                    className="ark-footer__paging-btn"
                    onClick={onLast}
                    disabled={!canGoNext}
                    aria-label="Last page"
                    title="Last page"
                >
                    »
                </button>
            </nav>

            {/* Page indicator */}
            <div className="ark-footer__paging-indicator">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Footer = memo(forwardRef<HTMLElement, FooterProps>(
    function Footer(props, ref) {
        const { left, right, center, className = '', ...footerOptions } = props;
        const vm = useFooter(footerOptions);

        return (
            <footer
                ref={ref}
                className={`${vm.footerClasses} ${className}`}
                style={vm.backgroundStyles}
                data-testid={vm.model.testId}
            >
                <div className="ark-footer__content">
                    {/* Left slot */}
                    {left && <div className="ark-footer__left">{left}</div>}

                    {/* Center - either custom content or paging */}
                    <div className="ark-footer__center">
                        {center ? center : (
                            vm.model.showPaging && (
                                <PagingControls
                                    currentPage={vm.pagingConfig.currentPage}
                                    totalPages={vm.pagingConfig.totalPages}
                                    pageSize={vm.pagingConfig.pageSize}
                                    totalItems={vm.pagingConfig.totalItems}
                                    pageSizeOptions={vm.pagingConfig.pageSizeOptions}
                                    showPageSize={vm.pagingConfig.showPageSize}
                                    showTotal={vm.pagingConfig.showTotal}
                                    pageNumbers={vm.pageNumbers}
                                    startItem={vm.startItem}
                                    endItem={vm.endItem}
                                    canGoPrevious={vm.canGoPrevious}
                                    canGoNext={vm.canGoNext}
                                    onPageChange={vm.goToPage}
                                    onPrevious={vm.goToPrevious}
                                    onNext={vm.goToNext}
                                    onFirst={vm.goToFirst}
                                    onLast={vm.goToLast}
                                    onPageSizeChange={vm.changePageSize}
                                />
                            )
                        )}
                        {vm.model.text && !center && !vm.model.showPaging && (
                            <span className="ark-footer__text">{vm.model.text}</span>
                        )}
                    </div>

                    {/* Right slot */}
                    {right && <div className="ark-footer__right">{right}</div>}
                </div>
            </footer>
        );
    }
));

Footer.displayName = 'Footer';

export default Footer;
