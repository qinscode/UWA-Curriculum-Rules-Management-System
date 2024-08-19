import { useHeTree, sortFlatData } from 'he-tree-react'
import React, { useState, useEffect } from 'react'
import { Requirement, NumberingStyle } from '@/types'
import { ChevronRight, ChevronDown, GripVertical, Plus, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import RequirementNumber from './RequirementNumber'

interface BasePageProps {
  initialData: Requirement[]
  onUpdateRequirement?: (
    value: ((prevState: Requirement[]) => Requirement[]) | Requirement[]
  ) => void
  onAddChildNode?: (parentId: number) => void
}

export default function BasePage({
  initialData,
  onUpdateRequirement,
  onAddChildNode,
}: BasePageProps) {
  const keys = { idKey: 'id', parentIdKey: 'parent_id' }
  const [data, setData] = useState<any[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())

  const handleAddRootNode = () => {
    setData((prevData) => {
      const newNode = {
        id: Date.now(),
        parent_id: null, // 一级节点的 parent_id 为 null
        name: 'New Root Requirement',
        style: NumberingStyle.None,
        isConnector: false,
        hasChildren: false,
      }
      const updatedData = [...prevData, newNode]
      setTimeout(() => {
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(updatedData)
          onUpdateRequirement(requirements)
        }
      }, 0)
      return updatedData
    })
  }

  useEffect(() => {
    const flattenData = (items: Requirement[], parentId: number | null = null): any[] => {
      return items.reduce((acc: any[], item: Requirement) => {
        acc.push({
          id: item.id,
          parent_id: parentId,
          name: item.content,
          style: item.style,
          isConnector: item.isConnector,
          hasChildren: item.children && item.children.length > 0,
        })
        if (item.children && item.children.length > 0) {
          acc.push(...flattenData(item.children, item.id))
        }
        return acc
      }, [])
    }

    const flatData = flattenData(initialData)
    setData(sortFlatData(flatData, keys))
  }, [initialData])

  function convertDataToRequirements(flatData: any[]): Requirement[] {
    const map = new Map<number, Requirement[]>()

    flatData.forEach((item) => {
      if (!map.has(item.parent_id)) {
        map.set(item.parent_id, [])
      }
      const requirement: Requirement = {
        id: item.id,
        content: item.name,
        style: item.style,
        children: [],
        isConnector: item.isConnector,
      }
      map.get(item.parent_id)!.push(requirement)
    })

    function buildTree(parentId: number | null): Requirement[] {
      return (map.get(parentId as number) || []).map((requirement) => {
        requirement.children = buildTree(requirement.id)
        return requirement
      })
    }

    return buildTree(null)
  }

  const toggleNode = (id: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleInputChange = (id: number, value: string) => {
    setData((prevData) => {
      const updatedData = prevData.map((node) => (node.id === id ? { ...node, name: value } : node))
      setTimeout(() => {
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(updatedData)
          onUpdateRequirement(requirements)
        }
      }, 0)
      return updatedData
    })
  }

  const handleDeleteNode = (id: number) => {
    setData((prevData) => {
      const updatedData = prevData.filter((node) => node.id !== id && node.parent_id !== id)
      setTimeout(() => {
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(updatedData)
          onUpdateRequirement(requirements)
        }
      }, 0)
      return updatedData
    })
  }

  const handleAddChildNode = (parentId: number) => {
    if (onAddChildNode) {
      onAddChildNode(parentId)
    }
    setData((prevData) => {
      const newNode = {
        id: Date.now(),
        parent_id: parentId,
        name: 'New Requirement',
        style: NumberingStyle.None,
        isConnector: false,
        hasChildren: false,
      }
      const updatedData = [...prevData, newNode]
      setTimeout(() => {
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(updatedData)
          onUpdateRequirement(requirements)
        }
      }, 0)
      return updatedData
    })
    setExpandedNodes((prev) => new Set(prev).add(parentId)) // 展开新添加子节点的父节点
  }

  const { renderTree, placeholder } = useHeTree({
    ...keys,
    data,
    dataType: 'flat',
    onChange: (newData) => {
      const sortedData = sortFlatData(newData, keys)
      setData(sortedData)
      if (onUpdateRequirement) {
        const requirements = convertDataToRequirements(sortedData)
        onUpdateRequirement(requirements)
      }
    },
    renderNodeBox: ({ stat, attrs, isPlaceholder }) => (
      <div {...attrs} key={attrs.key} className="mb-2">
        {isPlaceholder ? (
          <div className="rounded-md border-2 border-dashed border-blue-400 bg-blue-100 p-2 text-sm text-blue-600">
            DROP HERE
          </div>
        ) : (
          <div
            className={`flex items-center rounded-md border p-2 transition-colors duration-200 ${
              stat.node.isConnector
                ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            } ${stat.node.hasChildren ? 'font-semibold' : 'font-normal'}`}
          >
            {stat.node.hasChildren && (
              <button
                onClick={() => toggleNode(stat.node.id)}
                className="mr-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {expandedNodes.has(stat.node.id) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}
            <span
              className="mr-2 cursor-grab text-gray-400 hover:text-gray-600"
              draggable={stat.draggable}
            >
              <GripVertical size={16} />
            </span>
            <RequirementNumber
              node={stat.node}
              allNodes={data}
              keys={keys}
              style={NumberingStyle.Numeric} // Default style, you can change this if needed
            />
            <Input
              className="flex-grow"
              value={stat.node.name}
              onChange={(e) => handleInputChange(stat.node.id, e.target.value)}
            />
            <button
              className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => handleDeleteNode(stat.node.id)}
            >
              <Trash size={16} />
            </button>
            <button
              className="ml-2 text-green-500 hover:text-green-700 focus:outline-none"
              onClick={() => handleAddChildNode(stat.node.id)}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    ),
  })
  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow-md">
      <div className="rounded-md p-4">
        <button
          className="mb-4 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
          onClick={handleAddRootNode}
        >
          Add Root Node
        </button>
        {renderTree({
          className: `${placeholder ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`,
        })}
      </div>
    </div>
  )
}
