import React, { useState, useEffect } from 'react'
import { useHeTree, sortFlatData } from 'he-tree-react'
import { Requirement, NumberingStyle } from '@/types'
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Plus,
  Trash,
  HelpCircle,
  FileText,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import RequirementNumber from './RequirementNumber'

interface BasePageProps {
  initialData: Requirement[]
  presetRequirements: Requirement[]
  onUpdateRequirement?: (
    value: ((prevState: Requirement[]) => Requirement[]) | Requirement[]
  ) => void
  onAddChildNode?: (parentId: number) => void
}

export default function BasePage({
  initialData,
  presetRequirements,
  onUpdateRequirement,
  onAddChildNode,
}: BasePageProps) {
  const keys = { idKey: 'id', parentIdKey: 'parent_id' }
  const [data, setData] = useState<any[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
  const [levelStyles, setLevelStyles] = useState<NumberingStyle[]>([
    NumberingStyle.Numeric,
    NumberingStyle.Alphabetic,
    NumberingStyle.Roman,
  ])

  useEffect(() => {
    const flattenedData = flattenRequirements(initialData)
    setData(flattenedData)
  }, [initialData])

  const handleAddRootNode = () => {
    setData((prevData) => {
      const newNode = {
        id: Date.now(),
        parent_id: null,
        name: 'New Root Requirement',
        style: NumberingStyle.Numeric,
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

  const handleLevelStyleChange = (level: number, newStyle: NumberingStyle) => {
    setLevelStyles((prevStyles) => {
      const newStyles = [...prevStyles]
      newStyles[level] = newStyle
      return newStyles
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
        style: NumberingStyle.Numeric,
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
    setExpandedNodes((prev) => new Set(prev).add(parentId))
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

  const loadPresetRequirements = () => {
    const flattenedData = flattenRequirements(presetRequirements)
    setData(flattenedData)
    if (onUpdateRequirement) {
      onUpdateRequirement(presetRequirements)
    }
  }

  const flattenRequirements = (
    requirements: Requirement[],
    parentId: number | null = null
  ): any[] => {
    return requirements.reduce((acc: any[], req: Requirement) => {
      const flatNode = {
        id: req.id,
        parent_id: parentId,
        name: req.content,
        style: req.style || NumberingStyle.Numeric,
        isConnector: req.isConnector || false,
        hasChildren: req.children && req.children.length > 0,
      }
      acc.push(flatNode)
      if (req.children) {
        acc.push(...flattenRequirements(req.children, req.id))
      }
      return acc
    }, [])
  }

  const convertDataToRequirements = (flatData: any[]): Requirement[] => {
    const map = new Map<number, Requirement>()

    flatData.forEach((item) => {
      const requirement: Requirement = {
        id: item.id,
        content: item.name,
        style: item.style,
        children: [],
        isConnector: item.isConnector,
      }
      map.set(item.id, requirement)
    })

    const rootRequirements: Requirement[] = []

    flatData.forEach((item) => {
      const requirement = map.get(item.id)
      if (requirement) {
        if (item.parent_id === null) {
          rootRequirements.push(requirement)
        } else {
          const parent = map.get(item.parent_id)
          if (parent) {
            parent.children = parent.children || []
            parent.children.push(requirement)
          }
        }
      }
    })

    return rootRequirements
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
              levelStyles={levelStyles}
            />
            <Input
              className="mr-2 flex-grow"
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
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-4">
          {[0, 1, 2].map((level) => (
            <div key={level} className="flex flex-col">
              <Label htmlFor={`level-${level + 1}-style`} className="mb-2">
                Level {level + 1} Style
              </Label>
              <Select
                value={levelStyles[level]}
                onValueChange={(value: NumberingStyle) => handleLevelStyleChange(level, value)}
              >
                <SelectTrigger id={`level-${level + 1}-style`} className="w-[180px]">
                  <SelectValue placeholder={`Select style`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NumberingStyle.Numeric}>Numeric</SelectItem>
                  <SelectItem value={NumberingStyle.Alphabetic}>Alphabetic</SelectItem>
                  <SelectItem value={NumberingStyle.Roman}>Roman</SelectItem>
                  <SelectItem value={NumberingStyle.None}>None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Help Information</DialogTitle>
                <DialogDescription>
                  This tool allows you to create and manage hierarchical requirements.
                  <ul className="mt-2 list-inside list-disc">
                    <li>Use the "Add Root Node" button to create top-level requirements.</li>
                    <li>Click the "+" button on any node to add a child requirement.</li>
                    <li>Use the drag handle to reorder requirements.</li>
                    <li>Select different numbering styles for each level using the dropdowns.</li>
                    <li>Click the preset button to load a set of predefined requirements.</li>
                  </ul>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={loadPresetRequirements}>
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </div>
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
