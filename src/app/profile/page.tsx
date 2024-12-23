'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Globe, Loader2, Heart, Edit, Trash2 } from 'lucide-react'
import type { UserProfile } from '@/types/profile'
import { Certificate } from '@/components/Certificate'
import { ProfileHeader } from './ProfileHeader'
import { motion } from 'framer-motion'
import { ResumePreview } from '@/components/ResumePreview'
import TaskListPage from '../tasklist/TaskListPage'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

interface Project {
    id: string
    projectName: string
    techStack: string
    description: string
    features: string[]
    approved: boolean
    likes: number
    completionDate: string
    repoUrl: string
    imageUrl?: string
}

interface LikedProject {
    id: string
    projectName: string
    techStack: string
    likes: number
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        displayName: '',
        bio: '',
        location: '',
        skills: [],
        socialLinks: {
            github: '',
            linkedin: '',
            twitter: '',
            portfolio: '',
        }
    })
    const [projects, setProjects] = useState<Project[]>([])
    const [likedProjects, setLikedProjects] = useState<LikedProject[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [skillInput, setSkillInput] = useState('')
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
            fetchLikedProjects()
        }
    }, [user, authChecked, router])

    const fetchProfile = async () => {
        if (!user) return
        try {
            const profileDoc = await getDoc(doc(db, 'profiles', user.uid))
            if (profileDoc.exists()) {
                setProfile(profileDoc.data() as UserProfile)
            } else {
                // Create default profile if it doesn't exist
                const defaultProfile = {
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
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                await setDoc(doc(db, 'profiles', user.uid), defaultProfile)
                setProfile(defaultProfile)
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
            setError('Failed to load profile')
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
                    projectName: projectData.projectName || 'Untitled Project',
                    techStack: projectData.techStack || 'Not Specified',
                    description: projectData.description || 'No description available.',
                    features: projectData.features || [],
                    approved: projectData.approved || false,
                    likes: projectData.likes || 0,
                    completionDate: projectData.completionDate?.toDate?.().toLocaleDateString() || 'Not Specified',
                    repoUrl: projectData.repoUrl || '#',
                    imageUrl: projectData.imageUrl,
                }
            })

            setProjects(projectsData)
        } catch (err) {
            console.error('Error fetching projects:', err)
        }
    }

    const fetchLikedProjects = async () => {
        if (!user) return
        try {
            const likesQuery = query(collection(db, 'userLikes'), where('userId', '==', user.uid))
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

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        try {
            await setDoc(doc(db, 'profiles', user.uid), {
                ...profile,
                userId: user.uid,
                updatedAt: new Date(),
            }, { merge: true })
            toast({
                title: "Profile saved",
                description: "Your profile has been updated successfully.",
            })
        } catch (err) {
            console.error('Error saving profile:', err)
            setError('Failed to save profile')
            toast({
                title: "Error",
                description: "Failed to save profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }



    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            if (!profile.skills?.includes(skillInput.trim())) {
                setProfile(prev => ({
                    ...prev,
                    skills: [...(prev.skills || []), skillInput.trim()]
                }))
            }
            setSkillInput('')
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills?.filter(skill => skill !== skillToRemove)
        }))
    }

    const handleEditProject = (projectId: string) => {
        router.push(`/upload-project?id=${projectId}`)
    }

    const handleDeleteProject = async (projectId: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteDoc(doc(db, 'projects', projectId))
                setProjects(projects.filter(project => project.id !== projectId))
                toast({
                    title: "Project deleted",
                    description: "Your project has been successfully deleted.",
                })
            } catch (error) {
                console.error('Error deleting project:', error)
                toast({
                    title: "Error",
                    description: "Failed to delete the project. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    const totalLikes = projects.reduce((sum, project) => sum + (project.likes || 0), 0)

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
                    onUpdate={(updatedProfile) => {
                        setProfile(updatedProfile)
                        window.location.reload()
                    }}
                />
            </motion.div>

            <Tabs defaultValue="profile" className="mt-8">
                <TabsList className="grid w-full grid-cols-6 rounded-xl bg-muted p-1">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="liked">Liked</TabsTrigger>
                    <TabsTrigger value="certificates">Certificate</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <ProfileContent
                        profile={profile}
                        setProfile={setProfile}
                        skillInput={skillInput}
                        setSkillInput={setSkillInput}
                        handleAddSkill={handleAddSkill}
                        removeSkill={removeSkill}
                        handleSave={handleSave}
                        saving={saving}
                        error={error}
                    />
                </TabsContent>

                <TabsContent value="projects">
                    <ProjectsContent
                        projects={projects}
                        totalLikes={totalLikes}
                        handleEditProject={handleEditProject}
                        handleDeleteProject={handleDeleteProject}
                        router={router}
                    />
                </TabsContent>

                <TabsContent value="liked">
                    <LikedProjectsContent likedProjects={likedProjects} />
                </TabsContent>

                <TabsContent value="certificates">
                    <CertificatesContent projects={projects.filter(p => p.approved)} profile={profile as UserProfile} />
                </TabsContent>

                <TabsContent value="tasks">
                    <TasksContent />
                </TabsContent>
                <TabsContent value="resume">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12"
                    >
                        <ResumePreview
                            profile={profile as UserProfile}
                            projects={projects}
                            certificates={projects.filter(p => p.approved).map(p => ({ project: p, profile: profile as UserProfile }))}
                            companyName="Student Showcase"
                            experience="Showcase Projects"
                            format="modern"
                        />
                    </motion.div>
                </TabsContent>
            </Tabs>


        </div>
    )
}

function ProfileContent({ profile, setProfile, skillInput, setSkillInput, handleAddSkill, removeSkill, handleSave, saving, error }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your profile information and social media links
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                    />
                </div>

                <div>
                    <Label htmlFor="skills">Skills</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id="skills"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleAddSkill}
                            placeholder="Type a skill and press Enter"
                        />
                        <Button onClick={() => handleAddSkill({ key: 'Enter', preventDefault: () => { } } as React.KeyboardEvent<HTMLInputElement>)} type="button">
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills?.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                onClick={() => removeSkill(skill)}
                            >
                                {skill} ×
                            </Badge>
                        ))}
                    </div>
                </div>




                <div>
                    <Label htmlFor="hobbiesAndInterests">Hobbies and Interests</Label>
                    <Input
                        id="hobbiesAndInterests"
                        value={profile.hobbiesAndInterests?.join(', ')}
                        onChange={(e) => setProfile({ ...profile, hobbiesAndInterests: e.target.value.split(',').map(item => item.trim()) })}
                        placeholder="Enter hobbies and interests, separated by commas"
                    />
                </div>

                <div>
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                        id="languages"
                        value={profile.languages?.join(', ')}
                        onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(',').map(item => item.trim()) })}
                        placeholder="Enter languages, separated by commas"
                    />
                </div>

                <div>
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                        id="emailAddress"
                        value={profile.emailAddress}
                        onChange={(e) => setProfile({ ...profile, emailAddress: e.target.value })}
                        placeholder="Enter your email address"
                    />
                </div>

                <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Github className="h-5w-5" />
                            <Input
                                placeholder="GitHub URL"
                                value={profile.socialLinks?.github}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, github: e.target.value }
                                })}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Linkedin className="h-5 w-5" />
                            <Input
                                placeholder="LinkedIn URL"
                                value={profile.socialLinks?.linkedin}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                                })}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Twitter className="h-5 w-5" />
                            <Input
                                placeholder="Twitter URL"
                                value={profile.socialLinks?.twitter}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                                })}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            <Input
                                placeholder="Portfolio URL"
                                value={profile.socialLinks?.portfolio}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, portfolio: e.target.value }
                                })}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Profile'
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

