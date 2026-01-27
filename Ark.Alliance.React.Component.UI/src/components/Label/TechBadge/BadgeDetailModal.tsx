/**
 * @fileoverview Badge Detail Modal Component
 * @module components/Label/TechBadge
 * 
 * Generic modal for displaying badge details.
 * Works for technology badges, skill badges, or any badge type.
 */

import { forwardRef, memo } from 'react';
import { useBadgeDetailModal, type UseBadgeDetailModalOptions } from './BadgeDetailModal.viewmodel';
import './BadgeDetailModal.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BadgeDetailModalProps extends UseBadgeDetailModalOptions {
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BadgeDetailModal - Generic modal for displaying badge details
 * 
 * Features:
 * - Display name, description, category
 * - Custom brand color styling
 * - Related links section
 * - Metadata display
 * - Escape key close
 * - Overlay click close
 * 
 * @example
 * ```tsx
 * <BadgeDetailModal
 *     isOpen={isOpen}
 *     data={{
 *         name: 'React',
 *         category: 'Frontend',
 *         description: 'A JavaScript library for building user interfaces',
 *         icon: 'fab fa-react',
 *         color: '#61dafb',
 *         links: [{ label: 'Website', url: 'https://react.dev' }]
 *     }}
 *     onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export const BadgeDetailModal = memo(forwardRef<HTMLDivElement, BadgeDetailModalProps>(
    function BadgeDetailModal(props, ref) {
        const { className = '', ...modalOptions } = props;

        const vm = useBadgeDetailModal(modalOptions);

        // Don't render if not open or no data
        if (!vm.model.isOpen || !vm.hasData) {
            return null;
        }

        const data = vm.model.data!;

        return (
            <div
                ref={ref}
                className={`${vm.overlayClasses} ${className}`}
                onClick={vm.handleOverlayClick}
                data-testid={vm.model.testId}
            >
                <div
                    className={vm.contentClasses}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="badge-modal-title"
                >
                    {/* Close Button */}
                    <button
                        className="ark-badge-modal__close"
                        onClick={vm.handleClose}
                        aria-label="Close modal"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="ark-badge-modal__header">
                        <div
                            className="ark-badge-modal__icon-container"
                            style={{
                                backgroundColor: `${vm.brandColor}20`,
                                borderColor: `${vm.brandColor}50`,
                            }}
                        >
                            {data.icon ? (
                                <i
                                    className={data.icon}
                                    style={{ color: vm.brandColor, fontSize: '24px' }}
                                    aria-hidden="true"
                                />
                            ) : (
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={vm.brandColor}
                                    strokeWidth="2"
                                >
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h2 id="badge-modal-title" className="ark-badge-modal__title">
                                {data.name}
                            </h2>
                            {data.category && (
                                <span className="ark-badge-modal__category">{data.category}</span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {data.description && (
                        <div className="ark-badge-modal__section">
                            <p>{data.description}</p>
                        </div>
                    )}

                    {/* Version */}
                    {data.version && (
                        <div className="ark-badge-modal__badge-row">
                            <span
                                className="ark-badge-modal__version"
                                style={{ color: vm.brandColor }}
                            >
                                v{data.version}
                            </span>
                        </div>
                    )}

                    {/* Metadata */}
                    {data.metadata && Object.keys(data.metadata).length > 0 && (
                        <div className="ark-badge-modal__metadata">
                            {Object.entries(data.metadata).map(([key, value]) => (
                                <div key={key} className="ark-badge-modal__metadata-item">
                                    <span className="ark-badge-modal__metadata-key">{key}:</span>
                                    <span className="ark-badge-modal__metadata-value">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Links */}
                    {data.links && data.links.length > 0 && (
                        <div className="ark-badge-modal__links">
                            {data.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ark-badge-modal__link"
                                    style={{
                                        backgroundColor: `${vm.brandColor}15`,
                                        borderColor: `${vm.brandColor}40`,
                                    }}
                                >
                                    {link.icon && (
                                        <i
                                            className={link.icon}
                                            style={{ color: vm.brandColor }}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span>{link.label}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
));

BadgeDetailModal.displayName = 'BadgeDetailModal';

export default BadgeDetailModal;
