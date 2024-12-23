import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'
import { Project } from '@/types/project'

interface ProjectDetailsModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{project.projectName}</DialogTitle>
                    <DialogDescription>By {project.name}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow pr-4">
                    <div className="grid gap-6 py-4">
                        <div className="relative w-full h-[200px] sm:h-[300px]">
                            <Image
                                src={project.imageUrl}
                                alt={project.projectName}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-md"
                            />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Description</h4>
                            <p className="text-sm text-gray-700">{project.description}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Tech Stack</h4>
                            <p className="text-sm text-gray-700">{project.techStack}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Features</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-700">
                                {project.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Repository</h4>
                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                                {project.repoUrl}
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{project.branch}</Badge>
                            <Badge variant="outline">{project.projectType}</Badge>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

