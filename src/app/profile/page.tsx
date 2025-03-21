'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile, Project } from '@/types/profile'
import { ProfileHeader } from './ProfileHeader'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ProfileContent } from './components/ProfileContent'
import { ProjectsContent } from './components/ProjectContent'
import { LikedProjectsContent } from './components/LikedProjectContent'
import { CertificatesContent } from './components/CertificatesContent'
import { TasksContent } from './components/TaskContent'
import { ResumeContent } from './components/ResumeContent'
import { PortfolioContent } from '@/components/ProfileContent/PortfolioContent'

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const { user, authChecked } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (authChecked && !user) {
            router.push('/')
            return
        }
        if (user) {
            fetchProfile()
            fetchProjects()
        }
    }, [user, authChecked, router])

    const fetchProfile = async () => {
        if (!user) return
        try {
            const profileDoc = await getDoc(doc(db, 'profiles', user.uid))
            if (profileDoc.exists()) {
                setProfile(profileDoc.data() as UserProfile)
                console.log(user.uid)
            } else {
                const defaultProfile: UserProfile = {
                    id: '',
                    points: 0,
                    orderHistory: [],
                    likedProducts: [],
                    userId: user.uid,
                    displayName: '',
                    bio: '',
                    location: '',
                    skills: [],
                    socialLinks: {
                        github: '',
                        linkedin: '',
                        twitter: '',
                        portfolio: ''
                    },
                    hobbiesAndInterests: [],
                    languages: [],
                    emailAddress: '',
                    phoneNumber: '',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                setProfile(defaultProfile)
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchProjects = async () => {
        if (!user) return
        try {
            const q = query(collection(db, 'projects'), where('userId', '==', user.uid))
            const querySnapshot = await getDocs(q)

            const projectsData: Project[] = querySnapshot.docs.map((doc) => {
                const projectData = doc.data()
                return {
                    id: doc.id,
                    userId: projectData.userId || user.uid,
                    name: projectData.name || projectData.projectName || 'Untitled Project',
                    projectName: projectData.projectName || 'Untitled Project',
                    techStack: projectData.techStack || 'Not Specified',
                    description: projectData.description || 'No description available.',
                    features: projectData.features || [],
                    repoUrl: projectData.repoUrl || '#',
                    imageUrl: projectData.imageUrl || '/placeholder.svg',
                    likes: projectData.likes || 0,
                    approved: projectData.approved || false,
                    stars: projectData.stars || 0,
                    starredBy: projectData.starredBy || [],
                    completionDate: projectData.completionDate?.toDate?.().toLocaleDateString() || 'Not Specified',
                }
            })

            setProjects(projectsData)
        } catch (err) {
            console.error('Error fetching projects:', err)
        }
    }


    if (loading) {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground">Loading profile...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">Failed to load profile. Please try again later.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-background to-secondary/20 rounded-3xl shadow-lg"
            >
                <ProfileHeader
                    profile={profile}
                    onUpdate={(updatedProfile: UserProfile) => {
                        setProfile(updatedProfile)
                        window.location.reload()
                    }}
                />
            </motion.div>

            <Tabs defaultValue="profile" className="mt-8">
                <TabsList className="grid w-full grid-cols-7 rounded-xl bg-muted p-1">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="liked">Liked</TabsTrigger>
                    <TabsTrigger value="certificates">Certificate</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <ProfileContent initialProfile={profile} userId={user!.uid} />
                </TabsContent>

                <TabsContent value="projects">
                    <ProjectsContent userId={user!.uid} />
                </TabsContent>

                <TabsContent value="liked">
                    <LikedProjectsContent userId={user!.uid} />
                </TabsContent>

                <TabsContent value="certificates">
                    <CertificatesContent projects={projects} profile={profile} />
                </TabsContent>

                <TabsContent value="tasks">
                    <TasksContent />
                </TabsContent>

                <TabsContent value="resume">
                    <ResumeContent profile={profile} projects={projects} />
                </TabsContent>
                <TabsContent value="portfolio">
                    <PortfolioContent userId={user!.uid} profile={profile} />
                </TabsContent>
            </Tabs>
        </div>
    )
}



