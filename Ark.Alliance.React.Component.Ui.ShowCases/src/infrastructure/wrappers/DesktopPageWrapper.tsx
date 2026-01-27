import React from 'react';
import { DesktopPage, DesktopPageModel } from 'ark-alliance-react-ui';

interface DesktopPageWrapperProps extends Omit<DesktopPageModel, 'icons' | 'windows'> {
    iconSet: 'default' | 'trading' | 'dev' | 'productivity';
}

const getIcons = (set: string) => {
    const common = [
        { id: 'recycling-bin', label: 'Recycling Bin', icon: 'trash', appId: 'recycling-bin', x: 0, y: 0 },
        { id: 'this-pc', label: 'This PC', icon: 'server', appId: 'this-pc', x: 0, y: 1 },
    ];

    switch (set) {
        case 'trading':
            return [
                ...common,
                { id: 'terminal', label: 'Trading Terminal', icon: 'chart-line', appId: 'terminal', x: 1, y: 0 },
                { id: 'wallet', label: 'Wallet', icon: 'wallet', appId: 'wallet', x: 1, y: 1 },
            ];
        case 'dev':
            return [
                ...common,
                { id: 'code', label: 'VS Code', icon: 'code', appId: 'code', x: 1, y: 0 },
                { id: 'git', label: 'GitHub', icon: 'github', appId: 'git', x: 1, y: 1 },
                { id: 'terminal', label: 'Terminal', icon: 'terminal', appId: 'terminal', x: 1, y: 2 },
            ];
        default:
            return [
                ...common,
                { id: 'browser', label: 'Browser', icon: 'globe', appId: 'browser', x: 1, y: 0 },
                { id: 'notes', label: 'Notes', icon: 'clipboard', appId: 'notes', x: 1, y: 1 },
            ];
    }
};

export const DesktopPageWrapper: React.FC<DesktopPageWrapperProps> = ({
    iconSet = 'default',
    ...props
}) => {
    // In a real app, windows would be managed state.
    // For showcase, we simulate a few open windows or let the internal component handle empty state.

    const icons = React.useMemo(() => getIcons(iconSet), [iconSet]);

    return <DesktopPage icons={icons} windows={[]} {...props} />;
};
