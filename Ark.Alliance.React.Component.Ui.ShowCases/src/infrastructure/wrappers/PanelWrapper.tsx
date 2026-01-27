/**
 * @fileoverview Panel Wrapper
 * @module infrastructure/wrappers/PanelWrapper
 */

import React from 'react';
import { Panel, PanelProps } from 'ark-alliance-react-ui';

interface PanelWrapperProps extends Omit<PanelProps, 'children'> {
    content?: string;
}

export const PanelWrapper: React.FC<PanelWrapperProps> = ({
    content = "Panel content goes here.",
    ...props
}) => {
    return (
        <Panel {...props}>
            <div className="p-4 text-ark-text-primary">
                {content}
            </div>
        </Panel>
    );
};
