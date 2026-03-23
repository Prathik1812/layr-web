import type { Node } from '@xyflow/react';
import type { StructuredStory } from '../../store/useLayrStore';

/**
 * syncIAtoStory
 *
 * - ADDITIVE ONLY
 * - Syncs IA node labels into story.keyFeatures
 * - Fully safe (no undefined crashes)
 */
export const syncIAtoStory = (
    iaNodes: Node[] = [],
    currentStory: StructuredStory | null
): StructuredStory | null => {
    if (!currentStory) return null;

    const existingFeatures = new Set(
        (currentStory.keyFeatures || []).map(f => f.toLowerCase())
    );

    const newFeatures: string[] = [];

    iaNodes.forEach((node) => {
        const label = String(node?.data?.label || '').trim();

        // ignore empty + base nodes
        if (!label || label.toLowerCase() === 'home' || label.toLowerCase() === 'authentication') {
            return;
        }

        if (!existingFeatures.has(label.toLowerCase())) {
            newFeatures.push(label);
            existingFeatures.add(label.toLowerCase());
        }
    });

    if (newFeatures.length === 0) {
        return null;
    }

    return {
        ...currentStory,
        keyFeatures: [...(currentStory.keyFeatures || []), ...newFeatures]
    };
};