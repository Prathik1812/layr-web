import type { ReactNode } from 'react';
import { Header } from './Header';
import { NotificationBar } from './NotificationBar';
import { cn } from '../lib/utils';

interface LayoutProps {
    children: ReactNode;
    hideHeader?: boolean;
}

export const Layout = ({ children, hideHeader }: LayoutProps) => {
    return (
        <div className="h-screen w-screen bg-[#0d0d0d] text-foreground overflow-hidden flex flex-col font-sans">
            {!hideHeader && <Header />}
            <NotificationBar />
            <main className={cn(
                "flex-1 w-full relative z-0 overflow-hidden bg-[#0d0d0d]",
                !hideHeader && "pt-[60px]"
            )}>
                {/* Technical Grid for Editor Canvas */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute left-[20%] top-0 bottom-0 w-px bg-white" />
                    <div className="absolute right-[20%] top-0 bottom-0 w-px bg-white" />
                    <div className="absolute top-[20%] left-0 right-0 h-px bg-white" />
                    <div className="absolute bottom-[20%] left-0 right-0 h-px bg-white" />
                </div>
                {children}
            </main>
        </div>
    );
};
