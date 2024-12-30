import { notFound } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Code2, ListChecks, User2, FileText } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ProjectData = {
    userId: string;
    projectName: string;
    user?: {
        displayName: string;
        avatarUrl?: string;
    };
    techStack: string;
    description: string;
    features?: string[];
    createdAt: {
        seconds: number;
    };
};

type UserData = {
    displayName: string;
    avatarUrl?: string;
};

async function getProjectData(projectId: string): Promise<ProjectData | null> {
    const projectRef = doc(db, 'projects', projectId)
    const projectSnap = await getDoc(projectRef)

    if (!projectSnap.exists()) {
        return null
    }

    const projectData = projectSnap.data() as Omit<ProjectData, 'user'>
    const userRef = doc(db, 'profiles', projectData.userId)
    const userSnap = await getDoc(userRef)

    return {
        ...projectData,
        user: userSnap.exists() ? (userSnap.data() as UserData) : undefined
    }
}

export default async function VerifyCertificate({ params }: { params: { projectId: string } }) {
    const projectData = await getProjectData(params.projectId) as ProjectData;

    if (!projectData) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <Card className="w-full max-w-3xl mx-auto relative border-2 shadow-lg">
                {/* Certificate Stamp */}
                <div className="absolute -right-4 -top-4 w-32 h-32 transform rotate-12 mix-blend-multiply">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                        <defs>
                            <linearGradient id="stampGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#166534" stopOpacity={1} />
                                <stop offset="100%" stopColor="#14532d" stopOpacity={1} />
                            </linearGradient>
                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#166534" stopOpacity={1} />
                                <stop offset="100%" stopColor="#14532d" stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="url(#stampGradient)"
                            strokeWidth="4"
                            strokeDasharray="4 4"
                        />

                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="#166534"
                            strokeWidth="2"
                        />

                        <path
                            id="stamp-circle"
                            d="M100,30 A70,70 0 1 1 99.99,30"
                            fill="none"
                            stroke="none"
                        />

                        <text fill="#166534">
                            <textPath
                                href="#stamp-circle"
                                startOffset="10%"
                                style={{
                                    fontFamily: 'Arial',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem'
                                }}
                            >
                                • STUDENT SHOWCASE • VERIFIED PROJECT •
                            </textPath>
                        </text>

                        <text
                            x="100"
                            y="90"
                            textAnchor="middle"
                            fill="url(#textGradient)"
                            style={{
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            STUDENT
                        </text>
                        <text
                            x="100"
                            y="110"
                            textAnchor="middle"
                            fill="url(#textGradient)"
                            style={{
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            SHOWCASE
                        </text>
                        <text
                            x="100"
                            y="130"
                            textAnchor="middle"
                            fill="#166534"
                            style={{
                                fontSize: '12px'
                            }}
                        >
                            VERIFIED
                        </text>
                    </svg>
                </div>

                <CardHeader className="text-center border-b pb-6">
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Certificate of Achievement
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Issued by StudentShowcase
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-8">
                    <div className="flex items-center justify-center mb-8">
                        <Badge variant="success" className="text-lg py-2 px-4">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Verified Authentic
                        </Badge>
                    </div>

                    <div className="flex flex-col items-center mb-8">
                        <Avatar className="w-24 h-24 mb-4 border-4 border-green-100">
                            <AvatarImage src={projectData.user?.avatarUrl} alt={projectData.user?.displayName} />
                            <AvatarFallback>
                                <User2 className="w-12 h-12 text-gray-400" />
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold text-gray-900">{projectData.user?.displayName || 'N/A'}</h2>
                        <p className="text-gray-500 mt-1">Project Developer</p>
                    </div>

                    <div className="grid gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-green-700">
                                <FileText className="h-5 w-5" />
                                <h3 className="text-lg font-semibold">Project Name</h3>
                            </div>
                            <p className="text-gray-700">{projectData.projectName}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-green-700">
                                <Code2 className="h-5 w-5" />
                                <h3 className="text-lg font-semibold">Technologies Used</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {projectData.techStack.split(',').map((tech, index) => (
                                    <Badge key={index} variant="outline" className="bg-white">
                                        {tech.trim()}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-green-700">
                                <FileText className="h-5 w-5" />
                                <h3 className="text-lg font-semibold">Project Description</h3>
                            </div>
                            <p className="text-gray-700">{projectData.description}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-green-700">
                                <ListChecks className="h-5 w-5" />
                                <h3 className="text-lg font-semibold">Notable Features</h3>
                            </div>
                            {projectData.features && projectData.features.length > 0 ? (
                                <ul className="space-y-2">
                                    {projectData.features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No notable features specified for this project.</p>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-green-700">
                                <Calendar className="h-5 w-5" />
                                <h3 className="text-lg font-semibold">Issued On</h3>
                            </div>
                            <p className="text-gray-700">
                                {new Date(projectData.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            This certificate verifies the successful completion and verification of the project
                            on the StudentShowcase platform.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}