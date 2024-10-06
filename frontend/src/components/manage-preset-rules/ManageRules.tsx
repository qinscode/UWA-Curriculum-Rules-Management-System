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
import RuleSection from '@/components/manage-rules/common/RuleSection'
import AdmissionSelection from '@/components/manage-rules/RuleSection/AdmissionSelection'
import SatisfactoryProgress from '@/components/manage-rules/RuleSection/SatisfactoryProgress'
import ProgressStatus from '@/components/manage-rules/RuleSection/ProgressStatus'
import AwardWithDistinction from '@/components/manage-rules/RuleSection/AwardWithDistinction'
import Deferrals from '@/components/manage-rules/RuleSection/Deferrals'
import ArticulationExitAward from '@/components/manage-rules/RuleSection/ArticulationExitAward'
import CourseStructure from '@/components/manage-rules/RuleSection/CourseStructure'
import SaveButton from '@/components/manage-rules/common/SaveButton'
import { GeneralProps, Rule, RuleType, Requirement } from '@/types'
import { useCourse } from '@/context/CourseContext'
import { ruleService } from '@/services/preset-ruleService'
import { BackendRule } from '@/lib/categorizeRules'

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
  articulationExitAward?: Rule | null
  courseStructure?: Rule | null
}

// Sidebar navigation items
const sidebarItems = [
  { name: 'Admission and selection', href: '#admission-selection' },
  { name: 'English language eligibility requirements', href: '#english-language-eligibility' },
  { name: 'Admission requirements', href: '#admission-requirements' },
  { name: 'Articulation and Exit Award', href: '#articulation-exit-award' },
  { name: 'Course Structure', href: '#course-structure' },
  { name: 'Satisfactory Progress', href: '#satisfactory-progress' },
  { name: 'Progress Status', href: '#progress-status' },
  { name: 'Award with distinction', href: '#award-with-distinction' },
  { name: 'Deferrals', href: '#deferrals' },
]

const Sidebar = () => (
  <div className="h-screen w-64 bg-gray-200 p-4">
    <h2 className="mb-4 text-xl font-bold">Navigation</h2>
    <ul>
      {sidebarItems.map((item) => (
        <li key={item.name} className="mb-2">
          <a href={item.href} className="text-blue-600 hover:underline">
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
)

const ManageRules: React.FC = () => {
  const { course, updateCourse } = useCourse()
  const courseCode = course?.code
  const version = course?.version
  const courseName = course?.name
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
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
    articulationExitAward: [],
    courseStructure: [],
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
    articulationExitAward: null,
    courseStructure: null,
  })

  const [newVersion, setNewVersion] = useState<string>('')
  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = useState(false)
  const router = useRouter()
  const [showRankingRequirements, setShowRankingRequirements] = useState(false)
  const [allPresetRules, setAllPresetRules] = useState<BackendRule[]>([])

  useEffect(() => {
    if (course?.id) {
      fetchAndCategorizeRules(course.id)
    }
  }, [course])

  const fetchAndCategorizeRules = async (courseId: number) => {
    try {
      const rules = await ruleService.getAllRules(courseId)
      const categorized = categorizeRules(rules)
      console.log('Preset Debugging: Categorized rules:', categorized)
      setCategorizedRules(categorized)
      updateFormDataFromRules(categorized)
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
      skills: null,
      knowledgeApplication: null,
      knowledge: null,
      rankingSelection: null,
      articulationExitAward: null,
      courseStructure: null,
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
        case RuleType.RANKING_AND_SELECTION:
          categorized.rankingSelection = rule
          break
        case RuleType.ARTICULATION_EXIT_AWARD:
          categorized.articulationExitAward = rule
          break
        case RuleType.COURSE_STRUCTURE:
          categorized.courseStructure = rule
          break
      }
    })

    return categorized
  }

  const updateFormDataFromRules = (categorized: CategorizedRules) => {
    setFormData((prevData) => ({
      ...prevData,
      englishRequirements: categorized.englishEligibility?.requirements || [],
      admissionRequirements: categorized.admissions?.requirements || [],
      rankingSelection: categorized.rankingSelection?.requirements || [],
      satisfactoryProgress: categorized.progress?.requirements || [],
      progressStatus: categorized.progressStatus?.requirements || [],
      awardWithDistinction: categorized.distinction?.requirements || [],
      deferrals: categorized.deferrals?.requirements || [],
      articulationExitAward: categorized.articulationExitAward?.requirements || [],
      courseStructure: categorized.courseStructure?.requirements || [],
    }))
  }

  const updateFormData = useCallback((data: Partial<GeneralProps['data']>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }))
    setHasUnsavedChanges(true)
  }, [])

  const handleSave = async () => {
    if (!hasUnsavedChanges) return

    try {
      const rulesToUpdate = [
        { rule: categorizedRules.englishEligibility, data: formData.englishRequirements },
        { rule: categorizedRules.admissions, data: formData.admissionRequirements },
        { rule: categorizedRules.progress, data: formData.satisfactoryProgress },
        { rule: categorizedRules.distinction, data: formData.awardWithDistinction },
        { rule: categorizedRules.deferrals, data: formData.deferrals },
        { rule: categorizedRules.articulationExitAward, data: formData.articulationExitAward },
        { rule: categorizedRules.courseStructure, data: formData.courseStructure },
      ]

      for (const { rule, data } of rulesToUpdate) {
        if (rule && data) {
          await ruleService.updateRequirementByRuleId(course!.id, rule.id, data as Requirement[])
        }
      }

      setHasUnsavedChanges(false)
      toast({ title: 'Rules saved', description: 'All rules have been successfully saved.' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save rules. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Layout>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content */}
        <div className="mx-auto max-w-7xl flex-1 p-6 sm:px-6 lg:px-8">
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
                  initialPresetRules={allPresetRules}
                />
              </RuleSection>

              <RuleSection title="Articulation and Exit Award">
                <ArticulationExitAward
                  data={formData}
                  updateData={updateFormData}
                  initialPresetRules={allPresetRules}
                />
              </RuleSection>

              <RuleSection title="Course Structure">
                <CourseStructure
                  data={formData}
                  updateData={updateFormData}
                  initialPresetRules={allPresetRules}
                />
              </RuleSection>

              <RuleSection title="Satisfactory Progress">
                <SatisfactoryProgress
                  data={{ satisfactoryProgress: formData.satisfactoryProgress || [] }}
                  updateData={updateFormData}
                  initialPresetRules={allPresetRules}
                />
              </RuleSection>

              <RuleSection title="Progress Status">
                <ProgressStatus
                  data={formData}
                  updateData={updateFormData}
                  initialPresetRules={allPresetRules}
                />
              </RuleSection>

              <RuleSection title="Award with distinction">
                <AwardWithDistinction
                  data={{ awardWithDistinction: formData.awardWithDistinction || [] }}
                  updateData={updateFormData}
                  initialPresetRules={allPresetRules}
                />
              </RuleSection>

              <RuleSection title="Deferrals">
                <Deferrals
                  anchorId="deferrals"
                  data={{
                    deferrals: formData.deferrals || [],
                    deferralAllowed: formData.deferralAllowed || false,
                  }}
                  updateData={updateFormData}
                  initialPresetRules={allPresetRules}
                />
              </RuleSection>
            </div>

            <SaveButton handleSaveButton={handleSave} disabled={!hasUnsavedChanges} />
          </form>
        </div>
      </div>
      <Footer />
    </Layout>
  )
}

export default ManageRules
