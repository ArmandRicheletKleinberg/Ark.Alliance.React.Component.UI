/**
 * @fileoverview Chart3D Barrel Export
 * @module components/Chart3D
 * 
 * 3D data visualization component with trading features.
 */

// Model exports (schemas and types)
export * from './Chart3D.model';

// ViewModel exports
export * from './Chart3D.viewmodel';

// Constants
export * from './Chart3D.constants';

// Main component
export { Chart3D, type Chart3DProps } from './Chart3D';

// Sub-components
export { ControlPanel } from './ControlPanel';
export {
    AxisSystem,
    ChartShapes,
    SurfaceRibbon,
    ThresholdLines,
    EventMarkers,
    type ThresholdLinesProps,
    type EventMarkersProps,
} from './Scene';

// Note: Scene3D is lazy-loaded internally and not exported from public API


