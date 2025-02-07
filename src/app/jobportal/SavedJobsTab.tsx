'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, ExternalLink } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

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

export default function SavedJobsTab() {
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            fetchSavedJobs();
        }
    }, [user]);

    const fetchSavedJobs = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const q = query(collection(db, 'savedJobs'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const jobs: Job[] = [];
            querySnapshot.forEach((doc) => {
                const jobData = doc.data() as Job;
                jobs.push(jobData);
            });
            setSavedJobs(jobs);
        } catch (error) {
            console.error("Error fetching saved jobs:", error);
            toast({
                title: "Error",
                description: "Failed to fetch saved jobs. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUnsaveJob = async (job: Job) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, 'savedJobs', `${user.uid}_${job.id}`));
            setSavedJobs(savedJobs.filter(j => j.id !== job.id));
            toast({
                title: "Job Unsaved",
                description: "The job has been removed from your saved jobs.",
            });
        } catch (error) {
            console.error("Error unsaving job:", error);
            toast({
                title: "Error",
                description: "Failed to unsave the job. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="eee-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>
            {savedJobs.length === 0 ? (
                <p>You haven't saved any jobs yet.</p>
            ) : (
                <div className="space-y-4">
                    {savedJobs.map((job) => (
                        <Card key={job.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-semibold">{job.title}</h3>
                                        <p className="text-sm text-muted-foreground">{job.company}</p>
                                    </div>
                                    <Badge variant="secondary">{job.salary}</Badge>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {job.location}
                                </div>
                                {job.description && (
                                    <p className="text-sm mb-2">{job.description}</p>
                                )}
                                {job.requirements && job.requirements.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.requirements.map((req, index) => (
                                            <Badge key={index} variant="outline">
                                                {req}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <Badge variant="secondary">{job.source}</Badge>
                                    <div>
                                        <Button
                                            asChild
                                            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x mr-2"
                                        >
                                            <a
                                                href={`https://internshala.com/${job.applicationLink}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Apply <ExternalLink className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button
                                            onClick={() => handleUnsaveJob(job)}
                                            variant="outline"
                                        >
                                            Unsave
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

