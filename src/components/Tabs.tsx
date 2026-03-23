import { useLayrStore, type Tab } from "../store/useLayrStore";
import { cn } from "../lib/utils";
import { useNavigate, useParams } from "react-router-dom";

const tabs: { id: Tab; label: string }[] = [
    { id: 'story', label: 'Story' },
    { id: 'ia', label: 'IA' },
    { id: 'userflow', label: 'Userflow' },
];

export const Tabs = () => {
    const { currentTab, setCurrentTab } = useLayrStore();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const handleTabChange = (tabId: Tab) => {
        setCurrentTab(tabId);
        if (id) {
            navigate(`/projects/${id}/${tabId}`);
        }
    };

    return (
        <div className="flex bg-muted/50 p-1 rounded-lg backdrop-blur-md">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 uppercase tracking-widest",
                        currentTab === tab.id
                            ? "bg-white text-black font-bold shadow-sm"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
