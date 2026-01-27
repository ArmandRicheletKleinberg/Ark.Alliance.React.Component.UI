/**
 * @fileoverview Button Component Barrel Export
 * @module components/Buttons/Button
 */

// Component
export { Button, type ButtonProps } from './Button';
export { default } from './Button';

// ViewModel
export { useButton, type UseButtonOptions, type UseButtonResult } from './Button.viewmodel';

// Model
export {
    ButtonModelSchema,
    defaultButtonModel,
    createButtonModel,
    type ButtonModel,
    type ButtonVariantType,
    type ButtonSizeType,
} from './Button.model';

// Re-export enums from core (for convenience)
export { ButtonVariantSchema as ButtonVariant, ComponentSizeSchema as ButtonSize } from '../../../core/enums';
