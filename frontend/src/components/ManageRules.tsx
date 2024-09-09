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
import { ManageRulesProps, Course, Requirement, Rule, RuleType } from '@/types'
import { useCourse } from '@/context/CourseContext'
import { ruleService } from '@/services/ruleService'

interface CategorizedRules {
  englishEligibility: Rule | null
  admissions: Rule | null
  progress: Rule | null
  progressStatus: Rule | null
  distinction: Rule | null
  deferrals: Rule | null
  additional: Rule | null
  aqfOutcomes: Rule | null
  skills: Rule | null
  knowledgeApplication: Rule | null
}

const ManageRules: React.FC = () => {
  const { course, updateCourse } = useCourse()
  const courseCode = course?.code
  const version = course?.version
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  console.log('Course information:', { courseCode, version })

  const [courseName, setCourseName] = useState<string>('')
  const [formData, setFormData] = useState<ManageRulesProps['data']>({
    englishRequirements: [],
  })
  const [categorizedRules, setCategorizedRules] = useState<CategorizedRules>({
    englishEligibility: null,
    admissions: null,
    progress: null,
    progressStatus: null,
    distinction: null,
    deferrals: null,
    additional: null,
    aqfOutcomes: null,
    skills: null,
    knowledgeApplication: null,
  })
  const [newVersion, setNewVersion] = useState<string>('')
  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (course?.id) {
      console.log('Fetching rules for course ID:', course.id)
      fetchAndCategorizeRules(course.id)
    }
  }, [course])

  const fetchAndCategorizeRules = async (courseId: number) => {
    try {
      const rules = await ruleService.getAllRules(courseId)
      console.log('Fetched rules:', rules)
      const categorized = categorizeRules(rules)
      console.log('Categorized rules:', categorized)
      setCategorizedRules(categorized)
      updateFormDataFromRules(categorized)
      console.log('Form data updated from rules', formData)
    } catch (error) {
      console.error('Error fetching rules:', error)
    }
  }

  const categorizeRules = (rules: Rule[]): CategorizedRules => {
    const categorized: CategorizedRules = {
      englishEligibility: null,
      admissions: null,
      progress: null,
      progressStatus: null,
      distinction: null,
      deferrals: null,
      additional: null,
      aqfOutcomes: null,
      skills: null,
      knowledgeApplication: null,
    }

    rules.forEach((rule) => {
      switch (rule.type) {
        case RuleType.ENGLISH_ELIGIBILITY:
          categorized.englishEligibility = rule
          break
        case RuleType.ADMISSIONS:
          categorized.admissions = rule
          break
        case RuleType.SATISFACTORY_PROGRESS:
          categorized.progress = rule
          break
        case RuleType.PROGRESS_STATUS:
          categorized.progressStatus = rule
          break
        case RuleType.AWARD_WITH_DISTINCTION:
          categorized.distinction = rule
          break
        case RuleType.DEFERRALS:
          categorized.deferrals = rule
          break
        case RuleType.ADDITIONAL_RULES:
          categorized.additional = rule
          break
        case RuleType.AQF_OUTCOMES:
          categorized.aqfOutcomes = rule
          break
        case RuleType.SKILLS:
          categorized.skills = rule
          break
        case RuleType.KNOWLEDGE_APPLICATION:
          categorized.knowledgeApplication = rule
          break
      }
    })

    console.log('Categorized rules:', categorized)
    return categorized
  }

  const updateFormDataFromRules = (categorized: CategorizedRules) => {
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        englishRequirements: categorized.englishEligibility?.requirements || [],
        // Update other form data fields based on categorized rules
      }
      console.log('22222Updated form data:', newData)
      return newData
    })
    console.log('111111Form data updated from rules:', formData)
  }

  const updateFormData = (data: Partial<ManageRulesProps['data']>) => {
    console.log('updateFormData called with:', data)
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        ...data,
      }
      setHasUnsavedChanges(true)
      console.log('New form data:', newData)
      return newData
    })
  }

  const handleSave = async () => {
    if (!hasUnsavedChanges) return // 如果没有未保存的更改，直接返回

    console.log('Saving form data:', formData)

    try {
      if (categorizedRules.englishEligibility) {
        console.log('Updating English Eligibility rule:', categorizedRules.englishEligibility.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.englishEligibility.id,
          formData.englishRequirements
        )
      }

      if (categorizedRules.admissions) {
        console.log('Updating admissions rule:', categorizedRules.admissions.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.admissions.id,
          formData.admissionRequirements
        )
      }

      if (categorizedRules.progress) {
        console.log('Updating satisfactoryProgress rule:', categorizedRules.progress.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.progress.id,
          formData.satisfactoryProgress
        )
      }

      if (categorizedRules.distinction) {
        console.log('Updating awardWithDistinction rule:', categorizedRules.distinction.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.distinction.id,
          formData.awardWithDistinction
        )
      }

      if (categorizedRules.deferrals) {
        console.log('Updating deferrals rule:', categorizedRules.deferrals.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.deferrals.id,
          formData.deferrals
        )
      }

      if (categorizedRules.additional) {
        console.log('Updating additionalRules rule:', categorizedRules.additional.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.additional.id,
          formData.additionalRules
        )
      }

      if (categorizedRules.aqfOutcomes) {
        console.log('Updating aqfOutcomes rule:', categorizedRules.aqfOutcomes.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.aqfOutcomes.id,
          formData.aqfOutcomes
        )
      }

      if (categorizedRules.skills) {
        console.log('Updating skills rule:', categorizedRules.skills.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.skills.id,
          formData.skills
        )
      }

      if (categorizedRules.knowledgeApplication) {
        console.log('Updating knowledgeApplication:', categorizedRules.knowledgeApplication.id)
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.knowledgeApplication.id,
          formData.knowledgeApplication
        )
      }

      console.log('All rules updated successfully')
      setHasUnsavedChanges(false) // 重置未保存更改状态
      toast({
        title: 'Rules saved',
        description: 'All rules have been successfully saved.',
      })
    } catch (error) {
      console.error('Error saving rules:', error)
      toast({
        title: 'Error',
        description: 'Failed to save rules. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted. Current form data:', formData)

    try {
      if (categorizedRules.englishEligibility) {
        console.log('Updating English Eligibility rule:', categorizedRules.englishEligibility.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.englishEligibility.id,

          formData.englishRequirements
        )
      }
      if (categorizedRules.admissions) {
        console.log('Updating admissions rule:', categorizedRules.admissions.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.admissions.id,

          formData.admissionRequirements
        )
      }
      if (categorizedRules.progress) {
        console.log('Updating satisfactoryProgress rule:', categorizedRules.progress.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.progress.id,

          formData.satisfactoryProgress
        )
      }
      if (categorizedRules.distinction) {
        console.log('Updating awardWithDistinction rule:', categorizedRules.distinction.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.distinction.id,

          formData.awardWithDistinction
        )
      }
      if (categorizedRules.deferrals) {
        console.log('Updating deferrals rule:', categorizedRules.deferrals.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.deferrals.id,

          formData.deferrals
        )
      }
      if (categorizedRules.additional) {
        console.log('Updating additionalRules rule:', categorizedRules.additional.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.additional.id,

          formData.additionalRules
        )
      }

      if (categorizedRules.aqfOutcomes) {
        console.log('Updating aqfOutcomes rule:', categorizedRules.aqfOutcomes.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.aqfOutcomes.id,

          formData.aqfOutcomes
        )
      }

      if (categorizedRules.skills) {
        console.log('Updating skills rule:', categorizedRules.skills.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.skills.id,

          formData.skills
        )
      }

      if (categorizedRules.knowledgeApplication) {
        console.log('Updating knowledgeApplication:', categorizedRules.knowledgeApplication.id)

        // @ts-ignore
        await ruleService.updateRequirementByRuleId(
          course!.id,
          categorizedRules.knowledgeApplication.id,

          formData.knowledgeApplication
        )
      }

      console.log('All rules updated successfully')
      toast({
        title: 'Rules updated',
        description: 'All rules have been successfully updated.',
      })
    } catch (error) {
      console.error('Error updating rules:', error)
      toast({
        title: 'Error',
        description: 'Failed to update rules. Please try again.',
        variant: 'destructive',
      })
    }
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

  console.log('Rendering ManageRules component')

  return (
    <Layout>
      <div className="mx-auto max-w-7xl p-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Manage Rules - {courseCode}: {courseName} (Version: {version})
          </h1>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          {/*
          *******WARNING: Do not remove the e.preventDefault() call in the form's onSubmit handler.******
    Prevent the default form submission behavior.
    This ensures that clicking buttons or pressing enter in input fields
    within the form does not trigger an unintended form submission.
    It allows us to handle data updates and submissions manually,
    giving full control over when and how data is processed or sent to the server.
  */}
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

          <SaveButton handleSaveButton={handleSave} disabled={!hasUnsavedChanges} />
        </form>
      </div>
      <Footer />
    </Layout>
  )
}

export default ManageRules
