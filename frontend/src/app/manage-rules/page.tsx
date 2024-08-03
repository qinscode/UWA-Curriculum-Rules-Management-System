'use client'
import Layout from '../../components/Layout'
import { PageHeader } from '../../components/PageHeader'
import { RuleForm } from '../../components/manage-rules/RuleForm'
import { RulesTable } from '../../components/manage-rules/RulesTable'
import { useRules } from '../../hooks/useRules'

export default function ManageRules() {
  const { rules, isLoading, error, addRule, deleteRule } = useRules()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Layout>
      <PageHeader title="Manage Course Rules" />
      <RuleForm onSave={addRule} />
      <h3 className="mb-4 text-xl font-bold">Existing Rules</h3>
      <RulesTable rules={rules} onDelete={deleteRule} />
    </Layout>
  )
}
