import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useHeTree, sortFlatData } from 'he-tree-react'
import { Requirement, NumberingStyle } from '@/types'
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  Plus,
  Trash,
  HelpCircle,
  ArrowDownLeft,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import HelpPanel from './HelpPanel'
import RequirementNumber from './RequirementNumber'
import { debounce } from 'lodash'

interface SortedTree {
  initialData: Requirement[]
  presetRequirements: Requirement[]
  onUpdateRequirement?: (
    value: ((prevState: Requirement[]) => Requirement[]) | Requirement[]
  ) => void
  onAddChildNode?: (parentId: number) => void
  showControls?: boolean
  showHelpPanel?: boolean
}

function generateMySQLCompatibleId(): number {
  return Math.floor(Math.random() * 2147483647) + 1
}

export default function SortedTree({
  initialData,
  presetRequirements,
  onUpdateRequirement,
  onAddChildNode,
  showControls = true,
  showHelpPanel = true,
}: SortedTree) {
  const keys = { idKey: 'id', parentIdKey: 'parent_id' }
  const [data, setData] = useState<any[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
  const [levelStyles, setLevelStyles] = useState<NumberingStyle[]>([
    NumberingStyle.Numeric,
    NumberingStyle.Alphabetic,
    NumberingStyle.Roman,
  ])
  const [showHelp, setShowHelp] = useState(false)
  const [connectorNodes, setConnectorNodes] = useState<Set<number>>(new Set())

  const dataRef = useRef(data)
  const connectorNodesRef = useRef(connectorNodes)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    connectorNodesRef.current = connectorNodes
  }, [connectorNodes])

  useEffect(() => {
    const flattenedData = flattenRequirements(initialData)
    setData(flattenedData)
    const initialConnectorNodes = new Set(
      flattenedData.filter((node) => node.is_connector).map((node) => node.id)
    )
    setConnectorNodes(initialConnectorNodes)

    const initialLevelStyles = getInitialLevelStyles(flattenedData)
    setLevelStyles(initialLevelStyles)
  }, [initialData])

  const handleAddRootNode = useCallback(() => {
    setData((prevData) => {
      const newNode = {
        id: generateMySQLCompatibleId(),
        parent_id: null,
        name: 'New Root Requirement',
        style: NumberingStyle.Numeric,
        is_connector: false,
        hasChildren: false,
      }
      const updatedData = [...prevData, newNode]
      if (onUpdateRequirement) {
        const requirements = convertDataToRequirements(updatedData)
        onUpdateRequirement(requirements)
      }
      return updatedData
    })
  }, [onUpdateRequirement])

  const handleLevelStyleChange = useCallback(
    (level: number, newStyle: NumberingStyle) => {
      setLevelStyles((prevStyles) => {
        const newStyles = [...prevStyles]
        newStyles[level] = newStyle
        return newStyles
      })

      setData((prevData) => {
        const updatedData = prevData.map((node) => {
          const nodeLevel = getNodeLevel(node, prevData)
          if (nodeLevel === level) {
            return { ...node, style: newStyle }
          }
          return node
        })

        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(updatedData)
          onUpdateRequirement(requirements)
        }

        return updatedData
      })
    },
    [onUpdateRequirement]
  )

  const debouncedHandleInputChange = useCallback(
    debounce((id: number, value: string) => {
      setData((prevData) => {
        const updatedData = prevData.map((node) =>
          node.id === id ? { ...node, name: value } : node
        )
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(updatedData)
          onUpdateRequirement(requirements)
        }
        return updatedData
      })
    }, 300),
    [onUpdateRequirement]
  )

  const handleInputChange = useCallback(
    (id: number, value: string) => {
      setData((prevData) =>
        prevData.map((node) => (node.id === id ? { ...node, name: value } : node))
      )
      debouncedHandleInputChange(id, value)
    },
    [debouncedHandleInputChange]
  )

  const handleDeleteNode = useCallback(
    (id: number) => {
      setData((prevData) => {
        const updatedData = prevData.filter((node) => node.id !== id && node.parent_id !== id)
        const sortedData = sortFlatData(updatedData, keys)

        // Update connectorNodes if necessary
        setConnectorNodes((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })

        // Call onUpdateRequirement with the updated data
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(sortedData)
          onUpdateRequirement(requirements)
        }

        return sortedData
      })
    },
    [keys, onUpdateRequirement]
  )

  // 修改 handleAddChildNode 函数
  const handleAddChildNode = useCallback(
    (parentId: number) => {
      if (onAddChildNode) {
        onAddChildNode(parentId)
      }
      setData((prevData) => {
        const newNode = {
          id: generateMySQLCompatibleId(),
          parent_id: parentId,
          name: 'New Requirement',
          style: NumberingStyle.Numeric,
          is_connector: false,
          hasChildren: false,
        }
        const updatedData = [...prevData, newNode]
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(updatedData)
          onUpdateRequirement(requirements)
        }
        return updatedData
      })
      setExpandedNodes((prev) => new Set(prev).add(parentId))
    },
    [onAddChildNode, onUpdateRequirement]
  )

  const toggleNode = useCallback((id: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const handleToggleConnector = useCallback(
    (id: number) => {
      setData((prevData) => {
        const updatedData = prevData.map((node) => {
          if (node.id === id) {
            const newNode = { ...node, is_connector: !node.is_connector }
            if (newNode.is_connector) {
              newNode.hasChildren = false
            }
            console.log(
              `Number: Toggle connector for node ID ${id}, is now ${newNode.is_connector}`
            )
            return newNode
          }
          return node
        })

        const sortedData = sortFlatData(updatedData, keys)

        const newConnectorNodes = new Set(connectorNodesRef.current)
        if (sortedData.find((node) => node.id === id)?.is_connector) {
          newConnectorNodes.add(id)
        } else {
          newConnectorNodes.delete(id)
        }
        console.log(`Number: Connector nodes set: ${Array.from(newConnectorNodes)}`)

        // Update connectorNodes and data in a single setState call
        setConnectorNodes(newConnectorNodes)

        // Call onUpdateRequirement with the updated data
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(sortedData)
          onUpdateRequirement(requirements)
        }

        return sortedData
      })
    },
    [keys, onUpdateRequirement]
  )

  const loadPresetRequirements = useCallback(() => {
    const flattenedData = flattenRequirements(presetRequirements)
    setData(flattenedData)
    if (onUpdateRequirement) {
      onUpdateRequirement(presetRequirements)
    }
  }, [presetRequirements, onUpdateRequirement])

  const flattenRequirements = useCallback(
    (requirements: Requirement[], parentId: number | null = null): any[] => {
      return requirements.reduce((acc: any[], req: Requirement) => {
        const flatNode = {
          id: req.id,
          parent_id: parentId,
          name: req.content,
          style: req.style || NumberingStyle.Numeric,
          is_connector: req.is_connector || false,
          hasChildren: req.children && req.children.length > 0,
        }
        acc.push(flatNode)
        if (req.children) {
          acc.push(...flattenRequirements(req.children, req.id))
        }
        return acc
      }, [])
    },
    []
  )

  const convertDataToRequirements = useCallback((flatData: any[]): Requirement[] => {
    const map = new Map<number, Requirement>()

    flatData.forEach((item) => {
      const requirement: Requirement = {
        id: item.id,
        content: item.name,
        style: item.style,
        children: [],
        is_connector: item.is_connector,
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
  }, [])

  const { renderTree, placeholder } = useHeTree({
    ...keys,
    data,
    dataType: 'flat',
    onChange: useCallback(
      (newData: any[]) => {
        const sortedData = sortFlatData(newData, keys)
        setData(sortedData)
        if (onUpdateRequirement) {
          const requirements = convertDataToRequirements(sortedData)
          onUpdateRequirement(requirements)
        }
      },
      [onUpdateRequirement, keys]
    ),
    renderNodeBox: ({ stat, attrs, isPlaceholder }) => (
      <div {...attrs} key={attrs.key} className="mb-2">
        {isPlaceholder ? (
          <div className="rounded-md border-2 border-dashed border-blue-400 bg-blue-100 p-2 text-sm text-blue-600">
            DROP HERE
          </div>
        ) : (
          <Card
            className={`transition-colors duration-200 ${
              stat.node.is_connector ? 'bg-blue-50' : ''
            }`}
          >
            <CardContent className="p-3">
              <div className="flex items-start p-2">
                <div className="m-2 flex items-center">
                  {stat.node.hasChildren && !stat.node.is_connector && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleNode(stat.node.id)}
                      className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {expandedNodes.has(stat.node.id) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </Button>
                  )}
                  <span
                    className="cursor-grab p-1 text-gray-400 hover:text-gray-600"
                    draggable={stat.draggable}
                  >
                    <GripVertical size={16} />
                  </span>
                  {stat.node.is_connector ? (
                    <Sparkles size={16} className="mr-2 text-blue-500" />
                  ) : (
                    <RequirementNumber
                      node={stat.node}
                      allNodes={data}
                      keys={keys}
                      levelStyles={levelStyles}
                      connectorNodes={connectorNodes}
                    />
                  )}
                </div>
                <Textarea
                  className="m-2 min-h-[2.5rem] flex-grow resize-y p-2"
                  value={stat.node.name}
                  onChange={(e) => handleInputChange(stat.node.id, e.target.value)}
                  rows={2}
                />
                <div className="ml-2 flex p-2">
                  {!stat.node.hasChildren && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleConnector(stat.node.id)}
                      className={`mr-1 ${
                        stat.node.is_connector ? 'bg-blue-100 text-blue-600' : ''
                      }`}
                    >
                      {stat.node.is_connector ? <ArrowRight size={16} /> : <Sparkles size={16} />}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteNode(stat.node.id)}
                    className="mr-1 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <Trash size={16} />
                  </Button>
                  {!stat.node.is_connector && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddChildNode(stat.node.id)}
                      className="text-green-500 hover:text-green-700 focus:outline-none"
                    >
                      <Plus size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    ),
  })

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {[0, 1, 2].map((level) => (
            <div key={level} className="flex flex-col">
              <Label htmlFor={`level-${level + 1}-style`} className="mb-2">
                Level {level + 1} Style
              </Label>
              <Select
                value={levelStyles[level]}
                onValueChange={(value: NumberingStyle) => handleLevelStyleChange(level, value)}
              >
                <SelectTrigger id={`level-${level + 1}-style`} className="w-[140px]">
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
          <Button
            variant="outline"
            size="icon"
            onClick={loadPresetRequirements}
            className="bg-blue-600 text-white hover:bg-blue-500"
          >
            <ArrowDownLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHelp(!showHelp)}
            className="bg-blue-600 text-white hover:bg-blue-500"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <HelpPanel showHelp={showHelp} />
      <div className="rounded-md bg-gray-50 p-4 shadow-inner">
        <Button className="mb-4 bg-blue-800 text-white hover:bg-black" onClick={handleAddRootNode}>
          Add Requirement
        </Button>
        {renderTree({
          className: `${placeholder ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`,
        })}
      </div>
    </div>
  )
}

const getNodeLevel = (node: any, allNodes: any[]): number => {
  let level = 0
  let currentNode = node
  while (currentNode.parent_id !== null) {
    level++
    currentNode = allNodes.find((n) => n.id === currentNode.parent_id)
    if (!currentNode) break
  }
  return level
}

function getInitialLevelStyles(flattenedData: any[]): NumberingStyle[] {
  const levelStyles: NumberingStyle[] = [
    NumberingStyle.Numeric,
    NumberingStyle.Alphabetic,
    NumberingStyle.Roman,
  ]

  flattenedData.forEach((node) => {
    const level = getNodeLevel(node, flattenedData)
    if (level < 3 && node.style !== levelStyles[level]) {
      levelStyles[level] = node.style
    }
  })

  return levelStyles
}
