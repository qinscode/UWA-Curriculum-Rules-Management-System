'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import RuleSection from '@/components/manage-rules/RuleSection'
import AdmissionSelection from '@/components/manage-rules/AdmissionSelection'
import SatisfactoryProgress from '@/components/manage-rules/SatisfactoryProgress'
import ProgressStatus from '@/components/manage-rules/ProgressStatus'
import AwardWithDistinction from '@/components/manage-rules/AwardWithDistinction'
import Deferrals from '@/components/manage-rules/Deferrals'
import AdditionalRules from '@/components/manage-rules/AdditionalRules'
import OutcomesAQF from '@/components/manage-rules/OutcomesAQF'
import SaveButton from '@/components/manage-rules/SaveButton'
import { AdmissionSelectionProps, Course, Requirement, RuleType } from '@/types'
import { useCourse } from '@/context/CourseContext'
import { ruleService } from '@/services/ruleService'

const ManageRules: React.FC = () => {
  const { course, updateCourse } = useCourse()
  const courseCode = course?.code
  const version = course?.version

  const [courseName, setCourseName] = useState<string>('')
  const [formData, setFormData] = useState<AdmissionSelectionProps['data']>({
    // Initialize with your default form data
  })
  const [newVersion, setNewVersion] = useState<string>('')
  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch course details and rules data
    // This is a mock implementation. Replace with actual API call.
    const fetchCourseDetails = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCourseName(course?.name || '')
      // Set initial form data here
    }
    fetchCourseDetails()
  }, [courseCode, version])

  const updateFormData = (data: Partial<AdmissionSelectionProps['data']>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data submitted:', formData)

    // @ts-ignore
    // create englishRequirements dto
    // await ruleService.createRule(course.id, {
    //   requirement: formData.englishRequirements || [],
    //   name: RuleType.ENGLISH_ELIGIBILITY,
    //   description: `${RuleType.ENGLISH_ELIGIBILITY} rule`,
    //   type: RuleType.ENGLISH_ELIGIBILITY,
    // })
    await ruleService.createRule(course.id, formData.englishRequirements || [])

    // await updateOrCreateRule(RuleType.ADMISSIONS, formData.englishRequirements || [])
    // await updateOrCreateRule(RuleType.ADMISSIONS, formData.rankingSelection || [])
    // await updateOrCreateRule(RuleType.PROGRESS, formData.satisfactoryProgress || [])
    // await updateOrCreateRule(RuleType.PROGRESS_STATUS, formData.progressStatus || [])
    // await updateOrCreateRule(RuleType.DISTINCTION, formData.awardWithDistinction || [])
    // await updateOrCreateRule(RuleType.DEFERRALS, formData.deferralAllowed || [])
    // await updateOrCreateRule(RuleType.DEFERRALS, formData.deferralRules || [])

    toast({
      title: 'Rules updated',
      description: 'All rules have been successfully updated.',
    })
  }
  const handleSaveAsNewVersion = () => {
    if (newVersion) {
      console.log('Saving as new version:', newVersion)
      // Implement your logic to save as a new version
      toast({
        title: 'New version created',
        description: `Version ${newVersion} has been created successfully.`,
      })
      setIsNewVersionDialogOpen(false)
      // Optionally, redirect to the new version
      router.push(`/manage-rules?code=${courseCode}&version=${newVersion}`)
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl p-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Manage Rules - {courseCode}: {courseName} (Version: {version})
          </h1>
        </div>
        <Button onClick={() => console.log('Current Requirements:', formData)}>SSS</Button>
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
          <div className="mt-8 flex justify-end">
            <Dialog open={isNewVersionDialogOpen} onOpenChange={setIsNewVersionDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                >
                  Save as New Version
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save as New Version</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="new-version" className="text-right">
                      New Version
                    </label>
                    <Input
                      id="new-version"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., 2025"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveAsNewVersion}
                  className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                >
                  Save New Version
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <SaveButton handleSaveButton={handleSubmit} />

          <Button onClick={() => console.log('Current Requirements:', formData)}>SSS</Button>
        </form>
      </div>
      <Footer />
    </Layout>
  )
}

export default ManageRules
