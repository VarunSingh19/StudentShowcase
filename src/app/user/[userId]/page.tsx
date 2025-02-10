// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
// import { db } from "@/lib/firebase"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Loader2 } from "lucide-react"

// interface UserProfile {
//     id: string
//     displayName: string
//     email: string
//     avatarUrl?: string
// }

// interface Project {
//     id: string
//     projectName: string
//     description: string
// }

// export default function UserProjectsPage() {
//     const [user, setUser] = useState<UserProfile | null>(null)
//     const [projects, setProjects] = useState<Project[]>([])
//     const [loading, setLoading] = useState(true)
//     const params = useParams()
//     const router = useRouter()
//     const userId = params.userId as string

//     useEffect(() => {
//         const fetchUserAndProjects = async () => {
//             try {
//                 // Fetch user profile
//                 const userDoc = await getDoc(doc(db, "profiles", userId))
//                 if (userDoc.exists()) {
//                     setUser({ id: userDoc.id, ...userDoc.data() } as UserProfile)
//                 }

//                 // Fetch user's projects
//                 const projectsQuery = query(collection(db, "projects"), where("userId", "==", userId))
//                 const projectsSnapshot = await getDocs(projectsQuery)
//                 const fetchedProjects: Project[] = []
//                 projectsSnapshot.forEach((doc) => {
//                     fetchedProjects.push({ id: doc.id, ...doc.data() } as Project)
//                 })
//                 setProjects(fetchedProjects)
//             } catch (error) {
//                 console.error("Error fetching user and projects:", error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchUserAndProjects()
//     }, [userId])

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//         )
//     }

//     if (!user) {
//         return <div>User not found.</div>
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <Card className="mb-8">
//                 <CardHeader>
//                     <CardTitle className="flex items-center space-x-4">
//                         <Avatar className="h-16 w-16">
//                             <AvatarImage src={user.avatarUrl} />
//                             <AvatarFallback>{user.displayName[0]}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                             <h1 className="text-2xl font-bold">{user.displayName}</h1>
//                             <p className="text-gray-500">{user.email}</p>
//                         </div>
//                     </CardTitle>
//                 </CardHeader>
//             </Card>

