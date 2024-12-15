'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Certificate } from '@/components/Certificate'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'

interface Project {
    id: string
    projectName: string
    techStack: string
    description: string
    features: string[]
    approved: boolean
    userId: string
}

interface UserProfile {
    displayName: string
    // Add other profile fields as needed
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<{ project: Project; profile: UserProfile }[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        try {
            const q = query(collection(db, 'projects'), where('approved', '==', true))
            const querySnapshot = await getDocs(q)
            const certificatesData: { project: Project; profile: UserProfile }[] = []

            for (const doc of querySnapshot.docs) {
                const projectData = { id: doc.id, ...doc.data() } as Project
                const userProfileDoc = await getDocs(query(collection(db, 'profiles'), where('userId', '==', projectData.userId)))

                if (!userProfileDoc.empty) {
                    const profileData = userProfileDoc.docs[0].data() as UserProfile
                    certificatesData.push({ project: projectData, profile: profileData })
                }
            }

            setCertificates(certificatesData)
        } catch (err) {
            console.error('Error fetching certificates:', err)
            setError('Failed to fetch certificates')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">All Certificates</h1>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {certificates.map(({ project, profile }) => (
                    <Certificate key={project.id} project={project} profile={profile} />
                ))}
            </div>
            {certificates.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No certificates available at the moment.</p>
            )}
        </div>
    )
}

