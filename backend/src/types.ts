import { NumberingStyle } from './requirements/entities/style.enum'

export interface Rule {
    title: string
    ruleIndex: number
    content: {
        text: string
        style: NumberingStyle
        ruleIndex?: number
        children?: any[]
    }[]
}