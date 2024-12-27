// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
// import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { useAuth } from '@/hooks/useAuth'
// import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
// import { Alert, AlertDescription, AlertTitle } from './ui/alert'

// interface Answer {
//     questionId: number
//     userAnswer: string
//     isCorrect: boolean
//     correctAnswer: string
//     explanation: string
//     skill: string
// }

// interface AssessmentResultsProps {
//     results: Array<Answer>
//     field: string
//     path: string
//     difficulty: string
// }

// export function AssessmentResults({ field, results, path, difficulty }: AssessmentResultsProps) {
//     const [recommendations, setRecommendations] = useState<string[]>([])
//     const [loading, setLoading] = useState(true)
//     const [saveError, setSaveError] = useState<string | null>(null)
//     const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
//     const { user } = useAuth()

//     const calculateScore = (): number => {
//         if (results.length === 0) return 0
//         const correctAnswers = results.filter(answer => answer.isCorrect).length
//         return Math.round((correctAnswers / results.length) * 100)
//     }

//     useEffect(() => {
//         console.log('AssessmentResults useEffect triggered with props:', { field, path, difficulty });
//         const saveAndFetchRecommendations = async () => {
//             try {
//                 if (!field) {
//                     throw new Error('Field is undefined');
//                 }
//                 if (!user) {
//                     throw new Error('User is not authenticated');
//                 }
//                 const score = calculateScore()
//                 const assessmentData = {
//                     userId: user.uid,
//                     field,
//                     path,
//                     difficulty,
//                     score,
//                     results,
//                     date: serverTimestamp(),
//                     recommendations: [] // Initialize empty array
//                 }

//                 // Save initial assessment
//                 const docRef = await addDoc(collection(db, 'assessments'), assessmentData)

//                 // Fetch recommendations
//                 const response = await fetch('/api/gemini-recommendations', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         results: results.map(r => ({
//                             skill: r.skill,
//                             isCorrect: r.isCorrect
//                         })),
//                         field,
//                         path,
//                         difficulty
//                     }),
//                 })

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch recommendations')
//                 }

//                 const data = await response.json()
//                 setRecommendations(data.recommendations)

//                 // Update document with recommendations
//                 await updateDoc(doc(db, 'assessments', docRef.id), {
//                     recommendations: data.recommendations
//                 })
//             } catch (error) {
//                 console.error('Error saving assessment or fetching recommendations:', error);
//                 setSaveError(error instanceof Error ? error.message : 'An unexpected error occurred');
//                 setRecommendations(['Error saving assessment or fetching recommendations. Please try again.']);
//             } finally {
//                 setLoading(false)
//             }
//         }

//         if (field && path && difficulty && results.length > 0) {
//             saveAndFetchRecommendations()
//         } else {
//             console.error('Missing required props:', { field, path, difficulty, resultsLength: results.length });
//             setSaveError('Missing required assessment information');
//             setLoading(false);
//         }
//     }, [results, field, path, difficulty, user])

//     const toggleQuestion = (questionId: number) => {
//         setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
//     }

//     if (!field || !path || !difficulty) {
//         return (
//             <Card className="w-full max-w-4xl mx-auto">
//                 <CardContent className="p-6">
//                     <Alert variant="destructive">
//                         <AlertTitle>Error</AlertTitle>
//                         <AlertDescription>
//                             Missing required assessment information. Please try again.
//                         </AlertDescription>
//                     </Alert>
//                 </CardContent>
//             </Card>
//         )
//     }

//     return (
//         <Card className="w-full max-w-4xl mx-auto">
//             <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//                 <CardTitle className="text-2xl font-bold">Assessment Results</CardTitle>
//                 <CardDescription className="text-blue-100">Your performance and personalized recommendations</CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//                 <AlertDialog open={!!saveError}>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Error</AlertDialogTitle>
//                             <AlertDialogDescription>{saveError}</AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogAction onClick={() => setSaveError(null)}>OK</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>

//                 <div className="mb-8">
//                     <h3 className="text-xl font-semibold mb-4">Overall Score:</h3>
//                     <div className="flex items-center gap-4">
//                         <Progress value={calculateScore()} className="w-full" />
//                         <Badge variant="outline" className="text-lg font-bold">
//                             {calculateScore()}%
//                         </Badge>
//                     </div>
//                 </div>

