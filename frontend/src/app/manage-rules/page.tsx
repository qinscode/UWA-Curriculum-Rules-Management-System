import React from 'react'
import { redirect } from 'next/navigation'
import ManageRules from '@/components/ManageRules'

export const metadata = {
  title: 'Manage Rules',
}

export default function ManageRulesPage({
  searchParams,
}: {
  searchParams: { code?: string; version?: string }
}) {
  const { code, version } = searchParams

  if (!code || !version) {
    redirect('/manage-course')
  }

  return <ManageRules courseCode={code} version={version} />
}
