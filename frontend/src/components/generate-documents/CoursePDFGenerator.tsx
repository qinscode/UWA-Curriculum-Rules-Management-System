import { Select, SelectItem, Button } from "@nextui-org/react";

export function CoursePDFGenerator() {
    return (
        <div>
            <h3 className="text-xl font-bold mb-2">Generate PDF for Specific Course</h3>
            <div className="flex space-x-2">
                <Select label="Select a course" className="flex-grow">
                    <SelectItem key="CS101" value="CS101">CS101 - Introduction to Programming</SelectItem>
                    <SelectItem key="MATH201" value="MATH201">MATH201 - Advanced Calculus</SelectItem>
                </Select>
                <Button color="primary">Generate Course PDF</Button>
            </div>
        </div>
    );
}