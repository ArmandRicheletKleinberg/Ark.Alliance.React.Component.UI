/**
 * @fileoverview TabControl Component
 * @module components/TabControl
 * 
 * Tab control container using TabItem components.
 */

import { forwardRef, memo, useMemo, type ReactNode } from 'react';
import { TabItem } from './TabItem';
import { useTabControl, type UseTabControlOptions } from './TabControl.viewmodel';
import { type TabItemModel } from './TabControl.model';
import './TabControl.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabControl component props
 */
export interface TabControlProps extends UseTabControlOptions {
    /** Optional children (tab panels) */
    children?: ReactNode;
    /** Render function for tab panels */
    renderPanel?: (tabKey: string) => ReactNode;
    /** Additional class name for container */
    className?: string;
    /** Light theme variant */
    light?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabControl Component
 * 
 * @example
 * ```tsx
 * const tabs = [
 *   { tabKey: 'overview', label: 'Overview', icon: 'home' },
 *   { tabKey: 'settings', label: 'Settings', icon: 'cog' },
 * ];
 * 
 * <TabControl
 *   items={tabs}
 *   defaultActiveKey="overview"
 *   variant="pills"
 *   onTabChange={(tabKey) => console.log('Tab:', tabKey)}
 *   renderPanel={(tabKey) => <div>Content for {tabKey}</div>}
 * />
 * ```
 */
export const TabControl = memo(forwardRef<HTMLDivElement, TabControlProps>(
    function TabControl(props, ref) {
        const {
            children,
            renderPanel,
            className = '',
            light = false,
            ...options
        } = props;

        const vm = useTabControl(options);

        // Container classes
        const containerClassName = useMemo(() => {
            const classes = [vm.containerClasses, className];
            if (light) classes.push('ark-tab-control--light');
            return classes.filter(Boolean).join(' ');
        }, [vm.containerClasses, className, light]);

        return (
            <div
                ref={ref}
                className={containerClassName}
                data-testid={vm.model.testId}
            >
                {/* Tab List */}
                <div
                    className={vm.tablistClasses}
                    role="tablist"
                    aria-label={vm.model.ariaLabel}
                    aria-orientation={vm.model.orientation}
                    style={{ gap: vm.model.gap }}
                >
                    {vm.model.items.map((tab: TabItemModel, index: number) => (
                        <TabItem
                            key={tab.tabKey}
                            tabKey={tab.tabKey}
                            {...tab}
                            isActive={tab.tabKey === vm.activeKey}
                            index={index}
                            onClick={() => vm.setActiveTab(tab.tabKey)}
                            onClose={vm.model.closeable ? () => vm.closeTab(tab.tabKey) : undefined}
                            ariaProps={vm.getTabAriaProps(tab, index)}
                            ref={vm.getTabRef(tab.tabKey)?.current ? undefined : undefined}
                        />
                    ))}
                </div>

                {/* Tab Panels */}
                <div className="ark-tab-control__panels">
                    {renderPanel ? (
                        vm.model.items.map((tab: TabItemModel) => (
                            <div
                                key={tab.tabKey}
                                className="ark-tab-control__panel"
                                {...vm.getPanelAriaProps(tab.tabKey)}
                            >
                                {tab.tabKey === vm.activeKey && renderPanel(tab.tabKey)}
                            </div>
                        ))
                    ) : children}
                </div>
            </div>
        );
    }
));

TabControl.displayName = 'TabControl';

export default TabControl;
