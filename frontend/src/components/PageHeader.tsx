type PageHeaderProps = {
  title: string
}

export function PageHeader({ title }: PageHeaderProps) {
  return <h2 className="mb-4 text-2xl font-bold">{title}</h2>
}
