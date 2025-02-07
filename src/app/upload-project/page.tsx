'use client'

import { useState, useEffect, ChangeEvent } from 'react'
// import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Search, X } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Github } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// import { motion, AnimatePresence } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Zoom } from '@/components/ui/zoom'
import GithubPushSteps from '@/components/github-push-steps'

interface FormData {
    name: string;
    projectName: string;
    techStack: string;
    description: string;
    features: string[];
    projectImage: File | null;
    repoUrl: string;
    createdAt: Date | null;
    approved: boolean;
    likes: number;
    imageUrl: string;
    userId: string;
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
// Define a custom event type that combines both possibilities
type FormChangeEvent =
    | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    | { name: string; value: string };


export default function UploadProjectPage() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        projectName: '',
        techStack: '',
        description: '',
        features: [''],
        projectImage: null,
        repoUrl: '',
        createdAt: null,
        approved: false,
        likes: 0,
        imageUrl: '',
        userId: '',
        branch: '',
        projectType: '',
    })
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        const projectId = searchParams.get('id')
        if (projectId) {
            setIsEditing(true)
            fetchProjectData(projectId)
        }
    }, [searchParams])

    const fetchProjectData = async (projectId: string) => {
        try {
            const docRef = doc(db, 'projects', projectId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    name: data.name,
                    projectName: data.projectName,
                    techStack: data.techStack,
                    description: data.description,
                    features: data.features || [],
                    projectImage: null,
                    repoUrl: data.repoUrl,
                    createdAt: data.createdAt.toDate(),
                    approved: data.approved,
                    likes: data.likes,
                    imageUrl: data.imageUrl,
                    userId: data.userId,
                    branch: data.branch || '',
                    projectType: data.projectType || '',
                });
            } else {
                setError('Project not found');
            }
        } catch (err) {
            console.error('Error fetching project:', err);
            setError('Failed to fetch project data');
        }
    };


    const handleChange = (e: FormChangeEvent) => {
        // Check if it's a standard React change event
        if ('target' in e) {
            const target = e.target as HTMLInputElement;
            const { name, value, files } = target;
            setFormData(prevData => ({
                ...prevData,
                [name]: files ? files[0] : value
            }));
        } else {
            // Handle custom event object
            const { name, value } = e;
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const uploadImage = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'project')

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to upload image')
            }

            const data = await response.json()
            return data.secure_url
        } catch (error) {
            console.error('Error uploading image:', error)
            throw error
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to upload a project');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            let imageUrl = formData.imageUrl;
            if (formData.projectImage) {
                imageUrl = await uploadImage(formData.projectImage);
            }

            const projectData: Partial<FormData> & { userId: string } = {
                userId: user.uid,
                name: formData.name,
                projectName: formData.projectName,
                techStack: formData.techStack,
                description: formData.description,
                features: formData.features.filter(f => f.trim() !== ''),
                repoUrl: formData.repoUrl,
                imageUrl: imageUrl,
                approved: isEditing ? formData.approved : false,
                likes: isEditing ? formData.likes : 0,
                branch: formData.branch,
                projectType: formData.projectType,
            };

            if (!isEditing) {
                projectData.createdAt = new Date();
            }

            if (isEditing) {
                const projectId = searchParams.get('id');
                if (!projectId) throw new Error('Project ID is missing');
                await updateDoc(doc(db, 'projects', projectId), projectData);
                toast({
                    title: "Project updated",
                    description: "Your project has been successfully updated.",
                });
            } else {
                await addDoc(collection(db, 'projects'), projectData as FormData);
                toast({
                    title: "Project uploaded",
                    description: "Your project has been successfully uploaded and is pending approval.",
                });
            }

            router.push('/');
        } catch (err) {
            console.error('Error adding/updating project:', err);
            setError('Failed to upload/update project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Your Project' : 'Upload Your Project'}</h1>

            {!isEditing && (
                <div className="mb-8">
                    <GithubPushSteps />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Select name="branch" value={formData.branch} onValueChange={(value) => handleSelectChange("branch", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map((branch) => (
                                <SelectItem key={branch.value} value={branch.value}>
                                    {branch.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select name="projectType" value={formData.projectType} onValueChange={(value) => handleSelectChange("projectType", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                            {formData.branch && projectTypes[formData.branch as keyof typeof projectTypes].map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="techStack">Tech Stack</Label>
                    <Textarea
                        id="techStack"
                        name="techStack"
                        value={formData.techStack}
                        onChange={handleChange}
                        placeholder="e.g., React, Node.js, MongoDB"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your project in detail"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="features">Project Features</Label>
                    {formData.features?.map((feature, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <Input
                                name={`features[${index}]`}
                                value={feature}
                                onChange={(e) => {
                                    const newFeatures = [...formData.features];
                                    newFeatures[index] = e.target.value;
                                    setFormData({ ...formData, features: newFeatures });
                                }}
                                placeholder={`Feature ${index + 1}`}
                                required
                            />
                            {index === formData.features.length - 1 && (
                                <Button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                                    className="ml-2"
                                >
                                    +
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div>
                    <Label htmlFor="projectImage">Project Image</Label>
                    <Input
                        id="projectImage"
                        name="projectImage"
                        type="file"
                        onChange={handleChange}
                        accept="image/*"
                        required={!isEditing}
                    />
                </div>

                <div>
                    <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                    <div className="relative">
                        <Input
                            id="repoUrl"
                            name="repoUrl"
                            value={formData.repoUrl}
                            onChange={handleChange}
                            placeholder="https://github.com/yourusername/your-repo"
                            required
                        />
                        <Github className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Uploading...' : isEditing ? 'Update Project' : 'Upload Project'}
                </Button>
            </form>
        </div>
    )
}

