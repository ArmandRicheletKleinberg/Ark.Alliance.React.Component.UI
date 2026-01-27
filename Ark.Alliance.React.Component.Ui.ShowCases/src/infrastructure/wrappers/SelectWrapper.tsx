/**
 * @fileoverview Select Component Wrapper
 * @module infrastructure/wrappers/SelectWrapper
 * 
 * Provides pre-configured option sets for the Select component showcase.
 * Supports crypto, fiat, actions, and timeframes datasets.
 */

import React from 'react';
import { Select, SelectModel, SelectOption } from 'ark-alliance-react-ui';

interface SelectWrapperProps extends Omit<SelectModel, 'options'> {
    optionSet: 'crypto' | 'fiat' | 'actions' | 'timeframes';
}

export const SelectWrapper: React.FC<SelectWrapperProps> = ({
    optionSet = 'crypto',
    ...props
}) => {

    const getOptions = (set: string): SelectOption[] => {
        switch (set) {
            case 'crypto':
                return [
                    { value: 'BTC', label: 'Bitcoin', icon: 'currency-bitcoin' },
                    { value: 'ETH', label: 'Ethereum', icon: 'ethereum' },
                    { value: 'SOL', label: 'Solana', icon: 'sun' },
                    { value: 'ADA', label: 'Cardano', icon: 'copyright' },
                    { value: 'DOT', label: 'Polkadot', icon: 'circle-dot' }
                ];
            case 'fiat':
                return [
                    { value: 'USD', label: 'US Dollar', icon: 'dollar-sign' },
                    { value: 'EUR', label: 'Euro', icon: 'euro' },
                    { value: 'GBP', label: 'British Pound', icon: 'pound-sterling' },
                    { value: 'JPY', label: 'Japanese Yen', icon: 'yen' }
                ];
            case 'actions':
                return [
                    { value: 'buy', label: 'Buy Market', icon: 'trending-up' },
                    { value: 'sell', label: 'Sell Market', icon: 'trending-down' },
                    { value: 'limit_buy', label: 'Limit Buy', icon: 'arrow-down-circle' },
                    { value: 'limit_sell', label: 'Limit Sell', icon: 'arrow-up-circle' }
                ];
            case 'timeframes':
                return [
                    { value: '1m', label: '1 Minute' },
                    { value: '5m', label: '5 Minutes' },
                    { value: '15m', label: '15 Minutes' },
                    { value: '1h', label: '1 Hour' },
                    { value: '4h', label: '4 Hours' },
                    { value: '1d', label: '1 Day' }
                ];
            default:
                return [];
        }
    };

    const options = getOptions(optionSet);

    return (
        <div style={{ width: '100%', maxWidth: '300px' }}>
            <Select
                options={options}
                {...props}
            />
        </div>
    );
};
