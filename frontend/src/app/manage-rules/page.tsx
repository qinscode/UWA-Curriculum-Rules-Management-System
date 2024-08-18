'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import AdmissionSelection from '@/components/manage-rules/AdmissionSelection'
import Footer from '@/components/Footer'
import { PRESET_RULES } from '@/constants'
import { AdmissionSelectionProps } from '@/types'
import SatisfactoryProgress from '@/components/manage-rules/SatisfactoryProgress'
import ProgressStatus from '@/components/manage-rules/ProgressStatus'
import AdditionalRules from '@/components/manage-rules/AdditionalRules'
import Deferrals from '@/components/manage-rules/Deferrals'
import AwardWithDistinction from '@/components/manage-rules/AwardWithDistinction'
import OutcomesAQF from '@/components/manage-rules/OutcomesAQF'
import { Save } from 'lucide-react'

const ManageRules: React.FC = () => {
  const [formData, setFormData] = useState<AdmissionSelectionProps['data']>({
    englishRequirements: [],
    admissionRequirements: PRESET_RULES,
    rankingSelection: [],
    satisfactoryProgress: [],
    progressStatus: [],
    awardWithDistinction: [],
    deferralAllowed: [],
    deferralRules: [],
  })

  const updateFormData = (data: Partial<AdmissionSelectionProps['data']>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data submitted:', formData)
    // Here you would typically send the data to your backend
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Manage Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <Section title="Admission and selection">
                <AdmissionSelection data={formData} updateData={updateFormData} />
              </Section>

              <Section title="Satisfactory Progress">
                <SatisfactoryProgress data={formData} updateData={updateFormData} />
              </Section>

              <Section title="Progress Status">
                <ProgressStatus data={formData} updateData={updateFormData} />
              </Section>

              <Section title="Award with distinction">
                <AwardWithDistinction data={formData} updateData={updateFormData} />
              </Section>

              <Section title="Deferrals">
                <Deferrals data={formData} updateData={updateFormData} />
              </Section>

              <Section title="Additional rules">
                <AdditionalRules data={formData} updateData={updateFormData} />
              </Section>

              <Section title="Outcomes & Australian Qualifications Framework">
                <OutcomesAQF data={formData} updateData={updateFormData} />
              </Section>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </Layout>
  )
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="mb-4 text-lg font-medium">{title}</h3>
    <Card>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  </div>
)

export default ManageRules
