
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, FolderOpen, Clock, Trash2, Edit2, ExternalLink } from 'lucide-react';
import type { ProjectData } from '../../services/projectService';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
    project: ProjectData;
    onDelete: (id: string) => void;
    onRename: (id: string, newTitle: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete, onRename }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(project.title);

    const handleRenameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTitle.trim() && newTitle !== project.title) {
            onRename(project.id!, newTitle);
        }
        setIsRenaming(false);
    };

    const formattedDate = project.updatedAt
        ? new Date((project.updatedAt as any)?.seconds * 1000).toLocaleDateString()
        : 'Active';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="group relative h-[280px] bg-[#111] border border-white/10 hover:border-white/30 transition-all rounded-xl overflow-hidden flex flex-col"
        >
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Top Image / Preview Area holder */}
            <div
                onClick={() => navigate(`/projects/${project.id}/story`)}
                className="h-[140px] bg-white/5 relative group-hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center border-b border-white/5"
            >
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <FolderOpen className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>

                {/* Decoration */}
                <div className="absolute top-4 left-4 flex gap-1">
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 flex flex-col justify-between relative z-10 glass">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                        {isRenaming ? (
                            <form onSubmit={handleRenameSubmit}>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    autoFocus
                                    onBlur={handleRenameSubmit}
                                    className="bg-transparent border-b border-white/20 text-sm font-bold text-white w-full focus:outline-none"
                                />
                            </form>
                        ) : (
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight truncate group-hover:text-white/90 transition-colors">
                                {project.title}
                            </h3>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>Updated: {formattedDate}</span>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                                <button
                                    onClick={() => { setShowMenu(false); setIsRenaming(true); }}
                                    className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                >
                                    <Edit2 className="w-3 h-3" /> Rename
                                </button>
                                <button
                                    onClick={() => { setShowMenu(false); onDelete(project.id!); }}
                                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Action */}
                <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="mt-4 w-full py-2 bg-white/5 hover:bg-white text-gray-300 hover:text-black rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-transparent"
                >
                    Open Project <ExternalLink className="w-3 h-3" />
                </button>
            </div>

            {/* Backdrop for menu */}
            {showMenu && (
                <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
            )}
        </motion.div>
    );
};

export default ProjectCard;
