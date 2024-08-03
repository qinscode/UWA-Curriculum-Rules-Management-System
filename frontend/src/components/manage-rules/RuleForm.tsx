import { Select, SelectItem, Textarea, Button, Input } from "@nextui-org/react";

export function RuleForm() {
    return (
        <form className="space-y-4 mb-8">
            <Select label="Select Course Type" placeholder="Select course type">
                <SelectItem key="standard" value="standard">Standard</SelectItem>
                <SelectItem key="custom" value="custom">Custom</SelectItem>
            </Select>
            <Input label="Course Code" placeholder="Enter course code" />
            <Input label="Course Name" placeholder="Enter course name" />
            <Textarea label="Course Description" placeholder="Enter course description" />
            <Textarea label="Course Rules" placeholder="Enter course rules" />
            <Button color="primary" type="submit">Save Rules</Button>
        </form>
    );
}