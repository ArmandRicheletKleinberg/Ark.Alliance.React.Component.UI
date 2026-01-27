import React from 'react';
// import { PositionsGrid, PositionsGridModel, InstrumentType } from 'ark-alliance-react-ui';
import { mockDataGenerators } from '../mockData/generators';

type InstrumentType = 'CRYPTO_PERP' | 'CRYPTO_SPOT' | 'CRYPTO_FUTURES' | 'OPTIONS' | 'STOCK';
interface PositionsGridModel {
    positions: any[];
}

interface PositionsGridWrapperProps extends Omit<PositionsGridModel, 'positions'> {
    positionCount: number;
    instrumentType: InstrumentType;
}

const PositionsGridPlaceholder = ({ positions }: { positions: any[] }) => (
    <div className="w-full overflow-auto rounded-lg border border-ark-border">
        <table className="w-full text-left text-sm text-ark-text-secondary">
            <thead className="bg-ark-bg-secondary text-xs uppercase text-ark-text-muted">
                <tr>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Side</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">PnL</th>
                </tr>
            </thead>
            <tbody>
                {positions.map((p: any) => (
                    <tr key={p.id} className="border-b border-ark-border/50 hover:bg-ark-bg-tertiary/20">
                        <td className="px-4 py-3 font-bold text-ark-primary">{p.symbol}</td>
                        <td className={`px-4 py-3 ${p.side === 'LONG' ? 'text-ark-success' : 'text-ark-error'}`}>{p.side}</td>
                        <td className="px-4 py-3">{p.size.toFixed(4)}</td>
                        <td className={`px-4 py-3 ${p.pnl >= 0 ? 'text-ark-success' : 'text-ark-error'}`}>{p.pnl.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="p-2 text-center text-xs text-ark-warning">PositionsGrid component missing from library - Mock View</div>
    </div>
);

export const PositionsGridWrapper: React.FC<PositionsGridWrapperProps> = ({
    positionCount = 8,
    instrumentType = 'CRYPTO_PERP',
    ...props
}) => {
    const positions = React.useMemo(
        () => mockDataGenerators.generatePositionsData(positionCount),
        [positionCount, instrumentType]
    );

    return <PositionsGridPlaceholder positions={positions} {...props} />;
};
