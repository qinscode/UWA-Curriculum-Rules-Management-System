import { useState } from 'react'
import { Select, SelectItem, Button } from '@nextui-org/react'

interface CoursePDFGeneratorProps {
  onGenerate: (courseId: string) => Promise<void>
  isGenerating: boolean
}

export function CoursePDFGenerator({ onGenerate, isGenerating }: CoursePDFGeneratorProps) {
  const [selectedCourse, setSelectedCourse] = useState('')

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
          <SelectItem key="CS101" value="CS101">
            CS101 - Introduction to Programming
          </SelectItem>
          <SelectItem key="MATH201" value="MATH201">
            MATH201 - Advanced Calculus
          </SelectItem>
          {/* Add more courses as needed */}
        </Select>
        <Button color="primary" onClick={handleGenerate} disabled={isGenerating || !selectedCourse}>
          Generate Course PDF
        </Button>
      </div>
    </div>
  )
}
