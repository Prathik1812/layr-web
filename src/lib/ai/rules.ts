import type { Node, Edge } from '@xyflow/react';
import type { StructuredStory } from '../../store/useLayrStore';

export interface Suggestion {
    id: string;
    source: "story" | "ia" | "userflow";
    tab: "story" | "ia" | "userflow";
    message: string;
    severity: "info" | "warning" | "error";
    relatedId?: string;
    isDismissed?: boolean;
    tier?: 'free' | 'pro';
}

// ---- RULES ----

// 1. Check for Story Features missing in IA
export const checkMissingIAFeatures = (story: StructuredStory | null, iaNodes: Node[]): Suggestion[] => {
    if (!story) return [];
    const suggestions: Suggestion[] = [];
    const iaLabels = new Set(iaNodes.map(n => ((n?.data?.label as string) || "Unknown")));

    (story.keyFeatures || []).forEach(feature => {
        // Simple heuristic: check if feature name is contained in any IA node label
        // or effectively represented. For now, exact or near match.
        // Let's rely on exact strings or simplified containment for robustness.
        const encodedFeature = feature.toLowerCase().trim();
        const exists = Array.from(iaLabels).some(label => label.toLowerCase().includes(encodedFeature));

        if (!exists) {
            suggestions.push({
                id: `missing-ia-${feature}`,
                source: 'story',
                tab: 'ia',
                message: `Feature "${feature}" is in your Story but not in your Information Architecture.`,
                severity: 'info'
            });
        }
    });

    return suggestions;
};

// 2. Check for Orphan IA Nodes (not connected to anything)
export const checkOrphanIANodes = (nodes: Node[], edges: Edge[]): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const connectedNodeIds = new Set<string>();

    edges.forEach(edge => {
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
    });

    nodes.forEach(node => {
        if (!connectedNodeIds.has(node.id) && nodes.length > 1) {
            suggestions.push({
                id: `orphan-ia-${node.id}`,
                source: 'ia',
                tab: 'ia',
                message: `Page "${(node?.data?.label as string) || "Unknown"}" is isolated. Consider connecting it to the flow.`,
                severity: 'warning',
                relatedId: node.id
            });
        }
    });

    return suggestions;
};

// 3. Check Userflow steps missing in IA
export const checkUserflowMissingInIA = (userflowNodes: Node[], iaNodes: Node[]): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const iaLabels = new Set(iaNodes.map(n => ((n?.data?.label as string) || "Unknown"))); // normalize?

    userflowNodes.forEach(node => {
        const label = (node?.data?.label as string) || "Unknown";
        // Ignore "Note" or utility nodes if any
        if (!label) return;

        // Check if this step exists in IA
        const exists = Array.from(iaLabels).some(iaLabel => iaLabel.toLowerCase() === label.toLowerCase());

        if (!exists) {
            suggestions.push({
                id: `userflow-missing-ia-${node.id}`,
                source: 'userflow',
                tab: 'ia',
                message: `User step "${label}" is not defined in your IA.`,
                severity: 'warning',
                relatedId: node.id
            });
        }
    });

    return suggestions;
};

// 4. Dead-end Userflows
export const checkDeadEndUserflows = (nodes: Node[], edges: Edge[]): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const hasOutgoing = new Set<string>();

    edges.forEach(edge => {
        hasOutgoing.add(edge.source);
    });

    nodes.forEach(node => {
        // Heuristic: Last step usually doesn't have outgoing, but maybe it should connect to a success state?
        // Let's only flag if it's NOT a terminal state (maybe logic later).
        // For now, if we have > 1 node, and this node is not "Success" or "Done" and has no outgoing.

        const label = ((node?.data?.label as string) || "Unknown").toLowerCase();
        if (['end', 'success', 'done', 'finish'].some(t => label.includes(t))) return;

        if (!hasOutgoing.has(node.id) && nodes.length > 1) {
            suggestions.push({
                id: `dead-end-${node.id}`,
                source: 'userflow',
                tab: 'userflow',
                message: `Flow stops at "${(node?.data?.label as string) || "Unknown"}". Should it lead somewhere?`,
                severity: 'info',
                relatedId: node.id
            });
        }
    });

    return suggestions;
};
