import { Card, CardBody } from '@nextui-org/react'

type FeatureCardProps = {
  title: string
  description: string
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardBody>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p>{description}</p>
      </CardBody>
    </Card>
  )
}
