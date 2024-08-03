// components/generate-documents/HandbookGenerator.tsx
import { Button } from '@nextui-org/react'

interface HandbookGeneratorProps {
  onGenerate: () => Promise<void>
  isGenerating: boolean
}

export function HandbookGenerator({ onGenerate, isGenerating }: HandbookGeneratorProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Generate Complete Handbook</h3>
      <Button color="primary" onClick={onGenerate} disabled={isGenerating}>
        Generate Full Handbook PDF
      </Button>
    </div>
  )
}
