"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Download, Eye } from 'lucide-react'
import { UserProfile } from "@/types/profile"
import jsPDF from "jspdf"
import QRCode from "qrcode"
import { CertificatePreview } from "./CertificatePreview"
import { DialogTitle } from "@radix-ui/react-dialog"

import { } from "crypto"

export interface CertificateProps {
    project: {
        id: string
        projectName: string
        techStack: string
        description: string
        features: string[]
        approved: boolean
        completionDate: string
    }
    profile: UserProfile
}


// const certificatesProps: CertificateProps[] = certificates.map(cert => ({
//     project: {
//         id: cert.projectId,
//         projectName: cert.name,
//         techStack: cert.technologies,
//         description: cert.details,
//         features: cert.featuresList,
//         repoUrl: cert.repositoryUrl,
//     },
//     profile: {
//         displayName: cert.issuerName,
//         avatarUrl: cert.issuerAvatar,
//         bio: cert.issuerBio,
//         emailAddress: cert.issuerEmail,
//         phoneNumber: cert.issuerPhone,
//         location: cert.issuerLocation,
//     }
// }));


export function Certificate({ project, profile }: CertificateProps) {
    const [isGenerating, setIsGenerating] = useState(false)  // eslint-disable-line @typescript-eslint/no-unused-vars

    const generateCertificate = async () => {
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

        // Add logo - assuming logo.png is in public folder
        // pdf.addImage('/logo.png', 'PNG', 10, 10, 60, 25)

        // Add clickable link for logo
        // pdf.link(10, 10, 60, 25, { url: 'https://studentshowcase.vercel.app' })

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
        pdf.text(profile.displayName, 148.5, 85, { align: 'center' })

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
        const compliment = `We are impressed by ${profile.displayName}'s exceptional work on this project. 
            Their implementation of ${project.projectName} showcases a deep understanding of ${project.techStack}. 
            The project demonstrates creativity, technical proficiency, and attention to detail.`
        pdf.text(pdf.splitTextToSize(compliment, 250), 148.5, 140, { align: 'center' })

        // Add project features if they exist
        // if (Array.isArray(project.features) && project.features.length > 0) {
        //     pdf.setFont('helvetica', 'bold')
        //     pdf.setFontSize(14)
        //     pdf.text('Notable Features:', 30, 155)
        //     pdf.setFont('helvetica', 'normal')
        //     pdf.setFontSize(12)
        //     project.features.forEach((feature, index) => {
        //         pdf.text(`• ${feature}`, 35, 165 + (index * 7))
        //     })
        // }

        // Generate and add QR code
        const qrCodeDataUrl = await QRCode.toDataURL(`https://studentshowcase.vercel.app/verify/${project.id}`, {
            margin: 1,
            width: 150,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })
        pdf.addImage(qrCodeDataUrl, 'PNG', 20, 155, 25, 25)
        pdf.setFont('helvetica', 'italic')
        pdf.setFontSize(8)
        pdf.text('Scan to verify', 20, 185)

        // Add date
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
        pdf.save(`${profile.displayName}_${project.projectName}_Certificate.pdf`)
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-white border border-blue-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">Certificate of Achievement</h2>
                    <p className="text-blue-500">For Outstanding Project Completion</p>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{project.projectName}</h3>
                        <p className="text-sm text-gray-500">Awarded to:</p>
                        <p className="text-lg font-semibold text-blue-600">{profile.displayName}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Technologies Used:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {project.techStack.split(",").map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                                >
                                    {tech.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* <p className="text-sm text-gray-500">
                        Completed on: <span className="text-gray-700">{project.completionDate}</span>
                    </p> */}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={generateCertificate}
                        disabled={isGenerating}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {isGenerating ? "Generating..." : "Download"}
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogTitle></DialogTitle>
                            <CertificatePreview
                                projectName={project.projectName}
                                recipientName={profile.displayName}
                                techStack={project.techStack}
                                completionDate={project.completionDate}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}
