// src/rules/dto/rule-history.dto.ts

export class RuleHistoryDto {
  id: number
  ruleId: number
  code: string
  name: string
  type: string
  description: string
  version: number
  timestamp: Date
}
