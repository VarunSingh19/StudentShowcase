import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CertificatePreview } from '@/components/CertificatePreview'
import { UserProfile } from '@/types/profile'

interface Project {
    id: string
    projectName: string
    techStack: string
    description: string
    features: string[]
    approved: boolean
    likes: number
    completionDate: string
}

export function CertificateSection({ projects, profile }: { projects: Project[], profile: UserProfile }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{project.projectName}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-gray-600 mb-4">{project.techStack}</p>
                            <p className="text-sm mb-4">Completed on: {project.completionDate}</p>
                            <div className="flex justify-between items-center">
                                <Badge variant="success">Approved</Badge>
                                <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Preview
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <CertificatePreview
                                                projectName={project.projectName}
                                                recipientName={profile.displayName}
                                                techStack={project.techStack}
                                                completionDate={project.completionDate}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}

