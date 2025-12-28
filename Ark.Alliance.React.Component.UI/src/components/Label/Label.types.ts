export type LabelVariant = 'default' | 'subtle' | 'error' | 'success' | 'warning';
export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps {
    text: string;
    htmlFor?: string;
    variant?: LabelVariant;
    size?: LabelSize;
    required?: boolean;
    className?: string;
}
