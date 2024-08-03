import { Input } from "@nextui-org/react";

export function GeneralSettings() {
    return (
        <div>
            <h3 className="text-xl font-bold mb-2">General Settings</h3>
            <Input label="University Name" defaultValue="The University of Western Australia" className="mb-4" />
            <Input label="Current Academic Year" defaultValue="2023-2024" />
        </div>
    );
}