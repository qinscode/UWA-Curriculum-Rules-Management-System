import { useState, FC } from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Rule } from '../../types'

interface RuleFormProps {
  onSave: (rule: Omit<Rule, 'id'>) => void
}

const RuleForm: FC<RuleFormProps> = ({ onSave }) => {
  const [rule, setRule] = useState<Omit<Rule, 'id'>>({
    code: '',
    name: '',
    type: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(rule)
    setRule({ code: '', name: '', type: '', description: '' })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-4 shadow sm:rounded-lg">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                  Course Type
                </label>
                <div className="mt-2">
                  <select
                    id="type"
                    name="type"
                    value={rule.type}
                    onChange={(e) => setRule({ ...rule, type: e.target.value })}
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select course type</option>
                    <option value="standard">Standard</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                  Course Code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={rule.code}
                    onChange={(e) => setRule({ ...rule, code: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Course Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={rule.name}
                    onChange={(e) => setRule({ ...rule, name: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Course Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={rule.description}
                    onChange={(e) => setRule({ ...rule, description: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <UserCircleIcon aria-hidden="true" className="h-12 w-12 text-gray-300" />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  )
}

export default RuleForm
