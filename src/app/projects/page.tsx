// 'use client'

// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from 'lucide-react'
// import { LikeButton } from '@/components/LikeButton'
// import { useAuth } from '@/hooks/useAuth'

// interface Project {
//     id: string;
//     name: string;
//     projectName: string;
//     techStack: string;
//     repoUrl: string;
//     imageUrl?: string; // Make optional since it's not in the DB
//     likes?: number; // Make optional since it's not in the DB
//     approved: boolean;
//     createdAt: any;
// }

// export default function ProjectsPage() {
//     const [projects, setProjects] = useState<Project[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const { user } = useAuth()

//     useEffect(() => {
//         console.log("Fetching projects...")
//         const q = query(
//             collection(db, 'projects'),
//             where('approved', '==', true),
//             orderBy('createdAt', 'desc') // Updated query to order by createdAt
//         )

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             console.log("Query snapshot size:", querySnapshot.size) // Added debug log
//             const fetchedProjects: Project[] = []
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data()
//                 console.log("Project document:", doc.id, data) // Added debug log
//                 fetchedProjects.push({
//                     id: doc.id,
//                     ...data,
//                     likes: data.likes || 0 // Provide default value for likes
//                 } as Project)
//             })
//             console.log("Processed projects:", fetchedProjects) // Added debug log
//             setProjects(fetchedProjects)
//             setLoading(false)
//         }, (err) => {
//             console.error('Error fetching projects:', err)
//             setError('Failed to fetch projects: ' + err.message)
//             setLoading(false)
//         })

//         return () => unsubscribe()
//     }, [])

//     if (loading) {
//         return <div>Loading...</div>
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-6">Approved Projects</h1>
//             {error && (
//                 <Alert variant="destructive" className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}
//             {projects.length === 0 && !error && (
//                 <Alert className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>No Projects</AlertTitle>
//                     <AlertDescription>There are no approved projects to display at the moment.</AlertDescription>
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
//                             {project.imageUrl && (
//                                 <Image
//                                     src={project.imageUrl}
//                                     alt={project.projectName}
//                                     width={300}
//                                     height={200}
//                                     className="w-full h-40 object-cover mb-4 rounded"
//                                 />
//                             )}
//                             <p><strong>Tech Stack:</strong> {project.techStack}</p>
//                             <p><strong>Repository:</strong> <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.repoUrl}</a></p>
//                             <div className="mt-4 flex items-center justify-between">
//                                 <LikeButton projectId={project.id} initialLikes={project.likes || 0} /> {/* Provide default value for likes */}
//                                 <span className="text-sm text-gray-500">{project.likes || 0} likes</span> {/* Provide default value for likes */}
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     )
// }






// 'use client'

// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from 'lucide-react'
// import { LikeButton } from '@/components/LikeButton'
// import { useAuth } from '@/hooks/useAuth'

// interface Project {
//     id: string;
//     name: string;
//     projectName: string;
//     techStack: string;
//     repoUrl: string;
//     imageUrl: string;
//     likes: number;
//     approved: boolean;
//     createdAt: any;
// }

// export default function ProjectsPage() {
//     const [projects, setProjects] = useState<Project[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const { user } = useAuth()

//     useEffect(() => {
//         console.log("Fetching projects...")
//         const q = query(
//             collection(db, 'projects'),
//             where('approved', '==', true),
//             orderBy('createdAt', 'desc')
//         )

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             console.log("Query snapshot size:", querySnapshot.size)
//             const fetchedProjects: Project[] = []
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data()
//                 console.log("Project document:", doc.id, data)
//                 fetchedProjects.push({
//                     id: doc.id,
//                     ...data,
//                     likes: data.likes || 0,
//                     imageUrl: data.imageUrl || '/placeholder.svg'
//                 } as Project)
//             })
//             console.log("Processed projects:", fetchedProjects)
//             setProjects(fetchedProjects)
//             setLoading(false)
//         }, (err) => {
//             console.error('Error fetching projects:', err)
//             setError('Failed to fetch projects: ' + err.message)
//             setLoading(false)
//         })

