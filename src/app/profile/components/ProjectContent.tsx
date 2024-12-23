import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from '@/hooks/use-toast'
import { Project } from '@/types/project'


interface ProjectsContentProps {
    userId: string;
}

export function ProjectsContent({ userId }: ProjectsContentProps) {
    const [projects, setProjects] = useState<Project[]>([])
    const router = useRouter()

    useEffect(() => {
        fetchProjects()
    }, [userId])

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, 'projects'), where('userId', '==', userId))
            const querySnapshot = await getDocs(q)

            const projectsData: Project[] = querySnapshot.docs.map((doc) => {
                const projectData = doc.data()
                return {
                    id: doc.id,
                    userId: projectData.userId || userId, // Use the passed userId if not in data
                    name: projectData.name || projectData.projectName || 'Untitled Project', // Fall back to projectName if name isn't set
                    projectName: projectData.projectName || 'Untitled Project',
                    techStack: projectData.techStack || 'Not Specified',
                    description: projectData.description || 'No description available.',
                    features: projectData.features || [],
                    repoUrl: projectData.repoUrl || '#',
                    imageUrl: projectData.imageUrl || '/placeholder.svg',
                    likes: projectData.likes || 0,
                    approved: projectData.approved || false,
                    createdAt: projectData.createdAt || Timestamp.now(), // Default to current timestamp if not set
                    branch: projectData.branch || 'main', // Default to 'main' if not set
                    projectType: projectData.projectType || 'personal', // Default to 'personal' if not set
                }
            })

            setProjects(projectsData)
        } catch (err) {
            console.error('Error fetching projects:', err)
            toast({
                title: "Error",
                description: "Failed to fetch projects. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleEditProject = (projectId: string) => {
        router.push(`/upload-project?id=${projectId}`)
    }

    const handleDeleteProject = async (projectId: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteDoc(doc(db, 'projects', projectId))
                setProjects(projects.filter(project => project.id !== projectId))
                toast({
                    title: "Project deleted",
                    description: "Your project has been successfully deleted.",
                })
            } catch (error) {
                console.error('Error deleting project:', error)
                toast({
                    title: "Error",
                    description: "Failed to delete the project. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>
                    Manage and track the status of your submitted projects
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="grid gap-4">
                        {projects.map((project) => (
                            <Card key={project.id} className="flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{project.projectName}</CardTitle>
                                        <Badge variant={project.approved ? "success" : "secondary"}>
                                            {project.approved ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </div>
                                    <CardDescription>{project.techStack}</CardDescription>
                                </CardHeader>
                                <CardContent className="py-2">
                                    <div className="aspect-video relative mb-4">
                                        <Image
                                            src={project.imageUrl || "/placeholder.svg"}
                                            alt={project.projectName}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between pt-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">View Details</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{project.projectName}</DialogTitle>
                                                <DialogDescription>{project.techStack}</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="aspect-video relative">
                                                    <Image
                                                        src={project.imageUrl || "/placeholder.svg"}
                                                        alt={project.projectName}
                                                        fill
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                                <p>{project.description}</p>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Features:</h4>
                                                    <ul className="list-disc pl-5">
                                                        {project.features?.map((feature, index) => (
                                                            <li key={index}>{feature}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Repository:</h4>
                                                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {project.repoUrl}
                                                    </a>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditProject(project.id)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                        {projects.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">You have not submitted any projects yet.</p>
                                <Button onClick={() => router.push('/upload-project')}>Upload Your First Project</Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/upload-project')} className="w-full">
                    Upload New Project
                </Button>
            </CardFooter>
        </Card>
    )
}

