// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/hooks/useAuth'
// import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from 'lucide-react'

// interface Project {
//     id: string;
//     name: string;
//     projectName: string;
//     techStack: string;
//     repoUrl: string;
//     approved: boolean;
// }

// export default function AdminPanel() {
//     const [projects, setProjects] = useState<Project[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const { user } = useAuth()

//     useEffect(() => {
//         fetchProjects()
//     }, [])

//     const fetchProjects = async () => {
//         try {
//             const q = query(collection(db, 'projects'))
//             const querySnapshot = await getDocs(q)
//             const fetchedProjects: Project[] = []
//             querySnapshot.forEach((doc) => {
//                 fetchedProjects.push({ id: doc.id, ...doc.data() } as Project)
//             })
//             setProjects(fetchedProjects)
//         } catch (err) {
//             console.error('Error fetching projects:', err)
//             setError('Failed to fetch projects')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleApprove = async (projectId: string) => {
//         try {
//             await updateDoc(doc(db, 'projects', projectId), {
//                 approved: true
//             })
//             setProjects(projects.map(project =>
//                 project.id === projectId ? { ...project, approved: true } : project
//             ))
//         } catch (err) {
//             console.error('Error approving project:', err)
//             setError('Failed to approve project')
//         }
//     }

//     const handleReject = async (projectId: string) => {
//         try {
//             await updateDoc(doc(db, 'projects', projectId), {
//                 approved: false
//             })
//             setProjects(projects.map(project =>
//                 project.id === projectId ? { ...project, approved: false } : project
//             ))
//         } catch (err) {
//             console.error('Error rejecting project:', err)
//             setError('Failed to reject project')
//         }
//     }

//     if (!user) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Access Denied</AlertTitle>
//                     <AlertDescription>
//                         You must be logged in as an admin to access this page.
//                     </AlertDescription>
//                 </Alert>
//             </div>
//         )
//     }

//     if (loading) {
//         return <div>Loading...</div>
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
//             {error && (
//                 <Alert variant="destructive" className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                     <Card key={project.id}>
//                         <CardHeader>
//                             <CardTitle>{project.projectName}</CardTitle>
//                             <CardDescription>By {project.name}</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <p><strong>Tech Stack:</strong> {project.techStack}</p>
//                             <p><strong>Repository:</strong> <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.repoUrl}</a></p>
//                         </CardContent>
//                         <CardFooter className="flex justify-between">
//                             {project.approved ? (
//                                 <Button onClick={() => handleReject(project.id)} variant="destructive">Reject</Button>
//                             ) : (
//                                 <Button onClick={() => handleApprove(project.id)}>Approve</Button>
//                             )}
//                             <span className={`px-2 py-1 rounded ${project.approved ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
//                                 {project.approved ? 'Approved' : 'Pending'}
//                             </span>
//                         </CardFooter>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     )
// }

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface Project {
    id: string;
    name: string;
    projectName: string;
    techStack: string;
    repoUrl: string;
    approved: boolean;
    imageUrl: string;
}

export default function AdminPanel() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, 'projects'))
            const querySnapshot = await getDocs(q)
            const fetchedProjects: Project[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                fetchedProjects.push({
                    id: doc.id,
                    ...data,
                    imageUrl: data.imageUrl || '/placeholder.svg'
                } as Project)
            })
            setProjects(fetchedProjects)
        } catch (err) {
            console.error('Error fetching projects:', err)
            setError('Failed to fetch projects')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (projectId: string) => {
        try {
            await updateDoc(doc(db, 'projects', projectId), {
                approved: true
            })
            setProjects(projects.map(project =>
                project.id === projectId ? { ...project, approved: true } : project
            ))
        } catch (err) {
            console.error('Error approving project:', err)
            setError('Failed to approve project')
        }
    }

    const handleReject = async (projectId: string) => {
        try {
            await updateDoc(doc(db, 'projects', projectId), {
                approved: false
            })
            setProjects(projects.map(project =>
                project.id === projectId ? { ...project, approved: false } : project
            ))
        } catch (err) {
            console.error('Error rejecting project:', err)
            setError('Failed to reject project')
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You must be logged in as an admin to access this page.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{project.projectName}</CardTitle>
                            <CardDescription>By {project.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                            <div className="relative w-full h-48 mb-4">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.projectName}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-md"
                                />
                            </div>
                            <p><strong>Tech Stack:</strong> {project.techStack}</p>
                            <p><strong>Repository:</strong> <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.repoUrl}</a></p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            {project.approved ? (
                                <Button onClick={() => handleReject(project.id)} variant="destructive">Reject</Button>
                            ) : (
                                <Button onClick={() => handleApprove(project.id)}>Approve</Button>
                            )}
                            <span className={`px-2 py-1 rounded ${project.approved ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {project.approved ? 'Approved' : 'Pending'}
                            </span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

