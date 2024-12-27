'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Copy, ChevronDown, ChevronUp, Award, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { collection, query, where, getDocs, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AssessmentRecord {
    id: string
    path: string
    difficulty: string
    score: number
    date: Timestamp
    userId: string
    results: {
        [key: number]: {
            question: string
            userAnswer: string
            correctAnswer: string
            explanation: string
        }
    }
    recommendations?: string[]
}

interface ProgressDashboardProps {
    userId: string
}

// Helper function to format recommendation text and extract links
const formatRecommendation = (text: string) => {
    // Remove asterisks and handle numbered items
    const cleanText = text
        .replace(/\*\*/g, '') // Remove double asterisks (**)
        .replace(/^\d+\.\s*/, '') // Remove leading numbers followed by a period and space
        .replace(/["-]/g, ''); // Remove double quotes (") and hyphen (-)


    // Regular expression to match URLs
    const urlRegex = /\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g;

    // Split the text into parts, separating URLs and regular text
    const parts: Array<{ type: 'text' | 'link', content?: string, text?: string, url?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(cleanText)) !== null) {
        // Add text before the URL
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: cleanText.slice(lastIndex, match.index)
            });
        }

        // Add the URL
        parts.push({
            type: 'link',
            text: match[1],
            url: match[2]
        });

        lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < cleanText.length) {
        parts.push({
            type: 'text',
            content: cleanText.slice(lastIndex)
        });
    }

    return parts;
};