//                 <div className="mb-8">
//                     <h3 className="text-xl font-semibold mb-4">Detailed Results:</h3>
//                     <div className="space-y-4">
//                         {results.map((result, index) => (
//                             <Card key={index} className="overflow-hidden">
//                                 <Button
//                                     variant="ghost"
//                                     className="w-full justify-between p-4 text-left"
//                                     onClick={() => toggleQuestion(result.questionId)}
//                                 >
//                                     <div className="flex items-center gap-2">
//                                         {result.isCorrect ? (
//                                             <CheckCircle className="text-green-500" />
//                                         ) : (
//                                             <XCircle className="text-red-500" />
//                                         )}
//                                         <span className="font-medium">Question {result.questionId + 1}</span>
//                                     </div>
//                                     {expandedQuestion === result.questionId ? (
//                                         <ChevronUp className="h-5 w-5" />
//                                     ) : (
//                                         <ChevronDown className="h-5 w-5" />
//                                     )}
//                                 </Button>
//                                 <AnimatePresence>
//                                     {expandedQuestion === result.questionId && (
//                                         <motion.div
//                                             initial={{ height: 0, opacity: 0 }}
//                                             animate={{ height: 'auto', opacity: 1 }}
//                                             exit={{ height: 0, opacity: 0 }}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             <CardContent className="pt-0">
//                                                 <span className="text-sm text-muted-foreground mb-2">
//                                                     Skill: {result.skill}
//                                                 </span>

//                                                 <div className="flex items-center gap-2 mb-2">
//                                                     Your Answer:
//                                                     <Badge variant={result.isCorrect ? "success" : "destructive"}>
//                                                         {result.userAnswer}
//                                                     </Badge>
//                                                 </div>

//                                                 {!result.isCorrect && (
//                                                     <div className="flex items-center gap-2 mb-2">
//                                                         Correct Answer:
//                                                         <Badge variant="success">
//                                                             {result.correctAnswer}
//                                                         </Badge>
//                                                     </div>
//                                                 )}
//                                                 <div className="text-sm mt-2 p-2 bg-gray-100 rounded-md">
//                                                     {result.explanation}
//                                                 </div>
//                                             </CardContent>
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </Card>
//                         ))}
//                     </div>
//                 </div>

//                 <div>
//                     <h3 className="text-xl font-semibold mb-4">Recommendations:</h3>
//                     {loading ? (
//                         <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-md">
//                             <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
//                             <div className="text-blue-700">Generating personalized recommendations...</div>
//                         </div>
//                     ) : (
//                         <div className="space-y-2">
//                             {recommendations.map((recommendation, index) => (
//                                 <motion.div
//                                     key={index}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                                     className="flex gap-2 p-2 bg-green-50 rounded-md"
//                                 >
//                                     <span className="text-green-500">•</span>
//                                     <div className="text-green-800">{recommendation}</div>
//                                 </motion.div>

//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
// import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { useAuth } from '@/hooks/useAuth'
// import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
// import { Alert, AlertDescription, AlertTitle } from './ui/alert'

// interface Answer {
//     questionId: number
//     userAnswer: string
//     isCorrect: boolean
//     correctAnswer: string
//     explanation: string
//     skill: string
// }

// interface AssessmentResultsProps {
//     results: Array<Answer>
//     field: string
//     path: string
//     difficulty: string
// }

// // Helper function to format recommendation text and extract links
// const formatRecommendation = (text: string) => {
//     // Remove asterisks and handle numbered items
//     const cleanText = text.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '');

//     // Regular expression to match URLs
//     const urlRegex = /\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g;

//     // Split the text into parts, separating URLs and regular text
//     const parts: Array<{ type: 'text' | 'link', content?: string, text?: string, url?: string }> = [];
//     let lastIndex = 0;
//     let match;

//     while ((match = urlRegex.exec(cleanText)) !== null) {
//         // Add text before the URL
//         if (match.index > lastIndex) {
//             parts.push({
//                 type: 'text',
//                 content: cleanText.slice(lastIndex, match.index)
//             });
//         }

//         // Add the URL
//         parts.push({
//             type: 'link',
//             text: match[1],
//             url: match[2]
//         });

//         lastIndex = match.index + match[0].length;
//     }

//     // Add any remaining text
//     if (lastIndex < cleanText.length) {
//         parts.push({
//             type: 'text',
//             content: cleanText.slice(lastIndex)
//         });
//     }

//     return parts;
// };

// const RecommendationItem = ({ content }: { content: string }) => {
//     const parts = formatRecommendation(content);

//     return (
//         <div className="flex gap-2 items-start p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
//             <span className="text-blue-500 mt-1">•</span>
//             <div className="text-gray-700 flex-1">
//                 {parts.map((part, index) => (
//                     part.type === 'link' ? (
//                         <a
//                             key={index}
//                             href={part.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-800 underline"
//                         >
//                             {part.text}
//                         </a>
//                     ) : (
//                         <span key={index}>{part.content}</span>
//                     )
//                 ))}
//             </div>
//         </div>
//     );
// };

// export function AssessmentResults({ field, results, path, difficulty }: AssessmentResultsProps) {
//     const [recommendations, setRecommendations] = useState<string[]>([])
//     const [loading, setLoading] = useState(true)
//     const [saveError, setSaveError] = useState<string | null>(null)
//     const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
//     const { user } = useAuth()

//     const calculateScore = (): number => {
//         if (results.length === 0) return 0
//         const correctAnswers = results.filter(answer => answer.isCorrect).length
//         return Math.round((correctAnswers / results.length) * 100)
//     }

