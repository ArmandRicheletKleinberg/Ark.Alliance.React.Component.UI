/**
 * @fileoverview Base Module Barrel Export
 * @module core/base
 */

export {
    BaseComponentModel,
    BaseModelSchema,
    createModelFactory,
    extendSchema,
    type BaseModel,
    type ValidationResult,
} from './BaseComponentModel';

export {
    useBaseViewModel,
    type BaseViewModelState,
    type UseBaseViewModelOptions,
    type BaseViewModelResult,
    type LifecyclePhase,
} from './BaseViewModel';

// Form input extensions
export {
    FormInputModelSchema,
    InputRestrictionSchema,
    InputRestrictionPresets,
    defaultInputRestriction,
    defaultFormInputModel,
    createFormInputModel,
    extendFormInputSchema,
    type FormInputModel,
    type InputRestriction,
} from './FormInputModel';

export {
    useFormInputRestrictions,
    type UseFormInputRestrictionsResult,
} from './useFormInputRestrictions';
