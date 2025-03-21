// 'use client'

// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Project } from '@/types/project';
// import { CheckCircle2, Clock, GitPullRequest, Users } from 'lucide-react';
// import {
//     PieChart,
//     Pie,
//     Cell,
//     ResponsiveContainer,
//     Tooltip,
// } from 'recharts';

// interface ProjectStatsProps {
//     projects: Project[];
// }

// export function ProjectStats({ projects }: ProjectStatsProps) {
//     const totalProjects = projects.length;
//     const approvedProjects = projects.filter(p => p.approved).length;
//     const pendingProjects = totalProjects - approvedProjects;
//     const uniqueUsers = new Set(projects.map(p => p.name)).size;

//     const pieData = [
//         { name: 'Approved', value: approvedProjects },
//         { name: 'Pending', value: pendingProjects },
//     ];

//     const COLORS = ['#10b981', '#f59e0b'];

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
//                     <GitPullRequest className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                     <div className="text-2xl font-bold">{totalProjects}</div>
//                     <p className="text-xs text-muted-foreground">
//                         Across all submissions
//                     </p>
//                 </CardContent>
//             </Card>

//             <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Approved</CardTitle>
//                     <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                     <div className="text-2xl font-bold">{approvedProjects}</div>
//                     <p className="text-xs text-muted-foreground">
//                         Projects approved
//                     </p>
//                 </CardContent>
//             </Card>

//             <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Pending</CardTitle>
//                     <Clock className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                     <div className="text-2xl font-bold">{pendingProjects}</div>
//                     <p className="text-xs text-muted-foreground">
//                         Awaiting review
//                     </p>
//                 </CardContent>
//             </Card>

//             <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium">Contributors</CardTitle>
//                     <Users className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                     <div className="text-2xl font-bold">{uniqueUsers}</div>
//                     <p className="text-xs text-muted-foreground">
//                         Unique submitters
//                     </p>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

// 'use client'

// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Project } from '@/types/project';
// import { CheckCircle2, Clock, GitPullRequest, Users, TrendingUp } from 'lucide-react';
// import {
//     PieChart,
//     Pie,
//     Cell,
//     ResponsiveContainer,
//     Tooltip,
//     Legend
// } from 'recharts';

// interface ProjectStatsProps {
//     projects: Project[];
// }

// export function ProjectStats({ projects }: ProjectStatsProps) {
//     const totalProjects = projects.length;
//     const approvedProjects = projects.filter(p => p.approved).length;
//     const pendingProjects = totalProjects - approvedProjects;
//     const uniqueUsers = new Set(projects.map(p => p.name)).size;

//     const pieData = [
//         { name: 'Approved', value: approvedProjects },
//         { name: 'Pending', value: pendingProjects },
//     ];

//     const COLORS = ['#10b981', '#f59e0b'];

//     // Calculate project submission trend (last 7 days)
//     const last7Days = [...Array(7)].map((_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         return date.toISOString().split('T')[0];
//     }).reverse();

//     const trendData = last7Days.map(date => ({
//         date,
//         count: projects.filter(p =>
//             new Date((p.createdAt as any).toDate()).toISOString().split('T')[0] === date
//         ).length
//     }));

//     const CustomTooltip = ({ active, payload }: any) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
//                     <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     return (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl hover:shadow-2xl transition-shadow duration-200">
//                     <CardHeader className="flex flex-row items-center justify-between pb-2">
//                         <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
//                         <GitPullRequest className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">{totalProjects}</div>
//                         <p className="text-xs text-muted-foreground">
//                             Across all submissions
//                         </p>
//                     </CardContent>
//                 </Card>

//                 <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl hover:shadow-2xl transition-shadow duration-200">
//                     <CardHeader className="flex flex-row items-center justify-between pb-2">
//                         <CardTitle className="text-sm font-medium">Approved</CardTitle>
//                         <CheckCircle2 className="h-4 w-4 text-emerald-500" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold text-emerald-500">{approvedProjects}</div>
//                         <p className="text-xs text-muted-foreground">
//                             Projects approved
//                         </p>
//                     </CardContent>
//                 </Card>

