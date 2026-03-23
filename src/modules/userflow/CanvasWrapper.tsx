import { useCallback, useEffect, useState } from 'react';
import { ReactFlow, Background, addEdge, type Connection, BackgroundVariant, ReactFlowProvider, useReactFlow, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useLayrStore } from '../../store/useLayrStore';
import CustomStepNode from './components/CustomStepNode';
import { Toolbar } from './components/Toolbar';
import { getLayoutedElements } from '../../lib/utils/layout';
import { debounce } from '../../lib/sync/debounce';
import { CanvasLayout } from '../../components/canvas/CanvasLayout';
import { CanvasHeader } from '../../components/canvas/CanvasHeader';

const nodeTypes = {
    step: CustomStepNode,
};

const Canvas = () => {
    const { fitView } = useReactFlow();
    const [isGenerating, setIsGenerating] = useState(false);
    const {
        userflowNodes, userflowEdges,
        setUserflowNodes, setUserflowEdges,
        onUserflowNodesChange, onUserflowEdgesChange,
        structuredStory,
        addUserflowNode,
        runUserflowSync
    } = useLayrStore();

    const debouncedSync = useCallback(
        debounce(() => {
            runUserflowSync();
        }, 1500),
        [runUserflowSync]
    );

    useEffect(() => {
        debouncedSync();
    }, [userflowNodes, debouncedSync]);

    useEffect(() => {
        if (structuredStory && userflowNodes.length === 0 && !isGenerating) {
            setIsGenerating(true);
            
            const actions = structuredStory.primaryUserActions || [];
            const nodes: any[] = [];
            const edges: any[] = [];
            
            if (actions.length === 0) {
                nodes.push({
                    id: `step-start`,
                    type: 'step',
                    position: { x: 100, y: 100 },
                    data: { label: 'Start', action: 'User enters app', stepIndex: '1' }
                });
            } else {
                actions.forEach((action, i) => {
                    const baseId = `step-${i}`;
                    const isComplex = i % 3 === 0;
                    
                    const label = action.split(' ').slice(0, 3).join(' ') + (action.split(' ').length > 3 ? '...' : '');
                    
                    nodes.push({ 
                        id: `${baseId}-main`, 
                        type: 'step', 
                        position: { x: 0, y: 0 }, 
                        data: { label: label, action: action, stepIndex: String(i + 1) } 
                    });

                    if (isComplex) {
                        const errorId = `${baseId}-err`;
                        nodes.push({ 
                            id: errorId, 
                            type: 'step', 
                            position: { x: 0, y: 0 }, 
                            data: { label: `Handle Error`, action: `Fallback for ${label}`, stepIndex: '!' } 
                        });
                        edges.push({ 
                            id: `e-${baseId}-err`, 
                            source: `${baseId}-main`, 
                            target: errorId, 
                            type: 'smoothstep', 
                            animated: true, 
                            style: { stroke: '#ef4444' } 
                        });
                    }

                    const successId = `${baseId}-ok`;
                    nodes.push({ 
                        id: successId, 
                        type: 'step', 
                        position: { x: 0, y: 0 }, 
                        data: { label: `Completed`, action: `${label} Success`, stepIndex: '✓' } 
                    });
                    
                    edges.push({ 
                        id: `e-${baseId}-success`, 
                        source: `${baseId}-main`, 
                        target: successId, 
                        type: 'smoothstep', 
                        style: { stroke: '#10b981' } 
                    });
                    
                    if (i > 0) {
                        edges.push({ 
                            id: `e-chain-${i-1}`, 
                            source: `step-${i-1}-ok`, 
                            target: `${baseId}-main`, 
                            type: 'smoothstep', 
                            style: { strokeWidth: 1, stroke: '#ffffff20' } 
                        });
                    }
                });
            }
            
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'LR');
            setUserflowNodes(layoutedNodes);
            setUserflowEdges(layoutedEdges);
            
            setTimeout(() => {
                fitView({ padding: 0.2, duration: 800 });
                setIsGenerating(false);
            }, 300);
        }
    }, [structuredStory, userflowNodes.length, isGenerating, setUserflowNodes, setUserflowEdges, fitView]);

    const onConnect = useCallback(
        (params: Connection) => setUserflowEdges(addEdge(params, userflowEdges)),
        [userflowEdges, setUserflowEdges]
    );

    const handleAddNode = () => {
        const id = `step-${Date.now()}`;
        const newNode = {
            id,
            type: 'step',
            position: { x: 400, y: 300 },
            data: { label: 'New Step', action: 'User Interaction', stepIndex: String(userflowNodes.length + 1) },
        };
        addUserflowNode(newNode);
    };

    const handleAddLogic = () => {
        const id = `logic-${Date.now()}`;
        const newNode = {
            id,
            type: 'step',
            position: { x: 400, y: 300 },
            data: { label: 'Condition', action: 'System Decision', stepIndex: '?' },
        };
        addUserflowNode(newNode);
    };

    const handleAddText = () => {
        const id = `note-${Date.now()}`;
        const newNode = {
            id,
            type: 'step',
            position: { x: 400, y: 300 },
            data: { label: 'Notation', action: 'User Note', stepIndex: 'i' },
        };
        addUserflowNode(newNode);
    };

    const handleDeleteNode = () => {
        const selectedNodes = userflowNodes.filter(n => n.selected).map(n => n.id);
        if (selectedNodes.length > 0) {
            useLayrStore.getState().deleteUserflowNodes(selectedNodes);
        }
    };

    const handleOrganize = useCallback(() => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            userflowNodes,
            userflowEdges,
            'LR'
        );

        setUserflowNodes([...layoutedNodes]);
        setUserflowEdges([...layoutedEdges]);

        setTimeout(() => {
            fitView({ padding: 0.2, duration: 800 });
        }, 50);

    }, [userflowNodes, userflowEdges, setUserflowNodes, setUserflowEdges, fitView]);

    const handleExport = () => {
        const data = {
            nodes: userflowNodes,
            edges: userflowEdges,
            metadata: {
                projectTitle: useLayrStore.getState().projectTitle,
                module: 'Userflow',
                exportedAt: new Date().toISOString()
            }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `userflow-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!structuredStory && userflowNodes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in">
                <span className="text-4xl mb-4">🕸️</span>
                <p>Create a Story first to generate your Userflow.</p>
            </div>
        );
    }

    return (
        <CanvasLayout
            header={<CanvasHeader onExport={handleExport} />}
            toolbar={
                <Toolbar 
                    onAddNode={handleAddNode} 
                    onAddLogic={handleAddLogic}
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
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Mapping User Journey</h3>
                        <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">Building local graph layouts</p>
                    </div>
                )}
                <ReactFlow
                nodes={userflowNodes}
                edges={userflowEdges}
                onNodesChange={onUserflowNodesChange}
                onEdgesChange={onUserflowEdgesChange}
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
