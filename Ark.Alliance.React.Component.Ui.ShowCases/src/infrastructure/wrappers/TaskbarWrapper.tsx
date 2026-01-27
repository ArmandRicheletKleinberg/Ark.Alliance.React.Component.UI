import React from 'react';
import { Taskbar, TaskbarModel } from 'ark-alliance-react-ui';

interface TaskbarWrapperProps extends Omit<TaskbarModel, 'apps'> {
    appSet: 'default' | 'trading' | 'productivity';
}

const getWindows = (set: string) => {
    // Map 'apps' concept to 'windows' for Taskbar
    switch (set) {
        case 'trading':
            return [
                { id: 'app1', title: 'Trading', icon: 'chart-line', isMinimized: false },
                { id: 'app2', title: 'Wallet', icon: 'wallet', isMinimized: true },
                { id: 'app3', title: 'News', icon: 'newspaper', isMinimized: true }
            ];
        default:
            return [
                { id: 'app1', title: 'Explorer', icon: 'folder', isMinimized: true },
                { id: 'app2', title: 'Browser', icon: 'globe', isMinimized: false },
                { id: 'app3', title: 'Settings', icon: 'gear', isMinimized: true }
            ];
    }
}

export const TaskbarWrapper: React.FC<TaskbarWrapperProps> = ({
    appSet = 'default',
    ...props
}) => {
    const windows = React.useMemo(() => getWindows(appSet), [appSet]);
    // Filter out windows from props to avoid overwrite warning
    const { windows: _, ...rest } = props as any;

    return <Taskbar windows={windows} {...rest} />;
};
