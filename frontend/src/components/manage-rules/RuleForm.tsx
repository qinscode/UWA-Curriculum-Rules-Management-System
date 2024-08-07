import React from 'react'
import { PlusCircle } from 'lucide-react'
import SelectMenu from '@/components/SelectMenu'
import { CreateRuleDTO, Rule } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RuleFormProps {
  rule: CreateRuleDTO | Rule
  setRule: (rule: CreateRuleDTO | Rule) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  isEditing: boolean
  cancelEdit?: () => void
}

const RuleForm: React.FC<RuleFormProps> = ({
  rule,
  setRule,
  handleSubmit,
  isEditing,
  cancelEdit,
}) => {
  const updateRule = (field: keyof (CreateRuleDTO & Rule), value: string) => {
    setRule({ ...rule, [field]: value })
  }

  const RuleSection = ({ number }: { number: number }) => (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Rule {number}</CardTitle>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Import Base Rule
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          id={`rule${number}`}
          value={rule.description}
          onChange={(e) => updateRule('description', e.target.value)}
          className="mt-2"
          rows={3}
        />
      </CardContent>
    </Card>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Course Code
          </label>
          <Input
            type="text"
            name="code"
            id="code"
            value={rule.code}
            onChange={(e) => updateRule('code', e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Course Name
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            value={rule.name}
            onChange={(e) => updateRule('name', e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-3">
          <SelectMenu
            label="Course Type"
            value={rule.type}
            onChange={(value) => updateRule('type', value)}
            options={[
              { value: 'option', label: 'Option' },
              { value: 'conversion', label: 'Conversion' },
              { value: 'core', label: 'Core' },
            ]}
          />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="version" className="block text-sm font-medium text-gray-700">
            Version Information
          </label>
          <Input type="text" name="version" id="version" className="mt-1" />
        </div>
      </div>

      <RuleSection number={1} />
      <RuleSection number={2} />
      <RuleSection number={3} />

      <div className="mt-6 flex items-center justify-end gap-x-6">
        {isEditing && cancelEdit && (
          <Button variant="ghost" onClick={cancelEdit}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="default">
          {isEditing ? 'Update Rule' : 'Add Rule'}
        </Button>
      </div>
    </form>
  )
}

export default RuleForm
