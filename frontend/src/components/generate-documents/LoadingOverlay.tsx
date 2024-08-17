import React, { FC } from 'react'

const LoadingOverlay: FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <p className="text-lg font-semibold">Generating document...</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
