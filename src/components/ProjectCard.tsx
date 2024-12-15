import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { Project } from '../types/profile';
export function ProjectCard({ project }: { project: Project }) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{project.projectName}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-4">{project.techStack}</p>
                    <p className="text-sm mb-4">By {project.name}</p>
                </div>
                <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {project.stars}
                    </Badge>
                    <Button variant="outline" size="sm">View Project</Button>
                </div>
            </CardContent>
        </Card>
    )
}