//     useEffect(() => {
//         console.log('AssessmentResults useEffect triggered with props:', { field, path, difficulty });
//         const saveAndFetchRecommendations = async () => {
//             try {
//                 if (!user) {
//                     console.error('User is not authenticated');
//                     setSaveError('Please log in to save your results and fetch recommendations.');
//                     return;
//                 }

//                 if (!field) {
//                     throw new Error('Field is undefined');
//                 }

//                 const score = calculateScore();
//                 const assessmentData = {
//                     userId: user.uid,
//                     field,
//                     path,
//                     difficulty,
//                     score,
//                     results,
//                     date: serverTimestamp(),
//                     recommendations: []
//                 };

//                 const docRef = await addDoc(collection(db, 'assessments'), assessmentData);

//                 const response = await fetch('/api/gemini-recommendations', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         results: results.map(r => ({
//                             skill: r.skill,
//                             isCorrect: r.isCorrect
//                         })),
//                         field,
//                         path,
//                         difficulty
//                     }),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch recommendations');
//                 }

//                 const data = await response.json();
//                 setRecommendations(data.recommendations);

//                 await updateDoc(doc(db, 'assessments', docRef.id), {
//                     recommendations: data.recommendations
//                 });
//             } catch (error) {
//                 console.error('Error saving assessment or fetching recommendations:', error);
//                 setSaveError(error instanceof Error ? error.message : 'An unexpected error occurred');
//                 setRecommendations(['Error saving assessment or fetching recommendations. Please try again.']);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (field && path && difficulty && results.length > 0) {
//             saveAndFetchRecommendations();
//         } else {
//             console.error('Missing required props:', { field, path, difficulty, resultsLength: results.length });
//             setSaveError('Missing required assessment information');
//             setLoading(false);
//         }
//     }, [results, field, path, difficulty, user]);

//     const toggleQuestion = (questionId: number) => {
//         setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
//     }

//     if (!field || !path || !difficulty) {
//         return (
//             <Card className="w-full max-w-4xl mx-auto">
//                 <CardContent className="p-6">
//                     <Alert variant="destructive">
//                         <AlertTitle>Error</AlertTitle>
//                         <AlertDescription>
//                             Missing required assessment information. Please try again.
//                         </AlertDescription>
//                     </Alert>
//                 </CardContent>
//             </Card>
//         )
//     }

//     return (
//         <Card className="w-full max-w-4xl mx-auto">
//             <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//                 <CardTitle className="text-2xl font-bold">Assessment Results</CardTitle>
//                 <CardDescription className="text-blue-100">Your performance and personalized recommendations</CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//                 <AlertDialog open={!!saveError}>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Error</AlertDialogTitle>
//                             <AlertDialogDescription>{saveError}</AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogAction onClick={() => setSaveError(null)}>OK</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>

//                 <div className="mb-8">
//                     <h3 className="text-xl font-semibold mb-4">Overall Score:</h3>
//                     <div className="flex items-center gap-4">
//                         <Progress value={calculateScore()} className="w-full" />
//                         <Badge variant="outline" className="text-lg font-bold">
//                             {calculateScore()}%
//                         </Badge>
//                     </div>
//                 </div>

//                 <div className="mb-8">
//                     <h3 className="text-xl font-semibold mb-4">Detailed Results:</h3>
//                     <div className="space-y-4">
//                         {results.map((result, index) => (
//                             <Card key={index} className="overflow-hidden">
//                                 <Button
//                                     variant="ghost"
//                                     className="w-full justify-between p-4 text-left"
//                                     onClick={() => toggleQuestion(result.questionId)}
//                                 >
//                                     <div className="flex items-center gap-2">
//                                         {result.isCorrect ? (
//                                             <CheckCircle className="text-green-500" />
//                                         ) : (
//                                             <XCircle className="text-red-500" />
//                                         )}
//                                         <span className="font-medium">Question {result.questionId + 1}</span>
//                                     </div>
//                                     {expandedQuestion === result.questionId ? (
//                                         <ChevronUp className="h-5 w-5" />
//                                     ) : (
//                                         <ChevronDown className="h-5 w-5" />
//                                     )}
//                                 </Button>
//                                 <AnimatePresence>
//                                     {expandedQuestion === result.questionId && (
//                                         <motion.div
//                                             initial={{ height: 0, opacity: 0 }}
//                                             animate={{ height: 'auto', opacity: 1 }}
//                                             exit={{ height: 0, opacity: 0 }}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             <CardContent className="pt-0">
//                                                 <span className="text-sm text-muted-foreground mb-2">
//                                                     Skill: {result.skill}
//                                                 </span>

//                                                 <div className="flex items-center gap-2 mb-2">
//                                                     Your Answer:
//                                                     <Badge variant={result.isCorrect ? "success" : "destructive"}>
//                                                         {result.userAnswer}
//                                                     </Badge>
//                                                 </div>

