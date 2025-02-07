'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Users, Briefcase, Award, Rocket } from 'lucide-react'
import Link from 'next/link'

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <Card className="h-full">
        <CardContent className="flex flex-col items-center text-center p-6">
            <Icon className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
)

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <Badge className="mb-4" variant="secondary">About StudentShowcase</Badge>
                <h1 className="text-4xl font-bold mb-6">Empowering Student Innovation</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    StudentShowcase is the premier platform for students to showcase their projects,
                    connect with peers, and launch their careers in the world of technology and innovation.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
                <FeatureCard
                    icon={Code}
                    title="Project Showcase"
                    description="Upload and showcase your innovative projects to a global audience of peers, mentors, and potential employers."
                />
                <FeatureCard
                    icon={Users}
                    title="Peer Collaboration"
                    description="Connect with like-minded students, form teams, and collaborate on groundbreaking projects that push the boundaries of innovation."
                />
                <FeatureCard
                    icon={Briefcase}
                    title="Career Opportunities"
                    description="Get discovered by top companies and startups looking for fresh talent and innovative ideas."
                />
                <FeatureCard
                    icon={Award}
                    title="Skill Certification"
                    description="Earn certificates for your skills and projects, validating your expertise to potential employers and collaborators."
                />
                <FeatureCard
                    icon={Rocket}
                    title="Startup Launchpad"
                    description="Turn your project into a startup with our resources, mentorship programs, and connections to investors."
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center"
            >
                <h2 className="text-3xl font-bold mb-6">Join the Innovation Revolution</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    Whether you're a coding prodigy, a design maverick, or a visionary entrepreneur,
                    StudentShowcase is your launchpad to success. Join us today and be part of the
                    next generation of innovators shaping the future.
                </p>
                <Link href="/authform">
                    <Button size="lg" className="group">
                        Get Started
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}

