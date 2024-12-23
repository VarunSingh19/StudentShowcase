import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Github, Linkedin, Twitter, Globe, ExternalLink } from 'lucide-react'
import { ImageModal } from '@/components/ImageModal'
import { Project } from '@/types/profile'

async function getUserProfile(userId: string) {


    const userDoc = await getDoc(doc(db, 'profiles', userId))
    if (!userDoc.exists()) {
        return null
    }
    return userDoc.data()
}


async function getUserProjects(userId: string): Promise<Project[]> {
    const q = query(collection(db, 'projects'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, 'id'>), // Explicit cast to the Project type
    }));
}


export default async function UserProfilePage({ params }: { params: { userId: string } }) {

    interface Project {
        id: string;
        projectName: string;
        techStack: string;
        likes?: number;
        repoUrl?: string;
    }

    const profile = await getUserProfile(params.userId)
    if (!profile) {
        notFound()
    }

    const projects = await getUserProjects(params.userId)
    // <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-end space-x-4">
                            <ImageModal
                                src={profile.avatarUrl || '/studentshowcase.jpg'}
                                alt={profile.displayName}
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-white">{profile.displayName}</h1>
                                <p className="text-xl text-white/80">{profile.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">About Me</h2>
                                <p className="text-muted-foreground">{profile.bio}</p>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills?.map((skill: string) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Connect</h2>
                            <div className="flex space-x-4">
                                {profile.socialLinks?.github && (
                                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon">
                                            <Github className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                                {profile.socialLinks?.linkedin && (
                                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon">
                                            <Linkedin className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                                {profile.socialLinks?.twitter && (
                                    <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon">
                                            <Twitter className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                                {profile.socialLinks?.portfolio && (
                                    <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="icon">
                                            <Globe className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{profile.displayName} s Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project: Project) => (
                            <Card key={project.id} className="overflow-hidden">
                                <div className="relative h-40 bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h3 className="text-2xl font-bold text-white">{project.projectName}</h3>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground mb-4">{project.techStack}</p>
                                    <div className="flex justify-between items-center">
                                        <Badge variant="secondary" className="flex items-center space-x-1">
                                            <Heart className="h-4 w-4" />
                                            <span>{project.likes || 0}</span>
                                        </Badge>
                                        <a href={project.repoUrl} target='_blank' rel="noopener noreferrer">
                                            <Button variant="outline" size="sm">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                View Project
                                            </Button>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {projects.length === 0 && (
                            <p className="text-center text-muted-foreground col-span-full">No projects found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

