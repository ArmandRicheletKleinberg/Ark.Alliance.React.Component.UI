/**
 * @fileoverview Component Resolver
 * @module infrastructure/ComponentResolver
 */

import { ComponentType, lazy } from 'react';
import {
    Button,
    Icon,
    Label,
    StatusBadge,
    CircularGauge,
    BatteryGauge,
    DigitalGauge,
    SignalBarsGauge,
    SpeedometerGauge,
    NeonInput,
    NumericInput,
    Slider,
    TextArea,
    FileUpload,
    TextEditor,
    // New Components
    // Toggle, // Not exported from library yet
    ProgressBar,
    TechBadge,
    Tooltip,
    Modal,  // For default export
    DesktopIcon, // For default export
    TradingGridCard, // For default export
    GenericPanel,
    WindowPanel, // For default export
    // ControlPanel, // Not exported from library yet
} from 'ark-alliance-react-ui';

// Lazy load complex wrappers to improve startup performance
const ProjectGridWrapper = lazy(() => import('./wrappers/ProjectGridWrapper').then(m => ({ default: m.ProjectGridWrapper })));
const TimelineWrapper = lazy(() => import('./wrappers/TimelineWrapper').then(m => ({ default: m.TimelineWrapper })));
const PanelWrapper = lazy(() => import('./wrappers/PanelWrapper').then(m => ({ default: m.PanelWrapper })));
const SelectWrapper = lazy(() => import('./wrappers/SelectWrapper').then(m => ({ default: m.SelectWrapper })));
const NeonButtonWrapper = lazy(() => import('./wrappers/NeonButtonWrapper').then(m => ({ default: m.NeonButtonWrapper })));
const DataGridWrapper = lazy(() => import('./wrappers/DataGridWrapper').then(m => ({ default: m.DataGridWrapper })));
const FinancialChartWrapper = lazy(() => import('./wrappers/FinancialChartWrapper').then(m => ({ default: m.FinancialChartWrapper })));
const TrendPriceChartWrapper = lazy(() => import('./wrappers/TrendPriceChartWrapper').then(m => ({ default: m.TrendPriceChartWrapper })));
const TestChartWrapper = lazy(() => import('./wrappers/TestChartWrapper').then(m => ({ default: m.TestChartWrapper })));

// New Wrappers - Lazy Loaded
const SideBarMenuWrapper = lazy(() => import('./wrappers/SideBarMenuWrapper').then(m => ({ default: m.SideBarMenuWrapper })));
const TabControlWrapper = lazy(() => import('./wrappers/TabControlWrapper').then(m => ({ default: m.TabControlWrapper })));
const CarouselWrapper = lazy(() => import('@/infrastructure/wrappers/CarouselWrapper').then(m => ({ default: m.CarouselWrapper })));
const ToastWrapper = lazy(() => import('./wrappers/ToastWrapper').then(m => ({ default: m.ToastWrapper })));
const TreeViewWrapper = lazy(() => import('./wrappers/TreeViewWrapper').then(m => ({ default: m.TreeViewWrapper })));
const ToggleWrapper = lazy(() => import('@/infrastructure/wrappers/ToggleWrapper').then(m => ({ default: m.ToggleWrapper })));

// Desktop Wrappers
const DesktopPageWrapper = lazy(() => import('./wrappers/DesktopPageWrapper').then(m => ({ default: m.DesktopPageWrapper })));
const TaskbarWrapper = lazy(() => import('./wrappers/TaskbarWrapper').then(m => ({ default: m.TaskbarWrapper })));
const StartMenuWrapper = lazy(() => import('./wrappers/StartMenuWrapper').then(m => ({ default: m.StartMenuWrapper })));

// Finance Wrappers
const OrdersGridWrapper = lazy(() => import('./wrappers/OrdersGridWrapper').then(m => ({ default: m.OrdersGridWrapper })));
const PositionsGridWrapper = lazy(() => import('./wrappers/PositionsGridWrapper').then(m => ({ default: m.PositionsGridWrapper })));
const TradeHistoryGridWrapper = lazy(() => import('./wrappers/TradeHistoryGridWrapper').then(m => ({ default: m.TradeHistoryGridWrapper })));


// Map of string keys to actual React components
const componentMap: Record<string, ComponentType<any>> = {
    // Buttons
    'Button': Button,
    'NeonButton': NeonButtonWrapper,

    // Inputs
    'NeonInput': NeonInput,
    'NumericInput': NumericInput,
    'Select': SelectWrapper,
    'Slider': Slider,
    'TextArea': TextArea,
    'FileUpload': FileUpload,
    'TextEditor': TextEditor,
    'Toggle': ToggleWrapper,

    // Data Display
    'DataGrid': DataGridWrapper,
    'ProjectGrid': ProjectGridWrapper,
    'Timeline': TimelineWrapper,
    'TreeView': TreeViewWrapper,
    'ProgressBar': ProgressBar,
    'StatusBadge': StatusBadge,
    'TechBadge': TechBadge,

    // Gauges
    'CircularGauge': CircularGauge,
    'BatteryGauge': BatteryGauge,
    'DigitalGauge': DigitalGauge,
    'SignalBarsGauge': SignalBarsGauge,
    'SpeedometerGauge': SpeedometerGauge,

    // Charts
    'FinancialChart': FinancialChartWrapper,
    'TrendPriceChart': TrendPriceChartWrapper,
    'TestChart': TestChartWrapper,

    // Navigation
    'TabControl': TabControlWrapper,
    'SideBarMenu': SideBarMenuWrapper,
    'Carousel': CarouselWrapper,

    // Overlays
    'Modal': Modal,
    'Toast': ToastWrapper,
    'Tooltip': Tooltip,

    // Panels & Containers
    'Panel': PanelWrapper,
    'GenericPanel': GenericPanel,
    // 'ControlPanel': ControlPanel, // Not exported from library yetrs

    // Desktop OS
    'DesktopPage': DesktopPageWrapper,
    'WindowPanel': WindowPanel,
    'DesktopIcon': DesktopIcon,
    'Taskbar': TaskbarWrapper,
    'StartMenu': StartMenuWrapper,

    // Finance
    'OrdersGrid': OrdersGridWrapper,
    'PositionsGrid': PositionsGridWrapper,
    'TradeHistoryGrid': TradeHistoryGridWrapper,
    'TradingGridCard': TradingGridCard,

    // Misc
    'Icon': Icon,
    'Label': Label
};

export const resolveComponent = (componentId: string): ComponentType<any> | null => {
    return componentMap[componentId] || null;
};
