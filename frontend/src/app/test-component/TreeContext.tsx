import React, { createContext, useContext, useCallback } from 'react'
import { TreeItems } from 'dnd-kit-sortable-tree'
import { TreeItemAdapter } from './types'

interface TreeContextType {
  refreshTree: () => void
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
}

export const TreeProvider: React.FC<TreeProviderProps> = ({ children, onRefresh }) => {
  const refreshTree = useCallback(() => {
    onRefresh()
  }, [onRefresh])

  return <TreeContext.Provider value={{ refreshTree }}>{children}</TreeContext.Provider>
}
