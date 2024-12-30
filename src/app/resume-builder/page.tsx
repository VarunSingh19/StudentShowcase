'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@mui/material';
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import { UserProfile } from '@/types/profile'
import { ResumePreview } from '@/components/ResumePreview'
import { AIEnhancer } from '@/components/AIEnhancer'
import { toast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { Certificate } from '@/components/Certificate'


interface Certificate {
    id: string;
    projectName: string;
    issuedBy: string;
    issueDate: Date;
    verificationUrl: string;
}


interface Project {
    id: string
    projectName: string
    techStack: string
    description: string
    features: string[]
    repoUrl: string
    approved: boolean;
    completionDate: ''

}



interface CertificatesContentProps {
    projects: Project[]
    profile: UserProfile
}


export default function ResumeBuilderPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [companyName, setCompanyName] = useState('')
    const [experience, setExperience] = useState('')
    const [resumeFormat, setResumeFormat] = useState('professional')
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars
    const [generatedResume, setGeneratedResume] = useState('')
    const { user, authChecked } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (authChecked && !user) {
            router.push('/')
            return
        }
        if (user) {
            fetchUserData()
        }
    }, [user, authChecked, router])

    const fetchUserData = async () => {
        try {
            setLoading(true)
            setError('')

            if (!user) {
                throw new Error('User not authenticated')
            }

            // Fetch user profile
            const profileDoc = await getDoc(doc(db, 'profiles', user.uid))
            if (profileDoc.exists()) {
                setProfile(profileDoc.data() as UserProfile)
            } else {
                setProfile(null)
            }

            // Fetch user projects
            const projectsQuery = query(collection(db, 'projects'), where('userId', '==', user.uid))
            const projectsSnapshot = await getDocs(projectsQuery)
            const projectsData: Project[] = []
            projectsSnapshot.forEach((doc) => {
                projectsData.push({ id: doc.id, ...doc.data() } as Project)
            })
            setProjects(projectsData)

            // Fetch user certificates
            const certificatesQuery = query(collection(db, 'certificates'), where('userId', '==', user.uid))
            const certificatesSnapshot = await getDocs(certificatesQuery)
            const certificatesData: Certificate[] = []
            certificatesSnapshot.forEach((doc) => {
                certificatesData.push({ id: doc.id, ...doc.data() } as Certificate)
            })
            setCertificates(certificatesData)

        } catch (err) {
            console.error('Error fetching user data:', err)
            setError('Failed to load user data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateResume = async () => {
        setGenerating(true)
        try {
            const response = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profile,
                    projects,
                    certificates,
                    companyName,
                    experience,
                    resumeFormat,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate resume')
            }

            const data = await response.json()
            setGeneratedResume(data.resumeContent)
            console.log(data.resumeContent)
            toast({
                title: "Resume Generated",
                description: "Your resume has been successfully generated.",
            })
        } catch (error) {
            console.error('Error generating resume:', error)
            toast({
                title: "Error",
                description: "Failed to generate resume. Please try again.",
                variant: "destructive",
            })
        } finally {
            setGenerating(false)
        }
    }

    const handleDownload = async (format: 'pdf' | 'docx') => {
        try {
            const response = await fetch('/api/download-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeContent: generatedResume,
                    format,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to download resume');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `resume.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            toast({
                title: "Resume Downloaded",
                description: `Your resume has been downloaded in ${format.toUpperCase()} format.`,
            });
        } catch (error) {
            console.error('Error downloading resume:', error);
            toast({
                title: "Error",
                description: `Failed to download resume in ${format.toUpperCase()} format. Please try again.`,
                variant: "destructive",
            });
        }
    };

    const handleUpdate = (field: string, value: any) => {
        switch (field) {
            case 'bio':
                setProfile(prev => prev ? { ...prev, bio: value } : null)
                break
            case 'projects':
                setProjects(value)
                break
            case 'certificates':
                setCertificates(value)
                break
            default:
                console.warn(`Unhandled update field: ${field}`)
        }
    }

    const styles = {
        button: {
            backgroundColor: '#007bff', // Blue background for the button
            color: '#fff', // White text color
            padding: '10px 20px', // Padding for button size
            border: 'none', // Remove border
            borderRadius: '5px', // Rounded corners
            display: 'flex', // Flex to align text and icon
            alignItems: 'center', // Vertically center content
            cursor: 'pointer', // Pointer cursor on hover
            fontSize: '16px', // Font size
            opacity: 1, // Default opacity
            transition: 'all 0.3s ease', // Smooth transition for hover effects
        },
        buttonDisabled: {
            backgroundColor: '#dcdcdc', // Disabled button background color
            cursor: 'not-allowed', // Change cursor to not-allowed when disabled
        },
        icon: {
            width: '20px', // Icon size
            height: '20px', // Icon size
        },
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    function CertificatesContent({ projects, profile }: CertificatesContentProps) {
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
                                    project={project}
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">AI-Powered Resume Builder</h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Resume Details</CardTitle>
                    <CardDescription>Enter the details for your target role</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="companyName">Target Company</Label>
                            <Input
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Enter the company name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                                id="experience"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="Enter your years of experience"
                                type="number"
                            />
                        </div>
                        <div>
                            <Label htmlFor="resumeFormat">Resume Format</Label>
                            <Select value={resumeFormat} onValueChange={setResumeFormat}>
                                <SelectTrigger id="resumeFormat">
                                    <SelectValue placeholder="Select a format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="modern">Modern</SelectItem>
                                    <SelectItem value="creative">Creative</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="preview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="enhance">AI Enhance</TabsTrigger>
                    {generatedResume && <TabsTrigger value="generated"
                        style={{ color: "white" }}
                        className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                    >

                        Generated Resume</TabsTrigger>}
                </TabsList>
                <Button
                    style={{ color: "white" }}
                    className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                    onClick={handleGenerateResume} disabled={generating}>
                    {generating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        'Generate Resume'
                    )}
                </Button>
                <TabsContent value="enhance">
                    <AIEnhancer
                        profile={profile}
                        projects={projects}
                        certificates={certificates}
                        companyName={companyName}
                        experience={experience}
                        onUpdate={handleUpdate}
                    />
                </TabsContent>

                <TabsContent value='preview'>

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
                <TabsContent value="certificates">
                    <CertificatesContent projects={projects.filter(p => p.approved)} profile={profile as UserProfile} />
                </TabsContent>
                <TabsContent value="generated">
                    <div className="mt-6 flex justify-center space-x-4 mb-3">
                        <Button
                            style={{ color: "white" }}
                            className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                            onClick={handleGenerateResume} disabled={generating}>
                            {generating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Resume'
                            )}
                        </Button>
                        {/* <Button onClick={() => handleDownload('pdf')} disabled={!generatedResume}>
                            Download PDF
                        </Button>
                        <Button onClick={() => handleDownload('docx')} disabled={!generatedResume}>
                            Download Word
                        // </Button> */}
                        <Button
                            style={{ color: "white" }}
                            className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                            onClick={() => handleDownload('pdf')}
                            disabled={!generatedResume}
                            startIcon={<img src="/pdf-file-svgrepo-com.svg" alt="Download PDF" style={{ width: 20, height: 20, }} />}
                        >
                            Download PDF
                        </Button>

                        <Button
                            style={{ color: "white" }}
                            className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                            onClick={() => handleDownload('docx')}
                            disabled={!generatedResume}
                            startIcon={<img src="/word-svgrepo-com.svg" alt="Download Word" style={{ width: 20, height: 20 }} />}
                        >
                            Download Word
                        </Button>



                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Resume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="whitespace-pre-wrap">{generatedResume}</pre>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>




            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>About AI Enhancement</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Our AI-powered resume builder uses Gemini AI to enhance your resume content.
                        Gemini AI analyzes your profile, projects, and certificates to generate
                        tailored summaries and project features that highlight your skills and
                        experience in the context of your target company.
                    </p>
                    <p className="mt-2">
                        While the AI provides valuable suggestions, we recommend reviewing and
                        adjusting the enhanced content to ensure it accurately represents your
                        experience and aligns with your personal style.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