//         return () => unsubscribe()
//     }, [])

//     if (loading) {
//         return <div>Loading...</div>
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-6">Approved Projects</h1>
//             {error && (
//                 <Alert variant="destructive" className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}
//             {projects.length === 0 && !error && (
//                 <Alert className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>No Projects</AlertTitle>
//                     <AlertDescription>There are no approved projects to display at the moment.</AlertDescription>
//                 </Alert>
//             )}
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                     <Card key={project.id} className="flex flex-col">
//                         <CardHeader>
//                             <CardTitle>{project.projectName}</CardTitle>
//                             <CardDescription>By {project.name}</CardDescription>
//                         </CardHeader>
//                         <CardContent className="flex-grow flex flex-col">
//                             <div className="relative w-full h-48 mb-4">
//                                 <Image
//                                     src={project.imageUrl}
//                                     alt={project.projectName}
//                                     fill
//                                     style={{ objectFit: 'cover' }}
//                                     className="rounded-md"
//                                 />
//                             </div>
//                             <p><strong>Tech Stack:</strong> {project.techStack}</p>
//                             <p><strong>Repository:</strong> <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.repoUrl}</a></p>
//                             <div className="mt-auto pt-4 flex items-center justify-between">
//                                 <LikeButton projectId={project.id} initialLikes={project.likes} />
//                                 <span className="text-sm text-gray-500">{project.likes} likes</span>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from 'lucide-react'
// import { LikeButton } from '@/components/LikeButton'
// import { useAuth } from '@/hooks/useAuth'
// import { Button } from "@/components/ui/button"

// interface Project {
//     id: string;
//     userId: string;
//     name: string;
//     projectName: string;
//     techStack: string;
//     description: string;
//     features: string[];
//     repoUrl: string;
//     imageUrl: string;
//     likes: number;
//     approved: boolean;
//     createdAt: any;
// }

// export default function ProjectsPage() {
//     const [projects, setProjects] = useState<Project[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const { user } = useAuth()
//     const router = useRouter()

//     useEffect(() => {
//         console.log("Fetching projects...")
//         const q = query(
//             collection(db, 'projects'),
//             where('approved', '==', true),
//             orderBy('createdAt', 'desc')
//         )

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             console.log("Query snapshot size:", querySnapshot.size)
//             const fetchedProjects: Project[] = []
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data()
//                 console.log("Project document:", doc.id, data)
//                 fetchedProjects.push({
//                     id: doc.id,
//                     ...data,
//                     likes: data.likes || 0,
//                     imageUrl: data.imageUrl || '/placeholder.svg'
//                 } as Project)
//             })
//             console.log("Processed projects:", fetchedProjects)
//             setProjects(fetchedProjects)
//             setLoading(false)
//         }, (err) => {
//             console.error('Error fetching projects:', err)
//             setError('Failed to fetch projects: ' + err.message)
//             setLoading(false)
//         })

//         return () => unsubscribe()
//     }, [])

//     const handleEditClick = (projectId: string) => {
//         router.push(`/upload-project?id=${projectId}`)
//     }

