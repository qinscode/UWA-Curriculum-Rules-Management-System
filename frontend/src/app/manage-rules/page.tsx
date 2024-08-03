'use client'
import { useState } from 'react';
import Layout from '../../components/Layout';
import { PageHeader } from '../../components/PageHeader';
import { RuleForm } from '../../components/manage-rules/RuleForm';
import { RulesTable } from '../../components/manage-rules/RulesTable';

export default function ManageRules() {
  const [rules, setRules] = useState([
    { code: 'CS101', name: 'Introduction to Programming', type: 'Standard' },
    { code: 'MATH201', name: 'Advanced Calculus', type: 'Custom' },
  ]);

  return (
    <Layout>
      <PageHeader title="Manage Course Rules" />
      <RuleForm />
      <h3 className="text-xl font-bold mb-4">Existing Rules</h3>
      <RulesTable rules={rules} />
    </Layout>
  );
}