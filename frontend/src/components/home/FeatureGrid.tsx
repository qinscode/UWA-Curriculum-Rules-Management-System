import FeatureCard from '../FeatureCard'

interface Feature {
  title: string
  description: string
}

export default function FeatureGrid(): JSX.Element {
  const features: Feature[] = [
    {
      title: 'Manage Rules',
      description: 'Create, edit, and delete course rules for your institution.',
    },
    {
      title: 'Generate Documents',
      description: 'Generate PDFs for specific courses or create a complete handbook.',
    },
    {
      title: 'System Settings',
      description: 'Configure general settings, document generation options, and user management.',
    },
    {
      title: 'Data Export',
      description: 'Export all rules as JSON for backup or integration purposes.',
    },
  ]

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {features.map((feature, index) => (
        <FeatureCard key={index} title={feature.title} description={feature.description} />
      ))}
    </div>
  )
}
