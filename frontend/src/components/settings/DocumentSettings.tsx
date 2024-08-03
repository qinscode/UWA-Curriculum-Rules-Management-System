import { Select, SelectItem } from '@nextui-org/react'
import { Settings } from '../../types'

interface DocumentSettingsProps {
  settings: Pick<Settings, 'pdfTemplate' | 'handbookFormat'>
  onChange: (newSettings: Partial<Pick<Settings, 'pdfTemplate' | 'handbookFormat'>>) => void
}

export function DocumentSettings({ settings, onChange }: DocumentSettingsProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Document Generation</h3>
      <Select label="PDF Template" defaultSelectedKeys={['template2']} className="mb-4">
        <SelectItem key="template1" value="template1">
          Template 1
        </SelectItem>
        <SelectItem key="template2" value="template2">
          Template 2
        </SelectItem>
        <SelectItem key="template3" value="template3">
          Template 3
        </SelectItem>
      </Select>
      <Select label="Handbook Format" defaultSelectedKeys={['pdf']}>
        <SelectItem key="pdf" value="pdf">
          PDF
        </SelectItem>
        <SelectItem key="html" value="html">
          HTML
        </SelectItem>
        <SelectItem key="docx" value="docx">
          DOCX
        </SelectItem>
      </Select>
    </div>
  )
}