function ProjectsContent({ projects, handleEditProject, handleDeleteProject, router }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>
                    Manage and track the status of your submitted projects
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="grid gap-4">
                        {projects.map((project) => (
                            <Card key={project.id} className="flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{project.projectName}</CardTitle>
                                        <Badge variant={project.approved ? "success" : "secondary"}>
                                            {project.approved ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </div>
                                    <CardDescription>{project.techStack}</CardDescription>
                                </CardHeader>
                                <CardContent className="py-2">
                                    <div className="aspect-video relative mb-4">
                                        <Image
                                            src={project.imageUrl || "/placeholder.svg"}
                                            alt={project.projectName}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between pt-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">View Details</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{project.projectName}</DialogTitle>
                                                <DialogDescription>{project.techStack}</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="aspect-video relative">
                                                    <Image
                                                        src={project.imageUrl || "/placeholder.svg"}
                                                        alt={project.projectName}
                                                        fill
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>
                                                <p>{project.description}</p>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Features:</h4>
                                                    <ul className="list-disc pl-5">
                                                        {project.features?.map((feature, index) => (
                                                            <li key={index}>{feature}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Repository:</h4>
                                                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {project.repoUrl}
                                                    </a>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditProject(project.id)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                        {projects.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">You have not submitted any projects yet.</p>
                                <Button onClick={() => router.push('/upload-project')}>Upload Your First Project</Button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/upload-project')} className="w-full">
                    Upload New Project
                </Button>
            </CardFooter>
        </Card>
    )
}

function LikedProjectsContent({ likedProjects }) {
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

function CertificatesContent({ projects, profile }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Certificates</CardTitle>
                <CardDescription>
                    View and download certificates for your approved projects
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Certificate
                                project={{
                                    ...project,
                                    completionDate: project.completionDate || "Not Specified",
                                }}
                                profile={profile}
                            />
                        </motion.div>
                    ))}
                    {projects.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                            No approved projects yet. Certificates will appear here once your projects are approved.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function TasksContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>
                    Manage your Tasks here
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TaskListPage />
            </CardContent>
        </Card>
    )
}
