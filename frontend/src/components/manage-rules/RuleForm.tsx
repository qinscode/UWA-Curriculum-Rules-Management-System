import React from 'react'
import SelectMenu from '@/components/SelectMenu'
import { CreateRuleDTO, Rule } from '@/types'

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
            Course Code
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="code"
              id="code"
              value={rule.code}
              onChange={(e) => updateRule('code', e.target.value)}
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            Course Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              value={rule.name}
              onChange={(e) => updateRule('name', e.target.value)}
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <SelectMenu
            label="Course Type"
            value={rule.type}
            onChange={(value) => updateRule('type', value)}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
        </div>
        <div className="col-span-full">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={rule.description}
              onChange={(e) => updateRule('description', e.target.value)}
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {isEditing && cancelEdit && (
          <button
            type="button"
            onClick={cancelEdit}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isEditing ? 'Update Rule' : 'Add Rule'}
        </button>
      </div>
    </form>
  )
}

export default RuleForm
