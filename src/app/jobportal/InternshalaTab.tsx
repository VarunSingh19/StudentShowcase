// "use client";
// import { useState, useEffect } from "react";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//     Loader2,
//     MapPin,
//     ExternalLink,
//     RefreshCw,
//     ChevronLeft,
//     ChevronRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// interface Job {
//     id: string;
//     title: string;
//     company: string;
//     location: string;
//     salary?: string;
//     description?: string;
//     requirements?: string[];
//     applicationLink?: string;
//     source: string;
// }

// export default function IntershalaTab() {
//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [retryCount, setRetryCount] = useState(0);
//     const [isRetrying, setIsRetrying] = useState(false);

//     const MAX_RETRIES = 3;
//     const RETRY_DELAY = 2000;

//     // Function to validate if a job card should be displayed
//     const isValidJob = (job: Job) => {
//         return (
//             job.title &&
//             job.title !== "Untitled Job" &&
//             job.company &&
//             job.company !== "Unknown Company" &&
//             job.location &&
//             job.location !== "Not Specified" &&
//             job.salary
//         );
//     };

//     useEffect(() => {
//         fetchJobs(currentPage);
//     }, [currentPage]);

//     const fetchJobs = async (page: number, retry = 0) => {
//         setLoading(true);
//         setError(null);

//         if (retry > 0) {
//             setIsRetrying(true);
//             setRetryCount(retry);
//         }

//         try {
//             const response = await fetch(`/api/internshala-api?page=${page}`);
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
//             // Filter out invalid jobs before setting state
//             const validJobs = data.jobs.filter(isValidJob);
//             setJobs(validJobs);
//             setIsRetrying(false);
//             setRetryCount(0);
//         } catch (err) {
//             console.error("Error fetching jobs:", err);
//             if (retry < MAX_RETRIES) {
//                 setTimeout(() => {
//                     fetchJobs(page, retry + 1);
//                 }, RETRY_DELAY);
//             } else {
//                 setError(
//                     "Failed to fetch jobs after multiple attempts. Please try again later."
//                 );
//                 setIsRetrying(false);
//                 setRetryCount(0);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePageChange = (newPage: number) => {
//         if (newPage >= 1) {
//             setCurrentPage(newPage);
//             window.scrollTo({ top: 0, behavior: "smooth" });
//         }
//     };

//     const handleManualRetry = () => {
//         fetchJobs(currentPage);
//     };

//     return (
//         <div className="container max-w-4xl mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-6">Internshala Job Listings</h1>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Available Jobs on Internshala</CardTitle>
//                     <CardDescription>
//                         Browse all current job listings from Internshala
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {loading ? (
//                         <div className="flex flex-col justify-center items-center h-64 space-y-4">
//                             <Loader2 className="h-8 w-8 animate-spin" />
//                             {isRetrying && (
//                                 <p className="text-sm text-muted-foreground">
//                                     Retrying... Attempt {retryCount} of {MAX_RETRIES}
//                                 </p>
//                             )}
//                         </div>
//                     ) : error ? (
//                         <Alert variant="destructive" className="mb-4">
//                             <AlertTitle>Error</AlertTitle>
//                             <AlertDescription className="flex flex-col gap-4">
//                                 <p>{error}</p>
//                                 <Button
//                                     onClick={handleManualRetry}
//                                     variant="outline"
//                                     className="w-fit"
//                                 >
//                                     <RefreshCw className="mr-2 h-4 w-4" />
//                                     Try Again
//                                 </Button>
//                             </AlertDescription>
//                         </Alert>
//                     ) : (
//                         <>
//                             {jobs.length > 0 ? (
//                                 <div className="space-y-4">
//                                     {jobs.map((job) => (
//                                         <motion.div
//                                             key={job.id}
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             <Card>
//                                                 <CardContent className="p-4">
//                                                     <div className="flex justify-between items-start mb-2">
//                                                         <div>
//                                                             <h3 className="text-lg font-semibold">
//                                                                 {job.title}
//                                                             </h3>
//                                                             <p className="text-sm text-muted-foreground">
//                                                                 {job.company}
//                                                             </p>
//                                                         </div>
//                                                         <Badge variant="secondary">{job.salary}</Badge>
//                                                     </div>
//                                                     <div className="flex items-center text-sm text-muted-foreground">
//                                                         <MapPin className="h-4 w-4 mr-1" />
//                                                         {job.location}
//                                                     </div>
//                                                     {job.description && (
//                                                         <p className="text-sm mb-2">{job.description}</p>
//                                                     )}
//                                                     {job.requirements && job.requirements.length > 0 && (
//                                                         <div className="flex flex-wrap gap-2 mb-4">
//                                                             {job.requirements.map((req, index) => (
//                                                                 <Badge key={index} variant="outline">
//                                                                     {req}
//                                                                 </Badge>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                     <div className="flex justify-between items-center">
//                                                         <Badge variant="secondary">{job.source}</Badge>
//                                                         <Button
//                                                             asChild
//                                                             className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x"
//                                                         >
//                                                             <a
//                                                                 href={`https://internshala.com/${job.applicationLink}`}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                             >
//                                                                 Apply <ExternalLink className="ml-2 h-4 w-4" />
//                                                             </a>
//                                                         </Button>
//                                                     </div>
//                                                 </CardContent>
//                                             </Card>
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <Alert>
//                                     <AlertTitle>End of Results</AlertTitle>
//                                     <AlertDescription>
//                                         No more job listings available. Try going back to previous
//                                         pages.
//                                     </AlertDescription>
//                                 </Alert>
//                             )}

//                             {/* Pagination Controls */}
//                             <div className="flex justify-center items-center gap-4 mt-8">
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => handlePageChange(currentPage - 1)}
//                                     disabled={currentPage === 1}
//                                 >
//                                     <ChevronLeft className="h-4 w-4 mr-2" />
//                                     Previous
//                                 </Button>
//                                 <div className="text-sm">Page {currentPage}</div>
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => handlePageChange(currentPage + 1)}
//                                     disabled={loading}
//                                 >
//                                     Next
//                                     <ChevronRight className="h-4 w-4 ml-2" />
//                                 </Button>
//                             </div>
//                         </>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


