// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from 'lucide-react'
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// interface Question {
//     text: string
//     options: string[]
//     correctAnswer: number
//     explanation: string
//     skill: string
// }

// interface Answer {
//     questionId: number
//     userAnswer: string
//     isCorrect: boolean
//     correctAnswer: string
//     explanation: string
//     skill: string
// }

// interface SkillAssessmentProps {
//     path: string
//     difficulty: string
//     onComplete: (results: Answer[]) => void
// }

// export function SkillAssessment({ path, difficulty, onComplete }: SkillAssessmentProps) {
//     const [questions, setQuestions] = useState<Question[]>([])
//     const [currentQuestion, setCurrentQuestion] = useState(0)
//     const [answers, setAnswers] = useState<Answer[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 setLoading(true)
//                 setError(null)

//                 const response = await fetch('/api/generate-questions', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ path, difficulty }),
//                 })

//                 const data = await response.json()

//                 if (!response.ok) {
//                     throw new Error(data.error || `HTTP error! status: ${response.status}`)
//                 }

//                 setQuestions(data.questions)
//             } catch (error) {
//                 console.error('Error fetching questions:', error)
//                 setError(error instanceof Error ? error.message : 'An unexpected error occurred')
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchQuestions()
//     }, [path, difficulty])

//     const handleAnswer = (selectedOption: string) => {
//         const currentQ = questions[currentQuestion]
//         const answer: Answer = {
//             questionId: currentQuestion,
//             userAnswer: selectedOption,
//             isCorrect: selectedOption === currentQ.options[currentQ.correctAnswer],
//             correctAnswer: currentQ.options[currentQ.correctAnswer],
//             explanation: currentQ.explanation,
//             skill: currentQ.skill
//         }
//         setAnswers([...answers.filter(a => a.questionId !== currentQuestion), answer])
//     }

//     const handleNext = () => {
//         if (currentQuestion < questions.length - 1) {
//             setCurrentQuestion(currentQuestion + 1)
//         } else {
//             onComplete(answers)
//         }
//     }

//     if (loading) {
//         return (
//             <Card className="min-h-[300px]">
//                 <CardContent className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                         <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//                         <div>Loading questions...</div>
//                     </div>
//                 </CardContent>
//             </Card>
//         )
//     }

//     if (error) {
//         return (
//             <Alert variant="destructive">
//                 <AlertTitle>Error</AlertTitle>
//                 <AlertDescription>
//                     <div className="space-y-4">
//                         <div>{error}</div>
//                         <Button onClick={() => window.location.reload()}>Try Again</Button>
//                     </div>
//                 </AlertDescription>
//             </Alert>
//         )
//     }

//     const currentQ = questions[currentQuestion]
//     if (!currentQ) {
//         return (
//             <Alert>
//                 <AlertTitle>No Questions Available</AlertTitle>
//                 <AlertDescription>
//                     <div className="space-y-4">
//                         <div>Sorry, no questions are available for this assessment.</div>
//                         <Button onClick={() => window.location.reload()}>Try Again</Button>
//                     </div>
//                 </AlertDescription>
//             </Alert>
//         )
//     }

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
//                 <CardDescription>
//                     <div className="mt-2">
//                         <div className="font-medium">Skill: {currentQ.skill}</div>
//                         <div className="mt-2">{currentQ.text}</div>
//                     </div>
//                 </CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <RadioGroup
//                     value={answers.find(a => a.questionId === currentQuestion)?.userAnswer || ""}
//                     onValueChange={handleAnswer}
//                     className="space-y-3"
//                 >
//                     {currentQ.options.map((option, index) => (
//                         <div key={index} className="flex items-center space-x-3">
//                             <RadioGroupItem value={option} id={`option-${index}`} />
//                             <Label className="cursor-pointer" htmlFor={`option-${index}`}>{option}</Label>
//                         </div>
//                     ))}
//                 </RadioGroup>
//                 <Button
//                     onClick={handleNext}
//                     className="mt-6 w-full sm:w-auto"
//                     disabled={!answers.find(a => a.questionId === currentQuestion)}
//                 >
//                     {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
//                 </Button>
//             </CardContent>
//         </Card>
//     )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from 'lucide-react'
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Progress } from "@/components/ui/progress"

