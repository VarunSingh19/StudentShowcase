
// import { notFound } from 'next/navigation'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Heart, Github, Linkedin, Twitter, Globe, ExternalLink, Mail, Phone } from 'lucide-react'
// import { ImageModal } from '@/components/ImageModal'
// import { Project } from '@/types/project'
// import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
// import { db } from '@/lib/firebase'

// type PageProps = {
//     params: { userId: string };
// };

// async function getUserProfile(userId: string) {
//     const userDoc = await getDoc(doc(db, 'profiles', userId));
//     if (!userDoc.exists()) {
//         throw new Error("Profile not found");
//     }
//     return userDoc.data();
// }

// async function getUserProjects(userId: string): Promise<Project[]> {
//     const querySnapshot = await getDocs(query(collection(db, 'projects'), where('userId', '==', userId)));
//     return querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...(doc.data() as Omit<Project, 'id'>),
//     }));
// }

// export default async function UserProfilePage({ params }: PageProps) {
//     try {
//         const [profile, projects] = await Promise.all([
//             getUserProfile(params.userId),
//             getUserProjects(params.userId)
//         ]);

//         if (!profile) {
//             notFound();
//         }

//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <Card className="mb-8 overflow-hidden">
//                     <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
//                         <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
//                             <div className="flex items-end space-x-4">
//                                 <ImageModal
//                                     src={profile.avatarUrl || '/studentshowcase.jpg'}
//                                     alt={profile.displayName}
//                                 />
//                                 <div>
//                                     <h1 className="text-3xl font-bold text-white">{profile.displayName}</h1>
//                                     <p className="text-xl text-white/80">{profile.location}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <CardContent className="pt-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-4">
//                                 <div>
//                                     <h2 className="text-xl font-semibold mb-2">About Me</h2>
//                                     <p className="text-muted-foreground">{profile.bio}</p>
//                                 </div>
//                                 <div>
//                                     <h2 className="text-xl font-semibold mb-2">Skills</h2>
//                                     <div className="flex flex-wrap gap-2">
//                                         {profile.skills?.map((skill: string) => (
//                                             <Badge key={skill} variant="secondary">
//                                                 {skill}
//                                             </Badge>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div>
//                                 <h2 className="text-xl font-semibold mb-2">Connect</h2>
//                                 <div className="flex space-x-4">
//                                     {profile.socialLinks?.github && (
//                                         <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
//                                             <Button variant="outline" size="icon">
//                                                 <Github className="h-4 w-4" />
//                                             </Button>
//                                         </a>
//                                     )}
//                                     {profile.socialLinks?.linkedin && (
//                                         <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
//                                             <Button variant="outline" size="icon">
//                                                 <Linkedin className="h-4 w-4" />
//                                             </Button>
//                                         </a>
//                                     )}
//                                     {profile.socialLinks?.twitter && (
//                                         <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
//                                             <Button variant="outline" size="icon">
//                                                 <Twitter className="h-4 w-4" />
//                                             </Button>
//                                         </a>
//                                     )}
//                                     {profile.socialLinks?.portfolio && (
//                                         <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
//                                             <Button variant="outline" size="icon">
//                                                 <Globe className="h-4 w-4" />
//                                             </Button>
//                                         </a>
//                                     )}
//                                 </div>
//                             </div>
//                             <div>
//                                 <h2 className="text-xl font-semibold mb-2">Contact</h2>
//                                 <div className="flex space-x-4">
//                                     <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
//                                         {profile.emailAddress && (
//                                             <span className="flex items-center">
//                                                 <Mail className="h-4 w-4 mr-2" />
//                                                 {profile.emailAddress}
//                                             </span>
//                                         )}
//                                     </div>
//                                     <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
//                                         {profile.phoneNumber && (
//                                             <span className="flex items-center">
//                                                 <Phone className="h-4 w-4 mr-2" />
//                                                 {profile.phoneNumber}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>{profile.displayName}&apos;s Projects</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                             {projects.map((project: Project) => (
//                                 <Card key={project.id} className="overflow-hidden">
//                                     <div className="relative h-40 bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
//                                         <div className="absolute inset-0 flex items-center justify-center">
//                                             <h3 className="text-2xl font-bold text-white">{project.projectName}</h3>
//                                         </div>
//                                     </div>
//                                     <CardContent className="p-4">
//                                         <p className="text-sm text-muted-foreground mb-4">{project.techStack}</p>
//                                         <div className="flex justify-between items-center">
//                                             <Badge variant="secondary" className="flex items-center space-x-1">
//                                                 <Heart className="h-4 w-4" />
//                                                 <span>{project.likes || 0}</span>
//                                             </Badge>
//                                             {project.repoUrl && (
//                                                 <a href={project.repoUrl} target='_blank' rel="noopener noreferrer">
//                                                     <Button variant="outline" size="sm">
//                                                         <ExternalLink className="h-4 w-4 mr-2" />
//                                                         View Project
//                                                     </Button>
//                                                 </a>
//                                             )}
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             ))}
//                             {projects.length === 0 && (
//                                 <p className="text-center text-muted-foreground col-span-full">No projects found.</p>
//                             )}
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     } catch (error) {
//         console.error("Error in UserProfilePage:", error);
//         throw error; // Let Next.js handle the error
//     }
// }

import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Github, Linkedin, Twitter, Globe, ExternalLink, Mail, Phone, CheckCircle } from "lucide-react"
import { ImageModal } from "@/components/ImageModal"
import type { Project } from "@/types/project"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

