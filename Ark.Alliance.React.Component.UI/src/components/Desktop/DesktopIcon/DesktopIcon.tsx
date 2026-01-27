/**
 * @fileoverview DesktopIcon Component
 * @module components/Desktop/DesktopIcon
 * 
 * A desktop shortcut icon with double-click and right-click support.
 * Supports multiple icon types: FontAwesome, SVG registry, image, or emoji.
 */

import React, { memo, forwardRef } from 'react';
import { useDesktopIcon, type UseDesktopIconOptions } from './DesktopIcon.viewmodel';
import { FAIcon, Icon } from '../../Icon';
import './DesktopIcon.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DesktopIconProps extends UseDesktopIconOptions { }

// ═══════════════════════════════════════════════════════════════════════════
// ICON RENDERER
// ═══════════════════════════════════════════════════════════════════════════

interface IconRendererProps {
    iconType: 'emoji' | 'fa' | 'svg' | 'image';
    icon: string;
    faStyle?: 'solid' | 'regular' | 'brands';
    iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    iconRotation?: '0' | '90' | '180' | '270';
    iconFlip?: 'none' | 'horizontal' | 'vertical' | 'both';
    iconColor?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({
    iconType,
    icon,
    faStyle = 'solid',
    iconSize = 'lg',
    iconRotation = '0',
    iconFlip = 'none',
    iconColor,
}) => {
    switch (iconType) {
        case 'fa':
            return (
                <FAIcon
                    name={icon}
                    iconStyle={faStyle}
                    size={iconSize}
                    rotation={iconRotation}
                    flip={iconFlip}
                    color={iconColor}
                />
            );

        case 'svg':
            return (
                <Icon
                    name={icon}
                    size={iconSize}
                    rotation={iconRotation}
                    flip={iconFlip}
                    color={iconColor}
                />
            );

        case 'image':
            return (
                <img
                    src={icon}
                    alt=""
                    className="ark-desktop-icon__image"
                    draggable={false}
                />
            );

        case 'emoji':
        default:
            return <span className="ark-desktop-icon__emoji">{icon}</span>;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DesktopIcon - A clickable desktop shortcut icon
 * 
 * Supports multiple icon types:
 * - emoji: Unicode emoji characters
 * - fa: FontAwesome icons (solid, regular, brands)
 * - svg: SVG icons from the Icon registry
 * - image: Image URLs (png, jpg, svg files)
 * 
 * @example
 * ```tsx
 * // Emoji icon
 * <DesktopIcon
 *   label="Documents"
 *   icon="📁"
 *   iconType="emoji"
 *   appId="documents"
 *   onDoubleClick={(appId) => openApp(appId)}
 * />
 * 
 * // FontAwesome icon
 * <DesktopIcon
 *   label="GitHub"
 *   icon="github"
 *   iconType="fa"
 *   faStyle="brands"
 *   appId="github"
 * />
 * 
 * // Image icon
 * <DesktopIcon
 *   label="My App"
 *   icon="https://example.com/icon.png"
 *   iconType="image"
 *   appId="myapp"
 * />
 * ```
 */
export const DesktopIcon = memo(forwardRef<HTMLDivElement, DesktopIconProps>(
    (props, ref) => {
        const vm = useDesktopIcon(props);

        return (
            <div
                ref={ref || vm.iconRef}
                className={vm.containerClasses}
                onClick={vm.handleClick}
                onDoubleClick={vm.handleDoubleClick}
                onContextMenu={vm.handleContextMenu}
                data-testid={vm.model.testId}
                aria-label={vm.model.ariaLabel || vm.model.label}
                role="button"
                tabIndex={0}
            >
                <div className="ark-desktop-icon__icon-wrapper">
                    <IconRenderer
                        iconType={vm.model.iconType}
                        icon={vm.model.icon}
                        faStyle={vm.model.faStyle}
                        iconSize={vm.model.iconSize}
                        iconRotation={vm.model.iconRotation}
                        iconFlip={vm.model.iconFlip}
                        iconColor={vm.model.iconColor}
                    />
                </div>
                <span className="ark-desktop-icon__label">{vm.model.label}</span>
            </div>
        );
    }
));

DesktopIcon.displayName = 'DesktopIcon';

export default DesktopIcon;
