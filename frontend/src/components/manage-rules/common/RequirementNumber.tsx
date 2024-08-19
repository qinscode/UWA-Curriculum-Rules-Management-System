import React from 'react'
import { NumberingStyle } from '@/types'

interface RequirementNumberProps {
  node: any
  allNodes: any[]
  keys: { idKey: string; parentIdKey: string }
  style: NumberingStyle
}

const RequirementNumber: React.FC<RequirementNumberProps> = ({ node, allNodes, keys, style }) => {
  // Convert a number to the specified numbering style
  const getNumber = (num: number, style: NumberingStyle): string => {
    switch (style) {
      case NumberingStyle.Numeric:
        return num.toString()
      case NumberingStyle.Alphabetic:
        return String.fromCharCode(96 + num).toUpperCase()
      case NumberingStyle.Roman:
        return toRoman(num)
      default:
        return ''
    }
  }

  // Convert a number to Roman numerals
  const toRoman = (num: number): string => {
    const romanNumerals = [
      { value: 1000, symbol: 'M' },
      { value: 900, symbol: 'CM' },
      { value: 500, symbol: 'D' },
      { value: 400, symbol: 'CD' },
      { value: 100, symbol: 'C' },
      { value: 90, symbol: 'XC' },
      { value: 50, symbol: 'L' },
      { value: 40, symbol: 'XL' },
      { value: 10, symbol: 'X' },
      { value: 9, symbol: 'IX' },
      { value: 5, symbol: 'V' },
      { value: 4, symbol: 'IV' },
      { value: 1, symbol: 'I' },
    ]
    let result = ''
    for (const { value, symbol } of romanNumerals) {
      while (num >= value) {
        result += symbol
        num -= value
      }
    }
    return result
  }

  // Generate the full node number
  const getNodeNumber = (node: any): string => {
    // If the style is None, return an empty string
    if (style === NumberingStyle.None) return ''

    // Get all parent nodes
    const getParents = (node: any): any[] => {
      const parent = allNodes.find((n) => n[keys.idKey] === node[keys.parentIdKey])
      return parent ? [...getParents(parent), parent] : []
    }

    const parents = getParents(node)
    const level = parents.length

    // Get all siblings (nodes with the same parent)
    const siblings = allNodes.filter((n) => n[keys.parentIdKey] === node[keys.parentIdKey])

    // Find the index of the current node among its siblings
    const index = siblings.findIndex((n) => n[keys.idKey] === node[keys.idKey]) + 1

    // Determine the numbering style for this level
    const levelStyle = [NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman][
      level % 3
    ]

    // Generate the full number
    return parents
      .map((p, i) => {
        const parentSiblings = allNodes.filter((n) => n[keys.parentIdKey] === p[keys.parentIdKey])
        const parentIndex = parentSiblings.findIndex((s) => s[keys.idKey] === p[keys.idKey]) + 1
        const parentStyle = [
          NumberingStyle.Numeric,
          NumberingStyle.Alphabetic,
          NumberingStyle.Roman,
        ][i % 3]
        return getNumber(parentIndex, parentStyle)
      })
      .concat(getNumber(index, levelStyle))
      .join('.')
  }

  const nodeNumber = getNodeNumber(node)

  // Log debugging information
  console.log('RequirementNumber props:', { node, allNodes, keys, style })
  console.log('Generated number:', nodeNumber)

  // Render the node number with a distinctive style
  return <span className="mr-2 font-semibold text-blue-600">{nodeNumber}</span>
}

export default RequirementNumber
