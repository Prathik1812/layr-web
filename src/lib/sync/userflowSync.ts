import type { Node } from '@xyflow/react';

/**
 * syncUserflowToIA
 *
 * - ADDITIVE ONLY
 * - Syncs Userflow steps into IA
 * - Fully safe (no undefined crashes)
 */
export const syncUserflowToIA = (
    userflowNodes: Node[] = [],
    iaNodes: Node[] = []
): Node[] | null => {
    if (!userflowNodes.length) return null;

    const existingIALabels = new Set(
        iaNodes.map(n => String(n?.data?.label || '').toLowerCase())
    );

    const nodesToAdd: Node[] = [];
    let newItemsOffset = 0;

    userflowNodes.forEach((stepNode, index) => {
        const label = String(stepNode?.data?.label || '').trim();

        // skip empty or meaningless labels
        if (!label || label.length < 2) return;

        if (!existingIALabels.has(label.toLowerCase())) {
            nodesToAdd.push({
                id: `node-synced-${index}-${Math.random().toString(36).slice(2, 7)}`,
                type: 'custom',
                position: {
                    x: 50 + newItemsOffset * 250,
                    y: 500
                },
                data: {
                    label,
                    subLabel: 'From Userflow',
                    icon: '⚡'
                }
            });

            existingIALabels.add(label.toLowerCase());
            newItemsOffset++;
        }
    });

    if (nodesToAdd.length === 0) return null;

    return [...iaNodes, ...nodesToAdd];
};