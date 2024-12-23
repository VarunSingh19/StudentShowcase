import React, { useRef } from 'react';
import { Briefcase, MapPin, Mail, Phone, Star, Code, Award, BookOpen, Smile, Download, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { UserProfile } from '@/types/profile';
import { CertificateProps } from '@/components/Certificate';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { CertificatePreview } from '@/components/CertificatePreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Github, Linkedin, Twitter, Globe } from 'lucide-react'
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Project {
    id: string;
    projectName: string;
    techStack: string;
    description: string;
    features: string[];
    repoUrl: string;
}

interface ResumePreviewProps {
    profile: UserProfile | null;
    projects: Project[];
    certificates: CertificateProps[];
    companyName: string;
    experience: string;
    format: string;
}

export function ResumePreview({
    profile,
    projects,
    certificates,
    // companyName,
    // experience,
    format
}: ResumePreviewProps) {
    const resumeRef = useRef<HTMLDivElement>(null);

    if (!profile) {
        return <div className="text-center text-gray-500 p-10">No profile data available</div>;
    }

    const getBackgroundClass = () => {
        switch (format) {
            case 'modern': return 'bg-gradient-to-br from-blue-100 to-white';
            case 'creative': return 'bg-gradient-to-br from-purple-100 to-white';
            default: return 'bg-white';
        }
    };

    const handleDownload = async () => {
        if (!resumeRef.current) return;

        const canvas = await html2canvas(resumeRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

        // Add clickable links
        const addClickableLink = (x: number, y: number, width: number, height: number, url: string) => {
            pdf.link(x, y, width, height, { url });
        };

        // Example: Add clickable link for each project's "View Code" button
        projects.forEach((project, index) => {
            const linkY = imgY + 100 + index * 50; // Adjust these values based on your layout
            addClickableLink(imgX + 150, linkY, 50, 10, project.repoUrl);
        });

        pdf.save('resume.pdf');
    };

    return (
        <>
            <div className="flex flex-col mb-8">
                <div className="flex justify-center items-center p-4">
                    <h1 className="text-3xl font-bold text-gray-800">Resume Preview</h1>
                </div>
                <div className="flex justify-end p-4">
                    <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>
            <div ref={resumeRef} className={`max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden ${getBackgroundClass()}`}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                            src={profile.avatarUrl || "/placeholder.svg"}
                            alt={profile.displayName || "User Profile"}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">{profile.displayName || 'Name Not Available'}</h1>
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm opacity-80">
                            {profile.location && <div className="flex items-center"><MapPin size={16} className="mr-1" /> {profile.location}</div>}
                            {profile.emailAddress && <div className="flex items-center"><Mail size={16} className="mr-1" /> {profile.emailAddress}</div>}
                            {profile.phoneNumber && <div className="flex items-center"><Phone size={16} className="mr-1" /> {profile.phoneNumber}</div>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-1 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3 flex items-center border-b pb-2">
                                <Star className="mr-2 text-blue-600" /> Professional Summary
                            </h2>
                            <p className="text-gray-700">{profile.bio || 'No professional summary available'}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 flex items-center border-b pb-2">
                                <Code className="mr-2 text-green-600" /> Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                                    profile.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No skills listed</p>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 flex items-center border-b pb-2">
                                <BookOpen className="mr-2 text-purple-600" /> Languages
                            </h2>
                            <div>
                                {Array.isArray(profile.languages) && profile.languages.length > 0 ? (
                                    profile.languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between mb-1">
                                            <span>{lang}</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mt-1.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No languages specified</p>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 flex items-center border-b pb-2">
                                <BookOpen className="mr-2 text-purple-600" /> Social Links
                            </h2>
                            <div className="flex items-center space-x-4 text-sm opacity-80">
                                {profile.socialLinks.github && <a href={profile.socialLinks.github} target='_blank' rel="noopener noreferrer"><Github size={20} className="text-gray-600 hover:text-blue-600" /></a>}
                                {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target='_blank' rel="noopener noreferrer"><Linkedin size={20} className="text-gray-600 hover:text-blue-600" /></a>}
                                {profile.socialLinks.portfolio && <a href={profile.socialLinks.portfolio} target='_blank' rel="noopener noreferrer"><Globe size={20} className="text-gray-600 hover:text-blue-600" /></a>}
                                {profile.socialLinks.twitter && <a href={profile.socialLinks.twitter} target='_blank' rel="noopener noreferrer"><Twitter size={20} className="text-gray-600 hover:text-blue-600" /></a>}
                            </div>
                        </section>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center border-b pb-2">
                                <Briefcase className="mr-2 text-indigo-600" /> Projects
                            </h2>
                            {Array.isArray(projects) && projects.length > 0 ? (
                                projects.map((project) => (
                                    <div key={project.id} className="bg-white rounded-lg p-4 shadow-md mb-4 hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-blue-800">{project.projectName}</h3>
                                                <p className="text-sm text-gray-500 mb-2">{project.techStack}</p>
                                            </div>
                                            <a
                                                href={project.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                View Code
                                            </a>
                                        </div>
                                        <p className="text-gray-700 mb-2">{project.description}</p>
                                        <ul className="list-disc list-inside mt-2">
                                            {Array.isArray(project.features) && project.features.length > 0 ? (
                                                project.features.map((feature, index) => (
                                                    <li key={index}>{feature}</li>
                                                ))
                                            ) : (
                                                <p>No features listed</p>
                                            )}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No projects available</p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center border-b pb-2">
                                <Award className="mr-2 text-yellow-600" /> Certifications
                            </h2>
                            {Array.isArray(certificates) && certificates.length > 0 ? (
                                certificates.map(({ project, profile }) => (  //@typescript-eslint/no-unused-vars
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-lg border border-blue-100 p-5 mb-4 hover:shadow-lg transition-all duration-300 ease-in-out"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-blue-600 mb-1">
                                                    {project.projectName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Issued by StudentShowcase Inc. on {new Date(project.id).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${project.approved
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-yellow-50 text-yellow-700'
                                                    }`}
                                            >
                                                {project.approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Technologies Used:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack.split(',').map((tech, techIndex) => (
                                                        <span
                                                            key={techIndex}
                                                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                                                        >
                                                            {tech.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 text-sm">{project.description}</p>

                                            {project.features && project.features.length > 0 && (
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Project Highlights:</p>
                                                    <ul className="list-disc list-inside text-gray-700 text-sm">
                                                        {project.features.map((feature, featureIndex) => (
                                                            <li key={featureIndex}>{feature}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="flex space-x-3 mt-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </Button>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Preview
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl">
                                                        {/* Ensure that a DialogTitle is present */}
                                                        <DialogTitle>
                                                            <VisuallyHidden>Resume Preview</VisuallyHidden>
                                                        </DialogTitle>
                                                        <CertificatePreview
                                                            projectName={project.projectName}
                                                            recipientName={profile.displayName}
                                                            techStack={project.techStack}
                                                            completionDate={project.id}
                                                        />
                                                    </DialogContent>
                                                </Dialog>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No certifications available</p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center border-b pb-2">
                                <Smile className="mr-2 text-pink-600" /> Hobbies & Interests
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(profile.hobbiesAndInterests) && profile.hobbiesAndInterests.length > 0 ? (
                                    profile.hobbiesAndInterests.map((hobby, index) => (
                                        <Badge key={index} variant="outline" className="bg-pink-50 text-pink-800">
                                            {hobby}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No hobbies specified</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

