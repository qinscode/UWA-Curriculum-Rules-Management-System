import { useState } from 'react'

const NumberedTextArea = ({ value, onChange }) => {
  const [items, setItems] = useState(value ? value.split('\n') : [''])

  const handleChange = (index, newValue) => {
    const newItems = [...items]
    newItems[index] = newValue
    setItems(newItems)
    onChange(newItems.join('\n'))
  }

  const addItem = () => {
    setItems([...items, ''])
  }

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    onChange(newItems.join('\n'))
  }

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="mb-2 flex items-center">
          <select
            className="mr-2 rounded-md border-gray-300"
            value={item.split(' ')[0]}
            onChange={(e) =>
              handleChange(index, `${e.target.value} ${item.split(' ').slice(1).join(' ')}`)
            }
          >
            <option value="">#</option>
            <option value="(1)">(1)</option>
            <option value="(2)">(2)</option>
            <option value="(a)">(a)</option>
            <option value="(b)">(b)</option>
            <option value="(c)">(c)</option>
          </select>
          <input
            type="text"
            value={item.split(' ').slice(1).join(' ')}
            onChange={(e) => handleChange(index, `${item.split(' ')[0]} ${e.target.value}`)}
            className="flex-grow rounded-md ring-1 ring-inset ring-gray-300"
          />
          <button onClick={() => removeItem(index)} className="ml-2 text-red-500">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addItem} className="mt-2 text-blue-500">
        Add Item
      </button>
    </div>
  )
}

export default NumberedTextArea
