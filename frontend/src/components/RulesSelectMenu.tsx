import React from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { StyleOption } from '@/types'

interface SelectMenuProps {
  value: string
  onChange: (value: string) => void
  options: StyleOption[]
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
                    `${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    } relative cursor-default select-none py-2 pl-8 pr-4`
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
                          className={`${
                            active ? 'text-white' : 'text-indigo-600'
                          } absolute inset-y-0 left-0 flex items-center pl-1.5`}
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

export default SelectMenu
