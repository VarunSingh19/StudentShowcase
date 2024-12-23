'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Github, Loader2, Package, Code2, User } from 'lucide-react'

interface Project {
    id: string;
    name: string;
    projectName: string;
    techStack: string;
    repoUrl: string;
    approved: boolean;
    imageUrl: string;
}

export default function ProjectPanel() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, 'projects'))
            const querySnapshot = await getDocs(q)
            const fetchedProjects: Project[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                fetchedProjects.push({
                    id: doc.id,
                    ...data,
                    imageUrl: data.imageUrl || '/placeholder.svg'
                } as Project)
            })
            setProjects(fetchedProjects)
        } catch (err) {
            console.error('Error fetching projects:', err)
            setError('Failed to fetch projects')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (projectId: string) => {
        setActionLoading(projectId)
        try {
            await updateDoc(doc(db, 'projects', projectId), {
                approved: true
            })
            setProjects(projects.map(project =>
                project.id === projectId ? { ...project, approved: true } : project
            ))
        } catch (err) {
            console.error('Error approving project:', err)
            setError('Failed to approve project')
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (projectId: string) => {
        setActionLoading(projectId)
        try {
            await updateDoc(doc(db, 'projects', projectId), {
                approved: false
            })
            setProjects(projects.map(project =>
                project.id === projectId ? { ...project, approved: false } : project
            ))
        } catch (err) {
            console.error('Error rejecting project:', err)
            setError('Failed to reject project')
        } finally {
            setActionLoading(null)
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You must be logged in as an admin to access this page.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                    <p className="text-lg text-gray-600">Loading projects...</p>
                </div>
            </div>
        )
    }

    const statusColors = {
        approved: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-200'
        },
        pending: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-200'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Management</h1>
                    <p className="text-gray-600">Review and manage submitted projects</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top duration-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="group hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl mb-1">{project.projectName}</CardTitle>
                                        <CardDescription className="flex items-center">
                                            <User className="h-4 w-4 mr-1" />
                                            {project.name}
                                        </CardDescription>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${project.approved
                                        ? `${statusColors.approved.bg} ${statusColors.approved.text} ${statusColors.approved.border}`
                                        : `${statusColors.pending.bg} ${statusColors.pending.text} ${statusColors.pending.border}`
                                        }`}>
                                        {project.approved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative w-full h-48 overflow-hidden rounded-lg">
                                    <Image
                                        src={project.imageUrl}
                                        alt={project.projectName}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <Code2 className="h-5 w-5 mr-2 mt-1 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Tech Stack</p>
                                            <p className="text-sm text-gray-600">{project.techStack}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Github className="h-5 w-5 mr-2 mt-1 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Repository</p>
                                            <a
                                                href={project.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 hover:text-blue-600 hover:underline break-all"
                                            >
                                                {project.repoUrl}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3">
                                {project.approved ? (
                                    <Button
                                        onClick={() => handleReject(project.id)}
                                        variant="destructive"
                                        disabled={actionLoading === project.id}
                                        className="w-full sm:w-auto"
                                    >
                                        {actionLoading === project.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : null}
                                        Reject Project
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleApprove(project.id)}
                                        disabled={actionLoading === project.id}
                                        className="w-full sm:w-auto"
                                    >
                                        {actionLoading === project.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : null}
                                        Approve Project
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {projects.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                        <p className="text-gray-600">Projects submitted by users will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}