
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Heart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

async function getLeaderboardData() {
    const q = query(collection(db, 'projects'), orderBy('likes', 'desc'), limit(50))
    const querySnapshot = await getDocs(q)
    const leaderboardData = []

    for (const doc of querySnapshot.docs) {
        const projectData = doc.data()
        const userDoc = await getDocs(query(collection(db, 'profiles'), where('userId', '==', projectData.userId)))
        const userData = userDoc.docs[0]?.data() || { displayName: 'Unknown User', avatarUrl: '/placeholder.svg' }

        leaderboardData.push({
            id: doc.id,
            projectName: projectData.projectName,
            likes: projectData.likes || 0,
            userName: userData.displayName,
            userId: projectData.userId,
            userAvatarUrl: userData.avatarUrl || '/placeholder.svg',
            imageUrl: projectData.imageUrl || '/placeholder.svg',
        })
    }

    return leaderboardData
}

export default async function LeaderboardPage() {


    const leaderboardData = await getLeaderboardData()





    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Top Projects Leaderboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Top Liked Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaderboardData.map((project, index) => (
                            <div key={project.id} className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl font-bold min-w-[2rem] flex items-center justify-center">
                                        {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                                        {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                                        {index === 2 && <Medal className="h-6 w-6 text-amber-600" />}
                                        {index > 2 && `#${index + 1}`}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <Avatar className="h-11 w-11">
                                            <AvatarImage src={project.userAvatarUrl} alt={project.userName} />
                                            <AvatarFallback>{project.userName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <h3 className="font-semibold">{project.projectName}</h3>
                                            <Link href={`/profile/${project.userId}`} className="text-sm text-blue-500 hover:underline">
                                                {project.userName}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{project.likes}</span>
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

