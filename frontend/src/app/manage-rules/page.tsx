'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl pb-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-8">
                <section>
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                    Admission and selection
                  </h3>
                  <div className="rounded-md bg-gray-50 p-4">
                    <AdmissionSelection data={formData} updateData={updateFormData} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                    Satisfactory Progress
                  </h3>
                  <div className="rounded-md bg-gray-50 p-4">
                    <SatisfactoryProgress data={formData} updateData={updateFormData} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                    Progress Status
                  </h3>
                  <div className="rounded-md bg-gray-50 p-4">
                    <ProgressStatus data={formData} updateData={updateFormData} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                    Award with distinction
                  </h3>
                  <div className="rounded-md bg-gray-50 p-4">
                    <AwardWithDistinction data={formData} updateData={updateFormData} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Deferrals</h3>
                  <div className="rounded-md bg-gray-50 p-4">
                    <Deferrals data={formData} updateData={updateFormData} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                    Additional rules
                  </h3>
                  <div className="rounded-md bg-gray-50 p-4">
                    <AdditionalRules data={formData} updateData={updateFormData} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                    Outcomes & Australian Qualifications Framework
                  </h3>
                  <div className="rounded-md bg-gray-50 p-4">
                    <OutcomesAQF data={formData} updateData={updateFormData} />
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="inline-flex items-center">
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

export default ManageRules