//     if (loading) {
//         return <div>Loading...</div>
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-6">Approved Projects</h1>
//             {error && (
//                 <Alert variant="destructive" className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}
//             {projects.length === 0 && !error && (
//                 <Alert className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>No Projects</AlertTitle>
//                     <AlertDescription>There are no approved projects to display at the moment.</AlertDescription>
//                 </Alert>
//             )}
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                     <Card key={project.id} className="flex flex-col">
//                         <CardHeader>
//                             <CardTitle>{project.projectName}</CardTitle>
//                             <CardDescription>By {project.name}</CardDescription>
//                         </CardHeader>
//                         <CardContent className="flex-grow flex flex-col">
//                             <div className="relative w-full h-48 mb-4">
//                                 <Image
//                                     src={project.imageUrl}
//                                     alt={project.projectName}
//                                     fill
//                                     style={{ objectFit: 'cover' }}
//                                     className="rounded-md"
//                                 />
//                             </div>
//                             <p><strong>Tech Stack:</strong> {project.techStack}</p>
//                             <p><strong>Repository:</strong> <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.repoUrl}</a></p>
//                             <div className="mt-auto pt-4 flex items-center justify-between">
//                                 <LikeButton projectId={project.id} initialLikes={project.likes} />
//                                 <span className="text-sm text-gray-500">{project.likes} likes</span>
//                             </div>
//                             {user && user.uid === project.userId && (
//                                 <Button onClick={() => handleEditClick(project.id)} className="mt-2">
//                                     Edit Project
//                                 </Button>
//                             )}
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from 'lucide-react'
// import { LikeButton } from '@/components/LikeButton'
// import { useAuth } from '@/hooks/useAuth'
// import { Button } from "@/components/ui/button"

// interface Project {
//     id: string;
//     userId: string;
//     name: string;
//     projectName: string;
//     techStack: string;
//     description: string;
//     features: string[];
//     repoUrl: string;
//     imageUrl: string;
//     likes: number;
//     approved: boolean;
//     createdAt: Date | Timestamp;
// }

// export default function ProjectsPage() {
//     const [projects, setProjects] = useState<Project[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const { user } = useAuth()
//     const router = useRouter()

//     useEffect(() => {
//         const q = query(
//             collection(db, 'projects'),
//             where('approved', '==', true),
//             orderBy('createdAt', 'desc')
//         )

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const fetchedProjects: Project[] = []
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data()
//                 fetchedProjects.push({
//                     id: doc.id,
//                     ...data,
//                     likes: data.likes || 0,
//                     imageUrl: data.imageUrl || '/placeholder.svg'
//                 } as Project)
//             })
//             setProjects(fetchedProjects)
//             setLoading(false)
//         }, (err) => {
//             setError('Failed to fetch projects: ' + err.message)
//             setLoading(false)
//         })

//         return () => unsubscribe()
//     }, [])

//     const handleEditClick = (projectId: string) => {
//         router.push(`/upload-project?id=${projectId}`)
//     }

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-4xl font-bold mb-6 text-center text-gradient bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Projects Gallery</h1>
//             {error && (
//                 <Alert variant="destructive" className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}
//             {projects.length === 0 && !error && (
//                 <Alert className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>No Projects</AlertTitle>
//                     <AlertDescription>There are no approved projects to display at the moment.</AlertDescription>
//                 </Alert>
//             )}
//             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                 {projects.map((project) => (
//                     <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300">
//                         <CardHeader>
//                             <CardTitle className="text-xl font-bold text-gray-800">{project.projectName}</CardTitle>
//                             <CardDescription className="text-sm text-gray-500">By {project.name}</CardDescription>
//                         </CardHeader>
//                         <CardContent className="flex-grow flex flex-col">
//                             <div className="relative w-full h-48 mb-4">
//                                 <Image
//                                     src={project.imageUrl}
//                                     alt={project.projectName}
//                                     fill
//                                     style={{ objectFit: 'cover' }}
//                                     className="rounded-md"
//                                 />
//                             </div>
//                             <p className="mb-2"><strong>Tech Stack:</strong> {project.techStack}</p>
//                             <p className="mb-2"><strong>Repository:</strong> <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{new URL(project.repoUrl).host}</a></p>
//                             <div className="mt-auto pt-4 flex items-center justify-between">
//                                 <LikeButton projectId={project.id} initialLikes={project.likes} />
//                                 <span className="text-sm text-gray-500">{project.likes} likes</span>
//                             </div>
//                             {user && user.uid === project.userId && (
//                                 <Button onClick={() => handleEditClick(project.id)} className="mt-4 w-full">
//                                     Edit Project
//                                 </Button>
//                             )}
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from 'lucide-react'
// import { LikeButton } from '@/components/LikeButton'
// import { useAuth } from '@/hooks/useAuth'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"

