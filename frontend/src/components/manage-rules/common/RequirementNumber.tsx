import React from 'react'
import { NumberingStyle } from '@/types'

interface RequirementNumberProps {
  node: any
  allNodes: any[]
  keys: { idKey: string; parentIdKey: string }
  levelStyles: NumberingStyle[]
  connectorNodes: Set<number>
}

const RequirementNumber: React.FC<RequirementNumberProps> = ({
  node,
  allNodes,
  keys,
  levelStyles,
  connectorNodes,
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
    const level = parents.filter((p) => !connectorNodes.has(p[keys.idKey])).length

    console.log(`Number: Node ID ${node[keys.idKey]}, Level ${level}`)

    const getIndex = (node: any, siblings: any[]): number => {
      const nonConnectorSiblings = siblings.filter((s) => !connectorNodes.has(s[keys.idKey]))
      const index = nonConnectorSiblings.findIndex((n) => n[keys.idKey] === node[keys.idKey]) + 1
      console.log(`Number: Node ID ${node[keys.idKey]}, Index among siblings: ${index}`)
      return index
    }

    const numbers = parents
      .filter((parent) => !connectorNodes.has(parent[keys.idKey]))
      .map((parent, index) => {
        const parentSiblings = allNodes.filter(
          (n) => n[keys.parentIdKey] === parent[keys.parentIdKey] && !connectorNodes.has(n[keys.idKey])
        )
        const parentIndex = getIndex(parent, parentSiblings)
        const parentNumber = getNumber(parentIndex, levelStyles[index] || NumberingStyle.Numeric)
        console.log(`Number: Parent ID ${parent[keys.idKey]}, Number ${parentNumber}`)
        return parentNumber
      })

    const siblings = allNodes.filter(
      (n) => n[keys.parentIdKey] === node[keys.parentIdKey] && !connectorNodes.has(n[keys.idKey])
    )
    const currentIndex = getIndex(node, siblings)
    const currentNumber = getNumber(currentIndex, levelStyles[level] || NumberingStyle.Numeric)
    numbers.push(currentNumber)

    const fullNumber = numbers.join('.')
    console.log(`Number: Node ID ${node[keys.idKey]}, Full Number ${fullNumber}`)
    return fullNumber
  }

  console.log(`Number: Calculating number for node ID ${node[keys.idKey]}`)
  console.log(`Number: Current connector nodes: ${Array.from(connectorNodes)}`)

  const nodeNumber = getNodeNumber(node)

  return <span className="mr-2 font-semibold text-blue-600">{nodeNumber}</span>
}

export default RequirementNumber