//                                                 {!result.isCorrect && (
//                                                     <div className="flex items-center gap-2 mb-2">
//                                                         Correct Answer:
//                                                         <Badge variant="success">
//                                                             {result.correctAnswer}
//                                                         </Badge>
//                                                     </div>
//                                                 )}
//                                                 <div className="text-sm mt-2 p-2 bg-gray-100 rounded-md">
//                                                     {result.explanation}
//                                                 </div>
//                                             </CardContent>
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </Card>
//                         ))}
//                     </div>
//                 </div>

//                 <div>
//                     <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
//                     {loading ? (
//                         <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-md">
//                             <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
//                             <div className="text-blue-700">Generating personalized recommendations...</div>
//                         </div>
//                     ) : (
//                         <div className="space-y-3">
//                             {recommendations.map((recommendation, index) => (
//                                 <motion.div
//                                     key={index}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                                 >
//                                     <RecommendationItem content={recommendation} />
//                                 </motion.div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
// import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { useAuth } from '@/hooks/useAuth'
// import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
// import { Alert, AlertDescription, AlertTitle } from './ui/alert'

// interface Answer {
//     questionId: number
//     userAnswer: string
//     isCorrect: boolean
//     correctAnswer: string
//     explanation: string
//     skill: string
// }

// interface AssessmentResultsProps {
//     results: Array<Answer>
//     field: string
//     path: string
//     difficulty: string
// }

// // Helper function to format recommendation text and extract links
// const formatRecommendation = (text: string) => {
//     // Remove asterisks and handle numbered items
//     const cleanText = text.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '');

//     // Regular expression to match URLs
//     const urlRegex = /\[(.*?)\]$$(https?:\/\/[^\s$$]+)\)/g;

//     // Split the text into parts, separating URLs and regular text
//     const parts: Array<{ type: 'text' | 'link', content?: string, text?: string, url?: string }> = [];
//     let lastIndex = 0;
//     let match;

//     while ((match = urlRegex.exec(cleanText)) !== null) {
//         // Add text before the URL
//         if (match.index > lastIndex) {
//             parts.push({
//                 type: 'text',
//                 content: cleanText.slice(lastIndex, match.index)
//             });
//         }

//         // Add the URL
//         parts.push({
//             type: 'link',
//             text: match[1],
//             url: match[2]
//         });

//         lastIndex = match.index + match[0].length;
//     }

//     // Add any remaining text
//     if (lastIndex < cleanText.length) {
//         parts.push({
//             type: 'text',
//             content: cleanText.slice(lastIndex)
//         });
//     }

//     return parts;
// };

// const RecommendationItem = ({ content }: { content: string }) => {
//     const parts = formatRecommendation(content);

//     return (
//         <div className="flex gap-2 items-start p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
//             <span className="text-blue-500 mt-1">•</span>
//             <div className="text-gray-700 flex-1">
//                 {parts.map((part, index) => (
//                     part.type === 'link' ? (
//                         <a
//                             key={index}
//                             href={part.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-800 underline"
//                         >
//                             {part.text}
//                         </a>
//                     ) : (
//                         <span key={index}>{part.content}</span>
//                     )
//                 ))}
//             </div>
//         </div>
//     );
// };

// export function AssessmentResults({ field, results, path, difficulty }: AssessmentResultsProps) {
//     const [recommendations, setRecommendations] = useState<string[]>([])
//     const [loading, setLoading] = useState(true)
//     const [saveError, setSaveError] = useState<string | null>(null)
//     const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
//     const { user } = useAuth()

//     const calculateScore = (): number => {
//         if (results.length === 0) return 0
//         const correctAnswers = results.filter(answer => answer.isCorrect).length
//         return Math.round((correctAnswers / results.length) * 100)
//     }

//     useEffect(() => {
//         console.log('AssessmentResults useEffect triggered with props:', { field, path, difficulty });
//         const saveAndFetchRecommendations = async () => {
//             try {
//                 if (!user) {
//                     // console.error('User is not authenticated');
//                     // setSaveError('Please log in to save your results and fetch recommendations.');
//                     return;
//                 }

//                 if (!field) {
//                     throw new Error('Field is undefined');
//                 }

//                 const score = calculateScore();
//                 const assessmentData = {
//                     userId: user.uid,
//                     field,
//                     path,
//                     difficulty,
//                     score,
//                     results,
//                     date: serverTimestamp(),
//                     recommendations: []
//                 };

//                 const docRef = await addDoc(collection(db, 'assessments'), assessmentData);

//                 const response = await fetch('/api/gemini-recommendations', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         results: results.map(r => ({
//                             skill: r.skill,
//                             isCorrect: r.isCorrect
//                         })),
//                         field,
//                         path,
//                         difficulty
//                     }),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch recommendations');
//                 }

//                 const data = await response.json();
//                 setRecommendations(data.recommendations);

