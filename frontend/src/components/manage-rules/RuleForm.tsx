import { useState } from 'react'
import { Select, SelectItem, Input, Textarea, Button } from '@nextui-org/react'

interface RuleFormProps {
  onSave: (rule: { code: string; name: string; type: string; description: string }) => void
}

export function RuleForm({ onSave }: RuleFormProps) {
  const [rule, setRule] = useState({ code: '', name: '', type: '', description: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(rule)
    setRule({ code: '', name: '', type: '', description: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <Select
        label="Select Course Type"
        placeholder="Select course type"
        value={rule.type}
        onChange={(e) => setRule({ ...rule, type: e.target.value })}
      >
        <SelectItem key="standard" value="standard">
          Standard
        </SelectItem>
        <SelectItem key="custom" value="custom">
          Custom
        </SelectItem>
      </Select>
      <Input
        label="Course Code"
        placeholder="Enter course code"
        value={rule.code}
        onChange={(e) => setRule({ ...rule, code: e.target.value })}
      />
      <Input
        label="Course Name"
        placeholder="Enter course name"
        value={rule.name}
        onChange={(e) => setRule({ ...rule, name: e.target.value })}
      />
      <Textarea
        label="Course Description"
        placeholder="Enter course description"
        value={rule.description}
        onChange={(e) => setRule({ ...rule, description: e.target.value })}
      />
      <Button color="primary" type="submit">
        Save Rule
      </Button>
    </form>
  )
}
