
// import { db } from '@/lib/firebase'
// import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
// import Link from 'next/link'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Trophy, Medal, Heart } from 'lucide-react'
// import { ImageModal } from '@/components/ImageModal'


// async function getLeaderboardData() {
//     const q = query(collection(db, 'projects'), orderBy('likes', 'desc'), limit(50))
//     const querySnapshot = await getDocs(q)
//     const leaderboardData = []

//     for (const doc of querySnapshot.docs) {
//         const projectData = doc.data()
//         const userDoc = await getDocs(query(collection(db, 'profiles'), where('userId', '==', projectData.userId)))
//         const userData = userDoc.docs[0]?.data() || { displayName: 'Unknown User', avatarUrl: '/placeholder.svg' }

//         leaderboardData.push({
//             id: doc.id,
//             projectName: projectData.projectName,
//             likes: projectData.likes || 0,
//             userName: userData.displayName,
//             userId: projectData.userId,
//             userAvatarUrl: userData.avatarUrl || '/placeholder.svg',
//             imageUrl: projectData.imageUrl || '/placeholder.svg',
//         })
//     }

//     return leaderboardData
// }

// export default async function LeaderboardPage() {


//     const leaderboardData = await getLeaderboardData()





//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-6 text-center">Top Projects Leaderboard</h1>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Top Liked Projects</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="space-y-4">
//                         {leaderboardData.map((project, index) => (
//                             <div key={project.id} className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
//                                 <div className="flex items-center space-x-4">
//                                     <span className="text-2xl font-bold min-w-[2rem] flex items-center justify-center">
//                                         {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
//                                         {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
//                                         {index === 2 && <Medal className="h-6 w-6 text-amber-600" />}
//                                         {index > 2 && `#${index + 1}`}
//                                     </span>
//                                     <div className="flex items-center space-x-2">
//                                         <ImageModal
//                                             src={project.userAvatarUrl || `/placeholder.svg?text=${project.userAvatarUrl?.charAt(0) || 'U'}`}
//                                             alt={project.userName?.charAt(0) || 'U'}

//                                         />
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                         <div>
//                                             <h3 className="font-semibold">{project.projectName}</h3>
//                                             <Link href={`/profile/${project.userId}`} className="text-sm text-blue-500 hover:underline">
//                                                 {project.userName}
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <Badge variant="secondary" className="flex items-center space-x-1">
//                                     <Heart className="h-4 w-4" />
//                                     <span>{project.likes}</span>
//                                 </Badge>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }


"use client"

import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Heart, Star } from 'lucide-react'
import { ImageModal } from '@/components/ImageModal'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Define a type for the project data
export type ProjectData = {
    id: string;
    projectName: string;
    likes: number;
    userName: string;
    userId: string;
    userAvatarUrl: string;
    imageUrl: string;
}

// Define a type for rank style
type RankStyle = {
    bgColor: string;
    icon: React.ReactNode;
    textColor: string;
    shadow: string;
}

function LeaderboardClient() {
    const [leaderboardData, setLeaderboardData] = useState<ProjectData[]>([])

    useEffect(() => {
        async function fetchLeaderboardData() {
            try {
                const q = query(collection(db, 'projects'), orderBy('likes', 'desc'), limit(50))
                const querySnapshot = await getDocs(q)
                const fetchedLeaderboardData: ProjectData[] = []

                for (const doc of querySnapshot.docs) {
                    const projectData = doc.data()
                    const userDoc = await getDocs(query(collection(db, 'profiles'), where('userId', '==', projectData.userId)))
                    const userData = userDoc.docs[0]?.data() || { displayName: 'Unknown User', avatarUrl: '/placeholder.svg' }

                    fetchedLeaderboardData.push({
                        id: doc.id,
                        projectName: projectData.projectName || 'Unnamed Project',
                        likes: projectData.likes || 0,
                        userName: userData.displayName || 'Unknown User',
                        userId: projectData.userId,
                        userAvatarUrl: userData.avatarUrl || '/placeholder.svg',
                        imageUrl: projectData.imageUrl || '/placeholder.svg',
                    })
                }

                setLeaderboardData(fetchedLeaderboardData)
            } catch (error) {
                console.error('Error fetching leaderboard data:', error)
            }
        }

        fetchLeaderboardData()
    }, [])

    // Ranking color and icon mapping
    const getRankStyle = (index: number): RankStyle => {
        switch (index) {
            case 0:
                return {
                    bgColor: 'bg-gradient-to-r from-purple-600 to-pink-800 animate-gradient',
                    icon: <Trophy className="h-8 w-8 text-white" />,
                    textColor: 'text-white',
                    shadow: 'shadow-2xl'
                }
            case 1:
                return {
                    bgColor: 'bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient',
                    icon: <Medal className="h-8 w-8 text-white" />,
                    textColor: 'text-white',
                    shadow: 'shadow-xl'
                }
            case 2:
                return {
                    bgColor: 'bg-gradient-to-r from-purple-300 to-pink-200 animate-gradient',
                    icon: <Medal className="h-8 w-8 text-white" />,
                    textColor: 'text-white',
                    shadow: 'shadow-lg'
                }
            default:
                return {
                    bgColor: 'bg-white',
                    icon: <span className="font-bold text-gray-600">{`#${index + 1}`}</span>,
                    textColor: 'text-gray-800',
                    shadow: 'shadow-md'
                }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                        StudentShowcase Leaderboard
                    </span>
                </h1>
                <Card className="bg-white/90 backdrop-blur-lg border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient py-6">
                        <CardTitle className="text-2xl font-bold flex items-center justify-between">
                            <span>Top Liked Projects</span>
                            <Star className="h-6 w-6" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-200">
                            {leaderboardData.map((project, index) => {
                                const rankStyle = getRankStyle(index)
                                return (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: index * 0.1,
                                            duration: 0.5
                                        }}
                                        className={`
                                            flex items-center justify-between p-4 
                                            ${rankStyle.bgColor} ${rankStyle.textColor} ${rankStyle.shadow}
                                            hover:scale-[1.02] transition-all duration-300 ease-in-out
                                        `}
                                    >
                                        <div className="flex items-center space-x-4 w-full">
                                            <div className="flex items-center justify-center w-12">
                                                {rankStyle.icon}
                                            </div>
                                            <div className="flex items-center space-x-4 flex-grow">
                                                <ImageModal
                                                    src={project.userAvatarUrl}
                                                    alt={project.userName?.charAt(0) || 'U'}

                                                />
                                                <div className="flex-grow">
                                                    <h3 className="font-bold text-lg">{project.projectName}</h3>
                                                    <Link
                                                        href={`/profile/${project.userId}`}
                                                        className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity"
                                                    >
                                                        {project.userName}
                                                    </Link>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"
                                            >
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

export default function LeaderboardPage() {
    return <LeaderboardClient />
}