//                 await updateDoc(doc(db, 'assessments', docRef.id), {
//                     recommendations: data.recommendations
//                 });
//             } catch (error) {
//                 console.error('Error saving assessment or fetching recommendations:', error);
//                 setSaveError(error instanceof Error ? error.message : 'An unexpected error occurred');
//                 setRecommendations(['Error saving assessment or fetching recommendations. Please try again.']);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (field && path && difficulty && results.length > 0) {
//             saveAndFetchRecommendations();
//         } else {
//             console.error('Missing required props:', { field, path, difficulty, resultsLength: results.length });
//             setSaveError('Missing required assessment information');
//             setLoading(false);
//         }
//     }, [results, field, path, difficulty, user]);

//     const toggleQuestion = (questionId: number) => {
//         setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
//     }

//     if (!field || !path || !difficulty) {
//         return (
//             <Card className="w-full max-w-4xl mx-auto">
//                 <CardContent className="p-6">
//                     <Alert variant="destructive">
//                         <AlertTitle>Error</AlertTitle>
//                         <AlertDescription>
//                             Missing required assessment information. Please try again.
//                         </AlertDescription>
//                     </Alert>
//                 </CardContent>
//             </Card>
//         )
//     }

//     return (
//         <Card className="w-full max-w-4xl mx-auto">
//             <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//                 <CardTitle className="text-2xl font-bold">Assessment Results</CardTitle>
//                 <CardDescription className="text-blue-100">Your performance and personalized recommendations</CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//                 <AlertDialog open={!!saveError}>
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Error</AlertDialogTitle>
//                             <AlertDialogDescription>{saveError}</AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogAction onClick={() => setSaveError(null)}>OK</AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>

//                 <div className="mb-8">
//                     <h3 className="text-xl font-semibold mb-4">Overall Score:</h3>
//                     <div className="flex items-center gap-4">
//                         <Progress value={calculateScore()} className="w-full" />
//                         <Badge variant="outline" className="text-lg font-bold">
//                             {calculateScore()}%
//                         </Badge>
//                     </div>
//                 </div>

//                 <div className="mb-8">
//                     <h3 className="text-xl font-semibold mb-4">Detailed Results:</h3>
//                     <div className="space-y-4">
//                         {results.map((result, index) => (
//                             <Card key={index} className="overflow-hidden">
//                                 <Button
//                                     variant="ghost"
//                                     className="w-full justify-between p-4 text-left"
//                                     onClick={() => toggleQuestion(result.questionId)}
//                                 >
//                                     <div className="flex items-center gap-2">
//                                         {result.isCorrect ? (
//                                             <CheckCircle className="text-green-500" />
//                                         ) : (
//                                             <XCircle className="text-red-500" />
//                                         )}
//                                         <span className="font-medium">Question {result.questionId + 1}</span>
//                                     </div>
//                                     {expandedQuestion === result.questionId ? (
//                                         <ChevronUp className="h-5 w-5" />
//                                     ) : (
//                                         <ChevronDown className="h-5 w-5" />
//                                     )}
//                                 </Button>
//                                 <AnimatePresence>
//                                     {expandedQuestion === result.questionId && (
//                                         <motion.div
//                                             initial={{ height: 0, opacity: 0 }}
//                                             animate={{ height: 'auto', opacity: 1 }}
//                                             exit={{ height: 0, opacity: 0 }}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             <CardContent className="pt-0">
//                                                 <span className="text-sm text-muted-foreground mb-2">
//                                                     Skill: {result.skill}
//                                                 </span>

//                                                 <div className="flex items-center gap-2 mb-2">
//                                                     Your Answer:
//                                                     <Badge variant={result.isCorrect ? "success" : "destructive"}>
//                                                         {result.userAnswer}
//                                                     </Badge>
//                                                 </div>

//                                                 {!result.isCorrect && (
//                                                     <div className="flex items-center gap-2 mb-2">
//                                                         Correct Answer:
//                                                         <Badge variant="success">
//                                                             {result.correctAnswer}
//                                                         </Badge>
//                                                     </div>
//                                                 )}
//                                                 <div className="text-sm mt-2 p-2 bg-gray-100 rounded-md">
//                                                     {result.explanation}
//                                                 </div>
//                                             </CardContent>
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </Card>
//                         ))}
//                     </div>
//                 </div>

//                 <div>
//                     <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
//                     {loading ? (
//                         <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-md">
//                             <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
//                             <div className="text-blue-700">Generating personalized recommendations...</div>
//                         </div>
//                     ) : (
//                         <div className="space-y-3">
//                             {recommendations.map((recommendation, index) => (
//                                 <motion.div
//                                     key={index}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                                 >
//                                     <RecommendationItem content={recommendation} />
//                                 </motion.div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }



// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
// import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { useAuth } from '@/hooks/useAuth'
// import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
// import { Alert, AlertDescription, AlertTitle } from './ui/alert'

// interface Answer {
//     questionId: number
//     userAnswer: string
//     isCorrect: boolean
//     correctAnswer: string
//     explanation: string
//     skill: string
// }

// interface AssessmentResultsProps {
//     results: Array<Answer>
//     field: string
//     path: string
//     difficulty: string
// }

