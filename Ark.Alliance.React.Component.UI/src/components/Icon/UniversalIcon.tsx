/**
 * @fileoverview Universal Icon Component
 * @module components/Icon
 * 
 * A unified icon component that intelligently renders either:
 * 1. An internal SVG icon (from IconRegistry)
 * 2. A Font Awesome icon
 * 
 * This replaces the need to separately use Icon and FAIcon.
 */

import { forwardRef, memo } from 'react';
import { useUniversalIcon, type UseUniversalIconOptions } from './UniversalIcon.viewmodel';
import { Icon } from './Base/Icon/Icon';
import { FAIcon } from './FAIcon/FAIcon';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UniversalIconProps extends UseUniversalIconOptions {
    /** Additional CSS class */
    className?: string;
    /** Title for accessibility (if not using ariaLabel) */
    title?: string;
    /** SVG props pass-through */
    svgProps?: React.SVGProps<SVGSVGElement>;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * UniversalIcon - Unified Icon Component
 * 
 * Automatically detects whether to use the internal SVG registry or Font Awesome.
 * 
 * @example
 * ```tsx
 * // Renders SVG if 'user' is in registry, else FA user icon
 * <UniversalIcon name="user" />
 * 
 * // Force Font Awesome
 * <UniversalIcon name="github" source="font-awesome" iconStyle="brands" />
 * 
 * // Force Internal SVG
 * <UniversalIcon name="close" source="svg" />
 * ```
 */
export const UniversalIcon = memo(forwardRef<HTMLElement, UniversalIconProps>(
    function UniversalIcon(props, ref) {
        const { className, title, svgProps, ...options } = props;
        const vm = useUniversalIcon(options);

        // Common props shared by both components
        const commonProps = {
            ...vm.model,
            className,
            // Size needs to be cast as needed by sub-components
            size: vm.model.size as any,
        };

        if (vm.resolvedSource === 'svg') {
            return (
                <Icon
                    {...commonProps}
                    ref={ref as React.Ref<SVGSVGElement>}
                    svgProps={svgProps}
                />
            );
        }

        return (
            <FAIcon
                {...commonProps}
                ref={ref as React.Ref<SVGSVGElement>}
                title={title}
                // FA specific props
                iconStyle={vm.model.iconStyle}
                pulse={vm.model.pulse}
                beat={vm.model.beat}
                fade={vm.model.fade}
                bounce={vm.model.bounce}
                shake={vm.model.shake}
                fixedWidth={vm.model.fixedWidth}
                border={vm.model.border}
                pull={vm.model.pull}
            />
        );
    }
));

UniversalIcon.displayName = 'UniversalIcon';

export default UniversalIcon;