const RecommendationItem = ({ content }: { content: string }) => {
    const parts = formatRecommendation(content);

    return (
        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
            <span className="flex h-2 w-2 mt-2 rounded-full bg-blue-500"></span>
            <div className="flex-1 text-gray-700">
                {parts.map((part, index) => (
                    part.type === 'link' ? (
                        <a
                            key={index}
                            href={part.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {part.text}
                        </a>
                    ) : (
                        <span key={index}>{part.content}</span>
                    )
                ))}
            </div>
        </div>
    );
};

export function ProgressDashboard({ userId }: ProgressDashboardProps) {
    const [assessments, setAssessments] = useState<AssessmentRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedAssessment, setExpandedAssessment] = useState<string | null>(null)
    const [alertMessage, setAlertMessage] = useState<string | null>(null)

    useEffect(() => {
        const fetchAssessments = async () => {
            if (!userId) {
                setError('User ID is required')
                setLoading(false)
                return
            }

            try {
                const assessmentsRef = collection(db, 'assessments')
                const q = query(
                    assessmentsRef,
                    where('userId', '==', userId),
                    orderBy('date', 'desc')
                )

                const querySnapshot = await getDocs(q)
                const assessmentData: AssessmentRecord[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as AssessmentRecord))

                setAssessments(assessmentData)
                setError(null)
            } catch (error) {
                console.error('Error fetching assessments:', error)
                setError('Failed to load assessments. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchAssessments()
    }, [userId])

    const toggleAssessment = (assessmentId: string) => {
        setExpandedAssessment(prevId => prevId === assessmentId ? null : assessmentId)
    }

    const deleteAssessment = async (assessmentId: string) => {
        try {
            await deleteDoc(doc(db, 'assessments', assessmentId))
            setAssessments(prevAssessments => prevAssessments.filter(a => a.id !== assessmentId))
            setAlertMessage("The assessment has been successfully removed.")
        } catch (error) {
            console.error('Error deleting assessment:', error)
            setAlertMessage("Failed to delete the assessment. Please try again.")
        }
    }

    const copyRecommendations = (recommendations: string[]) => {
        const text = recommendations.join('\n')
        navigator.clipboard.writeText(text).then(() => {
            setAlertMessage("Recommendations have been copied to clipboard.")
        }, () => {
            setAlertMessage("Failed to copy recommendations. Please try again.")
        })
    }


    const getStrengthsAndWeaknesses = () => {
        const topics = new Map<string, { correct: number; total: number }>();

        assessments.forEach(assessment => {
            if (!assessment.results) return;

            // Log the results structure to debug
            console.log('Assessment Results:', assessment.results);

            // Extract the path as a topic
            const mainTopic = assessment.path?.split('/').pop() || 'General';

            // Initialize topic if it doesn't exist
            if (!topics.has(mainTopic)) {
                topics.set(mainTopic, { correct: 0, total: 0 });
            }

            // Count correct answers for this topic
            Object.values(assessment.results).forEach(result => {
                if (!result) return;

                const current = topics.get(mainTopic)!;
                topics.set(mainTopic, {
                    correct: current.correct + (result.userAnswer === result.correctAnswer ? 1 : 0),
                    total: current.total + 1
                });
            });
        });

        // If no topics were found, return a default dataset
        if (topics.size === 0) {
            return [{ topic: 'No Data Available', percentage: 0 }];
        }

        // Convert to array and calculate percentages
        return Array.from(topics.entries())
            .map(([topic, stats]) => ({
                topic,
                percentage: Math.round((stats.correct / stats.total) * 100)
            }))
            .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
    };


    const getScoreOverTime = () => {
        if (!assessments.length) {
            return [{ date: 'No Data', score: 0 }];
        }

        return assessments
            .map(assessment => ({
                date: assessment.date instanceof Timestamp
                    ? assessment.date.toDate().toLocaleDateString()
                    : 'Invalid Date',
                score: assessment.score || 0
            }))
            .reverse();
    };

    const getDifficultyDistribution = () => {
        if (!assessments.length) {
            return [{ name: 'No Data', value: 0 }];
        }

        const distribution = assessments.reduce((acc, curr) => {
            const difficulty = curr.difficulty || 'Unknown';
            acc[difficulty] = (acc[difficulty] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(distribution)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];




    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="mt-8 space-y-8">
            <Card className="overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white  hover:shadow-xl transition-all duration-300 shadow-xl">
                <CardHeader className="pb-8 pt-6">
                    <CardTitle className="text-3xl font-extrabold">Progress Dashboard</CardTitle>
                    <p className="mt-2 text-lg font-medium text-purple-100">Your learning journey visualized</p>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold">{assessments.length}</p>
                            <p className="text-purple-200">Total Assessments</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {assessments.length > 0
                                    ? Math.round(assessments.reduce((acc, curr) => acc + curr.score, 0) / assessments.length)
                                    : 0}%
                            </p>
                            <p className="text-purple-200">Average Score</p>
                        </div>
                        <Award className="h-12 w-12 text-yellow-300" />
                    </div>
                </CardContent>
            </Card>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Progress Over Time Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Progress Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={getScoreOverTime()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={{ fill: '#8884d8' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Difficulty Distribution Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Assessment Difficulty Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={getDifficultyDistribution()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {getDifficultyDistribution().map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Topic Performance Chart */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl">Topic Performance Analysis</CardTitle>
                        <p className="text-sm text-gray-500">Performance breakdown by assessment path</p>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={getStrengthsAndWeaknesses()}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="topic"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    interval={0}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    label={{
                                        value: 'Success Rate (%)',
                                        angle: -90,
                                        position: 'insideRight',
                                        offset: 60
                                    }}
                                />
                                <Tooltip
                                    formatter={(value) => [`${value}%`, 'Success Rate']}
                                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="percentage" fill="#8884d8">
                                    {getStrengthsAndWeaknesses().map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                entry.percentage >= 70 ? '#00C49F' : // Green for high performance
                                                    entry.percentage >= 40 ? '#FFBB28' : // Yellow for medium performance
                                                        '#FF8042' // Orange for lower performance
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>


            <AnimatePresence>
                {assessments.map((assessment) => (
                    <motion.div
                        key={assessment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 pb-8 pt-6">
                                <div className="flex justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-white">{assessment.path}</CardTitle>
                                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">
                                            <p className="mt-1 text-blue-100">
                                                Difficulty:
                                            </p>
                                            <Badge variant="secondary" className="ml-1">
                                                {assessment.difficulty}
                                            </Badge>
                                        </div>

                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-white">{assessment.score}%</p>
                                        <p className="text-blue-100">{assessment.date.toDate().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="mb-4 flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => toggleAssessment(assessment.id)}
                                        className="w-full justify-between"
                                    >
                                        {expandedAssessment === assessment.id ? 'Hide Details' : 'Show Details'}
                                        {expandedAssessment === assessment.id ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="ml-2">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the assessment.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteAssessment(assessment.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>

                                <AnimatePresence>
                                    {expandedAssessment === assessment.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="mt-6 space-y-6">
                                                <div>
                                                    <h4 className="mb-4 text-lg font-semibold">Questions & Answers</h4>
                                                    {Object.entries(assessment.results).map(([questionId, result]) => (
                                                        <div key={questionId} className="mb-6 rounded-lg bg-gray-50 p-4 shadow-sm">
                                                            <p className="mb-2 font-medium text-gray-800">{result.question}</p>
                                                            <div className="grid gap-4 md:grid-cols-2">
                                                                <div>
                                                                    <p className="mb-1 text-sm font-semibold">Your Answer:</p>
                                                                    <Badge variant={result.userAnswer === result.correctAnswer ? "success" : "destructive"}>
                                                                        {result.userAnswer}
                                                                    </Badge>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-1 text-sm font-semibold">Correct Answer:</p>
                                                                    <Badge variant="success">{result.correctAnswer}</Badge>
                                                                </div>
                                                            </div>
                                                            <p className="mt-2 text-sm text-gray-600">
                                                                {result.explanation}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {assessment.recommendations && assessment.recommendations.length > 0 && (
                                                    <div>
                                                        <div className="mb-4 flex items-center justify-between">
                                                            <h4 className="text-lg font-semibold">Recommendations</h4>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => copyRecommendations(assessment.recommendations!)}
                                                                className="flex items-center"
                                                            >
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Copy All
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {assessment.recommendations.map((recommendation, index) => (
                                                                <RecommendationItem
                                                                    key={index}
                                                                    content={recommendation}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>

            <AlertDialog open={!!alertMessage} onOpenChange={() => setAlertMessage(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Notification</AlertDialogTitle>
                        <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}