import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Book, Lightbulb } from 'lucide-react'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

const difficulties: Array<{ id: Difficulty; name: string; icon: any; color: string; textColor: string; description: string }> = [
    { id: 'beginner', name: 'Beginner', icon: Book, color: 'bg-green-100 hover:bg-green-200', textColor: 'text-green-700', description: 'Perfect for those just starting out' },
    { id: 'intermediate', name: 'Intermediate', icon: Lightbulb, color: 'bg-yellow-100 hover:bg-yellow-200', textColor: 'text-yellow-700', description: 'For learners with some experience' },
    { id: 'advanced', name: 'Advanced', icon: Rocket, color: 'bg-red-100 hover:bg-red-200', textColor: 'text-red-700', description: 'Challenging questions for experts' },
]

interface DifficultySelectionProps {
    onSelect: (difficulty: Difficulty) => void
}

export function DifficultySelection({ onSelect }: DifficultySelectionProps) {
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)

    const handleSelect = (difficultyId: Difficulty) => {
        setSelectedDifficulty(difficultyId)
        onSelect(difficultyId)
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="text-3xl font-bold">Choose Your Challenge</CardTitle>
                <CardDescription className="text-purple-100">Select the difficulty level that matches your skills</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {difficulties.map((difficulty) => (
                        <motion.div
                            key={difficulty.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Card
                                className={`cursor-pointer transition-all ${difficulty.color} ${selectedDifficulty === difficulty.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                                    }`}
                                onClick={() => handleSelect(difficulty.id)}
                            >
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <difficulty.icon className={`w-12 h-12 mb-4 ${difficulty.textColor}`} />
                                    <h3 className={`text-xl font-semibold mb-2 ${difficulty.textColor}`}>{difficulty.name}</h3>
                                    <p className={`text-sm mb-4 ${difficulty.textColor}`}>{difficulty.description}</p>
                                    <Badge variant="outline" className={difficulty.textColor}>
                                        {selectedDifficulty === difficulty.id ? 'Selected' : 'Select'}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <Button
                        onClick={() => selectedDifficulty && onSelect(selectedDifficulty)}
                        disabled={!selectedDifficulty}
                        className="px-8 py-2 text-lg"
                    >
                        Start Assessment
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

