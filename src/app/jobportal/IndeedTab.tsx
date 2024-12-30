'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, ExternalLink, RefreshCw } from 'lucide-react'
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
    applicationLink: string;
    source: string;
    postedAt?: string;
}

export default function IndeedTab() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const [isRetrying, setIsRetrying] = useState(false)

    const MAX_RETRIES = 3
    const RETRY_DELAY = 2000 // 2 seconds

    const fetchJobs = async (retry = false) => {
        if (retry) {
            setIsRetrying(true)
        } else {
            setLoading(true)
        }
        setError(null)

        try {
            const response = await fetch('/api/indeed-api')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const jobsData = await response.json()
            setJobs(jobsData)
            setRetryCount(0)
            setIsRetrying(false)
        } catch (err) {
            console.error('Error fetching Indeed jobs:', err)
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1)
                setTimeout(() => fetchJobs(true), RETRY_DELAY)
                setError(`Attempt ${retryCount + 1}/${MAX_RETRIES}: Retrying to fetch Indeed jobs...`)
            } else {
                setError('Failed to fetch Indeed jobs after multiple attempts. Please try again later.')
                setIsRetrying(false)
            }
        } finally {
            if (!isRetrying) {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleManualRetry = () => {
        setRetryCount(0)
        fetchJobs()
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Indeed Job Listings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Available Jobs on Indeed</CardTitle>
                    <CardDescription>
                        Browse all current job listings from Indeed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {(loading || isRetrying) ? (
                        <div className="flex flex-col justify-center items-center h-64 space-y-4">
                            <div className="flex items-center space-x-2">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                {isRetrying && <RefreshCw className="h-6 w-6 animate-spin" />}
                            </div>
                            {isRetrying && (
                                <p className="text-sm text-muted-foreground">
                                    Attempting to reconnect... (Try {retryCount}/{MAX_RETRIES})
                                </p>
                            )}
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription className="flex flex-col space-y-2">
                                <p>{error}</p>
                                {!isRetrying && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleManualRetry}
                                        className="w-fit"
                                    >
                                        Try Again
                                    </Button>
                                )}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map((job) => (
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
                                                    <p className="text-sm text-muted-foreground">
                                                        {job.company}
                                                        {job.postedAt && (
                                                            <span className="ml-2 text-xs">• {job.postedAt}</span>
                                                        )}
                                                    </p>
                                                </div>
                                                {job.salary && (
                                                    <Badge variant="secondary">{job.salary}</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground mb-2">
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
                                                        href={job.applicationLink}
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
                            {jobs.length === 0 && (
                                <Alert>
                                    <AlertTitle>No Jobs Found</AlertTitle>
                                    <AlertDescription>No Indeed job listings are currently available. Please check back later.</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}