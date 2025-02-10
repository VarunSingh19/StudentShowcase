"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface UserProfile {
    id: string
    displayName: string
    email: string
    avatarUrl?: string
}

interface Project {
    id: string
    projectName: string
    description: string
}

export default function UserProjectsPage() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const router = useRouter()
    const userId = params.userId as string

    useEffect(() => {
        const fetchUserAndProjects = async () => {
            try {
                // Fetch user profile
                const userDoc = await getDoc(doc(db, "profiles", userId))
                if (userDoc.exists()) {
                    setUser({ id: userDoc.id, ...userDoc.data() } as UserProfile)
                }

                // Fetch user's projects
                const projectsQuery = query(collection(db, "projects"), where("userId", "==", userId))
                const projectsSnapshot = await getDocs(projectsQuery)
                const fetchedProjects: Project[] = []
                projectsSnapshot.forEach((doc) => {
                    fetchedProjects.push({ id: doc.id, ...doc.data() } as Project)
                })
                setProjects(fetchedProjects)
            } catch (error) {
                console.error("Error fetching user and projects:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserAndProjects()
    }, [userId])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!user) {
        return <div>User not found.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">{user.displayName}</h1>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>

            <h2 className="text-xl font-bold mb-4">Projects</h2>
            {projects.length === 0 ? (
                <p>No projects found for this user.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{project.projectName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                                <Button onClick={() => router.push(`/verify/${project.id}`)}>View Certificate</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

