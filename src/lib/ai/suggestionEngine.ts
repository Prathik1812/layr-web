import type { Node, Edge } from '@xyflow/react';
import type { StructuredStory } from '../../store/useLayrStore';
import {
    checkMissingIAFeatures,
    checkOrphanIANodes,
    checkUserflowMissingInIA,
    checkDeadEndUserflows,
    type Suggestion
} from './rules';

export const analyzeProject = (
    structuredStory: StructuredStory | null,
    iaNodes: Node[],
    iaEdges: Edge[],
    userflowNodes: Node[],
    userflowEdges: Edge[],
    _plan: 'free' | 'pro' = 'free' // Plan is passed for future server-side filtering vs client-side locking
): Suggestion[] => {
    let suggestions: Suggestion[] = [];

    // 1. Story <-> IA Analysis (Free)
    suggestions = [...suggestions, ...checkMissingIAFeatures(structuredStory, iaNodes).map(s => ({ ...s, tier: 'free' as const }))];

    // 2. IA Internal Analysis (Free)
    suggestions = [...suggestions, ...checkOrphanIANodes(iaNodes, iaEdges).map(s => ({ ...s, tier: 'free' as const }))];

    // 3. Userflow <-> IA Analysis (Pro)
    const userflowSuggestions = checkUserflowMissingInIA(userflowNodes, iaNodes).map(s => ({ ...s, tier: 'pro' as const }));

    // 4. Userflow Internal Analysis (Pro)
    const deadEndSuggestions = checkDeadEndUserflows(userflowNodes, userflowEdges).map(s => ({ ...s, tier: 'pro' as const }));

    // Merge Pro suggestions but maybe mark them or filter if we wanted strict hiding (but we want to gate them visibly)
    // We will include them, and the UI will hide/blur them based on the plan.
    suggestions = [...suggestions, ...userflowSuggestions, ...deadEndSuggestions];

    return suggestions;
};
