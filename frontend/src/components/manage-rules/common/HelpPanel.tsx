import React from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
        <Disclosure.Panel>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>How to use this tool:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-1">
                <li>Click "Add Main Requirement" to add a top-level requirement.</li>
                <li>Use the "+" button next to each requirement to add sub-requirements.</li>
                <li>Use the "-" button to remove a requirement and all its sub-requirements.</li>
                <li>Change the numbering style for each level using the dropdowns.</li>
                <li>Click the document icon to load preset admission rules.</li>
              </ul>
            </CardContent>
          </Card>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  )
}

export default HelpPanel
