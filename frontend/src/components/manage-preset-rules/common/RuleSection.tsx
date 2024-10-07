import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface RuleSectionProps {
  title: string
  children: React.ReactNode
  id: string // 新增id属性
}

const RuleSection: React.FC<RuleSectionProps> = ({ title, children, id }) => (
  <section className="mb-8" id={id}>
    {' '}
    {/* 添加id属性到section元素 */}
    <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">{title}</h3>
    <Card className="shadow-lg">
      <CardContent className="bg-blue-50 p-6">{children}</CardContent>
    </Card>
  </section>
)

export default RuleSection
