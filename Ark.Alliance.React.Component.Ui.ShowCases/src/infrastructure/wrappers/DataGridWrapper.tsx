import React, { useMemo } from 'react';
import { DataGrid } from 'ark-alliance-react-ui';
import { GridModel } from 'ark-alliance-react-ui/dist/components/Grids/DataGrid/DataGrid.model';

interface DataGridWrapperProps {
    title: string;
    subtitle: string;
    pageSize: number;
    selectionEnabled: boolean;
    multiSelection: boolean;
    isDark: boolean;
    rowCount: number;
}

const generateDummyData = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `row-${i + 1}`,
        name: `Item ${i + 1}`,
        status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive',
        category: i % 2 === 0 ? 'Hardware' : 'Software',
        price: Math.floor(Math.random() * 1000) + 100,
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()
    }));
};

export const DataGridWrapper: React.FC<DataGridWrapperProps> = ({
    title = "Inventory Items",
    subtitle = "List of current stock items",
    pageSize = 10,
    selectionEnabled = true,
    multiSelection = true,
    isDark = true,
    rowCount = 20
}) => {
    const data = useMemo(() => generateDummyData(rowCount), [rowCount]);

    const gridModel: GridModel = useMemo(() => ({
        gridId: 'showcase-grid',
        primaryKey: 'id',
        header: {
            title: title,
            subtitle: subtitle,
            actions: [
                { key: 'add', label: 'Add Item', action: 'add' },
                { key: 'refresh', label: 'Refresh', action: 'refresh' }
            ]
        },
        selection: {
            enabled: selectionEnabled,
            multi: multiSelection
        },
        paging: {
            pageSize: pageSize,
            pageSizes: [5, 10, 20, 50]
        },
        fields: [
            { fieldKey: 'id', displayName: 'ID', dataType: 'string', width: 80, sortable: true },
            { fieldKey: 'name', displayName: 'Name', dataType: 'string', sortable: true, filterable: true },
            { fieldKey: 'status', displayName: 'Status', dataType: 'string', width: 120, sortable: true },
            { fieldKey: 'category', displayName: 'Category', dataType: 'string', width: 120, sortable: true, filterable: true },
            { fieldKey: 'price', displayName: 'Price', dataType: 'number', width: 100, sortable: true },
            { fieldKey: 'lastUpdated', displayName: 'Last Updated', dataType: 'date', width: 150, sortable: true }
        ]
    }), [title, subtitle, pageSize, selectionEnabled, multiSelection]);

    return (
        <div className="w-full h-full min-h-[500px]">
            <DataGrid
                model={gridModel}
                initialData={data}
                isDark={isDark}
            />
        </div>
    );
};
