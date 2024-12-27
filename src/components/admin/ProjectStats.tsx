'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from '@/types/project';
import { CheckCircle2, Clock, GitPullRequest, Users } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface ProjectStatsProps {
    projects: Project[];
}

export function ProjectStats({ projects }: ProjectStatsProps) {
    const totalProjects = projects.length;
    const approvedProjects = projects.filter(p => p.approved).length;
    const pendingProjects = totalProjects - approvedProjects;
    const uniqueUsers = new Set(projects.map(p => p.name)).size;

    const pieData = [
        { name: 'Approved', value: approvedProjects },
        { name: 'Pending', value: pendingProjects },
    ];

    const COLORS = ['#10b981', '#f59e0b'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalProjects}</div>
                    <p className="text-xs text-muted-foreground">
                        Across all submissions
                    </p>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{approvedProjects}</div>
                    <p className="text-xs text-muted-foreground">
                        Projects approved
                    </p>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingProjects}</div>
                    <p className="text-xs text-muted-foreground">
                        Awaiting review
                    </p>
                </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Contributors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{uniqueUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        Unique submitters
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}