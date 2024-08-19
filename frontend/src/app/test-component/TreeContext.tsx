import React, { createContext, useContext, useCallback } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'

interface TreeContextType {
  refreshTree: () => void
  toggleConnector: (id: UniqueIdentifier) => void
}

const TreeContext = createContext<TreeContextType | undefined>(undefined)

export const useTreeContext = () => {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('useTreeContext must be used within a TreeProvider')
  }
  return context
}

interface TreeProviderProps {
  children: React.ReactNode
  onRefresh: () => void
  onToggleConnector: (id: UniqueIdentifier) => void
}

export const TreeProvider: React.FC<TreeProviderProps> = ({
  children,
  onRefresh,
  onToggleConnector,
}) => {
  const refreshTree = useCallback(() => {
    onRefresh()
  }, [onRefresh])

  const toggleConnector = useCallback(
    (id: UniqueIdentifier) => {
      onToggleConnector(id)
    },
    [onToggleConnector]
  )

  return (
    <TreeContext.Provider value={{ refreshTree, toggleConnector }}>{children}</TreeContext.Provider>
  )
}