type PageProps = {
    params: { userId: string }
}

async function getUserProfile(userId: string) {
    const userDoc = await getDoc(doc(db, "profiles", userId))
    if (!userDoc.exists()) {
        throw new Error("Profile not found")
    }
    return userDoc.data()
}

async function getUserProjects(userId: string): Promise<Project[]> {
    const querySnapshot = await getDocs(query(collection(db, "projects"), where("userId", "==", userId)))
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, "id">),
    }))
}

export default async function UserProfilePage({ params }: PageProps) {
    try {
        const [profile, projects] = await Promise.all([getUserProfile(params.userId), getUserProjects(params.userId)])

        if (!profile) {
            notFound()
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="mb-8 overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="flex items-end space-x-4">
                                <ImageModal src={profile.avatarUrl || "/studentshowcase.jpg"} alt={profile.displayName} />
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
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Contact</h2>
                                <div className="flex space-x-4">
                                    <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
                                        {profile.emailAddress && (
                                            <span className="flex items-center">
                                                <Mail className="h-4 w-4 mr-2" />
                                                {profile.emailAddress}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
                                        {profile.phoneNumber && (
                                            <span className="flex items-center">
                                                <Phone className="h-4 w-4 mr-2" />
                                                {profile.phoneNumber}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{profile.displayName}&apos;s Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project: Project) => (
                                <Card key={project.id} className="overflow-hidden">
                                    <Link href={`/verify/${project.id}`}>
                                        <div className="relative h-40 bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <h3 className="text-2xl font-bold text-white">{project.projectName}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                    <CardContent className="p-4">
                                        <p className="text-sm text-muted-foreground mb-4">{project.techStack}</p>
                                        <div className="flex justify-between items-center">
                                            <Badge variant="secondary" className="flex items-center space-x-1">
                                                <Heart className="h-4 w-4" />
                                                <span>{project.likes || 0}</span>
                                            </Badge>
                                            <div className="flex space-x-2">
                                                <Link href={`/verify/${project.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Verify
                                                    </Button>
                                                </Link>
                                                {project.repoUrl && (
                                                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" size="sm">
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
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
    } catch (error) {
        console.error("Error in UserProfilePage:", error)
        throw error // Let Next.js handle the error
    }
}