// interface Question {
//     text: string
//     options: string[]
//     correctAnswer: number
//     explanation: string
//     skill: string
// }

// interface Answer {
//     questionId: number
//     userAnswer: string
//     isCorrect: boolean
//     correctAnswer: string
//     explanation: string
//     skill: string
// }

// interface SkillAssessmentProps {
//     field: string
//     path: { id: string; name: string; icon: string };
//     difficulty: string
//     onComplete: (results: Answer[]) => void
// }

// export function SkillAssessment({ field, path, difficulty, onComplete }: SkillAssessmentProps) {
//     const [questions, setQuestions] = useState<Question[]>([])
//     const [currentQuestion, setCurrentQuestion] = useState(0)
//     const [answers, setAnswers] = useState<Answer[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)

//     useEffect(() => {
//         const fetchQuestions = async () => {
//             try {
//                 setLoading(true)
//                 setError(null)

//                 const response = await fetch('/api/generate-questions', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ field, path, difficulty }),
//                 })

//                 const data = await response.json()

//                 if (!response.ok) {
//                     throw new Error(data.error || `HTTP error! status: ${response.status}`)
//                 }

//                 setQuestions(data.questions)
//             } catch (error) {
//                 console.error('Error fetching questions:', error)
//                 setError(error instanceof Error ? error.message : 'An unexpected error occurred')
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchQuestions()
//     }, [field, path, difficulty])

//     const handleAnswer = (selectedOption: string) => {
//         const currentQ = questions[currentQuestion]
//         const answer: Answer = {
//             questionId: currentQuestion,
//             userAnswer: selectedOption,
//             isCorrect: selectedOption === currentQ.options[currentQ.correctAnswer],
//             correctAnswer: currentQ.options[currentQ.correctAnswer],
//             explanation: currentQ.explanation,
//             skill: currentQ.skill
//         }
//         setAnswers([...answers.filter(a => a.questionId !== currentQuestion), answer])
//     }

//     const handleNext = () => {
//         if (currentQuestion < questions.length - 1) {
//             setCurrentQuestion(currentQuestion + 1)
//         } else {
//             onComplete(answers)
//         }
//     }

//     if (loading) {
//         return (
//             <Card className="min-h-[300px]">
//                 <CardContent className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                         <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//                         <div>Loading questions...</div>
//                     </div>
//                 </CardContent>
//             </Card>
//         )
//     }

//     if (error) {
//         return (
//             <Alert variant="destructive">
//                 <AlertTitle>Error</AlertTitle>
//                 <AlertDescription>
//                     <div className="space-y-4">
//                         <div>{error}</div>
//                         <Button onClick={() => window.location.reload()}>Try Again</Button>
//                     </div>
//                 </AlertDescription>
//             </Alert>
//         )
//     }

//     const currentQ = questions[currentQuestion]
//     if (!currentQ) {
//         return (
//             <Alert>
//                 <AlertTitle>No Questions Available</AlertTitle>
//                 <AlertDescription>
//                     <div className="space-y-4">
//                         <div>Sorry, no questions are available for this assessment.</div>
//                         <Button onClick={() => window.location.reload()}>Try Again</Button>
//                     </div>
//                 </AlertDescription>
//             </Alert>
//         )
//     }

