import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useLayrStore, type Tab } from '../store/useLayrStore';
import { StoryModule } from '../modules/story';
import { IAModule } from '../modules/ia';
import { UserflowModule } from '../modules/userflow';

const Editor = () => {
    const { id, tab } = useParams<{ id: string; tab: string }>();
    const navigate = useNavigate();
    const { currentTab, loadProject, setCurrentTab } = useLayrStore();

    // 1. Sync URL tab to Store
    useEffect(() => {
        if (tab) {
            const validTabs: Tab[] = ['story', 'ia', 'userflow'];
            if (validTabs.includes(tab as Tab)) {
                if (currentTab !== tab) {
                    setCurrentTab(tab as Tab);
                }
            } else {
                // Invalid tab -> redirect to story
                navigate(`/projects/${id}/story`, { replace: true });
            }
        }
    }, [tab, id, navigate, currentTab, setCurrentTab]);

    // 2. Load Project
    useEffect(() => {
        if (id) {
            loadProject(id);
        }
    }, [id, loadProject]);

    return (
        <Layout hideHeader={tab !== 'story'}>
            <div className="flex flex-col h-full w-full">
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    {tab === 'story' && (
                        <div className="h-full w-full animate-in fade-in zoom-in-95 duration-500">
                            <StoryModule />
                        </div>
                    )}
                    {tab === 'ia' && (
                        <div className="h-full w-full animate-in fade-in zoom-in-95 duration-500">
                            <IAModule />
                        </div>
                    )}
                    {tab === 'userflow' && (
                        <div className="h-full w-full animate-in fade-in zoom-in-95 duration-500">
                            <UserflowModule />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Editor;
