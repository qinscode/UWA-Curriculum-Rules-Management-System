'use client'
import React, { useState, useRef, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useRules } from '@/hooks/useRules'
import { CreateRuleDTO, Rule, UpdateRuleDTO, RuleHistoryDto } from '@/types'
import SearchForm from '@/components/manage-rules/SearchForm'
import RuleForm from '@/components/manage-rules/RuleForm'
import RuleTable from '@/components/manage-rules/RuleTable'
import Pagination from '@/components/manage-rules/Pagination'
import RuleHistory from '@/components/manage-rules/RuleHistory'

const ManageRules: React.FC = () => {
  const {
    rules,
    isLoading,
    error,
    addRule,
    updateRule,
    deleteRule,
    fetchRuleHistory,
    restoreRuleVersion,
    totalRules,
    currentPage,
    changePage,
    searchTerm,
    setSearchTerm,
    pageSize,
    fetchRules,
  } = useRules()

  const [newRule, setNewRule] = useState<CreateRuleDTO>({
    code: '',
    name: '',
    type: 'standard',
    description: '',
  })
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [showHistory, setShowHistory] = useState<number | null>(null)
  const [ruleHistory, setRuleHistory] = useState<RuleHistoryDto[]>([])
  const historyRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    changePage(1) // Reset to first page when searching
    fetchRules()
  }

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addRule(newRule)
      setNewRule({ code: '', name: '', type: 'standard', description: '' })
      fetchRules()
    } catch (err) {
      console.error('Failed to add rule:', err)
    }
  }

  const handleUpdateRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRule) {
      try {
        await updateRule(editingRule.id, editingRule)
        setEditingRule(null)
        fetchRules()
      } catch (err) {
        console.error('Failed to update rule:', err)
      }
    }
  }

  const handleDeleteRule = async (id: number) => {
    try {
      await deleteRule(id)
      fetchRules()
    } catch (err) {
      console.error('Failed to delete rule:', err)
    }
  }

  const handleShowHistory = async (id: number) => {
    try {
      const history = await fetchRuleHistory(id)
      setRuleHistory(history)
      setShowHistory(id)
      setTimeout(() => {
        historyRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error('Failed to fetch rule history:', err)
    }
  }

  const handleRestoreVersion = async (ruleId: number, version: number) => {
    try {
      const restoredRule = await restoreRuleVersion(ruleId, version)
      setEditingRule(restoredRule)
      setShowHistory(null)
      fetchRules()
    } catch (err) {
      console.error('Failed to restore rule version:', err)
    }
  }

  const handlePageChange = (newPage: number) => {
    changePage(newPage)
    fetchRules()
  }

  const totalPages = Math.ceil(totalRules / pageSize)

  if (isLoading)
    return (
      <Layout>
        <div className="py-4 text-center">Loading...</div>
      </Layout>
    )
  if (error)
    return (
      <Layout>
        <div className="py-4 text-red-600">Error: {error}</div>
      </Layout>
    )

  return (
    <Layout>
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Manage Course Rules</h2>

      <SearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />

      <div className="mb-8 bg-white shadow-lg sm:rounded-lg">
        <RuleForm
          rule={editingRule || newRule}
          setRule={
            (editingRule ? setEditingRule : setNewRule) as (rule: Rule | CreateRuleDTO) => void
          }
          handleSubmit={editingRule ? handleUpdateRule : handleAddRule}
          isEditing={!!editingRule}
          cancelEdit={() => setEditingRule(null)}
        />
      </div>

      <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg">
        <RuleTable
          rules={rules}
          onEdit={setEditingRule}
          onDelete={handleDeleteRule}
          onShowHistory={handleShowHistory}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {showHistory !== null && (
        <div ref={historyRef}>
          <RuleHistory
            history={ruleHistory}
            onClose={() => setShowHistory(null)}
            onRestore={handleRestoreVersion}
          />
        </div>
      )}
    </Layout>
  )
}

export default ManageRules
