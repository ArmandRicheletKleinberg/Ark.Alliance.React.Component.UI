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
