
import type { ReactNode } from 'react';

interface CanvasLayoutProps {
    header: ReactNode;
    toolbar: ReactNode;
    children: ReactNode; // The React Flow Canvas
}

export const CanvasLayout = ({ header, toolbar, children }: CanvasLayoutProps) => {
    return (
        <div className="h-full w-full flex flex-col bg-[#0d0d0d] relative overflow-hidden">
            {/* Top Header Area */}
            <div className="h-20 border-b border-white/5 bg-[#0d0d0d]/80 backdrop-blur-md z-20 relative">
                {header}
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Center Canvas Area - No longer with side toolbar */}
                <div className="flex-1 flex flex-col relative bg-[#0d0d0d] overflow-hidden">
                    {/* Grid Overlay for technical feel */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    </div>
                    {children}
                </div>
            </div>

            {/* Floating Toolbar */}
            {toolbar}
        </div>
    );
};
