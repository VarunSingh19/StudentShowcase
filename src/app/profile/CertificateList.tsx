import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Certificate } from '@/components/Certificate'
import type { Project } from '@/types/profile'
import type { UserProfile } from '@/types/profile'

interface CertificateListProps {
    projects: Project[]
    profile: UserProfile
}

export function CertificateList({ projects, profile }: CertificateListProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>My Certificates</CardTitle>
                    <CardDescription>
                        View and download certificates for your approved projects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
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
        </motion.div>
    )
}

