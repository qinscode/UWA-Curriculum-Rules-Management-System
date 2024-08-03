import { Button } from "@nextui-org/react";

export function RulesExporter() {
    return (
        <div>
            <h3 className="text-xl font-bold mb-2">Export All Rules</h3>
            <Button color="primary">Export Rules as JSON</Button>
        </div>
    );
}