import React from 'react';
// import { TradeHistoryGrid, TradeHistoryGridModel, InstrumentType } from 'ark-alliance-react-ui';
import { mockDataGenerators } from '../mockData/generators';

type InstrumentType = 'CRYPTO_PERP' | 'CRYPTO_SPOT' | 'CRYPTO_FUTURES' | 'OPTIONS' | 'STOCK';
interface TradeHistoryGridModel {
    trades: any[];
}

interface TradeHistoryGridWrapperProps extends Omit<TradeHistoryGridModel, 'trades'> {
    tradeCount: number;
    instrumentType: InstrumentType;
}

const TradeHistoryGridPlaceholder = ({ trades }: { trades: any[] }) => (
    <div className="w-full overflow-auto rounded-lg border border-ark-border">
        <table className="w-full text-left text-sm text-ark-text-secondary">
            <thead className="bg-ark-bg-secondary text-xs uppercase text-ark-text-muted">
                <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Side</th>
                    <th className="px-4 py-3">Realized PnL</th>
                </tr>
            </thead>
            <tbody>
                {trades.map((t: any) => (
                    <tr key={t.id} className="border-b border-ark-border/50 hover:bg-ark-bg-tertiary/20">
                        <td className="px-4 py-3 font-mono">{t.id}</td>
                        <td className="px-4 py-3">{t.symbol}</td>
                        <td className={`px-4 py-3 ${t.side === 'BUY' ? 'text-ark-success' : 'text-ark-error'}`}>{t.side}</td>
                        <td className={`px-4 py-3 ${t.realizedPnl >= 0 ? 'text-ark-success' : 'text-ark-error'}`}>{t.realizedPnl.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="p-2 text-center text-xs text-ark-warning">TradeHistoryGrid component missing from library - Mock View</div>
    </div>
);

export const TradeHistoryGridWrapper: React.FC<TradeHistoryGridWrapperProps> = ({
    tradeCount = 30,
    instrumentType = 'CRYPTO_PERP',
    ...props
}) => {
    const trades = React.useMemo(
        () => {
            const orders = mockDataGenerators.generateOrdersData(tradeCount);
            return orders.map(o => ({
                ...o,
                id: o.id.replace('ORD', 'TRD'),
                realizedPnl: (Math.random() - 0.5) * 100,
                fee: Math.random() * 5
            }));
        },
        [tradeCount, instrumentType]
    );

    return <TradeHistoryGridPlaceholder trades={trades} {...props} />;
};
