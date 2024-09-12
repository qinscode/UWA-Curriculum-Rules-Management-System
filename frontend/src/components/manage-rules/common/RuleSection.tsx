import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface RuleSectionProps {
  title: string
  children: React.ReactNode
}

const RuleSection: React.FC<RuleSectionProps> = ({ title, children }) => (
  <section className="mb-8">
    <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">{title}</h3>
    <Card className="shadow-lg">
      <CardContent className="bg-blue-50 p-6">{children}</CardContent>
    </Card>
  </section>
)

export default RuleSection
