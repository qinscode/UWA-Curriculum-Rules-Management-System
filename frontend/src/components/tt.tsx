import React, { useState } from 'react'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { Requirement, NumberingStyle } from '@/types'
import { Button } from '@/components/ui/button'

const initialRequirements: Requirement[] = [
  {
    id: 1,
    content: 'Root Requirement 1',
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 2,
        content: 'Child Requirement 1.1',
        style: NumberingStyle.Alphabetic,
        children: [
          {
            id: 6,
            content: 'Connector 1.1.1',
            style: NumberingStyle.None,
            isConnector: true,
            children: [],
          },
        ],
      },
      {
        id: 3,
        content: 'Child Requirement 1.2',
        style: NumberingStyle.Alphabetic,
        children: [
          {
            id: 4,
            content: 'Grandchild Requirement 1.2.1',
            style: NumberingStyle.Roman,
            children: [
              {
                id: 7,
                content: 'Connector 1.2.1.1',
                style: NumberingStyle.None,
                isConnector: true,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    content: 'Root Requirement 2',
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 8,
        content: 'Connector 2.1',
        style: NumberingStyle.None,
        isConnector: true,
        children: [],
      },
    ],
  },
]

const testData: Requirement[] = [
  {
    id: 606,
    content: 'English language eligibility requirements',
    style: NumberingStyle.Numeric,
    isConnector: false,
    children: [
      {
        id: 607,
        content:
          '123123English language eligibility requirementsEnglish language eligibility requirements',
        style: NumberingStyle.Numeric,
        isConnector: false,
        children: [],
      },
      {
        id: 629,
        content: ' e asEnglish language eligibility requirementsdasdasd',
        style: NumberingStyle.Numeric,
        isConnector: false,
        children: [],
      },
    ],
  },
]

export default function TestNestedRequirementsList() {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements)

  const handleUpdateRequirement = (updatedRequirements: Requirement[]) => {
    setRequirements(updatedRequirements)
    console.log('Updated requirements:', updatedRequirements)
  }

  const importTestData = () => {
    setRequirements(testData)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Test NestedRequirementsList</h1>
      <Button onClick={importTestData} className="mb-4">
        Import Test Data
      </Button>
      <NestedRequirementsList
        initialRequirements={requirements}
        onUpdate={handleUpdateRequirement}
      />
    </div>
  )
}
