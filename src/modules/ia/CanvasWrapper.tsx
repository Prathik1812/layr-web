import { useCallback, useEffect, useState, useRef } from 'react';
import { ReactFlow, Background, addEdge, type Connection, BackgroundVariant, ReactFlowProvider, useReactFlow, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useLayrStore } from '../../store/useLayrStore';
import CustomNode from './components/CustomNode';
import { Toolbar } from './components/Toolbar';
import { getLayoutedElements } from '../../lib/utils/layout';
import { debounce } from '../../lib/sync/debounce';
import { CanvasLayout } from '../../components/canvas/CanvasLayout';
import { CanvasHeader } from '../../components/canvas/CanvasHeader';

const nodeTypes = {
    custom: CustomNode,
};

const Canvas = () => {
    const { fitView } = useReactFlow();
    const [isGenerating, setIsGenerating] = useState(false);
    const lastGeneratedRef = useRef<string | null>(null);
    const {
        iaNodes, iaEdges,
        setIANodes, setIAEdges,
        onNodesChange, onEdgesChange,
        structuredStory,
        addIANode,
        runIASync
    } = useLayrStore();

    // Debounced Sync Trigger
    const debouncedSync = useCallback(
        debounce(() => {
            runIASync();
        }, 1500),
        [runIASync]
    );

    // Watch for structural changes to trigger sync
    useEffect(() => {
        debouncedSync();
    }, [iaNodes, debouncedSync]);

    useEffect(() => {
        const hasContamination = iaNodes.some(n =>
            n.data?.subLabel === 'From Userflow' ||
            (n.data?.label && String(n.data.label).toLowerCase().includes('step'))
        );

        const currentStoryKey = structuredStory ? `${structuredStory.productName}-${structuredStory.description.slice(0, 20)}` : null;

        if (structuredStory && (iaNodes.length === 0 || hasContamination || lastGeneratedRef.current !== currentStoryKey) && !isGenerating) {
            setIsGenerating(true);
            lastGeneratedRef.current = currentStoryKey;

            const modules = structuredStory.systemModules || [];
            const nodes: any[] = [{
                id: 'ia-root',
                type: 'custom',
                position: { x: 0, y: 0 },
                data: { label: structuredStory.productName || 'Product Core', subLabel: 'Main Entry' }
            }];
            const edges: any[] = [];

            if (modules.length > 0) {
                modules.forEach((mod, i) => {
                    const baseId = `ia-mod-${i}`;

                    // Dynamic sub-page generation based on module index and name
                    const categories = [
                        ['Dashboard', 'Analytics', 'Reports'],
                        ['Feed', 'Post Creator', 'Discover'],
                        ['Profile', 'Connections', 'Messages'],
                        ['Marketplace', 'Cart', 'Checkout'],
                        ['Settings', 'Security', 'Billing']
                    ];

                    const subPages = categories[i % categories.length];

                    nodes.push({ id: baseId, type: 'custom', position: { x: 0, y: 0 }, data: { label: mod, subLabel: 'Feature Hub' } });
                    edges.push({ id: `e-root-${baseId}`, source: 'ia-root', target: baseId, type: 'smoothstep' });

                    subPages.forEach((sub, j) => {
                        const subId = `${baseId}-sub-${j}`;
                        nodes.push({
                            id: subId,
                            type: 'custom',
                            position: { x: 0, y: 0 },
                            data: { label: `${sub}`, subLabel: 'View' }
                        });
                        edges.push({ id: `e-${baseId}-${subId}`, source: baseId, target: subId, type: 'smoothstep' });
                    });
                });
            } else {
                nodes[0].position = { x: 250, y: 100 };
            }

            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB');
            setIANodes(layoutedNodes);
            setIAEdges(layoutedEdges);

            setTimeout(() => {
                fitView({ padding: 0.2, duration: 800 });
                setIsGenerating(false);
            }, 300);
        }
    }, [structuredStory, isGenerating, setIANodes, setIAEdges, fitView]);

    const onConnect = useCallback(
        (params: Connection) => setIAEdges(addEdge(params, iaEdges)),
        [iaEdges, setIAEdges]
    );

    const handleAddNode = () => {
        const id = `node-${Date.now()}`;
        const newNode = {
            id,
            type: 'custom',
            position: { x: 400, y: 300 },
            data: { label: 'New Page', subLabel: 'Draft' },
        };
        addIANode(newNode);
    };

    const handleAddText = () => {
        const id = `text-${Date.now()}`;
        const newNode = {
            id,
            type: 'custom',
            position: { x: 400, y: 300 },
            data: { label: 'Annotation', subLabel: 'Text Note' },
        };
        addIANode(newNode);
    };

    const handleDeleteNode = () => {
        const selectedNodes = iaNodes.filter(n => n.selected).map(n => n.id);
        if (selectedNodes.length > 0) {
            useLayrStore.getState().deleteIANodes(selectedNodes);
        }
    };

    const handleOrganize = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            iaNodes,
            iaEdges,
            'TB' // top to bottom
        );

        setIANodes([...layoutedNodes]);
        setIAEdges([...layoutedEdges]);

        // Let React Flow re-render before fitting view
        setTimeout(() => {
            fitView({ padding: 0.2, duration: 800 });
        }, 50);

    }, [iaNodes, iaEdges, setIANodes, setIAEdges, fitView]);

    const handleExport = () => {
        const data = {
            nodes: iaNodes,
            edges: iaEdges,
            metadata: {
                projectTitle: useLayrStore.getState().projectTitle,
                exportedAt: new Date().toISOString()
            }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ia-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!structuredStory && iaNodes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in">
                <span className="text-4xl mb-4">🚀</span>
                <p>Complete a Story first to generate your Information Architecture.</p>
            </div>
        );
    }

    return (
        <CanvasLayout
            header={<CanvasHeader onExport={handleExport} />}
            toolbar={
                <Toolbar
                    onAddNode={handleAddNode}
                    onAddText={handleAddText}
                    onDeleteNode={handleDeleteNode}
                    onOrganize={handleOrganize}
                    onExport={handleExport}
                />
            }
        >
            <div className="h-full w-full relative">
                {isGenerating && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <div className="w-16 h-16 rounded-3xl bg-primary/20 animate-pulse flex items-center justify-center border border-primary/20 mb-6 shadow-xl shadow-primary/10">
                            <span className="text-3xl animate-spin">⚡</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Architecting App Structure</h3>
                        <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">Building local graph layouts</p>
                    </div>
                )}
                <ReactFlow
                nodes={iaNodes}
                edges={iaEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-background"
                defaultEdgeOptions={{ type: 'smoothstep', animated: true, style: { stroke: '#ffffff50' } }}
            >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#ffffff10" />
                <MiniMap
                    position="bottom-right"
                    zoomable
                    pannable
                    style={{ backgroundColor: '#0d0d0d', borderRadius: '12px', border: '1px solid #ffffff10', opacity: 0.8 }}
                />
            </ReactFlow>
            </div>
        </CanvasLayout>
    );
};

export const CanvasWrapper = () => {
    return (
        <ReactFlowProvider>
            <Canvas />
        </ReactFlowProvider>
    );
};
