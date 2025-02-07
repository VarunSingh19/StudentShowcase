"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Eye, Loader2 } from 'lucide-react'
import { UserProfile } from "@/types/profile"
import jsPDF from "jspdf"
import QRCode from "qrcode"
import { CertificatePreview } from "./CertificatePreview"
import { toast } from "@/hooks/use-toast"
import { Timestamp } from "firebase/firestore"
import { motion } from "framer-motion"
export interface CertificateProps {
    project: {
        id: string
        projectName: string
        techStack: string
        description: string
        features: string[]
        approved: boolean
        createdAt: Date | Timestamp
    }
    profile: UserProfile
}

export function Certificate({ project, profile }: CertificateProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const verificationUrl = process.env.NEXT_PUBLIC_CERTIFICATE_VERIFICATION_URL
    const generateCertificate = async () => {
        try {
            setIsGenerating(true)
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            })

            // Set background color
            pdf.setFillColor(248, 250, 252)
            pdf.rect(0, 0, 297, 210, 'F')

            // Add border
            pdf.setDrawColor(59, 130, 246)
            pdf.setLineWidth(1.5)
            pdf.rect(5, 5, 287, 200)

            // Set title
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(32)
            pdf.setTextColor(31, 41, 55)
            pdf.text('Certificate of Achievement', 148.5, 50, { align: 'center' })

            // Add decorative line
            pdf.setDrawColor(59, 130, 246)
            pdf.setLineWidth(0.5)
            pdf.line(74, 55, 223, 55)

            // Set content
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(16)
            pdf.setTextColor(75, 85, 99)
            pdf.text('This is to certify that', 148.5, 75, { align: 'center' })

            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(28)
            pdf.setTextColor(31, 41, 55)
            pdf.text(profile.displayName || 'StudentName', 148.5, 85, { align: 'center' })

            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(16)
            pdf.setTextColor(75, 85, 99)
            pdf.text('has successfully completed the project', 148.5, 95, { align: 'center' })

            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(24)
            pdf.setTextColor(31, 41, 55)
            pdf.text(project.projectName, 148.5, 105, { align: 'center' })

            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(16)
            pdf.setTextColor(75, 85, 99)
            pdf.text('demonstrating proficiency in:', 148.5, 115, { align: 'center' })

            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(20)
            pdf.setTextColor(31, 41, 55)
            pdf.text(project.techStack, 148.5, 125, { align: 'center' })

            // Add project description and compliments
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(12)
            pdf.setTextColor(75, 85, 99)
            const compliment = `We are impressed by ${profile.displayName || 'the student'}'s exceptional work on this project. 
                Their implementation of ${project.projectName} showcases a deep understanding of ${project.techStack}. 
                The project demonstrates creativity, technical proficiency, and attention to detail.`
            pdf.text(pdf.splitTextToSize(compliment, 250), 148.5, 140, { align: 'center' })

            // Generate and add QR code
            const verificationUrl = process.env.NEXT_PUBLIC_CERTIFICATE_VERIFICATION_URL
            if (verificationUrl) {
                const qrCodeDataUrl = await QRCode.toDataURL(
                    `${verificationUrl}/verify/${project.id}`,
                    {
                        margin: 1,
                        width: 150,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF'
                        }
                    }
                )
                pdf.addImage(qrCodeDataUrl, 'PNG', 20, 155, 25, 25)
                pdf.setFont('helvetica', 'italic')
                pdf.setFontSize(8)
                pdf.text('Scan to verify', 20, 185)
            }

            // Add date
            const date = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            pdf.setFontSize(12)
            pdf.setTextColor(75, 85, 99)
            pdf.text(`Issued on ${date}`, 20, 190)

            // Add signature
            const signatureCanvas = document.createElement('canvas')
            signatureCanvas.width = 200
            signatureCanvas.height = 80
            const signatureCtx = signatureCanvas.getContext('2d')
            if (signatureCtx) {
                signatureCtx.font = 'italic 30px Arial'
                signatureCtx.fillStyle = '#1F2937'
                signatureCtx.fillText('Varun Singh', 10, 50)
            }
            pdf.addImage(signatureCanvas.toDataURL(), 'PNG', 220, 170, 50, 20)

            // Add signature text
            pdf.setFont('helvetica', 'italic')
            pdf.setFontSize(12)
            pdf.setTextColor(75, 85, 99)
            pdf.text('Founder, StudentShowcase', 220, 195)

            // Save the PDF
            pdf.save(`${profile.displayName || 'Student'}_${project.projectName}_Certificate.pdf`)

            toast({
                title: "Certificate Generated",
                description: "Your certificate has been successfully generated and downloaded.",
            })
        } catch (error) {
            console.error('Error generating certificate:', error)
            toast({
                title: "Error",
                description: "Failed to generate certificate. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-3">
                            Certificate of Achievement
                        </h2>
                        <p className="text-blue-500 font-medium">For Outstanding Project Completion</p>
                    </motion.div>

                    <motion.div
                        className="space-y-6 mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                    >
                        <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.projectName}</h3>
                            <p className="text-sm text-gray-500 mb-1">Awarded to:</p>
                            <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                {profile.displayName}
                            </p>
                        </div>

                        <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-sm text-gray-500 mb-2">Technologies Used:</p>
                            <motion.div
                                className="flex flex-wrap gap-2"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {project.techStack.split(",").map((tech, index) => (
                                    <motion.span
                                        key={index}
                                        variants={{
                                            hidden: { opacity: 0, scale: 0.8 },
                                            visible: { opacity: 1, scale: 1 }
                                        }}
                                        className="px-3 py-1.5 bg-blue-100/80 text-blue-600 text-sm rounded-full font-medium hover:bg-blue-200/80 transition-colors"
                                    >
                                        {tech.trim()}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                    >
                        <Button
                            onClick={generateCertificate}
                            disabled={isGenerating}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Certificate
                                </>
                            )}
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                                <DialogTitle className="text-xl font-semibold text-blue-600">
                                    {profile.displayName}'s Certificate Preview
                                </DialogTitle>
                                <CertificatePreview
                                    projectName={project.projectName}
                                    recipientName={profile.displayName}
                                    techStack={project.techStack}
                                    completionDate={project.id}
                                />
                            </DialogContent>
                        </Dialog>
                    </motion.div>

                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.3 }}
                    >
                        <a
                            href={`${process.env.NEXT_PUBLIC_CERTIFICATE_VERIFICATION_URL}/verify/${project.id}`}
                            className="inline-block"
                        >
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Verify Certificate Authenticity
                            </Button>
                        </a>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}