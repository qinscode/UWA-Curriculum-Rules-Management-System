import React from 'react'
import { Disclosure, Transition } from '@headlessui/react'

interface HelpPanelProps {
  showHelp: boolean
}

const HelpPanel: React.FC<HelpPanelProps> = ({ showHelp }) => {
  return (
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
            <li>Change the numbering style for each level using the dropdowns.</li>
            <li>Click the document icon to load preset admission rules.</li>
          </ul>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  )
}

export default HelpPanel