// interface Project {
//     id: string;
//     userId: string;
//     name: string;
//     projectName: string;
//     techStack: string;
//     description: string;
//     features: string[];
//     repoUrl: string;
//     imageUrl: string;
//     likes: number;
//     approved: boolean;
//     createdAt: Date | Timestamp;
//     branch: string;
//     projectType: string;
// }

// const branches = [
//     { value: "cs", label: "Computer Science" },
//     { value: "it", label: "Information Technology" },
//     { value: "ece", label: "Electronics and Communication" },
//     { value: "ee", label: "Electrical Engineering" },
//     { value: "me", label: "Mechanical Engineering" },
// ]

// const projectTypes = {
//     cs: [
//         { value: "web", label: "Web Development" },
//         { value: "mobile", label: "Mobile App Development" },
//         { value: "ai", label: "Artificial Intelligence" },
//         { value: "ml", label: "Machine Learning" },
//         { value: "blockchain", label: "Blockchain" },
//     ],
//     it: [
//         { value: "network", label: "Networking" },
//         { value: "security", label: "Cybersecurity" },
//         { value: "cloud", label: "Cloud Computing" },
//         { value: "data", label: "Data Analytics" },
//     ],
//     ece: [
//         { value: "iot", label: "Internet of Things" },
//         { value: "embedded", label: "Embedded Systems" },
//         { value: "robotics", label: "Robotics" },
//         { value: "vlsi", label: "VLSI Design" },
//     ],
//     ee: [
//         { value: "power", label: "Power Systems" },
//         { value: "control", label: "Control Systems" },
//         { value: "renewable", label: "Renewable Energy" },
//     ],
//     me: [
//         { value: "cad", label: "CAD/CAM" },
//         { value: "thermal", label: "Thermal Engineering" },
//         { value: "manufacturing", label: "Manufacturing Systems" },
//     ],
// }

// export default function ProjectsPage() {
//     const [projects, setProjects] = useState<Project[]>([])
//     const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const [searchTerm, setSearchTerm] = useState('')
//     const [selectedBranch, setSelectedBranch] = useState('all')
//     const [selectedProjectType, setSelectedProjectType] = useState('all')
//     const { user } = useAuth()
//     const router = useRouter()

//     useEffect(() => {
//         const q = query(
//             collection(db, 'projects'),
//             where('approved', '==', true),
//             orderBy('createdAt', 'desc')
//         )

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const fetchedProjects: Project[] = []
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data()
//                 fetchedProjects.push({
//                     id: doc.id,
//                     ...data,
//                     likes: data.likes || 0,
//                     imageUrl: data.imageUrl || '/placeholder.svg'
//                 } as Project)
//             })
//             setProjects(fetchedProjects)
//             setFilteredProjects(fetchedProjects)
//             setLoading(false)
//         }, (err) => {
//             setError('Failed to fetch projects: ' + err.message)
//             setLoading(false)
//         })

//         return () => unsubscribe()
//     }, [])

//     useEffect(() => {
//         const filtered = projects.filter(project => {
//             const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 project.techStack.toLowerCase().includes(searchTerm.toLowerCase())
//             const matchesBranch = selectedBranch === 'all' || project.branch === selectedBranch
//             const matchesProjectType = selectedProjectType === 'all' || project.projectType === selectedProjectType
//             return matchesSearch && matchesBranch && matchesProjectType
//         })
//         setFilteredProjects(filtered)
//     }, [searchTerm, selectedBranch, selectedProjectType, projects])

//     const handleEditClick = (projectId: string) => {
//         router.push(`/upload-project?id=${projectId}`)
//     }

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-4xl font-bold mb-6 text-center text-gradient bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Projects Gallery</h1>

