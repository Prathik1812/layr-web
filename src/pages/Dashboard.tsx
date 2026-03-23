
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, type ProjectData } from '../services/projectService';
import { isInitialized } from '../services/firebase';
import { useLayrStore } from '../store/useLayrStore';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { Plus, Grid, List, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ProjectCard from '../components/dashboard/ProjectCard';

import { CustomDialog } from '../components/ui/CustomDialog';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const { createNewProject } = useLayrStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    // Dialog State
    const [dialogConfig, setDialogConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        type: 'info' | 'warning' | 'error' | 'success';
        variant: 'alert' | 'confirm';
        onConfirm?: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        type: 'info',
        variant: 'alert'
    });

    useEffect(() => {
        if (user) loadProjects();
    }, [user]);

    const loadProjects = async () => {
        if (!user || !user.uid) return;
        try {
            setLoading(true);
            const data = await projectService.getUserProjects(user.uid);
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        if (!user) return;

        if (!isInitialized) {
            setDialogConfig({
                isOpen: true,
                title: 'Configuration Error',
                description: 'Firebase is not initialized. Please check your .env.local and ensure you have valid API keys.',
                type: 'error',
                variant: 'alert'
            });
            return;
        }

        if (!user.uid) {
            setDialogConfig({
                isOpen: true,
                title: 'Profile Incomplete',
                description: 'User profile is missing a UID. Please try logging out and back in.',
                type: 'warning',
                variant: 'alert'
            });
            return;
        }

        try {
            setLoading(true);
            const limitCheck = await userService.checkProjectLimit(user.uid);

            if (!limitCheck.allowed) {
                setLoading(false);
                setDialogConfig({
                    isOpen: true,
                    title: 'Limit Reached',
                    description: 'You have reached your project limit. Upgrade to a Pro plan to create more blueprints.',
                    type: 'warning',
                    variant: 'confirm',
                    onConfirm: () => navigate('/pricing')
                });
                return;
            }

            const newId = await createNewProject(user.uid);
            navigate(`/projects/${newId}/story`);
        } catch (error: any) {
            console.error("Failed to create project:", error);
            setDialogConfig({
                isOpen: true,
                title: 'System Failure',
                description: `Failed to create project: ${error.message}`,
                type: 'error',
                variant: 'alert'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = (id: string) => {
        setDialogConfig({
            isOpen: true,
            title: 'Delete Blueprint',
            description: 'Are you sure you want to delete this project? This operation is permanent and all associated data will be purged.',
            type: 'error',
            variant: 'confirm',
            onConfirm: async () => {
                await projectService.deleteProject(id);
                loadProjects();
            }
        });
    };

    const handleRenameProject = async (id: string, newTitle: string) => {
        try {
            await projectService.updateProjectTitle(id, newTitle);
            loadProjects();
        } catch (error) {
            console.error(error);
        }
    }

    if (authLoading) return <div className="h-screen flex items-center justify-center bg-[#0d0d0d] text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-sans selection:bg-white/20 flex">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
                <div className="absolute left-[300px] top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute right-[300px] top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute top-[100px] left-0 right-0 h-px bg-white/20" />
            </div>

            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col relative z-10 transition-all duration-300">
                <Header />

                <main className="p-8 max-w-[1600px] mx-auto w-full">
                    {/* Title and Controls */}
                    <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/5">
                        <div>
                            <h2 className="text-3xl font-bold uppercase tracking-tighter mb-1">Your Projects</h2>
                            <span className="text-xs font-mono text-gray-500">MANAGE YOUR LAYR PROJECTS</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* View Toggle */}
                            <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* New Project CTA */}
                            <button
                                onClick={handleCreateProject}
                                className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                New Project
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-white" />
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
                            {/* Create Card (only in grid) */}
                            {viewMode === 'grid' && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreateProject}
                                    className="h-[280px] border border-dashed border-white/20 hover:border-white hover:bg-white/5 rounded-xl flex flex-col items-center justify-center gap-4 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Create New</span>
                                </motion.button>
                            )}

                            <AnimatePresence>
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onDelete={handleDeleteProject}
                                        onRename={handleRenameProject}
                                    />
                                ))}
                            </AnimatePresence>

                            {projects.length === 0 && viewMode === 'list' && (
                                <div className="text-center py-20 text-gray-500 font-mono text-sm border border-dashed border-white/10 rounded-xl">
                                    NO PROJECTS FOUND. CREATE ONE TO GET STARTED.
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
            <CustomDialog
                isOpen={dialogConfig.isOpen}
                onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
                title={dialogConfig.title}
                description={dialogConfig.description}
                type={dialogConfig.type}
                variant={dialogConfig.variant}
                onConfirm={dialogConfig.onConfirm}
            />
        </div>
    );
};

export default Dashboard;
