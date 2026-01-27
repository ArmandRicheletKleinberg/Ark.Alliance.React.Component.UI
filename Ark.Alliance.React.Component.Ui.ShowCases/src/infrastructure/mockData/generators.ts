/**
 * @fileoverview Mock Data Generators
 * @module infrastructure/mockData/generators
 */

export interface GeneratorOptions {
    seed?: number;
    startPrice?: number;
    volatility?: number;
    trend?: 'up' | 'down' | 'flat';
}

export const mockDataGenerators = {
    // Financial data
    generateCandlestickData: (count: number, options: GeneratorOptions = {}) => {
        const data = [];
        let price = options.startPrice || 10000;
        const now = Date.now();
        const volatility = options.volatility || 100;

        for (let i = 0; i < count; i++) {
            const open = price;
            const change = (Math.random() - 0.5) * volatility;
            const close = open + change;
            const high = Math.max(open, close) + Math.random() * (volatility / 2);
            const low = Math.min(open, close) - Math.random() * (volatility / 2);

            data.push({
                time: now - ((count - i) * 60000), // 1 minute candles
                open,
                high,
                low,
                close,
                volume: Math.random() * 1000
            });

            price = close;
        }
        return data;
    },

    generateOrdersData: (count: number) => {
        const statuses = ['NEW', 'PARTIALLY_FILLED', 'FILLED', 'CANCELED'];
        const sides = ['BUY', 'SELL'];
        const types = ['LIMIT', 'MARKET', 'STOP'];

        return Array.from({ length: count }, (_, i) => ({
            id: `ORD-${1000 + i}`,
            symbol: 'BTC-PERP',
            side: sides[Math.floor(Math.random() * sides.length)],
            type: types[Math.floor(Math.random() * types.length)],
            price: 30000 + Math.random() * 5000,
            quantity: Math.random() * 2,
            filled: Math.random() * 2,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            timestamp: Date.now() - Math.floor(Math.random() * 1000000)
        }));
    },

    generatePositionsData: (count: number) => {
        return Array.from({ length: count }, (_, i) => {
            const entryPrice = 30000 + Math.random() * 5000;
            const size = Math.random() * 5;
            const pnl = (Math.random() - 0.5) * 1000;

            return {
                id: `POS-${1000 + i}`,
                symbol: 'ETH-PERP',
                side: Math.random() > 0.5 ? 'LONG' : 'SHORT',
                size,
                entryPrice,
                markPrice: entryPrice + (pnl / size),
                pnl,
                roe: (pnl / (entryPrice * size)) * 100
            };
        });
    },

    // Grid data
    generateProjectData: (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            name: `Project ${String.fromCharCode(65 + i)}`,
            status: ['Active', 'Completed', 'On Hold'][Math.floor(Math.random() * 3)],
            progress: Math.floor(Math.random() * 100),
            owner: `User ${i + 1}`,
            dueDate: new Date(Date.now() + Math.random() * 1000000000).toISOString().split('T')[0]
        }));
    }, // Corrected: added closing brace for the function and object

    generateTableRows: (count: number /*, schema: any */) => {
        // Generic row generator placeholder
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            col1: `Row ${i} Col 1`,
            col2: `Row ${i} Col 2`,
            date: new Date().toISOString()
        }));
    },

    // Timeline data
    generateTimelineEvents: (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            title: `Event ${i + 1}`,
            date: new Date(Date.now() - (count - i) * 86400000).toDateString(),
            description: `Description for significant event ${i + 1} happens here.`
        }));
    },

    // Tree/Org data
    generateOrgChartData: (depth: number, breadth: number) => {
        const createNode = (currentDepth: number, idPrefix: string): any => {
            if (currentDepth <= 0) return [];
            return Array.from({ length: breadth }, (_, i) => ({
                id: `${idPrefix}-${i}`,
                label: `Node ${idPrefix}-${i}`,
                children: createNode(currentDepth - 1, `${idPrefix}-${i}`)
            }));
        };
        return createNode(depth, 'root');
    },

    generateTreeNodes: (depth: number) => {
        // Similar to org chart but for file system etc
        return mockDataGenerators.generateOrgChartData(depth, 3);
    },

    // User/Profile data
    generateUsers: (count: number) => {
        const roles = ['Admin', 'Developer', 'Viewer', 'Manager'];
        return Array.from({ length: count }, (_, i) => ({
            id: `USR-${i}`,
            name: `User ${i}`,
            email: `user${i}@example.com`,
            role: roles[Math.floor(Math.random() * roles.length)],
            avatar: `https://i.pravatar.cc/150?u=${i}`,
            active: Math.random() > 0.2
        }));
    },

    // Tech/Department data
    generateTechStack: () => {
        return ['React', 'TypeScript', 'Node.js', 'Go', 'Docker', 'Kubernetes'];
    },

    generateDepartments: () => {
        return ['Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'HR'];
    }
};