//             <div className="mb-6 flex flex-col md:flex-row gap-4">
//                 <Input
//                     type="text"
//                     placeholder="Search projects..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="flex-grow"
//                 />
//                 <Select value={selectedBranch} onValueChange={setSelectedBranch}>
//                     <SelectTrigger className="w-full md:w-[200px]">
//                         <SelectValue placeholder="Select Branch" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="all">All Branches</SelectItem>
//                         {branches.map((branch) => (
//                             <SelectItem key={branch.value} value={branch.value}>
//                                 {branch.label}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//                 <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
//                     <SelectTrigger className="w-full md:w-[200px]">
//                         <SelectValue placeholder="Select Project Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="all">All Project Types</SelectItem>
//                         {Object.values(projectTypes).flat().map((type) => (
//                             <SelectItem key={type.value} value={type.value}>
//                                 {type.label}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             </div>

//             {error && (
//                 <Alert variant="destructive" className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}
//             {filteredProjects.length === 0 && !error && (
//                 <Alert className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>No Projects</AlertTitle>
//                     <AlertDescription>There are no projects matching your search criteria.</AlertDescription>
//                 </Alert>
//             )}
//             <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                 {filteredProjects.map((project) => (
//                     <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300">
//                         <CardHeader>
//                             <CardTitle className="text-xl font-bold text-gray-800">{project.projectName}</CardTitle>
//                             <CardDescription className="text-sm text-gray-500">By {project.name}</CardDescription>
//                         </CardHeader>
//                         <CardContent className="flex-grow flex flex-col">
//                             <div className="relative w-full h-48 mb-4">
//                                 <Image
//                                     src={project.imageUrl}
//                                     alt={project.projectName}
//                                     fill
//                                     style={{ objectFit: 'cover' }}
//                                     className="rounded-md"
//                                 />
//                             </div>
//                             <p className="mb-2"><strong>Tech Stack:</strong> {project.techStack}</p>
//                             <p className="mb-2"><strong>Repository:</strong> <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{new URL(project.repoUrl).host}</a></p>
//                             <div className="flex flex-wrap gap-2 mb-2">
//                                 <Badge variant="secondary">{branches.find(b => b.value === project.branch)?.label || project.branch}</Badge>
//                                 <Badge variant="outline">{projectTypes[project.branch as keyof typeof projectTypes]?.find(t => t.value === project.projectType)?.label || project.projectType}</Badge>
//                             </div>
//                             <div className="mt-auto pt-4 flex items-center justify-between">
//                                 <LikeButton projectId={project.id} initialLikes={project.likes} />
//                                 <span className="text-sm text-gray-500">{project.likes} likes</span>
//                             </div>
//                             {user && user.uid === project.userId && (
//                                 <Button onClick={() => handleEditClick(project.id)} className="mt-4 w-full">
//                                     Edit Project
//                                 </Button>
//                             )}
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     )
// }

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { LikeButton } from '@/components/LikeButton'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProjectDetailsModal } from '@/components/ProjectDetailsModal'

interface Project {
    id: string;
    userId: string;
    name: string;
    projectName: string;
    techStack: string;
    description: string;
    features: string[];
    repoUrl: string;
    imageUrl: string;
    likes: number;
    approved: boolean;
    createdAt: Date | Timestamp;
    branch: string;
    projectType: string;
}

const branches = [
    { value: "cs", label: "Computer Science" },
    { value: "it", label: "Information Technology" },
    { value: "ece", label: "Electronics and Communication" },
    { value: "ee", label: "Electrical Engineering" },
    { value: "me", label: "Mechanical Engineering" },
]

