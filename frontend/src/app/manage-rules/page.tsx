'use client'
import React, { useState } from 'react'
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
      <div className="mx-auto max-w-7xl pb-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
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
          </div>

          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </Layout>
  )
}

export default ManageRules