//             <h2 className="text-xl font-bold mb-4">Projects</h2>
//             {projects.length === 0 ? (
//                 <p>No projects found for this user.</p>
//             ) : (
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                     {projects.map((project) => (
//                         <Card key={project.id} className="hover:shadow-lg transition-shadow">
//                             <CardHeader>
//                                 <CardTitle>{project.projectName}</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <p className="text-sm text-gray-500 mb-4">{project.description}</p>
//                                 <Button onClick={() => router.push(`/verify/${project.id}`)}>View Certificate</Button>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }
"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
    Loader2,
    Github,
    Linkedin,
    Twitter,
    Globe,
    MapPin,
    Mail,
    Phone,
    Star,
    GitFork,
    ArrowLeft,
    Globe2,
    User2,
    Award,
} from "lucide-react"
import Image from "next/image"

interface UserProfile {
    id: string
    userId: string
    avatarUrl?: string
    displayName: string
    bio: string
    location: string
    skills: string[]
    socialLinks: {
        github: string
        linkedin: string
        twitter: string
        portfolio: string
    }
    hobbiesAndInterests: string[]
    languages: string[]
    emailAddress: string
    phoneNumber: string
    points: number
    status?: "online" | "offline"
}

interface Project {
    id: string
    name: string
    projectName: string
    techStack: string
    repoUrl: string
    imageUrl?: string
    approved: boolean
    description: string
    features: string[]
    stars: number
    starredBy: string[]
    userId?: string
}

export default function UserProjectsPage() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("projects")
    const params = useParams()
    const router = useRouter()
    const userId = params.userId as string

    useEffect(() => {
        if (!userId) return;

        const fetchUserAndProjects = async () => {
            setLoading(true);
            try {
                // Fetch user profile
                const userDoc = await getDoc(doc(db, "profiles", userId));
                if (userDoc.exists()) {
                    setUser({ id: userDoc.id, ...userDoc.data() } as UserProfile);
                }

                // Fetch user's projects
                const projectsQuery = query(collection(db, "projects"), where("userId", "==", userId));
                const projectsSnapshot = await getDocs(projectsQuery);

                const fetchedProjects: Project[] = projectsSnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                    } as Project;
                });

                setProjects(fetchedProjects);
            } catch (error) {
                console.error("Error fetching user and projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndProjects();
    }, [userId]);


    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-600">Loading profile...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <User2 className="h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">User not found</h2>
                <Button variant="ghost" className="mt-4" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        )
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
            <motion.div
                className="container mx-auto px-4 py-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="mb-8 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                            <CardTitle className="flex items-center space-x-6">
                                <Avatar className="h-24 w-24 border-4 border-white">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback className="text-2xl bg-white text-blue-500">{user.displayName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <h1 className="text-3xl font-bold">{user.displayName}</h1>
                                        <Badge variant="secondary" className="bg-white/20">
                                            {user.points} points
                                        </Badge>
                                    </div>
                                    <p className="text-blue-100">{user.bio}</p>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <MapPin className="h-4 w-4" />
                                        <span>{user.location}</span>
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span>{user.emailAddress}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        <span>{user.phoneNumber}</span>
                                    </div>
                                    <div className="flex space-x-4">
                                        {user.socialLinks.github && (
                                            <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                                <Github className="h-5 w-5 text-gray-600 hover:text-blue-500 transition-colors" />
                                            </a>
                                        )}
                                        {user.socialLinks.linkedin && (
                                            <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                                <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-500 transition-colors" />
                                            </a>
                                        )}
                                        {user.socialLinks.twitter && (
                                            <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                                <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-500 transition-colors" />
                                            </a>
                                        )}
                                        {user.socialLinks.portfolio && (
                                            <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                                                <Globe className="h-5 w-5 text-gray-600 hover:text-blue-500 transition-colors" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill, index) => (
                                            <Badge key={index} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects">
                        {projects.length === 0 ? (
                            <Card className="bg-white/50">
                                <CardContent className="pt-6">
                                    <div className="text-center py-12">
                                        <Globe2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700">No projects yet</h3>
                                        <p className="text-gray-500">This user has not published any projects.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" variants={containerVariants}>
                                {projects.map((project) => (
                                    <motion.div key={project.id} variants={itemVariants}>
                                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                            {project.imageUrl && (
                                                <div className="relative h-48 w-full overflow-hidden">
                                                    <Image
                                                        width={400}
                                                        height={200}
                                                        src={project.imageUrl || "/placeholder.svg"}
                                                        alt={project.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader>
                                                <CardTitle className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl">{project.projectName}</h3>
                                                        {project.approved && (
                                                            <Badge className="mt-2" variant="secondary">
                                                                <Award className="h-3 w-3 mr-1" /> Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-500">
                                                        <Star className="h-4 w-4" />
                                                        <span>
                                                            {typeof project.stars === "object"
                                                            }
                                                        </span>
                                                    </div>

                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-gray-600">{project.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack.split(",").map((tech, index) => (
                                                        <Badge key={index} variant="outline">
                                                            {tech.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <Button variant="ghost" onClick={() => router.push(`/verify/${project.id}`)}>
                                                    View Certificate
                                                </Button>
                                                {project.repoUrl && (
                                                    <a
                                                        href={project.repoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                                                    >
                                                        <GitFork className="h-4 w-4 mr-1" />
                                                        Repository
                                                    </a>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </TabsContent>

                    <TabsContent value="about">
                        <motion.div
                            className="grid gap-6 md:grid-cols-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={itemVariants}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Languages</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {user.languages.map((language, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {language}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hobbies & Interests</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {user.hobbiesAndInterests.map((hobby, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {hobby}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    )
}