const projectTypes = {
    cs: [
        { value: "web", label: "Web Development" },
        { value: "mobile", label: "Mobile App Development" },
        { value: "ai", label: "Artificial Intelligence" },
        { value: "ml", label: "Machine Learning" },
        { value: "blockchain", label: "Blockchain" },
    ],
    it: [
        { value: "network", label: "Networking" },
        { value: "security", label: "Cybersecurity" },
        { value: "cloud", label: "Cloud Computing" },
        { value: "data", label: "Data Analytics" },
    ],
    ece: [
        { value: "iot", label: "Internet of Things" },
        { value: "embedded", label: "Embedded Systems" },
        { value: "robotics", label: "Robotics" },
        { value: "vlsi", label: "VLSI Design" },
    ],
    ee: [
        { value: "power", label: "Power Systems" },
        { value: "control", label: "Control Systems" },
        { value: "renewable", label: "Renewable Energy" },
    ],
    me: [
        { value: "cad", label: "CAD/CAM" },
        { value: "thermal", label: "Thermal Engineering" },
        { value: "manufacturing", label: "Manufacturing Systems" },
    ],
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBranch, setSelectedBranch] = useState('all')
    const [selectedProjectType, setSelectedProjectType] = useState('all')
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const q = query(
            collection(db, 'projects'),
            where('approved', '==', true),
            orderBy('createdAt', 'desc')
        )

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedProjects: Project[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                fetchedProjects.push({
                    id: doc.id,
                    ...data,
                    likes: data.likes || 0,
                    imageUrl: data.imageUrl || '/placeholder.svg'
                } as Project)
            })
            setProjects(fetchedProjects)
            setFilteredProjects(fetchedProjects)
            setLoading(false)
        }, (err) => {
            setError('Failed to fetch projects: ' + err.message)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const filtered = projects.filter(project => {
            const matchesSearch = project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.techStack?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesBranch = selectedBranch === 'all' || project.branch === selectedBranch
            const matchesProjectType = selectedProjectType === 'all' || project.projectType === selectedProjectType
            return matchesSearch && matchesBranch && matchesProjectType
        })
        setFilteredProjects(filtered)
    }, [searchTerm, selectedBranch, selectedProjectType, projects])

    const handleEditClick = (projectId: string) => {
        router.push(`/upload-project?id=${projectId}`)
    }

    const handleViewDetails = (project: Project) => {
        setSelectedProject(project)
        setIsModalOpen(true)
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6 text-center text-gradient bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Projects Gallery</h1>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <Input
                    type="text"
                    placeholder="Search projects with tech stack or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.map((branch) => (
                            <SelectItem key={branch.value} value={branch.value}>
                                {branch.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Project Types</SelectItem>
                        {Object.values(projectTypes).flat().map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {filteredProjects.length === 0 && !error && (
                <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Projects</AlertTitle>
                    <AlertDescription>There are no projects matching your search criteria.</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-bold text-gray-800 truncate">{project.projectName}</CardTitle>
                            <CardDescription className="text-sm text-gray-500 truncate">By {project.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                            <div className="relative w-full h-40 mb-2">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.projectName}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="rounded-md"
                                />
                            </div>
                            <p className="mb-2 truncate"><strong>Tech Stack:</strong> {project.techStack}</p>
                            <p className="mb-2 truncate"><strong>Features:</strong> {project.features}</p>
                            <p className="mb-2 truncate">
                                <strong>Github:</strong>{' '}
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {project.repoUrl}
                                </a>
                            </p>

                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="secondary">{branches.find(b => b.value === project.branch)?.label || project.branch}</Badge>
                                <Badge variant="outline">{projectTypes[project.branch as keyof typeof projectTypes]?.find(t => t.value === project.projectType)?.label || project.projectType}</Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <div className="w-full flex items-center justify-between">
                                <LikeButton projectId={project.id} initialLikes={project.likes} />
                                <span className="text-sm text-gray-500">{project.likes} likes</span>
                            </div>
                            <Button onClick={() => handleViewDetails(project)} className="w-full">
                                View Details
                            </Button>
                            {user && user.uid === project.userId && (
                                <Button onClick={() => handleEditClick(project.id)} variant="outline" className="w-full">
                                    Edit Project
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {selectedProject && (
                <ProjectDetailsModal
                    project={selectedProject}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
}

