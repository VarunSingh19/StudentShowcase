import React from 'react'
import { motion } from 'framer-motion'
import { ResumePreview } from '@/components/ResumePreview'
import { UserProfile, Project } from '@/types/profile'

interface ResumeContentProps {
    profile: UserProfile;
    projects: Project[];
}

export function ResumeContent({ profile, projects }: ResumeContentProps) {
    const approvedProjects = projects.filter(p => p.approved)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
        >
            <ResumePreview
                profile={profile}
                projects={projects}
                certificates={approvedProjects.map(p => ({ project: p, profile: profile }))}
                companyName="Student Showcase"
                experience="Showcase Projects"
                format="modern"
            />
        </motion.div>
    )
}

