import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { LikedProject } from '@/types/profile'

interface LikedProjectsContentProps {
    userId: string;
}

export function LikedProjectsContent({ userId }: LikedProjectsContentProps) {
    const [likedProjects, setLikedProjects] = useState<LikedProject[]>([])

    useEffect(() => {
        fetchLikedProjects()
    }, [userId])

    const fetchLikedProjects = async () => {
        try {
            const likesQuery = query(collection(db, 'userLikes'), where('userId', '==', userId))
            const likesSnapshot = await getDocs(likesQuery)
            const likedProjectIds = likesSnapshot.docs.map(doc => doc.data().projectId)

            const likedProjectsData: LikedProject[] = []
            for (const projectId of likedProjectIds) {
                const projectDoc = await getDoc(doc(db, 'projects', projectId))
                if (projectDoc.exists()) {
                    const projectData = projectDoc.data()
                    likedProjectsData.push({
                        id: projectDoc.id,
                        projectName: projectData.projectName,
                        techStack: projectData.techStack,
                        likes: projectData.likes || 0
                    })
                }
            }
            setLikedProjects(likedProjectsData)
        } catch (err) {
            console.error('Error fetching liked projects:', err)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Liked Projects</CardTitle>
                <CardDescription>
                    Projects you have liked
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {likedProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h3 className="font-medium">{project.projectName}</h3>
                                <p className="text-sm text-muted-foreground">{project.techStack}</p>
                            </div>
                            <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4 fill-current text-red-500" />
                                {project.likes}
                            </span>
                        </motion.div>
                    ))}
                    {likedProjects.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                            You have not liked any projects yet
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

