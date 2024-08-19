import { useHeTree, sortFlatData } from 'he-tree-react'
import { useState, useEffect } from 'react'
import { Requirement, NumberingStyle } from '@/types'
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react'

interface BasePageProps {
  initialData: Requirement[]
  onUpdateRequirement?: (
    value: ((prevState: Requirement[]) => Requirement[]) | Requirement[]
  ) => void
}

export default function BasePage({ initialData, onUpdateRequirement }: BasePageProps) {
  const keys = { idKey: 'id', parentIdKey: 'parent_id' }
  const [data, setData] = useState<any[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())

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

  const { renderTree, placeholder } = useHeTree({
    ...keys,
    data,
    dataType: 'flat',
    onChange: setData,
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
            <span className="flex-grow">{stat.node.name}</span>
          </div>
        )}
      </div>
    ),
  })

  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow-md">
      <h3 className="mb-4 text-xl font-semibold text-gray-700">Requirement Structure</h3>
      <div className="rounded-md bg-white p-4">
        {renderTree({
          className: `${placeholder ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`,
        })}
      </div>
    </div>
  )
}
