import React, { useState, useEffect } from 'react'
import { useRules } from '@/hooks/useRules'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Rule } from '@/types'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const { rules, isLoading } = useRules()
  const [filteredRules, setFilteredRules] = useState<Rule[]>([])

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRules([])
      return
    }

    const lowerSearchTerm = searchTerm.toLowerCase()
    const filtered = rules.filter(
      (rule: Rule) =>
        rule.code.toLowerCase().includes(lowerSearchTerm) ||
        rule.name.toLowerCase().includes(lowerSearchTerm) ||
        rule.type.toLowerCase().includes(lowerSearchTerm)
    )
    setFilteredRules(filtered)
  }, [searchTerm, rules])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }

  const handleSelectRule = (rule: Rule) => {
    setSearchTerm(`${rule.code} - ${rule.name}`)
    onChange(rule.id.toString())
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Search rules..."
      />
      {isOpen && filteredRules.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredRules.map((rule) => (
            <li key={rule.id}>
              <button
                onClick={() => handleSelectRule(rule)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSelectRule(rule)
                  }
                }}
                className="relative w-full cursor-default select-none py-2 pl-3 pr-9 text-left text-gray-900 hover:bg-indigo-600 hover:text-white"
                type="button"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {rule.code} - {rule.name}
                  </span>
                  <span className="text-sm text-gray-500">{rule.type}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {isLoading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-indigo-500"></div>
        </div>
      )}
    </div>
  )
}

export default SearchInput
