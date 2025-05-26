// app/leaderboard/LeaderboardClient.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Heart, Star } from 'lucide-react'
// import { ImageModal } from '@/components/ImageModal'
import { motion } from 'framer-motion'

export type ProjectData = {
    id: string;
    projectName: string;
    likes: number;
    userName: string;
    userId: string;
    userAvatarUrl: string;
    imageUrl: string;
}

type RankStyle = {
    bgColor: string;
    icon: React.ReactNode;
    textColor: string;
    shadow: string;
}

export default function LeaderboardClient() {
    const [leaderboardData, setLeaderboardData] = useState<ProjectData[]>([])

    useEffect(() => {
        async function fetchLeaderboardData() {
            try {
                const q = query(collection(db, 'projects'), orderBy('likes', 'desc'), limit(50))
                const snapshot = await getDocs(q)
                const list: ProjectData[] = []

                for (const docSnap of snapshot.docs) {
                    const projectData = docSnap.data()
                    const userSnap = await getDocs(
                        query(collection(db, 'profiles'), where('userId', '==', projectData.userId))
                    )
                    const userData = userSnap.docs[0]?.data() || { displayName: 'Unknown User', avatarUrl: '/placeholder.svg' }

                    list.push({
                        id: docSnap.id,
                        projectName: projectData.projectName || 'Unnamed Project',
                        likes: projectData.likes || 0,
                        userName: userData.displayName,
                        userId: projectData.userId,
                        userAvatarUrl: userData.avatarUrl || '/placeholder.svg',
                        imageUrl: projectData.imageUrl || '/placeholder.svg',
                    })
                }

                setLeaderboardData(list)
            } catch (error) {
                console.error('Error fetching leaderboard data:', error)
            }
        }

        fetchLeaderboardData()
    }, [])

    const getRankStyle = (index: number): RankStyle => {
        switch (index) {
            case 0:
                return { bgColor: 'bg-gradient-to-r from-purple-600 to-pink-800 animate-gradient', icon: <Trophy className="h-8 w-8 text-white" />, textColor: 'text-white', shadow: 'shadow-2xl' }
            case 1:
                return { bgColor: 'bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient', icon: <Medal className="h-8 w-8 text-white" />, textColor: 'text-white', shadow: 'shadow-xl' }
            case 2:
                return { bgColor: 'bg-gradient-to-r from-purple-300 to-pink-200 animate-gradient', icon: <Medal className="h-8 w-8 text-white" />, textColor: 'text-white', shadow: 'shadow-lg' }
            default:
                return { bgColor: 'bg-white', icon: <span className="font-bold text-gray-600">#{index + 1}</span>, textColor: 'text-gray-800', shadow: 'shadow-md' }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                    StudentShowcase Leaderboard
                </h1>
                <Card className="bg-white/90 backdrop-blur-lg border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient py-6">
                        <CardTitle className="text-2xl font-bold flex items-center justify-between">
                            <span>Top Liked Projects</span>
                            <Star className="h-6 w-6 text-white" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-200">
                            {leaderboardData.map((project, idx) => {
                                const style = getRankStyle(idx)
                                return (
                                    <motion.div key={project.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1, duration: 0.5 }} className={`${style.bgColor} ${style.textColor} ${style.shadow} flex items-center justify-between p-4 hover:scale-[1.02] transition-all duration-300`}>
                                        <div className="flex items-center space-x-4 w-full">
                                            <div className="w-12 flex items-center justify-center">{style.icon}</div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-lg">{project.projectName}</h3>
                                                <Link href={`/profile/${project.userId}`} className="text-sm hover:underline opacity-80 hover:opacity-100">
                                                    {project.userName}
                                                </Link>
                                            </div>
                                            <Badge variant="secondary" className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                                <Heart className="h-5 w-5 text-red-500" />
                                                <span className="font-bold">{project.likes}</span>
                                            </Badge>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}