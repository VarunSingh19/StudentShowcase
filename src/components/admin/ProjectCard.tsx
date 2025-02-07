'use client'

import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Github, Link, Loader2, User } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectCardProps {
    project: Project;
    onApprove: (id: string) => Promise<void>;
    onReject: (id: string) => Promise<void>;
    actionLoading: string | null;
}

export function ProjectCard({ project, onApprove, onReject, actionLoading }: ProjectCardProps) {
    const statusColors = {
        approved: 'bg-green-100 text-green-800 border-green-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    return (
        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-none">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            {project.projectName}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <a href={`/profile/${project.userId}`}>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                    {project.name}
                                </span>

                            </a>
                        </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${project.approved ? statusColors.approved : statusColors.pending
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
                        <Code2 className="h-5 w-5 mr-2 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Tech Stack</p>
                            <p className="text-sm text-muted-foreground">{project.techStack}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Github className="h-5 w-5 mr-2 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Repository</p>
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
                        onClick={() => onReject(project.id)}
                        variant="destructive"
                        disabled={actionLoading === project.id}
                        className="w-full sm:w-auto"
                    >
                        {actionLoading === project.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Reject Project
                    </Button>
                ) : (
                    <Button
                        onClick={() => onApprove(project.id)}
                        disabled={actionLoading === project.id}
                        className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                        {actionLoading === project.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Approve Project
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}