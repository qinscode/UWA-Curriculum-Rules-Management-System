// app/manage-rules/page.tsx
'use client'
import { useState } from 'react';
import Layout from '../../components/Layout';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

export default function ManageRules() {
  const [rules, setRules] = useState([
    { code: 'CS101', name: 'Introduction to Programming', type: 'Standard' },
    { code: 'MATH201', name: 'Advanced Calculus', type: 'Custom' },
  ]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Manage Course Rules</h2>
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

      <h3 className="text-xl font-bold mb-4">Existing Rules</h3>
      <Table aria-label="Example table with dynamic content">
        <TableHeader>
          <TableColumn>COURSE CODE</TableColumn>
          <TableColumn>COURSE NAME</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {rules.map((rule, index) => (
            <TableRow key={index}>
              <TableCell>{rule.code}</TableCell>
              <TableCell>{rule.name}</TableCell>
              <TableCell>{rule.type}</TableCell>
              <TableCell>
                <Button size="sm" color="primary" className="mr-2">Edit</Button>
                <Button size="sm" color="danger">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}