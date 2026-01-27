import React from 'react';
// import { TreeView, TreeViewModel } from 'ark-alliance-react-ui'; 
import { mockDataGenerators } from '../mockData/generators';

interface TreeViewModel {
    nodes: any[];
}
interface TreeViewWrapperProps extends Omit<TreeViewModel, 'nodes'> {
    dataSet: 'fileSystem' | 'organization' | 'categories';
}

const TreeViewPlaceholder = ({ nodes }: { nodes: any[] }) => (
    <div className="p-4 border rounded border-ark-border bg-ark-bg-secondary font-mono text-sm text-ark-text-primary">
        <div>TreeView Placeholder</div>
        <ul className="pl-4 border-l border-ark-border/30 mt-2">
            {nodes.map((node: any) => (
                <li key={node.id} className="py-1">
                    <span className="text-ark-primary">{node.label}</span>
                    {node.children && <span className="text-ark-text-muted"> ({node.children.length} children)</span>}
                </li>
            ))}
        </ul>
    </div>
);

export const TreeViewWrapper: React.FC<TreeViewWrapperProps> = ({
    dataSet = 'fileSystem',
    ...props
}) => {
    const nodes = React.useMemo(() => {
        if (dataSet === 'fileSystem') {
            return mockDataGenerators.generateTreeNodes(3);
        } else if (dataSet === 'organization') {
            return mockDataGenerators.generateOrgChartData(3, 4);
        } else {
            return [
                {
                    id: 'c1', label: 'Electronics', children: [
                        { id: 'c1-1', label: 'Computers', children: [{ id: 'c1-1-1', label: 'Laptops' }, { id: 'c1-1-2', label: 'Desktops' }] },
                        { id: 'c1-2', label: 'Phones', children: [{ id: 'c1-2-1', label: 'Smartphones' }] }
                    ]
                },
                { id: 'c2', label: 'Clothing', children: [] }
            ];
        }
    }, [dataSet]);

    return <TreeViewPlaceholder nodes={nodes} {...props} />;
};
