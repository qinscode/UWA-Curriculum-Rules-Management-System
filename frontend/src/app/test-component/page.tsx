'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import SortedTree from '@/components/manage-rules/common/SortedTree'
import { initialViableRequirementData } from './initialData'
import { Button } from '@/components/ui/button'
import { Requirement } from '@/types'

// Dynamically import the SortableTreeComponent to avoid SSR issues

const SortableTreePage: React.FC = () => {
  const [useRequirement, setUseRequirement] = React.useState(initialViableRequirementData)
  return (
    <div className="container mx-auto p-4">
      <main>
        <h1 className="mb-4 text-3xl font-bold">Sortable Tree Demo</h1>
        <Button
          className="mb-3"
          onClick={() => {
            console.log(useRequirement)
          }}
        >
          Print
        </Button>
        <SortedTree initialData={useRequirement} onUpdateRequirement={setUseRequirement} />
      </main>
    </div>
  )
}

export default SortableTreePage
