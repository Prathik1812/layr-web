import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '../../../lib/utils';
import { memo, useState, useEffect, useRef } from 'react';
import { useLayrStore } from '../../../store/useLayrStore';

const CustomStepNode = ({ id, data, selected }: NodeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(String((data as any)?.label || ''));
    const { updateUserflowNode } = useLayrStore();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (label !== (data as any).label) {
            updateUserflowNode(id, { label });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setLabel(String((data as any)?.label || ''));
            setIsEditing(false);
        }
    };

    return (
        <div
            onDoubleClick={handleDoubleClick}
            className={cn(
                "group px-10 py-6 rounded-xl backdrop-blur-xl bg-white/5 border transition-all duration-300 min-w-[240px] text-center",
                selected
                    ? "border-white/40 ring-2 ring-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-105"
                    : "border-white/10 hover:border-white/30"
            )}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="!w-2 !h-2 !bg-white !border-none !opacity-0 group-hover:!opacity-100 transition-opacity"
            />

            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none text-2xl font-bold text-white text-center w-full focus:outline-none"
                    autoFocus
                />
            ) : (
                <div className="flex flex-col items-center justify-center">
                    {(data as any)?.stepIndex && (
                        <div className="absolute top-2 right-3 text-[8px] font-mono text-gray-500 uppercase tracking-widest opacity-40">
                            STEP {String((data as any).stepIndex)}
                        </div>
                    )}
                    <span className="text-2xl font-bold text-white tracking-tight leading-tight">{String((data as any)?.label || '')}</span>
                    {typeof (data as any)?.action === 'string' && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-mono">{String((data as any).action)}</span>
                    )}
                </div>
            )}

            <Handle
                type="source"
                position={Position.Right}
                className="!w-2 !h-2 !bg-white !border-none !opacity-0 group-hover:!opacity-100 transition-opacity"
            />
        </div>
    );
};

export default memo(CustomStepNode);
