import React, { useState, useCallback } from 'react'
import {
  PlusIcon,
  MinusIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/20/solid'
import { Disclosure, Transition, Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

type NumberingStyle = 'numeric' | 'alphabetic' | 'roman' | 'none'

// Updated interface for a single requirement
interface Requirement {
  id: number
  level: number
  content: string
  children: Requirement[]
  numberingStyle: NumberingStyle
}

const numberingStyles = {
  numeric: (index: number, level: number) => (level === 1 ? `${index + 1}` : `(${index + 1})`),
  alphabetic: (index: number, level: number) =>
    level === 1 ? String.fromCharCode(97 + index) : `(${String.fromCharCode(97 + index)})`,
  roman: (index: number, level: number) => {
    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
    return level === 1
      ? romanNumerals[index]
      : `(${romanNumerals[index] || (index + 1).toString()})`
  },
  none: () => '',
}

const styleOptions = [
  { value: 'numeric', label: '1, 2, 3' },
  { value: 'alphabetic', label: 'a, b, c' },
  { value: 'roman', label: 'i, ii, iii' },
  { value: 'none', label: 'No numbering' },
]

interface SelectMenuProps {
  value: NumberingStyle
  onChange: (value: NumberingStyle) => void
  options: { value: NumberingStyle; label: string }[]
}

const SelectMenu: React.FC<SelectMenuProps> = ({ value, onChange, options }) => {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <span className="block truncate">{selectedOption?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `${active ? 'bg-indigo-600 text-white' : 'text-gray-900'} relative cursor-default select-none py-2 pl-8 pr-4`
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span
                          className={`${active ? 'text-white' : 'text-indigo-600'} absolute inset-y-0 left-0 flex items-center pl-1.5`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}

const AdmissionRequirements: React.FC = () => {
  const [userRequirements, setUserRequirements] = useState<Requirement[]>([])
  const [showHelp, setShowHelp] = useState(false)

  // Preset rules with numbering styles
  const presetRules: Requirement[] = [
    {
      id: 1,
      level: 1,
      content: "A Bachelor's degree, or an equivalent qualification, as recognised by UWA;",
      children: [
        {
          id: 2,
          level: 2,
          content: 'the equivalent of a UWA weighted average mark of at least 50 per cent',
          children: [],
          numberingStyle: 'alphabetic',
        },
        {
          id: 3,
          level: 2,
          content: 'at least two years professional experience in a relevant occupation;',
          children: [],
          numberingStyle: 'alphabetic',
        },
      ],
      numberingStyle: 'numeric',
    },
    {
      id: 4,
      level: 1,
      content: 'Completed one of the following at UWA:',
      children: [
        {
          id: 5,
          level: 2,
          content: 'Graduate Certificate in Finance',
          children: [],
          numberingStyle: 'alphabetic',
        },
        {
          id: 6,
          level: 2,
          content: 'Graduate Certificate in Human Resources and Employment Relations',
          children: [],
          numberingStyle: 'alphabetic',
        },
        {
          id: 7,
          level: 2,
          content: 'Graduate Certificate in Business Information and Logistics Management',
          children: [],
          numberingStyle: 'alphabetic',
        },
        {
          id: 8,
          level: 2,
          content: 'Graduate Certificate in Commerce',
          children: [],
          numberingStyle: 'alphabetic',
        },
        {
          id: 9,
          level: 2,
          content: 'Graduate Certificate in Marketing',
          children: [],
          numberingStyle: 'alphabetic',
        },
        {
          id: 10,
          level: 2,
          content: 'Graduate Certificate in Economics',
          children: [],
          numberingStyle: 'alphabetic',
        },
      ],
      numberingStyle: 'numeric',
    },
  ]

  const addRequirement = (parentId: number | null = null, level = 1) => {
    const newRequirement: Requirement = {
      id: Date.now(),
      level,
      content: '',
      children: [],
      numberingStyle: level === 1 ? 'numeric' : 'alphabetic',
    }

    setUserRequirements((prevRequirements) => {
      if (!parentId) {
        return [...prevRequirements, newRequirement]
      }
      return updateNestedRequirements(prevRequirements, parentId, (parent) => ({
        ...parent,
        children: [...parent.children, newRequirement],
      }))
    })
  }

  const updateNestedRequirements = (
    reqs: Requirement[],
    id: number,
    updateFn: (req: Requirement) => Requirement
  ): Requirement[] => {
    return reqs.map((req) => {
      if (req.id === id) {
        return updateFn(req)
      }
      if (req.children.length > 0) {
        return {
          ...req,
          children: updateNestedRequirements(req.children, id, updateFn),
        }
      }
      return req
    })
  }

  const updateRequirement = (id: number, content: string) => {
    setUserRequirements((prevRequirements) =>
      updateNestedRequirements(prevRequirements, id, (req) => ({
        ...req,
        content,
      }))
    )
  }

  const updateNumberingStyle = (id: number, numberingStyle: NumberingStyle) => {
    setUserRequirements((prevRequirements) =>
      updateNestedRequirements(prevRequirements, id, (req) => ({
        ...req,
        numberingStyle,
      }))
    )
  }

  const removeRequirement = (id: number) => {
    setUserRequirements((prevRequirements) => {
      const removeNested = (reqs: Requirement[]): Requirement[] => {
        return reqs
          .filter((req) => req.id !== id)
          .map((req) => ({
            ...req,
            children: removeNested(req.children),
          }))
      }
      return removeNested(prevRequirements)
    })
  }

  const renderRequirement = useCallback(
    (req: Requirement, index: number, parentIndexes: number[] = []) => {
      const fullIndex = [...parentIndexes, index]
      const prefix = numberingStyles[req.numberingStyle](index, req.level)

      return (
        <div key={req.id} className="mb-2">
          <div className="flex items-center space-x-2">
            <span className="min-w-[30px] text-right font-semibold">{prefix}</span>
            <input
              type="text"
              value={req.content}
              onChange={(e) => updateRequirement(req.id, e.target.value)}
              className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter requirement"
            />
            <SelectMenu
              value={req.numberingStyle}
              onChange={(newStyle) => updateNumberingStyle(req.id, newStyle)}
              options={styleOptions}
            />
            <button
              onClick={() => removeRequirement(req.id)}
              className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
            >
              <MinusIcon className="h-5 w-5" />
            </button>
            {req.level < 3 && (
              <button
                onClick={() => addRequirement(req.id, req.level + 1)}
                className="p-2 text-green-600 hover:text-green-800 focus:outline-none"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          {req.children.length > 0 && (
            <div className="ml-8 mt-2">
              {req.children.map((child, childIndex) =>
                renderRequirement(child, childIndex, fullIndex)
              )}
            </div>
          )}
        </div>
      )
    },
    [updateRequirement, removeRequirement, addRequirement, updateNumberingStyle]
  )

  const loadPresetRules = () => {
    setUserRequirements(presetRules)
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-6 text-2xl font-bold">Admission Requirements</h2>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            title="Show Help"
          >
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </button>
          <button
            onClick={loadPresetRules}
            className="p-2 text-green-600 hover:text-green-800 focus:outline-none"
            title="Load Preset Rules"
          >
            <DocumentTextIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <Disclosure>
        <Transition
          show={showHelp}
          enter="transition duration-100 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Disclosure.Panel className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 text-lg font-semibold">How to use this tool:</h3>
            <ul className="list-inside list-disc">
              <li>Click "Add Main Requirement" to add a top-level requirement.</li>
              <li>Use the "+" button next to each requirement to add sub-requirements.</li>
              <li>Use the "-" button to remove a requirement and all its sub-requirements.</li>
              <li>Change the numbering style for each requirement using the dropdown.</li>
              <li>Click the document icon to load preset admission rules.</li>
            </ul>
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
      {userRequirements.map((req, index) => renderRequirement(req, index))}
      <button
        onClick={() => addRequirement()}
        className="mt-4 flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <PlusIcon className="mr-2 h-5 w-5" />
        Add Main Requirement
      </button>
    </div>
  )
}

export default AdmissionRequirements
