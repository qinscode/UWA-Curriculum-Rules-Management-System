import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react'

const SortableItem = ({ id, content, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-center">
            <GripVertical className="mr-2 cursor-move" />
            <div className="flex-grow">{content}</div>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

const AdmissionsDnDComponent = () => {
  const [items, setItems] = useState([
    {
      id: '1',
      content: "A Bachelor's degree, or an equivalent qualification, as recognised by UWA;",
      children: [
        {
          id: '1a',
          content: 'the equivalent of a UWA weighted average mark of at least 50 per cent',
        },
        {
          id: '1b',
          content: 'at least two years professional experience in a relevant occupation;',
        },
      ],
    },
    {
      id: '2',
      content: 'Completed one of the following at UWA:',
      children: [
        { id: '2a', content: 'Graduate Certificate in Finance' },
        { id: '2b', content: 'Graduate Certificate in Human Resources and Employment Relations' },
        {
          id: '2c',
          content: 'Graduate Certificate in Business Information and Logistics Management',
        },
        { id: '2d', content: 'Graduate Certificate in Commerce' },
        { id: '2e', content: 'Graduate Certificate in Marketing' },
        { id: '2f', content: 'Graduate Certificate in Economics' },
      ],
    },
  ])

  const [expandedItems, setExpandedItems] = useState({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Admissions</h1>
      <div className="mb-4 flex space-x-4">
        <Select defaultValue="1, 2, 3">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level 1 style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1, 2, 3">1, 2, 3</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="a, b, c">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level 2 style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a, b, c">a, b, c</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="i, ii, iii">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level 3 style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="i, ii, iii">i, ii, iii</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary">Help</Button>
        <Button variant="secondary">Load Preset</Button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              content={
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(item.id)}
                    className="mr-2"
                  >
                    {expandedItems[item.id] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </Button>
                  {item.content}
                </div>
              }
            >
              {expandedItems[item.id] && item.children && (
                <div className="ml-6 mt-2">
                  {item.children.map((child) => (
                    <div key={child.id} className="mb-2">
                      {child.content}
                    </div>
                  ))}
                </div>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default AdmissionsDnDComponent
