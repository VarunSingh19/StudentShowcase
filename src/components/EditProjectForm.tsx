'use client'

import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from '@/hooks/use-toast'

interface Project {
    id: string;
    name: string;
    projectName: string;
    techStack: string;
    description: string;
    features: string[];
    repoUrl: string;
    imageUrl: string;
}

interface EditProjectFormProps {
    project: Project;
    onComplete: () => void;
}

export function EditProjectForm({ project, onComplete }: EditProjectFormProps) {
    const [formData, setFormData] = useState({
        ...project,
        projectImage: null as File | null, // Add projectImage to formData
    });

    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features]
        newFeatures[index] = value
        setFormData(prevData => ({
            ...prevData,
            features: newFeatures
        }))
    }

    const handleImageUpload = async (file: File) => {
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
        setIsSubmitting(true);
        setError('');

        try {
            let imageUrl = formData.imageUrl; // Default to the current image URL

            // Check if a new image file is provided
            if (formData.projectImage) {
                imageUrl = await handleImageUpload(formData.projectImage); // Upload the new image file
            }

            // Update the project document in Firestore
            await updateDoc(doc(db, 'projects', project.id), {
                name: formData.name,
                projectName: formData.projectName,
                techStack: formData.techStack,
                description: formData.description,
                features: formData.features.filter((f) => f.trim() !== ''), // Remove empty features
                repoUrl: formData.repoUrl,
                imageUrl: imageUrl, // Update the image URL
            });

            // Notify success
            toast({
                title: 'Project updated',
                description: 'Your project has been successfully updated.',
            });

            onComplete(); // Callback to close the form
        } catch (err) {
            console.error('Error updating project:', err);
            setError('Failed to update project. Please try again.');
        } finally {
            setIsSubmitting(false); // Reset the submitting state
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Label htmlFor="techStack">Tech Stack</Label>
                        <Textarea
                            id="techStack"
                            name="techStack"
                            value={formData.techStack}
                            onChange={handleChange}
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
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="features">Project Features</Label>
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <Input
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    placeholder={`Feature ${index + 1}`}
                                    required
                                />
                                {index === formData.features.length - 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => setFormData(prevData => ({
                                            ...prevData,
                                            features: [...prevData.features, '']
                                        }))}
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
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setFormData(prevData => ({
                                        ...prevData,
                                        projectImage: file
                                    }))
                                }
                            }}
                            accept="image/*"
                        />
                    </div>

                    <div>
                        <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                        <Input
                            id="repoUrl"
                            name="repoUrl"
                            value={formData.repoUrl}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onComplete}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

