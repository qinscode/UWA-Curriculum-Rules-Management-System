'use client'
import React, { useState } from 'react'
import Layout from '@/components/Layout'
import SchoolEndorsement from '@/components/manage-rules/SchoolEndorsement'
import AvailabilityRescission from '@/components/manage-rules/AvailabilityRescission'
import Administration from '@/components/manage-rules/Administration'
import Details from '@/components/manage-rules/Details'
import VolumeOfLearning from '@/components/manage-rules/VolumeOfLearning'
import AdmissionSelection from '@/components/manage-rules/AdmissionSelection'
import Footer from '@/components/Footer'

import OutcomesAQF from '@/components/manage-rules/OutcomesAQF'
import ArticulationAgreement from '@/components/manage-rules/ArticulationAgreement'
import FieldOfEducation from '@/components/manage-rules/FieldOfEducation'
import ExampleCom from '@/components/ExampleCom'
import ExampleCom2 from '@/components/ExampleCom2'

const ManageRules: React.FC = () => {
  const [formData, setFormData] = useState({
    schoolEndorsement: {},
    availabilityRescission: {},
    administration: {},
    details: {},
    volumeOfLearning: {},
    admissionSelection: {},
    fieldOfEducation: {},
    articulationAgreement: {},
    outcomesAQF: {},
  })

  const updateFormData = (section: string, data: never) => {
    // setFormData((prevData) => ({
    //   ...prevData,
    //   [section]: { ...prevData[section], ...data },
    // }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data submitted:', formData)
    // Here you would typically send the data to your backend
  }

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Manage Course Rules</h2>

          <ExampleCom />
          <ExampleCom2 />
          {/*<SchoolEndorsement*/}
          {/*  data={formData.schoolEndorsement}*/}
          {/*  updateData={(data) => updateFormData('schoolEndorsement', data)}*/}
          {/*/>*/}

          {/*<AvailabilityRescission*/}
          {/*  data={formData.availabilityRescission}*/}
          {/*  updateData={(data) => updateFormData('availabilityRescission', data)}*/}
          {/*/>*/}

          {/*<Administration*/}
          {/*  data={formData.administration}*/}
          {/*  updateData={(data) => updateFormData('administration', data)}*/}
          {/*/>*/}

          {/*<Details data={formData.details} updateData={(data) => updateFormData('details', data)} />*/}

          {/*<VolumeOfLearning*/}
          {/*  data={formData.volumeOfLearning}*/}
          {/*  updateData={(data) => updateFormData('volumeOfLearning', data)}*/}
          {/*/>*/}

          {/*<AdmissionSelection*/}
          {/*  data={formData.admissionSelection}*/}
          {/*  updateData={(data) => updateFormData('admissionSelection', data)}*/}
          {/*/>*/}

          {/*<FieldOfEducation*/}
          {/*  data={formData.fieldOfEducation}*/}
          {/*  updateData={(data) => updateFormData('fieldOfEducation', data)}*/}
          {/*/>*/}

          {/*<ArticulationAgreement*/}
          {/*  data={formData.articulationAgreement}*/}
          {/*  updateData={(data) => updateFormData('articulationAgreement', data)}*/}
          {/*/>*/}

          {/*<OutcomesAQF*/}
          {/*  data={formData.outcomesAQF}*/}
          {/*  updateData={(data) => updateFormData('outcomesAQF', data)}*/}
          {/*/>*/}

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Layout>
      <Footer />
    </>
  )
}

export default ManageRules
