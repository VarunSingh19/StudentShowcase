import React, { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Star, Award, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LikedProject } from '@/types/profile'
import Image from 'next/image'

interface LikedProjectsContentProps {
    userId: string;
}

export function LikedProjectsContent({ userId }: LikedProjectsContentProps) {
    const [likedProjects, setLikedProjects] = useState<LikedProject[]>([])
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    useEffect(() => {
        console.log('Fetching liked projects for user:', userId)
        fetchLikedProjects()
    }, [userId])

    const fetchLikedProjects = async () => {
        try {
            const likesQuery = query(collection(db, 'userLikes'), where('userId', '==', userId));
            const likesSnapshot = await getDocs(likesQuery);
            const likedProjectIds = likesSnapshot.docs.map(doc => doc.data().projectId);
            console.log('Found liked project IDs:', likedProjectIds)

            const likedProjectsData: LikedProject[] = [];
            for (const projectId of likedProjectIds) {
                const projectDoc = await getDoc(doc(db, 'projects', projectId));
                if (projectDoc.exists()) {
                    const projectData = projectDoc.data();
                    likedProjectsData.push({
                        id: projectDoc.id,
                        projectName: projectData.projectName || "Untitled Project",
                        techStack: projectData.techStack || "Unknown",
                        likes: projectData.likes || 0,
                        name: projectData.name || "N/A",
                        repoUrl: projectData.repoUrl || "#",
                        approved: projectData.approved || false,
                        description: projectData.description || "No description provided.",
                        imageUrl: projectData.imageUrl || "/placeholder.svg"
                    });
                }
            }
            console.log('Fetched liked projects data:', likedProjectsData)
            setLikedProjects(likedProjectsData);
        } catch (err) {
            console.error('Error fetching liked projects:', err);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
            >
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
                    Your Liked Projects
                </h1>
                <p className="text-muted-foreground">
                    Projects that caught your attention ❤️
                </p>
            </motion.div>

            <AnimatePresence>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {likedProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={item}
                            layout
                            onHoverStart={() => setHoveredId(project.id)}
                            onHoverEnd={() => setHoveredId(null)}
                            className="relative"
                        >
                            <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={project.imageUrl || '/studentshowcase.png'}
                                        alt={project.projectName}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                    {project.approved && (
                                        <div className="absolute top-2 right-2">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="bg-green-500 p-1 rounded-full"
                                            >
                                                <Award className="h-5 w-5 text-white" />
                                            </motion.div>
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xl font-bold line-clamp-1">
                                            {project.projectName}
                                        </CardTitle>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            className="flex items-center gap-1 text-red-500"
                                        >
                                            <Heart className="h-5 w-5 fill-current" />
                                            <span className="font-semibold">{project.likes}</span>
                                        </motion.div>
                                    </div>
                                    <CardDescription className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        {project.techStack}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {project.description}
                                    </p>

                                    <motion.a
                                        href={project.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        View Project <ExternalLink className="h-4 w-4" />
                                    </motion.a>
                                </CardContent>
                            </Card>

                            {hoveredId === project.id && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
                                />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {likedProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-xl text-muted-foreground">
                        You haven't liked any projects yet
                    </p>
                </motion.div>
            )}
        </div>
    )
}

