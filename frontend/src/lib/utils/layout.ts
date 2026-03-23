import dagre from 'dagre';
import { type Node, type Edge, Position } from '@xyflow/react';

const nodeWidth = 350;
const nodeHeight = 100;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // TB = Top to Bottom, LR = Left to Right
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ 
        rankdir: direction,
        ranksep: 180, // Horizontal space between layers
        nodesep: 80,  // Vertical space between individual nodes in a layer
        marginx: 50,
        marginy: 50
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node, index) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        let finalX = index * (nodeWidth + 20);
        let finalY = index * (nodeHeight + 20);

        if (nodeWithPosition && typeof nodeWithPosition.x === 'number' && typeof nodeWithPosition.y === 'number') {
            finalX = nodeWithPosition.x - nodeWidth / 2;
            finalY = nodeWithPosition.y - nodeHeight / 2;
        }

        const newNode: Node = {
            ...node,
            position: {
                x: finalX,
                y: finalY,
            },
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        };

        return newNode;
    });

    return { nodes: layoutedNodes, edges };
};
