import React, { useState } from 'react';
import { TabControl, TabControlModel } from 'ark-alliance-react-ui';

interface TabControlWrapperProps extends Omit<TabControlModel, 'tabs'> {
    tabSet: 'dashboard' | 'settings' | 'profile';
}

const tabData: Record<string, any[]> = {
    dashboard: [
        { tabKey: 'overview', label: 'Overview', icon: 'chart-pie', children: <div className="p-4 text-ark-text-primary">Dashboard Overview Content</div> },
        { tabKey: 'analytics', label: 'Analytics', icon: 'chart-line', children: <div className="p-4 text-ark-text-primary">Analytics Data Visualization</div> },
        { tabKey: 'reports', label: 'Reports', icon: 'file-lines', children: <div className="p-4 text-ark-text-primary">Downloadable Reports</div> }
    ],
    settings: [
        { tabKey: 'general', label: 'General', icon: 'gear', children: <div className="p-4 text-ark-text-primary">General Settings</div> },
        { tabKey: 'security', label: 'Security', icon: 'lock', children: <div className="p-4 text-ark-text-primary">Security Configuration</div> },
        { tabKey: 'notifications', label: 'Notifications', icon: 'bell', children: <div className="p-4 text-ark-text-primary">Notification Preferences</div> }
    ],
    profile: [
        { tabKey: 'info', label: 'User Info', icon: 'user', children: <div className="p-4 text-ark-text-primary">User Information Panel</div> },
        { tabKey: 'activity', label: 'Activity', icon: 'clock-rotate-left', children: <div className="p-4 text-ark-text-primary">Recent Activity Log</div> }
    ]
};

export const TabControlWrapper: React.FC<TabControlWrapperProps> = ({
    tabSet = 'dashboard',
    ...props
}) => {
    const [activeTab] = useState(tabData[tabSet][0].tabKey);
    // Filter items from props to avoid overwrite
    const { items: _, ...rest } = props as any;

    return (
        <TabControl
            items={tabData[tabSet]}
            activeKey={activeTab}
            {...rest}
        />
    );
};
