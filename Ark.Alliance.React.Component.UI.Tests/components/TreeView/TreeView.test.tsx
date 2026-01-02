/**
 * @fileoverview TreeView Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TreeView } from '../../../Ark.Alliance.React.Component.UI/src/components/TreeView';
import { TreeNodeItem } from '../../../Ark.Alliance.React.Component.UI/src/components/TreeView/TreeNode/TreeNode.model';

const mockItems: TreeNodeItem[] = [
    {
        key: 'node1',
        label: 'Node 1',
        children: [
            { key: 'node1-1', label: 'Child 1-1' },
            { key: 'node1-2', label: 'Child 1-2' }
        ]
    },
    {
        key: 'node2',
        label: 'Node 2'
    },
    {
        key: 'node3',
        label: 'Node 3',
        disabled: true
    }
];

describe('TreeView', () => {
    it('should render root nodes', () => {
        render(<TreeView items={mockItems} />);
        expect(screen.getByText('Node 1')).toBeInTheDocument();
        expect(screen.getByText('Node 2')).toBeInTheDocument();
        expect(screen.getByText('Node 3')).toBeInTheDocument();
    });

    it('should expand node when clicked (toggle)', () => {
        render(<TreeView items={mockItems} />);
        // Child should not be visible initially
        expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument();

        // Click to expand (double click on content OR click on switcher)
        // Our implementation has click on switcher for expansion
        const node1 = screen.getByText('Node 1').closest('.ark-tree-node');
        const switcher = node1!.querySelector('.ark-tree-node__switcher');
        fireEvent.click(switcher!);

        expect(screen.getByText('Child 1-1')).toBeInTheDocument();
        expect(screen.getByText('Child 1-2')).toBeInTheDocument();
    });

    it('should select node when clicked', () => {
        const onSelectionChange = vi.fn();
        render(<TreeView items={mockItems} onSelectionChange={onSelectionChange} />);

        fireEvent.click(screen.getByText('Node 2'));

        expect(onSelectionChange).toHaveBeenCalledWith(['node2']);

        const node2 = screen.getByText('Node 2').closest('.ark-tree-node');
        expect(node2).toHaveClass('ark-tree-node--selected');
    });

    it('should handle multiple selection', () => {
        const onSelectionChange = vi.fn();
        render(<TreeView items={mockItems} selectionMode="multiple" onSelectionChange={onSelectionChange} />);

        fireEvent.click(screen.getByText('Node 1'));
        expect(onSelectionChange).toHaveBeenCalledWith(['node1']);

        fireEvent.click(screen.getByText('Node 2'));
        expect(onSelectionChange).toHaveBeenCalledWith(['node1', 'node2']);
    });

    it('should not select disabled node', () => {
        const onSelectionChange = vi.fn();
        render(<TreeView items={mockItems} onSelectionChange={onSelectionChange} />);

        fireEvent.click(screen.getByText('Node 3'));

        expect(onSelectionChange).not.toHaveBeenCalled();
        const node3 = screen.getByText('Node 3').closest('.ark-tree-node');
        expect(node3).not.toHaveClass('ark-tree-node--selected');
    });

    it('should respect expandedKeys prop (controlled expansion)', () => {
        render(<TreeView items={mockItems} expandedKeys={['node1']} />);
        expect(screen.getByText('Child 1-1')).toBeInTheDocument();
    });

    it('should respect selectedKeys prop (controlled selection)', () => {
        render(<TreeView items={mockItems} selectedKeys={['node2']} />);
        const node2 = screen.getByText('Node 2').closest('.ark-tree-node');
        expect(node2).toHaveClass('ark-tree-node--selected');
    });
});
