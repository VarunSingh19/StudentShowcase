'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PathSelection, Path } from '@/components/PathSelection'
import { DifficultySelection, Difficulty } from '@/components/DifficultySelection'
import { SkillAssessment } from '@/components/SkillAssessment'
import { AssessmentResults } from '@/components/AssessmentResults'
import { ProgressDashboard } from '@/components/ProgressDashboard'
import { useAuth } from '@/hooks/useAuth'

interface AssessmentResult {
    questionId: number
    userAnswer: string
    isCorrect: boolean
    correctAnswer: string
    explanation: string
    skill: string
}

export default function SkillAssessmentPage() {
    const [selectedField, setSelectedField] = useState<string | null>(null)
    const [selectedPath, setSelectedPath] = useState<Path | null>(null)
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
    const [assessmentCompleted, setAssessmentCompleted] = useState(false)
    const [results, setResults] = useState<AssessmentResult[] | null>(null)
    const [activeTab, setActiveTab] = useState("assessment")
    const { user } = useAuth()

    const handlePathSelect = (field: string, path: Path) => {
        console.log('handlePathSelect called with:', { field, path });
        setSelectedField(field)
        setSelectedPath(path)
        setSelectedDifficulty(null)
        setAssessmentCompleted(false)
        setResults(null)
    }

    const handleDifficultySelect = (difficulty: Difficulty) => {
        console.log('handleDifficultySelect called with:', difficulty);
        setSelectedDifficulty(difficulty)
    }

    const handleAssessmentComplete = (assessmentResults: AssessmentResult[]) => {
        console.log('handleAssessmentComplete called with:', assessmentResults);
        setResults(assessmentResults)
        setAssessmentCompleted(true)
    }

    const startNewAssessment = () => {
        setSelectedField(null)
        setSelectedPath(null)
        setSelectedDifficulty(null)
        setAssessmentCompleted(false)
        setResults(null)
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Assessment</CardTitle>
                        <CardDescription>Please log in to access the skill assessment.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className=" mx-auto px-4 py-8">
            <Card className='container'>
                <CardHeader>
                    <CardTitle>Skill Assessment and Progress Tracking</CardTitle>
                    <CardDescription>Evaluate your skills, get recommendations, and track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="assessment" className="flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap">
                                Assessment & Recommendations
                            </TabsTrigger>
                            <TabsTrigger value="progress" className="flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap">
                                Progress Dashboard
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="assessment">
                            {!selectedPath && (
                                <PathSelection onSelect={handlePathSelect} />
                            )}
                            {selectedPath && !selectedDifficulty && (
                                <DifficultySelection onSelect={handleDifficultySelect} />
                            )}
                            {selectedField && selectedPath && selectedDifficulty && !assessmentCompleted && (
                                <SkillAssessment
                                    field={selectedField}
                                    path={selectedPath}
                                    difficulty={selectedDifficulty}
                                    onComplete={handleAssessmentComplete}
                                />
                            )}
                            {assessmentCompleted && results && selectedField && selectedPath && selectedDifficulty && (
                                <>
                                    <AssessmentResults
                                        field={selectedField}
                                        results={results}
                                        path={selectedPath.id}
                                        difficulty={selectedDifficulty}
                                    />
                                    <div className="mt-4 space-x-4">
                                        <Button onClick={startNewAssessment}>Start New Assessment</Button>
                                    </div>
                                </>
                            )}
                        </TabsContent>
                        <TabsContent value="progress">
                            {user && (
                                <ProgressDashboard userId={user.uid} />
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

