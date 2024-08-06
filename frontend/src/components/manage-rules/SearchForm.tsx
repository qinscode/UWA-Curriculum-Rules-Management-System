import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

interface SearchFormProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleSearch: (e: React.FormEvent) => void
}

const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, setSearchTerm, handleSearch }) => (
  <form onSubmit={handleSearch} className="mb-4">
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by CODE"
        className="w-full rounded-md border-gray-300 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
    </div>
  </form>
)

export default SearchForm
