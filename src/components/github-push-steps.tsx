'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import ConfettiExplosion from 'react-confetti-explosion'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Step {
    title: string
    description: string
    image: string
}

const steps: Step[] = [
    {
        title: "Go to GitHub and click on the '+' icon",
        description: "In the top right corner of GitHub, click on the '+' icon and select 'New repository' from the dropdown menu.",
        image: '/clickonplusicon.png'
    },
    {
        title: "Name your repository",
        description: "Enter a name for your repository. You can also add an optional description. Choose to make it public or private, and select 'Add a README file' if you haven't created one locally.",
        image: "/nameyourrepo.png"
    },
    {
        title: "Create the repository",
        description: "Click on the 'Create repository' button at the bottom of the page to create your new GitHub repository.",
        image: "/createtherepo.png"
    },
    {
        title: "Copy the setup code",
        description: "Copy the below code and step by step execute them on the git bash.",
        image: "/copysetupcode.png"
    },
    {
        title: "Right click on project folder",
        description: "click on the project folder and open the folder with git bash software.",
        image: "/rightclickonfolder.png"
    },
    {
        title: "Open your terminal",
        description: "Open your git bash terminal.",
        image: "/openterminal.png"
    },
    {
        title: "Initialize your local project with Git",
        description: "In your terminal, run: git init",
        image: "/initrepo.png"
    },
    {
        title: "Add your project files",
        description: "In your terminal, run: git add .",
        image: "/gitaddfiles.png"
    },
    {
        title: "Commit your changes",
        description: "In your terminal, run: git commit -m \"Initial commit\"",
        image: "/gitcommitchanges.png"
    },
    {
        title: "Change the branch to main",
        description: "In your terminal, run: git branch -M main",
        image: "/changegitbranch.png"
    },
    {
        title: "Add your GitHub repository as a remote",
        description: "In your terminal, run: git remote add origin [YOUR_REPO_URL]. Replace [YOUR_REPO_URL] with the URL of your GitHub repository.",
        image: "/setrepoasremote.png"
    },
    {
        title: "Push your project to GitHub",
        description: "In your terminal, run: git push -u origin main",
        image: "/pushtogithub.png"
    },
    {
        title: "Copy the project URL",
        description: "On your screen, copy the URL.",
        image: "/copyprojecturl.png"
    }
]

export default function GithubPushSteps() {
    const [currentStep, setCurrentStep] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [completedSteps, setCompletedSteps] = useState<number[]>([])
    const [isExploding, setIsExploding] = useState(false)
    const { toast } = useToast()

    const filteredSteps = steps.filter(
        (step, index) =>
            step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            step.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (index + 1).toString().includes(searchTerm)
    )

    const progress = (completedSteps.length / steps.length) * 100

    useEffect(() => {
        if (completedSteps.length === steps.length) {
            setIsExploding(true)
            toast({
                title: "Congratulations!",
                description: "You've completed all steps to push your project to GitHub!",
            })
        }
    }, [completedSteps, toast])

    const handleStepComplete = (index: number) => {
        if (!completedSteps.includes(index)) {
            setCompletedSteps([...completedSteps, index])
        }
    }

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>How to Push Your Project to GitHub</CardTitle>
                <CardDescription>Follow these steps to create a repository and upload your project</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search steps..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setSearchTerm('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
                <ScrollArea className="h-[500px] pr-4">
                    <AnimatePresence>
                        {filteredSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card
                                    className={cn(
                                        "mb-4 overflow-hidden cursor-pointer transition-all duration-300",
                                        completedSteps.includes(index) ? "border-green-500" : "",
                                        currentStep === index ? "ring-2 ring-primary" : ""
                                    )}
                                    onClick={() => setCurrentStep(index)}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <span className="mr-2">Step {index + 1}:</span> {step.title}
                                            {completedSteps.includes(index) && (
                                                <Check className="ml-auto text-green-500" />
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    {currentStep === index && (
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="relative aspect-video w-full overflow-hidden rounded-md"
                                            >
                                                <Image
                                                    src={step.image}
                                                    alt={`Step ${index + 1}: ${step.title}`}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="cursor-pointer"
                                                    onClick={() => handleStepComplete(index)}
                                                />
                                            </motion.div>
                                        </CardContent>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </ScrollArea>
                <div className="flex justify-between mt-4">
                    <Button
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                        className={cn(
                            "transition-opacity duration-300",
                            currentStep === 0 ? "opacity-50" : "opacity-100"
                        )}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button
                        onClick={handleNextStep}
                        disabled={currentStep === steps.length - 1}
                        className={cn(
                            "transition-opacity duration-300",
                            currentStep === steps.length - 1 ? "opacity-50" : "opacity-100"
                        )}
                    >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-600 mt-2">
                        {completedSteps.length} of {steps.length} steps completed
                    </p>
                </div>
                {isExploding && (
                    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
                        <ConfettiExplosion />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

