'use client'
import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the SortableTreeComponent to avoid SSR issues
const SortableTreeComponent = dynamic(() => import('./SortableTreeComponent'), {
  ssr: false,
})

const SortableTreePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <main>
        <h1 className="mb-4 text-3xl font-bold">Sortable Tree Demo</h1>
        <SortableTreeComponent />
      </main>
    </div>
  )
}

export default SortableTreePage
