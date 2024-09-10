import React, { useState, useEffect, useCallback } from 'react'
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
import { GeneralProps, Rule, RuleType, Requirement } from '@/types'
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
  skills: Rule | null
  knowledge: Rule | null
  knowledgeApplication: Rule | null
  rankingSelection: Rule | null
}

const ManageRules: React.FC = () => {
  const { course, updateCourse } = useCourse()
  const courseCode = course?.code
  const version = course?.version
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [courseName, setCourseName] = useState<string>('')
  const [formData, setFormData] = useState<GeneralProps['data']>({
    englishRequirements: [],
    admissionRequirements: [],
    rankingSelection: [],
    satisfactoryProgress: [],
    progressStatus: [],
    awardWithDistinction: [],
    deferralAllowed: false,
    additionalRules: [],
    deferrals: [],
    knowledgeApplication: [],
    skills: [],
    knowledge: [],
  })

  const [categorizedRules, setCategorizedRules] = useState<CategorizedRules>({
    englishEligibility: null,
    admissions: null,
    progress: null,
    progressStatus: null,
    distinction: null,
    deferrals: null,
    additional: null,
    skills: null,
    knowledgeApplication: null,
    knowledge: null,
    rankingSelection: null,
  })
  const [newVersion, setNewVersion] = useState<string>('')
  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = useState(false)
  const router = useRouter()
  const [showRankingRequirements, setShowRankingRequirements] = useState(false)

  useEffect(() => {
    if (course?.id) {
      console.log('ManageRules: Fetching rules for course ID:', course.id)
      fetchAndCategorizeRules(course.id)
    }
  }, [course])

  const fetchAndCategorizeRules = async (courseId: number) => {
    try {
      const rules = await ruleService.getAllRules(courseId)
      console.log('ManageRules: Fetched rules:', rules)
      // 更新这行来检查 is_connector 字段
      rules.forEach(rule => {
        console.log(`Rule ${rule.id} requirements:`, rule.requirements.map(r => ({ id: r.id, content: r.content, is_connector: r.is_connector })))
      })
      const categorized = categorizeRules(rules)
      console.log('ManageRules: Categorized rules:', categorized)
      setCategorizedRules(categorized)
      updateFormDataFromRules(categorized)
      console.log('ManageRules: Form data updated from rules', formData)
    } catch (error) {
      console.error('ManageRules: Error fetching rules:', error)
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
      skills: null,
      knowledgeApplication: null,
      knowledge: null,
      rankingSelection: null,
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
        case RuleType.KNOWLEDGE:
          categorized.knowledge = rule
          break
        case RuleType.SKILLS:
          categorized.skills = rule
          break
        case RuleType.KNOWLEDGE_APPLICATION:
          categorized.knowledgeApplication = rule
          break
        case RuleType.RANKING_AND_SELECTION:
          categorized.rankingSelection = rule
          break
      }
    })

    console.log('ManageRules: Categorized rules:', categorized)
    return categorized
  }

  const updateFormDataFromRules = (categorized: CategorizedRules) => {
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        englishRequirements: categorized.englishEligibility?.requirements || [],
        admissionRequirements: categorized.admissions?.requirements || [],
        rankingSelection: categorized.rankingSelection?.requirements || [],
        satisfactoryProgress: categorized.progress?.requirements || [],
        progressStatus: categorized.progressStatus?.requirements || [],
        awardWithDistinction: categorized.distinction?.requirements || [],
        deferrals: categorized.deferrals?.requirements || [],
        additionalRules: categorized.additional?.requirements || [],
        knowledge: categorized.knowledge?.requirements || [],
        skills: categorized.skills?.requirements || [],
        knowledgeApplication: categorized.knowledgeApplication?.requirements || [],
      }
      console.log('ManageRules: Updated form data:', newData)
      console.log('ManageRules: Ranking and selection:', newData.rankingSelection)
      // 根据 rankingSelection 是否为空来设置 showRankingRequirements
      setShowRankingRequirements(newData.rankingSelection.length > 0)
      // 添加这些日志来检查每个字段的结构
      Object.entries(newData).forEach(([key, value]) => {
        console.log(`ManageRules: ${key} structure:`, value)
      })
      return newData
    })
  }

  const updateFormData = useCallback((data: Partial<GeneralProps['data']>) => {
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        ...data,
      }
      console.log('ManageRules: Updating form data', newData)
      console.log('ManageRules: New ranking selection data', newData.rankingSelection)
      setHasUnsavedChanges(true)
      return newData
    })
  }, [])

  const handleSave = async () => {
    console.log('handleSave called')
    if (!hasUnsavedChanges) {
      console.log('No unsaved changes, returning')
      return
    }

    console.log('Saving form data:', formData)

    try {
      const rulesToUpdate = [
        { rule: categorizedRules.englishEligibility, data: formData.englishRequirements },
        { rule: categorizedRules.admissions, data: formData.admissionRequirements },
        { rule: categorizedRules.progress, data: formData.satisfactoryProgress },
        { rule: categorizedRules.distinction, data: formData.awardWithDistinction },
        { rule: categorizedRules.deferrals, data: formData.deferrals },
        { rule: categorizedRules.additional, data: formData.additionalRules },
        { rule: categorizedRules.knowledge, data: formData.knowledge },
        { rule: categorizedRules.skills, data: formData.skills },
        { rule: categorizedRules.knowledgeApplication, data: formData.knowledgeApplication },
        { rule: categorizedRules.progressStatus, data: formData.progressStatus },
        { rule: categorizedRules.rankingSelection, data: formData.rankingSelection },
      ]

      for (const { rule, data } of rulesToUpdate) {
        if (rule && data) {
          console.log(`Updating ${rule.type} rule:`, rule.id, data)
          try {
            const result = await ruleService.updateRequirementByRuleId(course!.id, rule.id, data as Requirement[])
            console.log(`Update result for ${rule.type}:`, result)
          } catch (error) {
            console.error(`Error updating ${rule.type} rule:`, error)
          }
        } else {
          console.log(`No rule or data found for update`)
        }
      }

      console.log('All rules updated successfully')
      setHasUnsavedChanges(false)
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
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            <RuleSection title="Admission and selection">
              <AdmissionSelection
                data={{
                  englishRequirements: formData.englishRequirements || [],
                  admissionRequirements: formData.admissionRequirements || [],
                  rankingSelection: formData.rankingSelection || [],
                }}
                updateData={updateFormData}
                showRankingRequirements={showRankingRequirements}
                setShowRankingRequirements={setShowRankingRequirements}
              />
            </RuleSection>

            <RuleSection title="Satisfactory Progress">
              <SatisfactoryProgress
                data={{
                  satisfactoryProgress: formData.satisfactoryProgress || [],
                }}
                updateData={updateFormData}
              />
            </RuleSection>

            <RuleSection title="Progress Status">
              <ProgressStatus data={formData} updateData={updateFormData} />
            </RuleSection>

            <RuleSection title="Award with distinction">
              <AwardWithDistinction
                data={{
                  awardWithDistinction: formData.awardWithDistinction || [],
                }}
                updateData={updateFormData}
              />
            </RuleSection>

            <RuleSection title="Deferrals">
              <Deferrals
                data={{
                  deferrals: formData.deferrals || [],
                  deferralAllowed: formData.deferralAllowed || false,
                }}
                updateData={updateFormData}
              />
            </RuleSection>

            <RuleSection title="Additional rules">
              <AdditionalRules data={formData} updateData={updateFormData} />
            </RuleSection>

            <RuleSection title="Outcomes & Australian Qualifications Framework">
              <OutcomesAQF
                data={{
                  knowledge: formData.knowledge || [],
                  skills: formData.skills || [],
                  knowledgeApplication: formData.knowledgeApplication || [],
                }}
                updateData={updateFormData}
              />
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
