/**
 * @fileoverview OrgChartTree Primitive ViewModel
 * @module components/TreeView/OrgChart/primitives
 * 
 * Business logic for the organizational chart tree layout engine.
 * Handles tree traversal, connector configuration, and node rendering logic.
 */

import { useMemo } from 'react';
import type { OrgChartNodeData } from '../OrgChart.model';
import {
    type OrgChartTreeModel,
    type OrgChartTreeProps,
    createOrgChartTreeModel,
} from './OrgChartTree.model';
import {
    type OrgChartConnectorModel,
    createOrgChartConnectorModel,
} from './OrgChartConnector.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseOrgChartTreeResult {
    /** Tree configuration model */
    model: OrgChartTreeModel;
    /** Whether this node has children */
    hasChildren: boolean;
    /** Child node array */
    children: OrgChartNodeData[];
    /** Vertical connector configuration */
    verticalConnector: OrgChartConnectorModel;
    /** Horizontal bridge connector configuration */
    horizontalBridgeConnector: OrgChartConnectorModel;
    /** Child branch connector configuration */
    childBranchConnector: OrgChartConnectorModel;
    /** Check if a node is selected */
    isNodeSelected: (nodeId: string) => boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for OrgChartTree business logic
 * 
 * @param props - Tree props and node data
 * @returns Tree viewmodel with configuration and helpers
 * 
 * @example
 * ```tsx
 * const vm = useOrgChartTree({ node, lineColor, lineWidth });
 * ```
 */
export function useOrgChartTree(props: OrgChartTreeProps): UseOrgChartTreeResult {
    const { node, ...modelData } = props;

    // Create and memoize the tree model - build manually to avoid Zod coercion issues
    const model = useMemo<OrgChartTreeModel>(
        () => ({
            level: modelData.level ?? 0,
            parentId: modelData.parentId,
            lineColor: modelData.lineColor ?? 'var(--primary-color, #3b82f6)',
            lineWidth: modelData.lineWidth ?? 2,
            orientation: modelData.orientation ?? 'vertical',
            nodeSpacing: modelData.nodeSpacing ?? 24,
            levelSpacing: modelData.levelSpacing ?? 80,
            compact: modelData.compact ?? false,
            selectedId: modelData.selectedId,
        }),
        [
            modelData.level,
            modelData.lineColor,
            modelData.lineWidth,
            modelData.orientation,
            modelData.nodeSpacing,
            modelData.levelSpacing,
            modelData.compact,
            modelData.selectedId,
        ]
    );

    // Extract children
    const children = useMemo<OrgChartNodeData[]>(
        () => node.children || [],
        [node.children]
    );

    // Check if node has children
    const hasChildren = children.length > 0;

    // Calculate connector height based on level spacing
    const connectorHeight = useMemo(() => {
        // Adjust height for compact mode
        const baseHeight = model.compact ? model.levelSpacing * 0.6 : model.levelSpacing;
        return Math.max(20, baseHeight * 0.5); // Connector takes up half the level spacing
    }, [model.levelSpacing, model.compact]);

    // Vertical connector (from parent node to horizontal bridge)
    const verticalConnector = useMemo<OrgChartConnectorModel>(
        () => ({
            type: 'vertical',
            color: model.lineColor,
            width: model.lineWidth,
            height: connectorHeight,
            childCount: 0,
        }),
        [model.lineColor, model.lineWidth, connectorHeight]
    );

    // Horizontal bridge connector (connects siblings)
    const horizontalBridgeConnector = useMemo<OrgChartConnectorModel>(
        () => ({
            type: 'horizontal-bridge',
            color: model.lineColor,
            width: model.lineWidth,
            childCount: children.length,
            height: 40,
        }),
        [model.lineColor, model.lineWidth, children.length]
    );

    // Child branch connector (from bridge to each child)
    const childBranchConnector = useMemo<OrgChartConnectorModel>(
        () => ({
            type: 'child-branch',
            color: model.lineColor,
            width: model.lineWidth,
            height: connectorHeight,
            childCount: 0,
        }),
        [model.lineColor, model.lineWidth, connectorHeight]
    );

    // Check if a node is selected
    const isNodeSelected = (nodeId: string): boolean => {
        return model.selectedId === nodeId;
    };

    return {
        model,
        hasChildren,
        children,
        verticalConnector,
        horizontalBridgeConnector,
        childBranchConnector,
        isNodeSelected,
    };
}
