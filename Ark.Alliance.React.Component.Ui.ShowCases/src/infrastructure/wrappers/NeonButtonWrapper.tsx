/**
 * @fileoverview Neon Button Wrapper
 * @module infrastructure/wrappers/NeonButtonWrapper
 */

import React from 'react';
import { Button, ButtonProps } from 'ark-alliance-react-ui';

export const NeonButtonWrapper: React.FC<ButtonProps> = (props) => {
    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Button
                {...props}
                className="relative bg-black text-white hover:text-white"
                style={{
                    boxShadow: '0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            />
        </div>
    );
};
