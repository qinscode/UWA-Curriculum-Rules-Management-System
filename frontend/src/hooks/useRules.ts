import { useState, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Rule, CreateRuleDTO, UpdateRuleDTO } from '@/types'

export function useRules() {
  const [rules, setRules] = useState<Rule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRules, setTotalRules] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize] = useState(10)

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true)
      const { rules: fetchedRules, total } = await apiClient.getRules(
        currentPage,
        pageSize,
        searchTerm
      )
      setRules(fetchedRules)
      setTotalRules(total)
      setError(null)
    } catch (err) {
      setError('Failed to fetch rules')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, searchTerm])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  const addRule = useCallback(async (rule: CreateRuleDTO) => {
    try {
      const newRule = await apiClient.addRule(rule)
      setRules((prevRules) => [...prevRules, newRule])
      setTotalRules((prevTotal) => prevTotal + 1)
      return newRule
    } catch (err) {
      setError('Failed to add rule')
      throw err
    }
  }, [])

  const updateRule = useCallback(async (id: number, rule: UpdateRuleDTO) => {
    try {
      const updatedRule = await apiClient.updateRule(id, rule)
      setRules((prevRules) => prevRules.map((r) => (r.id === id ? updatedRule : r)))
      return updatedRule
    } catch (err) {
      setError('Failed to update rule')
      throw err
    }
  }, [])

  const deleteRule = useCallback(async (id: number) => {
    try {
      await apiClient.deleteRule(id)
      setRules((prevRules) => prevRules.filter((rule) => rule.id !== id))
      setTotalRules((prevTotal) => prevTotal - 1)
    } catch (err) {
      setError('Failed to delete rule')
      throw err
    }
  }, [])

  const restoreRuleVersion = useCallback(async (id: number, version: number) => {
    try {
      const restoredRule = await apiClient.restoreRuleVersion(id, version)
      setRules((prevRules) => prevRules.map((r) => (r.id === id ? restoredRule : r)))
      return restoredRule
    } catch (err) {
      setError('Failed to restore rule version')
      throw err
    }
  }, [])

  const changePage = useCallback((newPage: number) => {
    setCurrentPage(newPage)
  }, [])

  return {
    rules,
    isLoading,
    error,
    totalRules,
    currentPage,
    changePage,
    searchTerm,
    setSearchTerm,
    pageSize,
    fetchRules,
    addRule,
    updateRule,
    deleteRule,
    restoreRuleVersion,
  }
}