// const formatRecommendation = (text: string) => {
//     const cleanText = text.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '');
//     const urlRegex = /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g;
//     const parts: Array<{ type: 'text' | 'link', content?: string, text?: string, url?: string }> = [];
//     let lastIndex = 0;
//     let match;

//     while ((match = urlRegex.exec(cleanText)) !== null) {
//         if (match.index > lastIndex) {
//             parts.push({ type: 'text', content: cleanText.slice(lastIndex, match.index) });
//         }
//         parts.push({ type: 'link', text: match[1], url: match[2] });
//         lastIndex = match.index + match[0].length;
//     }

//     if (lastIndex < cleanText.length) {
//         parts.push({ type: 'text', content: cleanText.slice(lastIndex) });
//     }

//     return parts;
// };

// const RecommendationItem = ({ content }: { content: string }) => {
//     const parts = formatRecommendation(content);

//     return (
//         <div className="flex gap-2 items-start p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm">
//             <span className="text-blue-500 mt-1">•</span>
//             <div className="text-gray-700 flex-1">
//                 {parts.map((part, index) => (
//                     part.type === 'link' ? (
//                         <a
//                             key={index}
//                             href={part.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:text-blue-800 underline"
//                         >
//                             {part.text}
//                         </a>
//                     ) : (
//                         <span key={index}>{part.content}</span>
//                     )
//                 ))}
//             </div>
//         </div>
//     );
// };

// export function AssessmentResults({ field, results, path, difficulty }: AssessmentResultsProps) {
//     const [recommendations, setRecommendations] = useState<string[]>([])
//     const [loading, setLoading] = useState(true)
//     const [saveError, setSaveError] = useState<string | null>(null)
//     const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
//     const { user } = useAuth()

//     const calculateScore = (): number => {
//         if (results.length === 0) return 0
//         const correctAnswers = results.filter(answer => answer.isCorrect).length
//         return Math.round((correctAnswers / results.length) * 100)
//     }

//     useEffect(() => {
//         const saveAndFetchRecommendations = async () => {
//             try {
//                 if (!user) return;

//                 if (!field) throw new Error('Field is undefined');

//                 const score = calculateScore();
//                 const assessmentData = {
//                     userId: user.uid,
//                     field,
//                     path,
//                     difficulty,
//                     score,
//                     results,
//                     date: serverTimestamp(),
//                     recommendations: []
//                 };

//                 const docRef = await addDoc(collection(db, 'assessments'), assessmentData);

//                 const response = await fetch('/api/gemini-recommendations', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         results: results.map(r => ({ skill: r.skill, isCorrect: r.isCorrect })),
//                         field, path, difficulty
//                     }),
//                 });

//                 if (!response.ok) throw new Error('Failed to fetch recommendations');

//                 const data = await response.json();
//                 setRecommendations(data.recommendations);

//                 await updateDoc(doc(db, 'assessments', docRef.id), { recommendations: data.recommendations });
//             } catch (error) {
//                 console.error('Error saving assessment or fetching recommendations:', error);
//                 setSaveError(error instanceof Error ? error.message : 'An unexpected error occurred');
//                 setRecommendations(['Error fetching recommendations. Please try again.']);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (field && path && difficulty && results.length > 0 && user) {
//             saveAndFetchRecommendations();
//         } else {
//             setLoading(false);
//             if (!user) return;
//         }
//     }, [results, field, path, difficulty, user]);

//     const toggleQuestion = (questionId: number) => {
//         setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
//     }

//     if (!field || !path || !difficulty) {
//         return (
//             <Card className="w-full max-w-4xl mx-auto">
//                 <CardContent className="p-6">
//                     <Alert variant="destructive">
//                         <AlertTitle>Error</AlertTitle>
//                         <AlertDescription>
//                             Missing required assessment information. Please try again.
//                         </AlertDescription>
//                     </Alert>
//                 </CardContent>
//             </Card>
//         )
//     }

//     return (
//         <Card className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
//             <CardHeader className="mb-4">
//                 <CardTitle className="text-2xl font-bold text-gray-800">Assessment Results</CardTitle>
//                 <CardDescription className="text-gray-500">Your performance and personalized recommendations</CardDescription>
//             </CardHeader>

//             <AlertDialog open={!!saveError}>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Error</AlertDialogTitle>
//                         <AlertDialogDescription>{saveError}</AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogAction onClick={() => setSaveError(null)}>OK</AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>

//             <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Overall Score:</h3>
//                 <div className="flex items-center gap-4">
//                     <Progress value={calculateScore()} className="w-full h-4 rounded-md bg-gray-200" />
//                     <Badge variant="outline" className="text-lg font-bold text-blue-500 border-blue-500">
//                         {calculateScore()}%
//                     </Badge>
//                 </div>
//             </div>

