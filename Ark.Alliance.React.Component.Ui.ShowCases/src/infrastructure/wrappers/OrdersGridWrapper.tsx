import React from 'react';
// import { OrdersGrid, OrdersGridModel, InstrumentType } from 'ark-alliance-react-ui'; // Missing export
import { mockDataGenerators } from '../mockData/generators';

// Stubs
type InstrumentType = 'CRYPTO_PERP' | 'CRYPTO_SPOT' | 'CRYPTO_FUTURES' | 'OPTIONS' | 'STOCK';
interface OrdersGridModel {
    orders: any[];
}

interface OrdersGridWrapperProps extends Omit<OrdersGridModel, 'orders'> {
    orderCount: number;
    instrumentType: InstrumentType;
}

const OrdersGridPlaceholder = ({ orders }: { orders: any[] }) => (
    <div className="w-full overflow-auto rounded-lg border border-ark-border">
        <table className="w-full text-left text-sm text-ark-text-secondary">
            <thead className="bg-ark-bg-secondary text-xs uppercase text-ark-text-muted">
                <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Side</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((o: any) => (
                    <tr key={o.id} className="border-b border-ark-border/50 hover:bg-ark-bg-tertiary/20">
                        <td className="px-4 py-3 font-mono">{o.id}</td>
                        <td className="px-4 py-3 font-bold text-ark-primary">{o.symbol}</td>
                        <td className={`px-4 py-3 ${o.side === 'BUY' ? 'text-ark-success' : 'text-ark-error'}`}>{o.side}</td>
                        <td className="px-4 py-3">{o.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full bg-ark-bg-tertiary text-xs">{o.status}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="p-2 text-center text-xs text-ark-warning">OrdersGrid component missing from library - Mock View</div>
    </div>
);

export const OrdersGridWrapper: React.FC<OrdersGridWrapperProps> = ({
    orderCount = 15,
    instrumentType = 'CRYPTO_PERP',
    ...props
}) => {
    const orders = React.useMemo(
        () => mockDataGenerators.generateOrdersData(orderCount),
        [orderCount, instrumentType]
    );

    return <OrdersGridPlaceholder orders={orders} {...props} />;
};
