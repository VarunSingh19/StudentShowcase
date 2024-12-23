import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';

interface Project {
    id: string;
    projectName: string;
    techStack: string;
    name: string;
    stars: number;
    url?: string;
}

interface ProjectCardProps {
    project: Project;
    onStarClick?: (projectId: string) => void;
    onProjectView?: (projectId: string) => void;
}

export function ProjectCard({
    project,
    onStarClick,
    onProjectView
}: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handleViewProject = () => {
        if (project.url) {
            window.open(project.url, '_blank');
        }
        onProjectView?.(project.id);
    };

    return (
        <Card
            className="h-full flex flex-col transition-transform duration-200 hover:shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardHeader>
                <CardTitle className="text-xl font-bold line-clamp-1">
                    {project.projectName}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.techStack}
                    </p>
                    <p className="text-sm mb-4">By {project.name}</p>
                </div>
                <div className="flex justify-between items-center">
                    <Badge
                        variant="secondary"
                        className={`flex items-center cursor-pointer transition-colors duration-200 ${isHovered ? 'hover:bg-primary hover:text-primary-foreground' : ''
                            }`}
                        onClick={() => onStarClick?.(project.id)}
                    >
                        <Heart className={`h-4 w-4 mr-1 ${isHovered ? 'animate-pulse' : ''
                            }`} />
                        {project.stars}
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewProject}
                    >
                        View Project
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}