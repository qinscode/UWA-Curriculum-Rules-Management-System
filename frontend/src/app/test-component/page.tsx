'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'

// Dynamically import the SortableTreeComponent to avoid SSR issues
const SortableTreeComponent = dynamic(() => import('./SortableTreeComponent'), {
  ssr: false,
})

const SortableTreePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Sortable Tree Demo</title>
        <meta name="description" content="A demo of the Sortable Tree component" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="mb-4 text-3xl font-bold">Sortable Tree Demo</h1>
        <SortableTreeComponent />
      </main>
    </div>
  )
}

export default SortableTreePage
