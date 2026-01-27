import React, { useState } from 'react';

interface ToggleWrapperProps {
    checked?: boolean;
    disabled?: boolean;
    onColor?: string;
    offColor?: string;
    size?: 'sm' | 'md' | 'lg';
    labelPosition?: 'left' | 'right';
}

export const ToggleWrapper: React.FC<ToggleWrapperProps> = ({
    checked: initialChecked = false,
    disabled = false,
    onColor = '#10b981',
    offColor = '#4b5563',
    size = 'md'
}) => {
    const [checked, setChecked] = useState(initialChecked);

    const sizeClasses = {
        sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
        md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
        lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' }
    };

    const { track, thumb, translate } = sizeClasses[size];

    return (
        <div className="flex items-center justify-center min-h-[300px] p-8">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && setChecked(!checked)}
                className={`${track} relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ark-primary focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                style={{ backgroundColor: checked ? onColor : offColor }}
            >
                <span
                    className={`${thumb} ${checked ? translate : 'translate-x-0.5'
                        } inline-block transform rounded-full bg-white transition-transform duration-200 shadow-lg`}
                />
            </button>
        </div>
    );
};
