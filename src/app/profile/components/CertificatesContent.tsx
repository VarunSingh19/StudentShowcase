import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Certificate } from '@/components/Certificate'
import { motion } from 'framer-motion'
import { Project, UserProfile } from '@/types/profile'

interface CertificatesContentProps {
    projects: Project[];
    profile: UserProfile;
}

export function CertificatesContent({ projects, profile }: CertificatesContentProps) {
    const approvedProjects = projects.filter(p => p.approved)

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
                    {approvedProjects.map((project) => (
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
                    {approvedProjects.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                            No approved projects yet. Certificates will appear here once your projects are approved.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