//     return (
//         <Card className="w-full max-w-4xl mx-auto">
//             <CardHeader>
//                 <CardTitle className="text-2xl font-bold">Question {currentQuestion + 1} of {questions.length}</CardTitle>
//                 <CardDescription>
//                     <Progress value={(currentQuestion + 1) / questions.length * 100} className="mt-2" />
//                     <div className="mt-4">
//                         <span className="font-medium text-indigo-600">Field: {field}</span>
//                         <span className="font-medium text-indigo-600 ml-4">Path: {path.id}</span>
//                         <span className="font-medium text-indigo-600 ml-4">Skill: {currentQ.skill}</span>
//                     </div>
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//                 <AnimatePresence mode="wait">
//                     <motion.div
//                         key={currentQuestion}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <div className="text-lg font-medium mb-6">{currentQ.text}</div>
//                         <RadioGroup
//                             value={answers.find(a => a.questionId === currentQuestion)?.userAnswer || ""}
//                             onValueChange={handleAnswer}
//                             className="space-y-4"
//                         >
//                             {currentQ.options.map((option, index) => (
//                                 <div key={index} className="flex items-center space-x-3">
//                                     <RadioGroupItem value={option} id={`option-${index}`} />
//                                     <Label className="cursor-pointer text-base" htmlFor={`option-${index}`}>{option}</Label>
//                                 </div>
//                             ))}
//                         </RadioGroup>
//                         <Button
//                             onClick={handleNext}
//                             className="mt-8 w-full sm:w-auto"
//                             disabled={!answers.find(a => a.questionId === currentQuestion)}
//                         >
//                             {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
//                         </Button>
//                     </motion.div>
//                 </AnimatePresence>
//             </CardContent>
//         </Card>
//     )
// }



'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Question {
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    skill: string;
}

interface Answer {
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    skill: string;
}

interface SkillAssessmentProps {
    field: string;
    path: { id: string; name: string; icon: string };
    difficulty: string;
    onComplete: (results: Answer[]) => void;
}

export function SkillAssessment({ field, path, difficulty, onComplete }: SkillAssessmentProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/generate-questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ field, path, difficulty }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                setQuestions(data.questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [field, path, difficulty]);

    const handleAnswer = (selectedOption: string) => {
        const currentQ = questions[currentQuestion];
        const answer: Answer = {
            questionId: currentQuestion,
            userAnswer: selectedOption,
            isCorrect: selectedOption === currentQ.options[currentQ.correctAnswer],
            correctAnswer: currentQ.options[currentQ.correctAnswer],
            explanation: currentQ.explanation,
            skill: currentQ.skill
        };
        setAnswers([...answers.filter(a => a.questionId !== currentQuestion), answer]);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            onComplete(answers);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    if (loading) {
        return (
            <Card className="min-h-[300px] bg-gray-100 shadow rounded-lg flex items-center justify-center">
                <div>
                    <Loader2 className="h-10 w-10 mx-auto mb-4 text-blue-500 animate-spin" />
                    <div className="text-lg font-medium text-gray-700 text-center">Loading questions...</div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="text-gray-700">
                    <div className="space-y-4">
                        <div>{error}</div>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                </AlertDescription>
            </Alert>
        );
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ) {
        return (
            <Alert>
                <AlertTitle>No Questions Available</AlertTitle>
                <AlertDescription className="text-gray-700">
                    <div className="space-y-4">
                        <div>Sorry, no questions are available for this assessment.</div>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-lg bg-white overflow-hidden">
            <CardHeader className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-800">
                        Question {currentQuestion + 1} of {questions.length}
                    </CardTitle>
                    <Progress value={(currentQuestion + 1) / questions.length * 100} className="h-2 rounded-full bg-blue-500 w-24" />
                </div>
                <CardDescription className="text-sm text-gray-500 mt-1">
                    <span className="mr-2">Field: {field}</span>
                    <span className="mr-2">Path: {path.id}</span>
                    <span>Skill: {currentQ.skill}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, type: "tween" }}
                        className="space-y-6"
                    >
                        <div className="text-lg font-medium text-gray-800">{currentQ.text}</div>
                        <RadioGroup
                            value={answers.find(a => a.questionId === currentQuestion)?.userAnswer || ""}
                            onValueChange={handleAnswer}
                            className="space-y-4"
                        >
                            {currentQ.options.map((option, index) => (
                                <div key={index} className="flex items-center">
                                    <RadioGroupItem value={option} id={`option-${index}`} className="peer hidden" />
                                    <Label
                                        htmlFor={`option-${index}`}
                                        className={cn(
                                            "w-full p-3 rounded-md border border-gray-300 cursor-pointer transition-colors duration-200 hover:border-blue-500 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-800",
                                            answers.find(a => a.questionId === currentQuestion)?.userAnswer === option && "ring-2 ring-blue-500"
                                        )}
                                    >
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <div className="flex justify-between mt-8">
                            <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline">
                                Previous
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={!answers.find(a => a.questionId === currentQuestion)}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}