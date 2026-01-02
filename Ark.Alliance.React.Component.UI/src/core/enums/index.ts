/**
 * @fileoverview Core Enums Barrel Export
 * @module core/enums
 * 
 * Centralized exports for all common enums used across the component library.
 * 
 * @example
 * ```typescript
 * // Import specific enums
 * import { ComponentSizeSchema, PositionSchema, ConnectionStatusSchema } from '@core/enums';
 * 
 * // Import all enums
 * import * as Enums from '@core/enums';
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════
// SIZE ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Schemas
    ComponentSizeSchema,
    BasicSizeSchema,
    ModalSizeSchema,
    ProgressSizeSchema,
    ExtendedSizeSchema,
    // Types
    type ComponentSize,
    type BasicSize,
    type ModalSize,
    type ProgressSize,
    type ExtendedSize,
    // Constants
    COMPONENT_SIZES,
    BASIC_SIZES,
    DEFAULT_SIZE,
} from './Size';

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Schemas
    ComponentVariantSchema,
    BasicVariantSchema,
    InputVariantSchema,
    PanelVariantSchema,
    ButtonVariantSchema,
    TabVariantSchema,
    // Types
    type ComponentVariant,
    type BasicVariant,
    type InputVariant,
    type PanelVariant,
    type ButtonVariant,
    type TabVariant,
    // Constants
    DEFAULT_VARIANT,
} from './Variant';

// ═══════════════════════════════════════════════════════════════════════════
// POSITION ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Schemas
    PositionSchema,
    ExtendedPositionSchema,
    HorizontalPositionSchema,
    VerticalPositionSchema,
    ToolbarPositionSchema,
    OrientationSchema,
    AlignmentSchema,
    // Types
    type Position,
    type ExtendedPosition,
    type HorizontalPosition,
    type VerticalPosition,
    type ToolbarPosition,
    type Orientation,
    type Alignment,
    // Constants
    POSITIONS,
    DEFAULT_TOOLTIP_POSITION,
    DEFAULT_SIDEBAR_POSITION,
    DEFAULT_ORIENTATION,
    DEFAULT_ALIGNMENT,
} from './Position';

// ═══════════════════════════════════════════════════════════════════════════
// STATUS ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Schemas
    ConnectionStatusSchema,
    ProcessStatusSchema,
    TestStatusSchema,
    SemanticStatusSchema,
    // Types
    type ConnectionStatus,
    type ProcessStatus,
    type TestStatus,
    type SemanticStatus,
    // Constants
    STATUS_COLORS,
    PROCESS_STATUS_COLORS,
} from './Status';

// ═══════════════════════════════════════════════════════════════════════════
// COLOR ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Schemas
    ThemeColorSchema,
    ExtendedColorSchema,
    // Types
    type ThemeColor,
    type ExtendedColor,
    // Constants
    THEME_COLOR_VALUES,
    THEME_COLOR_RGB,
    DEFAULT_THEME_COLOR,
} from './Color';

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Schemas
    FontWeightSchema,
    BasicFontWeightSchema,
    TextTransformSchema,
    TextAlignmentSchema,
    // Types
    type FontWeight,
    type BasicFontWeight,
    type TextTransform,
    type TextAlignment,
    // Constants
    FONT_WEIGHT_VALUES,
    DEFAULT_FONT_WEIGHT,
    DEFAULT_TEXT_ALIGNMENT,
} from './Typography';

// ═══════════════════════════════════════════════════════════════════════════
// STYLE ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Schemas
    LineStyleSchema,
    PaddingSchema,
    ResizeModeSchema,
    BackgroundTypeSchema,
    AnimationTypeSchema,
    LayoutModeSchema,
    // Types
    type LineStyle,
    type Padding,
    type ResizeMode,
    type BackgroundType,
    type AnimationType,
    type LayoutMode,
    // Constants
    PADDING_VALUES,
    DEFAULT_LINE_STYLE,
    DEFAULT_PADDING,
} from './Styles';

// ═══════════════════════════════════════════════════════════════════════════
// INPUT FORMAT ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export {
    // Schemas
    InputFormatSchema,
    InputValidationConfigSchema,
    // Types
    type InputFormat,
    type InputValidationConfig,
} from './InputFormat';
