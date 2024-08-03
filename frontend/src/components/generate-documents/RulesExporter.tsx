import { Button } from '@nextui-org/react'

interface RulesExporterProps {
  onExport: () => Promise<void>
  isGenerating: boolean
}

export function RulesExporter({ onExport, isGenerating }: RulesExporterProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Export All Rules</h3>
      <Button color="primary" onClick={onExport} disabled={isGenerating}>
        Export Rules as JSON
      </Button>
    </div>
  )
}
