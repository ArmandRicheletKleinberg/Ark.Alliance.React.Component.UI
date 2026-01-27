/**
 * @fileoverview OrgChart ViewModel
 * @module components/TreeView/OrgChart
 */

import { useMemo, useCallback } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import {
    type OrgChartModel,
    type OrgChartNodeData,
    defaultOrgChartModel,
    OrgChartModelSchema,
} from './OrgChart.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseOrgChartOptions extends Partial<OrgChartModel> {
    rootNodes: OrgChartNodeData[];
}

export interface UseOrgChartResult extends BaseViewModelResult<OrgChartModel> {
    /** Whether the chart is empty */
    isEmpty: boolean;
    /** Total node count */
    nodeCount: number;
    /** Line style object */
    lineStyle: { width: string; color: string };
    /** Get node by ID */
    getNodeById: (id: string) => OrgChartNodeData | undefined;
    /** Check if node is selected */
    isNodeSelected: (id: string) => boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useOrgChart(options: UseOrgChartOptions): UseOrgChartResult {
    const modelOptions = useMemo(() => {
        return OrgChartModelSchema.parse({ ...defaultOrgChartModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    const base = useBaseViewModel<OrgChartModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'org-chart',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const isEmpty = useMemo(() => {
        return base.model.rootNodes.length === 0;
    }, [base.model.rootNodes]);

    const nodeCount = useMemo(() => {
        const count = (nodes: OrgChartNodeData[]): number => {
            return nodes.reduce((sum, node) => {
                return sum + 1 + (node.children ? count(node.children) : 0);
            }, 0);
        };
        return base.model.totalCount ?? count(base.model.rootNodes);
    }, [base.model.rootNodes, base.model.totalCount]);

    const lineStyle = useMemo(() => ({
        width: `${base.model.lineWidth}px`,
        color: base.model.lineColor,
    }), [base.model.lineWidth, base.model.lineColor]);

    // ═══════════════════════════════════════════════════════════════════════
    // METHODS
    // ═══════════════════════════════════════════════════════════════════════

    const getNodeById = useCallback((id: string): OrgChartNodeData | undefined => {
        const findNode = (nodes: OrgChartNodeData[]): OrgChartNodeData | undefined => {
            for (const node of nodes) {
                if (node.id === id) return node;
                if (node.children) {
                    const found = findNode(node.children);
                    if (found) return found;
                }
            }
            return undefined;
        };
        return findNode(base.model.rootNodes);
    }, [base.model.rootNodes]);

    const isNodeSelected = useCallback((id: string): boolean => {
        return base.model.selectedId === id;
    }, [base.model.selectedId]);

    return {
        ...base,
        isEmpty,
        nodeCount,
        lineStyle,
        getNodeById,
        isNodeSelected,
    };
}

export default useOrgChart;
