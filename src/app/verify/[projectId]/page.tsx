import { notFound } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from 'lucide-react'

type ProjectData = {
    userId: string;
    projectName: string;
    user?: {
        displayName: string;
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
    // Add other user fields if needed
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
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Certificate Verification</CardTitle>
                    <CardDescription>Issued by StudentShowcase</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center mb-6">
                        <Badge variant="success" className="text-lg py-2 px-4">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Verified Authentic
                        </Badge>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Project Name</h3>
                            <p>{projectData.projectName}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Completed By</h3>
                            <p>{projectData.user?.displayName || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Technologies Used</h3>
                            <p>{projectData.techStack}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Project Description</h3>
                            <p>{projectData.description}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Notable Features</h3>
                            {projectData.features && projectData.features.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {projectData.features.map((feature: string, index: number) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No notable features specified for this project.</p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Issued On</h3>
                            <p>{new Date(projectData.createdAt.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

