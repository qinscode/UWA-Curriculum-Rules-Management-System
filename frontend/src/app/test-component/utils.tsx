import { NumberingStyle, Requirement, TreeItemAdapter } from './types'

export const generateNumbering = (index: number, style: NumberingStyle): string => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

  switch (style) {
    case NumberingStyle.Numeric:
      return `${index + 1}.`
    case NumberingStyle.Alphabetic:
      return String.fromCharCode(97 + index).toUpperCase() + '.'
    case NumberingStyle.Roman:
      return romanNumerals[index] + '.'
    case NumberingStyle.None:
    default:
      return ''
  }
}

export const convertToTreeItemAdapter = (requirements: Requirement[]): TreeItemAdapter[] => {
  return requirements.map((req) => ({
    ...req,
    id: req.id.toString(),
    children: convertToTreeItemAdapter(req.children),
    canHaveChildren: true,
    disableSorting: false,
  }))
}

export const updateItemsWithNumbers = (
  items: TreeItemAdapter[],
  levelStyles: Record<string, NumberingStyle>,
  level = 1,
  parentNumbering = ''
): TreeItemAdapter[] => {
  let numbering = 0
  return items.map((item) => {
    if (item.isConnector) {
      return {
        ...item,
        numbering: '',
        children: updateItemsWithNumbers(item.children, levelStyles, level + 1, parentNumbering),
      }
    }

    const style = levelStyles[`level${level}`] || NumberingStyle.None
    numbering++
    const currentNumbering = generateNumbering(numbering - 1, style)
    const fullNumbering = parentNumbering
      ? `${parentNumbering}${currentNumbering}`
      : currentNumbering

    return {
      ...item,
      numbering: fullNumbering,
      children: updateItemsWithNumbers(item.children, levelStyles, level + 1, fullNumbering),
    }
  })
}