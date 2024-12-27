// 'use client'

// import React, { useState, useEffect } from 'react';
// import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { useAuth } from '@/hooks/useAuth';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle, Loader2, Package } from 'lucide-react';
// import { ProjectCard } from './ProjectCard';
// import { ProjectStats } from './ProjectStats';
// import { Project } from '@/types/project';

// export default function ProjectPanel() {
//     const [projects, setProjects] = useState<Project[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [actionLoading, setActionLoading] = useState<string | null>(null);
//     const { user } = useAuth();

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     const fetchProjects = async () => {
//         try {
//             const q = query(collection(db, 'projects'));
//             const querySnapshot = await getDocs(q);
//             const fetchedProjects: Project[] = [];
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data();
//                 fetchedProjects.push({
//                     id: doc.id,
//                     ...data,
//                     imageUrl: data.imageUrl || '/placeholder.svg'
//                 } as Project);
//             });
//             setProjects(fetchedProjects);
//         } catch (err) {
//             console.error('Error fetching projects:', err);
//             setError('Failed to fetch projects');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleApprove = async (projectId: string) => {
//         setActionLoading(projectId);
//         try {
//             await updateDoc(doc(db, 'projects', projectId), {
//                 approved: true
//             });
//             setProjects(projects.map(project =>
//                 project.id === projectId ? { ...project, approved: true } : project
//             ));
//         } catch (err) {
//             console.error('Error approving project:', err);
//             setError('Failed to approve project');
//         } finally {
//             setActionLoading(null);
//         }
//     };

//     const handleReject = async (projectId: string) => {
//         setActionLoading(projectId);
//         try {
//             await updateDoc(doc(db, 'projects', projectId), {
//                 approved: false
//             });
//             setProjects(projects.map(project =>
//                 project.id === projectId ? { ...project, approved: false } : project
//             ));
//         } catch (err) {
//             console.error('Error rejecting project:', err);
//             setError('Failed to reject project');
//         } finally {
//             setActionLoading(null);
//         }
//     };

//     if (!user) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Access Denied</AlertTitle>
//                     <AlertDescription>
//                         You must be logged in as an admin to access this page.
//                     </AlertDescription>
//                 </Alert>
//             </div>
//         );
//     }

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
//                     <p className="text-lg text-muted-foreground">Loading projects...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-8">
//             <ProjectStats projects={projects} />

//             {error && (
//                 <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top duration-300">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}

//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                     <ProjectCard
//                         key={project.id}
//                         project={project}
//                         onApprove={handleApprove}
//                         onReject={handleReject}
//                         actionLoading={actionLoading}
//                     />
//                 ))}
//             </div>

//             {projects.length === 0 && !loading && (
//                 <div className="text-center py-12">
//                     <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                     <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
//                     <p className="text-muted-foreground">Projects submitted by users will appear here.</p>
//                 </div>
//             )}
//         </div>
//     );
// }