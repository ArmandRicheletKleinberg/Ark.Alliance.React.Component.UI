/**
 * @fileoverview Component Resolver
 * @module infrastructure/ComponentResolver
 */

import { ComponentType } from 'react';
import {
    Button,
    Icon,
    Label,
    TabControl,
    StatusBadge,
    CircularGauge,
    BatteryGauge,
    DigitalGauge,
    SignalBarsGauge,
    SpeedometerGauge
} from 'ark-alliance-react-ui';
import { ProjectGridWrapper } from './wrappers/ProjectGridWrapper';
import { TimelineWrapper } from './wrappers/TimelineWrapper';
import { PanelWrapper } from './wrappers/PanelWrapper';
import {
    NeonInput,
    NumericInput,
    Slider,
    TextArea,
    FileUpload,
    TextEditor
} from 'ark-alliance-react-ui';
import { SelectWrapper } from './wrappers/SelectWrapper';
import { NeonButtonWrapper } from './wrappers/NeonButtonWrapper';
import { DataGridWrapper } from './wrappers/DataGridWrapper';
import { FinancialChartWrapper } from './wrappers/FinancialChartWrapper';
import { TrendPriceChartWrapper } from './wrappers/TrendPriceChartWrapper';
import { TestChartWrapper } from './wrappers/TestChartWrapper';

// Map of string keys to actual React components
const componentMap: Record<string, ComponentType<any>> = {
    'Button': Button,
    'NeonButton': NeonButtonWrapper,
    'DataGrid': DataGridWrapper,
    'Icon': Icon,
    'Label': Label,
    'TabControl': TabControl,
    'ProjectGrid': ProjectGridWrapper,
    'Timeline': TimelineWrapper,
    'Panel': PanelWrapper,
    'StatusBadge': StatusBadge,
    'CircularGauge': CircularGauge,
    'BatteryGauge': BatteryGauge,
    'DigitalGauge': DigitalGauge,
    'SignalBarsGauge': SignalBarsGauge,
    'SpeedometerGauge': SpeedometerGauge,
    'NeonInput': NeonInput,
    'NumericInput': NumericInput,
    'Select': SelectWrapper,
    'Slider': Slider,
    'TextArea': TextArea,
    'FileUpload': FileUpload,
    'TextEditor': TextEditor,
    'FinancialChart': FinancialChartWrapper,
    'TrendPriceChart': TrendPriceChartWrapper,
    'TestChart': TestChartWrapper
};

export const resolveComponent = (componentId: string): ComponentType<any> | null => {
    return componentMap[componentId] || null;
};