"use client";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    MapPin,
    ExternalLink,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    BookmarkCheck,
    BookmarkPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from "@/hooks/useAuth";

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
    saved?: boolean;
}


export default function IntershalaTab() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const { user } = useAuth();
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    // Function to validate if a job card should be displayed
    const isValidJob = (job: Job) => {
        return (
            job.title &&
            job.title !== "Untitled Job" &&
            job.company &&
            job.company !== "Unknown Company" &&
            job.location &&
            job.location !== "Not Specified" &&
            job.salary
        );
    };

    useEffect(() => {
        fetchJobs(currentPage);
    }, [currentPage]);

    const fetchJobs = async (page: number, retry = 0) => {
        setLoading(true);
        setError(null);

        if (retry > 0) {
            setIsRetrying(true);
            setRetryCount(retry);
        }

        try {
            const response = await fetch(`/api/internshala-api?page=${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Filter out invalid jobs before setting state
            const validJobs = data.jobs.filter(isValidJob);
            setJobs(validJobs);
            setIsRetrying(false);
            setRetryCount(0);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            if (retry < MAX_RETRIES) {
                setTimeout(() => {
                    fetchJobs(page, retry + 1);
                }, RETRY_DELAY);
            } else {
                setError(
                    "Failed to fetch jobs after multiple attempts. Please try again later."
                );
                setIsRetrying(false);
                setRetryCount(0);
            }
        } finally {
            setLoading(false);
        }
    };

    const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

    const handleSaveJob = async (job: Job) => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to save jobs.",
                variant: "destructive",
            });
            return;
        }

        const jobRef = doc(db, 'savedJobs', `${user.uid}_${job.id}`);

        try {
            if (savedJobs.has(job.id)) {
                await deleteDoc(jobRef);
                setSavedJobs(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(job.id);
                    return newSet;
                });
                toast({
                    title: "Job Unsaved",
                    description: "The job has been removed from your saved jobs.",
                });
            } else {
                await setDoc(jobRef, { ...job, userId: user.uid });
                setSavedJobs(prev => new Set(prev).add(job.id));
                toast({
                    title: "Job Saved",
                    description: "The job has been added to your saved jobs.",
                });
            }
        } catch (error) {
            console.error("Error saving/unsaving job:", error);
            toast({
                title: "Error",
                description: "There was an error saving/unsaving the job. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleManualRetry = () => {
        fetchJobs(currentPage);
    };

    return (
        <div className=" mx-auto px-4 py-8">
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
                        <div className="flex flex-col justify-center items-center h-64 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            {isRetrying && (
                                <p className="text-sm text-muted-foreground">
                                    Retrying... Attempt {retryCount} of {MAX_RETRIES}
                                </p>
                            )}
                        </div>
                    ) : error ? (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription className="flex flex-col gap-4">
                                <p>{error}</p>
                                <Button
                                    onClick={handleManualRetry}
                                    variant="outline"
                                    className="w-fit"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            {jobs.length > 0 ? (
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
                                                            <h3 className="text-lg font-semibold">
                                                                {job.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {job.company}
                                                            </p>
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
                                                        <Button
                                                            onClick={() => handleSaveJob(job)}
                                                            variant="outline"
                                                            className="ml-2"
                                                        >
                                                            {savedJobs.has(job.id) ? 'Unsave' : 'Save Job'}
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x"
                                                        >
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
                                </div>
                            ) : (
                                <Alert>
                                    <AlertTitle>End of Results</AlertTitle>
                                    <AlertDescription>
                                        No more job listings available. Try going back to previous
                                        pages.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Pagination Controls */}
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>
                                <div className="text-sm">Page {currentPage}</div>
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={loading}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


