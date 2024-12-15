import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Github, Image, Edit, Trash2Icon } from 'lucide-react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { DialogHeader } from '@/components/ui/dialog'
import { useRouter } from 'next/router'

interface Project {
    id: string
    projectName: string
    techStack: string
    description: string
    features: string[]
    approved: boolean
    likes: number
    completionDate: string
    repoUrl: string
}


export function ProjectSection({ projects }: { projects: Project[] }) {

    const router = useRouter()
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">{project.projectName}</CardTitle>
                            <CardDescription>{project.techStack}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.features.map((feature, index) => (
                                    <Badge key={index} variant="secondary">{feature}</Badge>
                                ))}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1 text-red-500">
                                    <Heart className="h-4 w-4" />
                                    {project.likes}
                                </span>
                                <Badge variant={project.approved ? "success" : "secondary"}>
                                    {project.approved ? 'Approved' : 'Pending'}
                                </Badge>
                            </div>
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center text-blue-500 hover:underline"
                            >
                                <Github className="h-4 w-4 mr-2" />
                                View on GitHub
                            </a>
                        </CardContent>
                    </Card> */}

                    <Card>
                        <CardHeader>
                            <CardTitle>My Projects</CardTitle>
                            <CardDescription>
                                Manage and track the status of your submitted projects
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] pr-4">                                 <div className="grid gap-4">
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
                                                    <Trash2Icon className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                                {projects.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground mb-4">You haven't submitted any projects yet.</p>
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
                </motion.div>
            ))}
        </div>
    )
}

