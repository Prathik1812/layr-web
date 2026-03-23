
import { PropertiesPanel, PropertyRow, PropertyInput, PropertyTextarea } from '../../../components/canvas/PropertiesPanel';

export const IAPropertiesPanel = () => {
    // Determine selected node using store or selection hook
    // For now, mocking selection or using what's available
    // Ideally useOnSelectionChange from React Flow

    // Placeholder implementation
    const selectedNode = null;

    return (
        <PropertiesPanel title="Page Properties" isEmpty={!selectedNode}>
            <PropertyRow label="Page Title">
                <PropertyInput placeholder="e.g. Home" />
            </PropertyRow>

            <PropertyRow label="Description">
                <PropertyTextarea placeholder="Describe the purpose of this page..." />
            </PropertyRow>

            <PropertyRow label="Type">
                <select className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-white/30 outline-none transition-colors">
                    <option>Landing Page</option>
                    <option>Dashboard</option>
                    <option>Auth</option>
                    <option>Settings</option>
                </select>
            </PropertyRow>
        </PropertiesPanel>
    );
};
