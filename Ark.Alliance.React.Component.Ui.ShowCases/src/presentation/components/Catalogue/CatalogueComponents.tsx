/**
 * @fileoverview Catalogue Components Engine
 * @module presentation/components/Catalogue/CatalogueComponents
 */

import React from 'react';
import { ComponentPanelConfig } from '@/domain/entities';
import { resolveComponent } from '@/infrastructure/ComponentResolver';
import { ComponentPanel } from './ComponentPanel';

interface CatalogueComponentsProps {
    configs: ComponentPanelConfig[];
}

export const CatalogueComponents: React.FC<CatalogueComponentsProps> = ({ configs }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-8 items-start">
            {configs.map(config => {
                const Component = resolveComponent(config.componentId);
                // Determine column span based on minWidth
                const isFullWidth = !!config.layout?.minWidth;
                const colSpanClass = isFullWidth ? 'col-span-1 xl:col-span-2' : 'col-span-1';

                return (
                    <div key={config.id} className={`w-full ${colSpanClass}`}>
                        <ComponentPanel
                            config={config}
                            ComponentToRender={Component || (() => <div>Component {config.componentId} Not Found</div>)}
                        />
                    </div>
                );
            })}
        </div>
    );
};