//                 <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl hover:shadow-2xl transition-shadow duration-200">
//                     <CardHeader className="flex flex-row items-center justify-between pb-2">
//                         <CardTitle className="text-sm font-medium">Pending</CardTitle>
//                         <Clock className="h-4 w-4 text-amber-500" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold text-amber-500">{pendingProjects}</div>
//                         <p className="text-xs text-muted-foreground">
//                             Awaiting review
//                         </p>
//                     </CardContent>
//                 </Card>

//                 <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl hover:shadow-2xl transition-shadow duration-200">
//                     <CardHeader className="flex flex-row items-center justify-between pb-2">
//                         <CardTitle className="text-sm font-medium">Contributors</CardTitle>
//                         <Users className="h-4 w-4 text-blue-500" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold text-blue-500">{uniqueUsers}</div>
//                         <p className="text-xs text-muted-foreground">
//                             Unique submitters
//                         </p>
//                     </CardContent>
//                 </Card>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
//                     <CardHeader>
//                         <CardTitle className="text-sm font-medium">Project Status Distribution</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="h-64">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie
//                                         data={pieData}
//                                         cx="50%"
//                                         cy="50%"
//                                         innerRadius={60}
//                                         outerRadius={80}
//                                         paddingAngle={5}
//                                         dataKey="value"
//                                     >
//                                         {pieData.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS[index]} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip content={<CustomTooltip />} />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
//                     <CardHeader className="flex flex-row items-center justify-between">
//                         <CardTitle className="text-sm font-medium">Submission Trend</CardTitle>
//                         <TrendingUp className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="h-64">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie
//                                         data={trendData}
//                                         cx="50%"
//                                         cy="50%"
//                                         outerRadius={80}
//                                         fill="#8884d8"
//                                         dataKey="count"
//                                         label
//                                     >
//                                         {trendData.map((entry, index) => (
//                                             <Cell
//                                                 key={`cell-${index}`}
//                                                 fill={`hsl(${index * 45}, 70%, 50%)`}
//                                             />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip content={<CustomTooltip />} />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }

// export default ProjectStats;

'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from '@/types/project';
import { CheckCircle2, Clock, GitPullRequest, Users, TrendingUp } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis
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

    // Calculate monthly trends
    const getMonthlyData = () => {
        const monthlyData = new Map();

        // Sort projects by date
        const sortedProjects = [...projects].sort((a, b) => {
            const dateA = new Date((a.createdAt as any).toDate());
            const dateB = new Date((b.createdAt as any).toDate());
            return dateA.getTime() - dateB.getTime();
        });

        // Get first and last dates
        if (sortedProjects.length === 0) return [];

        const firstDate = new Date((sortedProjects[0].createdAt as any).toDate());
        const lastDate = new Date((sortedProjects[sortedProjects.length - 1].createdAt as any).toDate());

        // Create array of all months between first and last date
        const months = [];
        const currentDate = new Date(firstDate);
        while (currentDate <= lastDate) {
            const monthKey = currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
            });
            months.push({
                monthKey,
                month: currentDate.getMonth(),
                year: currentDate.getFullYear()
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Count projects for each month
        months.forEach(({ monthKey, month, year }) => {
            const count = projects.filter(project => {
                const projectDate = new Date((project.createdAt as any).toDate());
                return projectDate.getMonth() === month &&
                    projectDate.getFullYear() === year;
            }).length;

            monthlyData.set(monthKey, {
                date: monthKey,
                count: count
            });
        });

        return Array.from(monthlyData.values());
    };

    const trendData = getMonthlyData();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">
                        {label}: {payload[0].value} projects
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl hover:shadow-2xl transition-shadow duration-200">
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

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl hover:shadow-2xl transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">{approvedProjects}</div>
                        <p className="text-xs text-muted-foreground">
                            Projects approved
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl hover:shadow-2xl transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{pendingProjects}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting review
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl hover:shadow-2xl transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Contributors</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{uniqueUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Unique submitters
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Project Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Monthly Submission Trend</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="count"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default ProjectStats;