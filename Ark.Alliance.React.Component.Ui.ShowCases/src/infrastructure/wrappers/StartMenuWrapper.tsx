import React from 'react';
import { StartMenu, StartMenuModel } from 'ark-alliance-react-ui';

interface StartMenuWrapperProps extends Omit<StartMenuModel, 'apps' | 'recent' | 'pinned'> {
    appSet: 'default' | 'trading' | 'dev' | 'productivity';
}

export const StartMenuWrapper: React.FC<StartMenuWrapperProps> = ({
    appSet = 'default',
    ...props
}) => {
    // Generate mock data based on appSet if validation needed
    // For now simple static sets
    const apps = [
        { id: '1', name: 'Calendar', icon: 'calendar', category: 'Productivity' },
        { id: '2', name: 'Mail', icon: 'envelope', category: 'Communication' },
        { id: '3', name: 'Photos', icon: 'image', category: 'Media' },
        { id: '4', name: 'Settings', icon: 'gear', category: 'System' },
    ];

    if (appSet === 'trading') {
        apps.push({ id: '5', name: 'Terminal', icon: 'terminal', category: 'Finance' });
        apps.push({ id: '6', name: 'Exchange', icon: 'bitcoin', category: 'Finance' });
    }

    const menuApps = apps.map(app => ({
        ...app,
        title: app.name,
        pinned: false
    }));

    // Add required props matching the interface (assuming StartMenuProps expects these)
    // Based on error: needs title, pinned in the items.

    // Filter props to avoid overwrite
    const { apps: _, pinned: __, recent: ___, ...rest } = props as any;

    return (
        <StartMenu
            apps={menuApps}
            pinned={menuApps.slice(0, 4).map(a => ({ ...a, pinned: true }))}
            recent={menuApps.slice(0, 2)}
            user={{ name: 'Demo User', avatar: 'https://i.pravatar.cc/150?u=1' }}
            isOpen={props.isOpen}
            onToggle={() => { }}
            {...rest}
        />
    );
};
