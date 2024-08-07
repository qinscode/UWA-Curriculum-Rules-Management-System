import { useState, useCallback } from 'react'
import { apiClient } from '../lib/api-client'

export function useDocuments() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCoursePDF = useCallback(async (courseId: string) => {
    try {
      setIsGenerating(true)
      const response = await apiClient.generateCoursePDF(courseId)
      window.open(response.url, '_blank')
    } catch (err) {
      setError('Failed to generate course PDF')
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const generateHandbook = useCallback(async () => {
    try {
      setIsGenerating(true)
      const response = await apiClient.generateHandbook()
      window.open(response.url, '_blank')
    } catch (err) {
      setError('This function is not implemented yet')
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const exportRules = useCallback(async () => {
    try {
      setIsGenerating(true)
      const response = await apiClient.exportRules()
      window.open(response.url, '_blank')
    } catch (err) {
      setError('This function is not implemented yet')
      throw err
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return { isGenerating, error, generateCoursePDF, generateHandbook, exportRules }
}
