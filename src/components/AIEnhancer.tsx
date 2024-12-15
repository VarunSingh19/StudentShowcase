import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfile } from '@/types/profile'
import { Loader2 } from 'lucide-react'

interface Project {
    id: string
    projectName: string
    techStack: string
    description: string
    features: string[]
    repoUrl: string
}

interface Certificate {
    id: string
    projectName: string
    issuedBy: string
    issueDate: Date
    verificationUrl: string
}

interface AIEnhancerProps {
    profile: UserProfile | null
    projects: Project[]
    certificates: Certificate[]
    companyName: string
    experience: string
}

export function AIEnhancer({ profile, projects, certificates, companyName, experience }: AIEnhancerProps) {
    const [enhancedSummary, setEnhancedSummary] = useState('')
    const [enhancedFeatures, setEnhancedFeatures] = useState<{ [key: string]: string[] }>({})
    const [loading, setLoading] = useState(false)
    const [enhancedProjects, setEnhancedProjects] = useState<Project[]>([])

    const handleEnhanceSummary = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/enhance-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profile,
                    companyName,
                    experience,
                    projects: projects.length,
                    certificates: certificates.length,
                }),
            })
            const data = await response.json()
            setEnhancedSummary(data.enhancedSummary)
        } catch (error) {
            console.error('Error enhancing summary:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEnhanceFeatures = async (projectId: string) => {
        setLoading(true)
        try {
            const project = projects.find(p => p.id === projectId)
            if (project) {
                const response = await fetch('/api/enhance-features', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        project,
                        companyName,
                    }),
                })
                const data = await response.json()
                setEnhancedFeatures(prev => ({ ...prev, [projectId]: data.enhancedFeatures }))
            }
        } catch (error) {
            console.error('Error enhancing features:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEnhanceProjects = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/enhance-projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projects }),
            });
            const data = await response.json();
            setEnhancedProjects(data.enhancedProjects);
        } catch (error) {
            console.error('Error enhancing projects:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI-Enhanced Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={enhancedSummary}
                        onChange={(e) => setEnhancedSummary(e.target.value)}
                        placeholder="Your AI-enhanced professional summary will appear here"
                        rows={6}
                    />
                    <Button onClick={handleEnhanceSummary} className="mt-4" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Enhance Summary
                    </Button>
                </CardContent>
            </Card>

            {projects.map((project) => (
                <Card key={project.id}>
                    <CardHeader>
                        <CardTitle>AI-Enhanced Features for {project.projectName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside mb-4">
                            {((enhancedFeatures[project.id] || project.features || []).map((feature, index) => (
                                <li key={index}>{feature}</li>
                            )))}
                        </ul>
                        <Button onClick={() => handleEnhanceFeatures(project.id)} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Enhance Features
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardHeader>
                    <CardTitle>AI-Enhanced Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    {enhancedProjects && enhancedProjects.length > 0 ? (
                        enhancedProjects.map((project, index) => (
                            <div key={index} className="mb-4">
                                <h3 className="font-bold">{project.projectName}</h3>
                                <p>{project.description}</p>
                                <ul className="list-disc list-inside">
                                    {project.features.map((feature, featureIndex) => (
                                        <li key={featureIndex}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>No enhanced projects available. Click Enhance Projects to generate.</p>
                            <Button onClick={handleEnhanceProjects} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Enhance Projects
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