//             <div className="mb-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Results:</h3>
//                 <div className="space-y-3">
//                     {results.map((result, index) => (
//                         <Card key={index} className="border rounded-md shadow-sm">
//                             <Button
//                                 variant="ghost"
//                                 className="w-full justify-between p-3 text-left hover:bg-gray-50"
//                                 onClick={() => toggleQuestion(result.questionId)}
//                             >
//                                 <div className="flex items-center gap-2">
//                                     {result.isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
//                                     <span className="font-medium">Question {result.questionId + 1}</span>
//                                 </div>
//                                 {expandedQuestion === result.questionId ? (
//                                     <ChevronUp className="h-5 w-5" />
//                                 ) : (
//                                     <ChevronDown className="h-5 w-5" />
//                                 )}
//                             </Button>
//                             <AnimatePresence>
//                                 {expandedQuestion === result.questionId && (
//                                     <motion.div
//                                         initial={{ height: 0, opacity: 0 }}
//                                         animate={{ height: 'auto', opacity: 1 }}
//                                         exit={{ height: 0, opacity: 0 }}
//                                         transition={{ duration: 0.3 }}
//                                         className="overflow-hidden" // Added overflow-hidden for smoother transitions
//                                     >
//                                         <CardContent className="pt-0">
//                                             <span className="text-sm text-muted-foreground mb-2 block"> {/* Made span block level */}
//                                                 Skill: {result.skill}
//                                             </span>

//                                             <div className="flex items-center gap-2 mb-2">
//                                                 Your Answer:
//                                                 <Badge variant={result.isCorrect ? "success" : "destructive"}>
//                                                     {result.userAnswer}
//                                                 </Badge>
//                                             </div>

//                                             {!result.isCorrect && (
//                                                 <div className="flex items-center gap-2 mb-2">
//                                                     Correct Answer:
//                                                     <Badge variant="success">
//                                                         {result.correctAnswer}
//                                                     </Badge>
//                                                 </div>
//                                             )}
//                                             <div className="text-sm mt-2 p-3 bg-gray-50 rounded-md"> {/* Reduced padding slightly */}
//                                                 {result.explanation}
//                                             </div>
//                                         </CardContent>
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>
//                         </Card>
//                     ))}
//                 </div>
//             </div>

//             <div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Recommendations</h3>
//                 {loading ? (
//                     <div className="flex items-center justify-center p-6"> {/* Centered loading */}
//                         <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
//                         <span className="text-gray-600">Generating personalized recommendations...</span>
//                     </div>
//                 ) : saveError ? ( // Display error message if saveError is present
//                     <Alert variant="destructive">
//                         <AlertTitle>Error</AlertTitle>
//                         <AlertDescription>{saveError}</AlertDescription>
//                     </Alert>
//                 ) : recommendations.length > 0 ? (
//                     <div className="space-y-3">
//                         {recommendations.map((recommendation, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                             >
//                                 <RecommendationItem content={recommendation} />
//                             </motion.div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="p-4 text-center text-gray-500">No recommendations found.</div>
//                 )}
//             </div>
//         </Card>
//     )
// }


'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'
import { collection, addDoc, serverTimestamp, updateDoc, doc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

interface Answer {
    questionId: number
    userAnswer: string
    isCorrect: boolean
    correctAnswer: string
    explanation: string
    skill: string
}

interface AssessmentData extends DocumentData {
    userId: string
    field: string
    path: string
    difficulty: string
    score: number
    results: Answer[]
    date: any
    recommendations?: string[]
}

interface AssessmentResultsProps {
    results: Array<Answer>
    field: string
    path: string
    difficulty: string
}

const formatRecommendation = (text: string) => {
    const cleanText = text.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '');
    const urlRegex = /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g;
    const parts: Array<{ type: 'text' | 'link', content?: string, text?: string, url?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(cleanText)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: cleanText.slice(lastIndex, match.index) });
        }
        parts.push({ type: 'link', text: match[1], url: match[2] });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < cleanText.length) {
        parts.push({ type: 'text', content: cleanText.slice(lastIndex) });
    }

    return parts;
};

