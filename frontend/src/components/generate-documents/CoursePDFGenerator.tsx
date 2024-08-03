import { useEffect, useState } from 'react'
import { Select, SelectItem, Button } from '@nextui-org/react'
import { apiClient } from '@/lib/api-client'
import { Rule } from '@/types'

interface CoursePDFGeneratorProps {
  onGenerate: (courseId: string) => Promise<void>
  isGenerating: boolean
}

export function CoursePDFGenerator({ onGenerate, isGenerating }: CoursePDFGeneratorProps) {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [rules, setRules] = useState<Rule[]>([])

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const data = await apiClient.getRules()
        setRules(data)
      } catch (error) {
        console.error('Failed to fetch rules:', error)
      }
    }

    fetchRules()
  }, [])

  const handleGenerate = () => {
    if (selectedCourse) {
      onGenerate(selectedCourse)
    }
  }

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Generate PDF for Specific Course</h3>
      <div className="flex space-x-2">
        <Select
          label="Select a course"
          placeholder="Choose a course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="flex-grow"
        >
          {rules.map((rule) => (
            <SelectItem key={rule.id} value={rule.id.toString()}>
              {rule.code} - {rule.name}
            </SelectItem>
          ))}
        </Select>
        <Button color="primary" onClick={handleGenerate} disabled={isGenerating || !selectedCourse}>
          Generate Course PDF
        </Button>
      </div>
    </div>
  )
}
