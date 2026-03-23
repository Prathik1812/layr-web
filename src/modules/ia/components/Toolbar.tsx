import {
    MousePointer2,
    Plus,
    Network,
    Save,
    Trash2,
    Type,
    Maximize,
    ZoomIn,
    ZoomOut
} from 'lucide-react';
import { CanvasToolbar, ToolbarButton, ToolbarSeparator } from '../../../components/canvas/CanvasToolbar';
import { useReactFlow } from '@xyflow/react';

interface ToolbarProps {
    onAddNode: () => void;
    onAddText: () => void;
    onDeleteNode: () => void;
    onOrganize: () => void;
    onExport: () => void;
}

export const Toolbar = ({ onAddNode, onAddText, onDeleteNode, onOrganize, onExport }: ToolbarProps) => {
    const { fitView, zoomIn, zoomOut } = useReactFlow();

    return (
        <CanvasToolbar>
            <ToolbarButton
                icon={MousePointer2}
                label="Select"
                active={true}
                onClick={() => { }}
            />
            
            <ToolbarSeparator />

            <ToolbarButton
                icon={Plus}
                label="Add Page"
                onClick={onAddNode}
            />

            <ToolbarButton
                icon={Type}
                label="Text"
                onClick={onAddText}
            />

            <ToolbarSeparator />

            <ToolbarButton
                icon={Network}
                label="Auto Layout"
                onClick={onOrganize}
            />

            <ToolbarButton
                icon={Maximize}
                label="Fit View"
                onClick={() => fitView({ padding: 0.2, duration: 800 })}
            />

            <ToolbarButton
                icon={ZoomIn}
                label="Zoom In"
                onClick={() => zoomIn()}
            />

            <ToolbarButton
                icon={ZoomOut}
                label="Zoom Out"
                onClick={() => zoomOut()}
            />

            <ToolbarSeparator />

            <ToolbarButton
                icon={Trash2}
                label="Delete"
                onClick={onDeleteNode}
            />

            <ToolbarSeparator />

            <ToolbarButton
                icon={Save}
                label="Export"
                onClick={onExport}
            />
        </CanvasToolbar>
    );
};
