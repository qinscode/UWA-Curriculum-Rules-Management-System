'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import Layout from '@/components/Layout'
import { CreateRuleDTO, Rule, UpdateRuleDTO, RuleHistoryDto } from '@/types'
import RuleForm from '@/components/manage-rules/RuleForm'
import RuleTable from '@/components/manage-rules/RuleTable'
import Pagination from '@/components/manage-rules/Pagination'
import RuleHistory from '@/components/manage-rules/RuleHistory'
import { apiClient } from '@/lib/api-client'
import SearchInput from '@/components/manage-rules/SearchInput'
import Footer from '@/components/Footer'

const ManageRules: React.FC = () => {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [showHistory, setShowHistory] = useState<number | null>(null)
  const [ruleHistory, setRuleHistory] = useState<RuleHistoryDto[]>([])
  const pageSize = 10
  const ruleHistoryRef = useRef<HTMLDivElement>(null)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const { data, isLoading, error } = useQuery(
    ['rules', currentPage, searchTerm],
    () => apiClient.getRules(currentPage, pageSize, searchTerm),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  )

  const addRuleMutation = useMutation((newRule: CreateRuleDTO) => apiClient.addRule(newRule), {
    onSuccess: () => {
      queryClient.invalidateQueries('rules')
      setEditingRule(null)
    },
  })

  const updateRuleMutation = useMutation(
    ({ id, rule }: { id: number; rule: UpdateRuleDTO }) => apiClient.updateRule(id, rule),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules')
        setEditingRule(null)
      },
    }
  )

  const deleteRuleMutation = useMutation((id: number) => apiClient.deleteRule(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('rules')
    },
  })

  const handleSubmitRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRule) {
      if ('id' in editingRule) {
        const { id, ...updateData } = editingRule
        updateRuleMutation.mutate({ id, rule: updateData })
      } else {
        addRuleMutation.mutate(editingRule as CreateRuleDTO)
      }
    }
  }

  const handleDeleteRule = (id: number) => {
    deleteRuleMutation.mutate(id)
  }

  const handleShowHistory = async (id: number) => {
    try {
      const history = await apiClient.getRuleHistory(id)
      setRuleHistory(history)
      setShowHistory(id)
    } catch (err) {
      console.error('Failed to fetch rule history:', err)
    }
  }

  // This effect handles the scrolling behavior when the `showHistory` state changes.
  // When `showHistory` is not null, it waits for the DOM to update, then scrolls smoothly
  // to the element referenced by `ruleHistoryRef` after a short delay.
  useEffect(() => {
    if (showHistory !== null) {
      setTimeout(() => {
        ruleHistoryRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }, [showHistory])

  const handleRestoreVersion = async (ruleId: number, version: number) => {
    try {
      const restoredRule = await apiClient.restoreRuleVersion(ruleId, version)
      setEditingRule(restoredRule)
      setShowHistory(null)
      queryClient.invalidateQueries('rules')
    } catch (err) {
      console.error('Failed to restore rule version:', err)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (isLoading)
    return (
      <Layout>
        <div className="py-4 text-center">Loading...</div>
      </Layout>
    )
  if (error)
    return (
      <Layout>
        <div className="py-4 text-red-600">Error: {(error as Error).message}</div>
      </Layout>
    )

  const { rules, total } = data || { rules: [], total: 0 }
  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      <Layout>
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Manage Course Rules</h2>

        <div className="mb-8 bg-white shadow-lg sm:rounded-lg">
          <RuleForm
            rule={editingRule || { code: '', name: '', type: 'standard', description: '' }}
            setRule={(rule: Rule | CreateRuleDTO) => setEditingRule(rule as Rule)}
            handleSubmit={handleSubmitRule}
            isEditing={!!editingRule && 'id' in editingRule}
            cancelEdit={() => setEditingRule(null)}
          />
        </div>

        <SearchInput value={searchTerm} onChange={handleSearchChange} />

        <div className="mt-8 overflow-hidden bg-white shadow-lg sm:rounded-lg">
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
          <div ref={ruleHistoryRef}>
            <RuleHistory
              history={ruleHistory}
              onClose={() => setShowHistory(null)}
              onRestore={handleRestoreVersion}
            />
          </div>
        )}
      </Layout>
      <Footer />
    </>
  )
}

export default ManageRules
