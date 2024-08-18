import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface RuleSectionProps {
  title: string
  children: React.ReactNode
}

const RuleSection: React.FC<RuleSectionProps> = ({ title, children }) => (
  <section className="mb-8">
    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{title}</h3>
    <Card className="shadow-md">
      <CardContent className="p-6 bg-gray-50">{children}</CardContent>
    </Card>
  </section>
)

export default RuleSection