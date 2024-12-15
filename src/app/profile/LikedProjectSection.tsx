import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from 'lucide-react'

interface LikedProject {
    id: string
    projectName: string
    techStack: string
    likes: number
}

export function LikedProjectsSection({ likedProjects }: { likedProjects: LikedProject[] }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {likedProjects.map((project) => (
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
                            <div className="flex items-center justify-end">
                                <span className="flex items-center gap-1 text-red-500">
                                    <Heart className="h-4 w-4 fill-current" />
                                    {project.likes}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}

