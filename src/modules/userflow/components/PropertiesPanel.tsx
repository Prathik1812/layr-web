
import { PropertiesPanel, PropertyRow, PropertyInput, PropertyTextarea } from '../../../components/canvas/PropertiesPanel';

export const UserflowPropertiesPanel = () => {
    // Placeholder implementation
    const selectedNode = null;

    return (
        <PropertiesPanel title="Step Properties" isEmpty={!selectedNode}>
            <PropertyRow label="Step Name">
                <PropertyInput placeholder="e.g. User Login" />
            </PropertyRow>

            <PropertyRow label="Action Details">
                <PropertyTextarea placeholder="Describe the user action..." />
            </PropertyRow>

            <PropertyRow label="Action Type">
                <select className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-white/30 outline-none transition-colors">
                    <option>Click</option>
                    <option>Input</option>
                    <option>Navigation</option>
                    <option>System Event</option>
                </select>
            </PropertyRow>

            <PropertyRow label="Trigger">
                <PropertyInput placeholder="e.g. On Button Click" />
            </PropertyRow>
        </PropertiesPanel>
    );
};
