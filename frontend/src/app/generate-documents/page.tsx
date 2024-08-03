'use client'
import Layout from '../../components/Layout'
import { PageHeader } from '../../components/PageHeader'
import { CoursePDFGenerator } from '../../components/generate-documents/CoursePDFGenerator'
import { HandbookGenerator } from '../../components/generate-documents/HandbookGenerator'
import { RulesExporter } from '../../components/generate-documents/RulesExporter'
import { useDocuments } from '../../hooks/useDocuments'

export default function GenerateDocuments() {
  const { isGenerating, error, generateCoursePDF, generateHandbook, exportRules } = useDocuments()

  return (
    <Layout>
      <PageHeader title="Generate Documentation" />
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="space-y-8">
        <CoursePDFGenerator onGenerate={generateCoursePDF} isGenerating={isGenerating} />
        <HandbookGenerator onGenerate={generateHandbook} isGenerating={isGenerating} />
        <RulesExporter onExport={exportRules} isGenerating={isGenerating} />
      </div>
    </Layout>
  )
}
