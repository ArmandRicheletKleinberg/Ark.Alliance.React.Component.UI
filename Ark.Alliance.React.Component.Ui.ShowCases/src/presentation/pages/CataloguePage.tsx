/**
 * @fileoverview Catalogue Page
 * @module presentation/pages/CataloguePage
 */

import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ConfigLoader } from '@/infrastructure/ConfigLoader';
import { CatalogueComponents } from '@/presentation/components/Catalogue/CatalogueComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPanelConfig } from '@/domain/entities';

export const CataloguePage: React.FC = () => {
    const { familyName } = useParams<{ familyName: string }>();

    const family = useMemo(() => {
        const catalogue = ConfigLoader.getCatalogue();
        return catalogue.categories.find(f => f.name === familyName);
    }, [familyName]);

    const panelConfigs = useMemo(() => {
        if (!family) return [];
        return family.componentIds
            .map(id => ConfigLoader.getPanelConfig(id))
            .filter((config): config is ComponentPanelConfig => config !== null);
    }, [family]);

    if (!family) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <h2 className="text-2xl font-bold text-ark-text-primary mb-2">Category Not Found</h2>
                <p className="text-ark-text-secondary">The category "{familyName}" does not exist.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl">
            <div className="p-8 pb-0">
                <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-lg bg-ark-primary/10 flex items-center justify-center text-ark-primary mr-4">
                        <FontAwesomeIcon icon={family.icon as any} size="lg" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-ark-text-primary">{family.name}</h1>
                        <p className="text-ark-text-secondary">{family.description}</p>
                    </div>
                </div>
                <div className="h-px bg-ark-border mt-8" />
            </div>

            <CatalogueComponents configs={panelConfigs} />
        </div>
    );
};
