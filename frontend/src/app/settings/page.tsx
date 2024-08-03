'use client'


import Layout from '../../components/Layout';
import { PageHeader } from '../../components/PageHeader';
import { GeneralSettings } from '../../components/settings/GeneralSettings';
import { DocumentSettings } from '../../components/settings/DocumentSettings';
import { UserManagementSettings } from '../../components/settings/UserManagementSettings';
import { Button } from "@nextui-org/react";

export default function Settings() {
  return (
    <Layout>
      <PageHeader title="System Settings" />
      <form className="space-y-8">
        <GeneralSettings />
        <DocumentSettings />
        <UserManagementSettings />
        <Button color="primary" type="submit">Save Settings</Button>
      </form>
    </Layout>
  );
}