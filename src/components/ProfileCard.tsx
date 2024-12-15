// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Heart, Briefcase } from 'lucide-react'
// import Link from 'next/link'
// import { db } from '@/lib/firebase'
// import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'

// async function profileData() {
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

// const profiled = await profileData()
// export function ProfileCard({ profile }) {
//     return (
//         <Card className="h-full flex flex-col">
//             <CardHeader>
//                 <div className="flex items-center space-x-4">
//                     <Avatar>
//                         <AvatarImage src={profiled.} />
//                         <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                         <CardTitle className="text-xl font-bold">{profile.displayName}</CardTitle>
//                         <p className="text-sm text-muted-foreground">{profile.role || 'Student'}</p>
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent className="flex-grow flex flex-col justify-between">
//                 <div>
//                     <div className="flex flex-wrap gap-2 mb-4">
//                         {profile.skills && profile.skills.slice(0, 3).map((skill, index) => (
//                             <Badge key={index} variant="secondary">{skill}</Badge>
//                         ))}
//                     </div>
//                     {profile.topProject && (
//                         <div className="mb-4">
//                             <h4 className="font-semibold mb-1">Top Project:</h4>
//                             <Link href={`/projects/${profile.topProject.id}`} className="text-blue-500 hover:underline">
//                                 {profile.topProject.projectName}
//                             </Link>
//                             <p className="text-sm text-muted-foreground">
//                                 {profile.topProject.likes} likes
//                             </p>
//                         </div>
//                     )}
//                     <div className="flex justify-between text-sm text-muted-foreground mb-4">
//                         <span className="flex items-center">
//                             <Briefcase className="h-4 w-4 mr-1" />
//                             {profile.projectCount || 0} Projects
//                         </span>
//                         <span className="flex items-center">
//                             <Heart className="h-4 w-4 mr-1" />
//                             {profile.totalLikes || 0} Total Likes
//                         </span>
//                     </div>
//                 </div>
//                 <Button variant="outline" size="sm" asChild>
//                     <Link href={`/profile/${profile.userId}`}>View Profile</Link>
//                 </Button>
//             </CardContent>
//         </Card>
//     )
// }

