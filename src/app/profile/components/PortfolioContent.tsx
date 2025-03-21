'use client'

import React, { useState } from 'react'
import { UserProfile, Project } from '@/types/profile'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Copy, ExternalLink, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'

type PortfolioContentProps = {
    profile: UserProfile
    projects: Project[]
    portfolioUrl: string
}

export function PortfolioContent({ profile, projects, portfolioUrl }: PortfolioContentProps) {
    const [copied, setCopied] = useState(false)
    const [isPublic, setIsPublic] = useState(profile.portfolioSettings?.isPublic ?? true)
    const [showContact, setShowContact] = useState(profile.portfolioSettings?.showContact ?? true)
    const [selectedProjects, setSelectedProjects] = useState<string[]>(
        profile.portfolioSettings?.selectedProjects || projects.map(p => p.id)
    )
    const [isSaving, setIsSaving] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(portfolioUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleProjectToggle = (projectId: string) => {
        setSelectedProjects(prev =>
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        )
    }

    const savePortfolioSettings = async () => {
        if (!profile.userId) return

        setIsSaving(true)
        try {
            const portfolioSettings = {
                isPublic,
                showContact,
                selectedProjects,
                lastUpdated: new Date()
            }

            await updateDoc(doc(db, 'profiles', profile.userId), {
                portfolioSettings
            })

            toast.success('Portfolio settings saved successfully!')
        } catch (error) {
            console.error('Error saving portfolio settings:', error)
            toast.error('Failed to save portfolio settings')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Portfolio</CardTitle>
                    <CardDescription>
                        Your public portfolio page that showcases your projects and skills
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium">Portfolio URL</h3>
                            <p className="text-sm text-muted-foreground">{portfolioUrl}</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyToClipboard}
                            >
                                {copied ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <Link href={portfolioUrl} target="_blank">
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    View
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">Portfolio Settings</h3>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="portfolio-public"
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                            <Label htmlFor="portfolio-public">Make portfolio public</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="contact-form"
                                checked={showContact}
                                onCheckedChange={setShowContact}
                            />
                            <Label htmlFor="contact-form">Show contact form</Label>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Projects to display</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {projects.map(project => (
                                    <div
                                        key={project.id}
                                        className="flex items-center space-x-2 border p-2 rounded-md"
                                    >
                                        <Switch
                                            id={`project-${project.id}`}
                                            checked={selectedProjects.includes(project.id)}
                                            onCheckedChange={() => handleProjectToggle(project.id)}
                                        />
                                        <Label htmlFor={`project-${project.id}`} className="cursor-pointer">
                                            {project.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="mt-4"
                            onClick={savePortfolioSettings}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Portfolio Settings'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Preview</CardTitle>
                    <CardDescription>
                        A preview of how your portfolio page will look to visitors
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md p-4 bg-background/50">
                        <div className="aspect-video flex items-center justify-center bg-muted rounded-md">
                            <p className="text-center text-muted-foreground">
                                Your portfolio preview will be available here soon
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}