import React from 'react'
import { NumberingStyle } from '@/types'

interface RequirementNumberProps {
  node: any
  allNodes: any[]
  keys: { idKey: string; parentIdKey: string }
  levelStyles: NumberingStyle[]
}

const RequirementNumber: React.FC<RequirementNumberProps> = ({
  node,
  allNodes,
  keys,
  levelStyles,
}) => {
  const getNumber = (num: number, style: NumberingStyle): string => {
    switch (style) {
      case NumberingStyle.Numeric:
        return num.toString()
      case NumberingStyle.Alphabetic:
        return String.fromCharCode(96 + num).toUpperCase()
      case NumberingStyle.Roman:
        return toRoman(num)
      case NumberingStyle.None:
        return ''
      default:
        return num.toString()
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
    const getParents = (node: any): any[] => {
      const parent = allNodes.find((n) => n[keys.idKey] === node[keys.parentIdKey])
      return parent ? [...getParents(parent), parent] : []
    }

    const parents = getParents(node)
    const level = parents.filter((p) => !p.isConnector).length

    const getIndex = (node: any, siblings: any[]): number => {
      const nonConnectorSiblings = siblings.filter((s) => !s.isConnector)
      return nonConnectorSiblings.findIndex((n) => n[keys.idKey] === node[keys.idKey]) + 1
    }

    const numbers = parents
      .filter((parent) => !parent.isConnector)
      .map((parent, index) => {
        const parentSiblings = allNodes.filter(
          (n) => n[keys.parentIdKey] === parent[keys.parentIdKey]
        )
        const parentIndex = getIndex(parent, parentSiblings)
        return getNumber(parentIndex, levelStyles[index] || NumberingStyle.Numeric)
      })

    const siblings = allNodes.filter((n) => n[keys.parentIdKey] === node[keys.parentIdKey])
    const currentIndex = getIndex(node, siblings)
    numbers.push(getNumber(currentIndex, levelStyles[level] || NumberingStyle.Numeric))

    return numbers.join('.')
  }

  const nodeNumber = getNodeNumber(node)

  return <span className="mr-2 font-semibold text-blue-600">{nodeNumber}</span>
}

export default RequirementNumber
