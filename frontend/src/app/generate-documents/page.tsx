

'use client'
import Layout from '../../components/Layout';
import { PageHeader } from '../../components/PageHeader';
import { CoursePDFGenerator } from '../../components/generate-documents/CoursePDFGenerator';
import { HandbookGenerator } from '../../components/generate-documents/HandbookGenerator';
import { RulesExporter } from '../../components/generate-documents/RulesExporter';

export default function GenerateDocuments() {
  return (
    <Layout>
      <PageHeader title="Generate Documentation" />
      <div className="space-y-8">
        <CoursePDFGenerator />
        <HandbookGenerator />
        <RulesExporter />
      </div>
    </Layout>
  );
}