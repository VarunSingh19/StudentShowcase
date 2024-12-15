'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    description?: string;
    requirements?: string[];
    applicationLink?: string;
    source: string;
}

export default function IntershalaTab() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/internshala-api')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const jobsData = await response.json()
            setJobs(jobsData)
        } catch (err) {
            console.error('Error fetching jobs:', err)
            setError('Failed to fetch jobs. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Internshala Job Listings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Available Jobs on Internshala</CardTitle>
                    <CardDescription>
                        Browse all current job listings from Internshala
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-4">
                            {jobs.slice(1).map((job) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{job.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{job.company}</p>
                                                </div>
                                                {job.salary && (
                                                    <Badge variant="secondary">{job.salary}</Badge>
                                                )}
                                            </div>
                                            <div className='flex items-center text-sm text-muted-foreground'>
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {job.location}
                                            </div>
                                            {job.description && (
                                                <p className="text-sm mb-2">{job.description}</p>
                                            )}
                                            {job.requirements && job.requirements.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {job.requirements.map((req, index) => (
                                                        <Badge key={index} variant="outline">{req}</Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <Badge variant="secondary">{job.source}</Badge>
                                                <Button asChild>
                                                    <a
                                                        href={`https://internshala.com/${job.applicationLink}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Apply <ExternalLink className="ml-2 h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                            {jobs.length <= 1 && (
                                <Alert>
                                    <AlertTitle>No Jobs Found</AlertTitle>
                                    <AlertDescription>No job listings are currently available. Please check back later.</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}