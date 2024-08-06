import { FC, ChangeEvent } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

const SearchInput: FC<SearchInputProps> = ({ value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div>
      <div className="relative mt-2 rounded-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="text"
          id="text"
          value={value}
          onChange={handleChange}
          className="block rounded-md border-none py-2 pl-10 text-sm text-gray-900 placeholder-gray-400 shadow-md ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
          placeholder="Search rules..."
        />
      </div>
    </div>
  )
}

export default SearchInput
