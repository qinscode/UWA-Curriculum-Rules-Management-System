// app/generate-documents/page.tsx
"use client";
import Layout from '../../components/Layout';
import { Button, Select, SelectItem } from "@nextui-org/react";

export default function GenerateDocuments() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Generate Documentation</h2>
      <div className="space-y-8">
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
        <div>
          <h3 className="text-xl font-bold mb-2">Generate Complete Handbook</h3>
          <Button color="primary">Generate Full Handbook PDF</Button>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Export All Rules</h3>
          <Button color="primary">Export Rules as JSON</Button>
        </div>
      </div>
    </Layout>
  );
}