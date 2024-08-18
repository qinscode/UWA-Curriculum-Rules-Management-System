'use client'
import React, { useState } from 'react'
import Layout from '@/components/Layout'
import Footer from '@/components/Footer'
import { PRESET_RULES } from '@/constants'
import { AdmissionSelectionProps } from '@/types'
import RuleSection from '@/components/manage-rules/RuleSection'
import AdmissionSelection from '@/components/manage-rules/AdmissionSelection'
import SatisfactoryProgress from '@/components/manage-rules/SatisfactoryProgress'
import ProgressStatus from '@/components/manage-rules/ProgressStatus'
import AwardWithDistinction from '@/components/manage-rules/AwardWithDistinction'
import Deferrals from '@/components/manage-rules/Deferrals'
import AdditionalRules from '@/components/manage-rules/AdditionalRules'
import OutcomesAQF from '@/components/manage-rules/OutcomesAQF'
import SaveButton from '@/components/manage-rules/SaveButton'

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
      <div className="mx-auto max-w-7xl p-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <RuleSection title="Admission and selection">
              <AdmissionSelection data={formData} updateData={updateFormData} />
            </RuleSection>

            <RuleSection title="Satisfactory Progress">
              <SatisfactoryProgress data={formData} updateData={updateFormData} />
            </RuleSection>

            <RuleSection title="Progress Status">
              <ProgressStatus data={formData} updateData={updateFormData} />
            </RuleSection>

            <RuleSection title="Award with distinction">
              <AwardWithDistinction data={formData} updateData={updateFormData} />
            </RuleSection>

            <RuleSection title="Deferrals">
              <Deferrals data={formData} updateData={updateFormData} />
            </RuleSection>

            <RuleSection title="Additional rules">
              <AdditionalRules data={formData} updateData={updateFormData} />
            </RuleSection>

            <RuleSection title="Outcomes & Australian Qualifications Framework">
              <OutcomesAQF data={formData} updateData={updateFormData} />
            </RuleSection>
          </div>

          <SaveButton />
        </form>
      </div>
      <Footer />
    </Layout>
  )
}

export default ManageRules
