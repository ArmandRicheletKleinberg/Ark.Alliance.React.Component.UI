import React from 'react';
import { SideBarMenu, SideBarMenuModel, MenuCategory } from 'ark-alliance-react-ui';

interface SideBarMenuWrapperProps extends Omit<SideBarMenuModel, 'categories'> {
    categorySet: 'default' | 'trading' | 'admin';
}

const categoryData: Record<string, MenuCategory[]> = {
    default: [
        {
            name: 'Dashboard', icon: 'house', items: [
                { key: 'home', label: 'Home', icon: 'house' },
                { key: 'analytics', label: 'Analytics', icon: 'chart-line', badge: 3 }
            ]
        },
        {
            name: 'Components', icon: 'puzzle-piece', items: [
                { key: 'buttons', label: 'Buttons', icon: 'play' },
                { key: 'inputs', label: 'Inputs', icon: 'keyboard' },
                { key: 'charts', label: 'Charts', icon: 'chart-bar' }
            ]
        }
    ],
    trading: [
        {
            name: 'Markets', icon: 'chart-line', items: [
                { key: 'spot', label: 'Spot', icon: 'bitcoin' },
                { key: 'futures', label: 'Futures', icon: 'chart-simple' }
            ]
        },
        {
            name: 'Wallet', icon: 'wallet', items: [
                { key: 'deposit', label: 'Deposit', icon: 'arrow-down' },
                { key: 'withdraw', label: 'Withdraw', icon: 'arrow-up' }
            ]
        }
    ],
    admin: [
        {
            name: 'System', icon: 'gear', items: [
                { key: 'users', label: 'Users', icon: 'users' },
                { key: 'logs', label: 'Logs', icon: 'file-lines' }
            ]
        }
    ]
};

export const SideBarMenuWrapper: React.FC<SideBarMenuWrapperProps> = ({
    categorySet = 'default',
    ...props
}) => {
    return <SideBarMenu categories={categoryData[categorySet]} {...props} />;
};
