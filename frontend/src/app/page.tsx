// app/page.tsx
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function Home() {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Welcome to the Course Rules Management System (Demo)</h2>
        </CardHeader>
        <CardBody>
          <p className="text-lg">
            This centralized platform allows you to manage and update course rules efficiently. Use the navigation menu
            to access different features.
          </p>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold mb-2">Manage Rules</h3>
            <p>Create, edit, and delete course rules for your institution.</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-bold mb-2">Generate Documents</h3>
            <p>Generate PDFs for specific courses or create a complete handbook.</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-bold mb-2">System Settings</h3>
            <p>Configure general settings, document generation options, and user management.</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-bold mb-2">Data Export</h3>
            <p>Export all rules as JSON for backup or integration purposes.</p>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}