const RecommendationItem = ({ content }: { content: string }) => {
    const parts = formatRecommendation(content);

    return (
        <div className="flex gap-2 items-start p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm">
            <span className="text-blue-500 mt-1">•</span>
            <div className="text-gray-700 flex-1">
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

export function AssessmentResults({ field, results, path, difficulty }: AssessmentResultsProps) {
    const [recommendations, setRecommendations] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
    const { user } = useAuth()

    const calculateScore = (): number => {
        if (results.length === 0) return 0
        const correctAnswers = results.filter(answer => answer.isCorrect).length
        return Math.round((correctAnswers / results.length) * 100)
    }

    const createAssessmentKey = () => {
        const resultsKey = results.map(r => `${r.questionId}:${r.userAnswer}`).join('|')
        return `${field}-${path}-${difficulty}-${resultsKey}`
    }

    useEffect(() => {
        const fetchOrCreateAssessment = async () => {
            try {
                if (!user || !field) return;

                // First, try to find any assessment with the same results pattern
                const assessmentsRef = collection(db, 'assessments')
                const q = query(
                    assessmentsRef,
                    where('field', '==', field),
                    where('difficulty', '==', difficulty)
                )

                const querySnapshot = await getDocs(q)
                let existingRecommendations: string[] | undefined;

                // Look for matching results pattern in existing assessments
                querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const docData = doc.data() as AssessmentData;
                    if (docData.recommendations &&
                        JSON.stringify(docData.results.map(r => ({ skill: r.skill, isCorrect: r.isCorrect }))) ===
                        JSON.stringify(results.map(r => ({ skill: r.skill, isCorrect: r.isCorrect })))) {
                        existingRecommendations = docData.recommendations;
                    }
                });

                // If we found existing recommendations, use them
                if (existingRecommendations) {
                    setRecommendations(existingRecommendations);

                    // Still save the assessment but with existing recommendations
                    const assessmentData: AssessmentData = {
                        userId: user.uid,
                        field,
                        path,
                        difficulty,
                        score: calculateScore(),
                        results,
                        date: serverTimestamp(),
                        recommendations: existingRecommendations
                    }
                    await addDoc(collection(db, 'assessments'), assessmentData);
                } else {
                    // If no existing recommendations found, generate new ones
                    const response = await fetch('/api/gemini-recommendations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            results: results.map(r => ({ skill: r.skill, isCorrect: r.isCorrect })),
                            field,
                            path,
                            difficulty
                        }),
                    })

                    if (!response.ok) throw new Error('Failed to fetch recommendations')

                    const data = await response.json()
                    const newRecommendations = data.recommendations

                    // Save assessment with new recommendations
                    const assessmentData: AssessmentData = {
                        userId: user.uid,
                        field,
                        path,
                        difficulty,
                        score: calculateScore(),
                        results,
                        date: serverTimestamp(),
                        recommendations: newRecommendations
                    }
                    await addDoc(collection(db, 'assessments'), assessmentData);

                    setRecommendations(newRecommendations)
                }

            } catch (error) {
                console.error('Error handling assessment:', error)
                setSaveError(error instanceof Error ? error.message : 'An unexpected error occurred')
                setRecommendations(['Error fetching recommendations. Please try again.'])
            } finally {
                setLoading(false)
            }
        }

        if (field && path && difficulty && results.length > 0 && user) {
            fetchOrCreateAssessment()
        } else {
            setLoading(false)
        }
    }, [results, field, path, difficulty, user])

    const toggleQuestion = (questionId: number) => {
        setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
    }

    if (!field || !path || !difficulty) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Missing required assessment information. Please try again.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
            <CardHeader className="mb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">Assessment Results</CardTitle>
                <CardDescription className="text-gray-500">Your performance and personalized recommendations</CardDescription>
            </CardHeader>

            <AlertDialog open={!!saveError}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error</AlertDialogTitle>
                        <AlertDialogDescription>{saveError}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setSaveError(null)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Overall Score:</h3>
                <div className="flex items-center gap-4">
                    <Progress value={calculateScore()} className="w-full h-4 rounded-md bg-gray-200" />
                    <Badge variant="outline" className="text-lg font-bold text-blue-500 border-blue-500">
                        {calculateScore()}%
                    </Badge>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Results:</h3>
                <div className="space-y-3">
                    {results.map((result, index) => (
                        <Card key={index} className="border rounded-md shadow-sm">
                            <Button
                                variant="ghost"
                                className="w-full justify-between p-3 text-left hover:bg-gray-50"
                                onClick={() => toggleQuestion(result.questionId)}
                            >
                                <div className="flex items-center gap-2">
                                    {result.isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                                    <span className="font-medium">Question {result.questionId + 1}</span>
                                </div>
                                {expandedQuestion === result.questionId ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </Button>
                            <AnimatePresence>
                                {expandedQuestion === result.questionId && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <CardContent className="pt-0">
                                            <span className="text-sm text-muted-foreground mb-2 block">
                                                Skill: {result.skill}
                                            </span>

                                            <div className="flex items-center gap-2 mb-2">
                                                Your Answer:
                                                <Badge variant={result.isCorrect ? "success" : "destructive"}>
                                                    {result.userAnswer}
                                                </Badge>
                                            </div>

                                            {!result.isCorrect && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    Correct Answer:
                                                    <Badge variant="success">
                                                        {result.correctAnswer}
                                                    </Badge>
                                                </div>
                                            )}
                                            <div className="text-sm mt-2 p-3 bg-gray-50 rounded-md">
                                                {result.explanation}
                                            </div>
                                        </CardContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Recommendations</h3>
                {loading ? (
                    <div className="flex items-center justify-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
                        <span className="text-gray-600">Loading recommendations...</span>
                    </div>
                ) : saveError ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{saveError}</AlertDescription>
                    </Alert>
                ) : recommendations.length > 0 ? (
                    <div className="space-y-3">
                        {recommendations.map((recommendation, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <RecommendationItem content={recommendation} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-500">No recommendations found.</div>
                )}
            </div>
        </Card>
    )
}