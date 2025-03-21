import React, { useRef } from "react";
import {
    Briefcase,
    MapPin,
    Mail,
    Phone,
    Star,
    Code,
    Award,
    BookOpen,
    Smile,
    Download,
    Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types/profile";
import { CertificateProps } from "./Certificate";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";
import { ImageModal } from "./ImageModal";

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
    companyName, // eslint-disable-line @typescript-eslint/no-unused-vars
    experience, // eslint-disable-line @typescript-eslint/no-unused-vars
    format,
}: ResumePreviewProps) {
    const resumeRef = useRef<HTMLDivElement>(null);

    if (!profile) {
        return (
            <div className="text-center text-gray-500 p-10">
                No profile data available
            </div>
        );
    }

    const getBackgroundClass = () => {
        switch (format) {
            case "modern":
                return "bg-gradient-to-br from-blue-100 to-white";
            case "creative":
                return "bg-gradient-to-br from-purple-100 to-white";
            default:
                return "bg-white";
        }
    };

    const handleDownload = async () => {
        if (!resumeRef.current) return;

        const canvas = await html2canvas(resumeRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            windowHeight: resumeRef.current.scrollHeight,
            y: 0,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        // Calculate how many pages we need
        const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);

        for (let page = 0; page < totalPages; page++) {
            if (page > 0) {
                pdf.addPage();
            }

            // Calculate the portion of the image to render on this page
            const sourceY = page * (pdfHeight / ratio);
            const sourceHeight = Math.min(pdfHeight / ratio, imgHeight - sourceY);
            const destHeight = sourceHeight * ratio;



            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                pdfWidth,
                (imgHeight * pdfWidth) / imgWidth,
                undefined,
                "FAST",
                0
            );
        }

        pdf.save(`${profile.displayName}'s Resume.pdf`);
    };
    const verificationUrl = process.env.NEXT_PUBLIC_CERTIFICATE_VERIFICATION_URL

    return (
        <>
            <div className="flex flex-col">
                {/* <div className="flex justify-center items-center p-4">
                    <h1 className="text-3xl font-bold text-gray-800">Resume Preview</h1>
                </div> */}
                <div className="flex justify-end p-4">
                    <Button
                        onClick={handleDownload}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>
            <div
                ref={resumeRef}
                className={`max-w-4xl mx-auto  shadow-2xl overflow-hidden p-0 ${getBackgroundClass()}`}
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex items-center space-x-6">
                    <ImageModal
                        src={
                            profile.avatarUrl ||
                            `/studentshowcase.jpg?text=${profile.displayName?.charAt(0) || "U"
                            }`
                        }
                        alt={profile.displayName?.charAt(0) || "U"}
                    />
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {profile.displayName || "Name Not Available"}
                        </h1>
                        <div className="flex items-center space-x-4 text-sm opacity-80">
                            {profile.location && (
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-1" /> {profile.location}
                                </div>
                            )}
                            {profile.emailAddress && (
                                <div className="flex items-center">
                                    <Mail size={16} className="mr-1" /> {profile.emailAddress}
                                </div>
                            )}
                            {profile.phoneNumber && (
                                <div className="flex items-center">
                                    <Phone size={16} className="mr-1" /> {profile.phoneNumber}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 p-6">
                    <div className="col-span-1 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3 flex items-center border-b pb-2">
                                <Star className="mr-2 text-blue-600" /> Professional Summary
                            </h2>
                            <p className="text-gray-700">
                                {profile.bio || "No professional summary available"}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 flex items-center border-b pb-2">
                                <Code className="mr-2 text-green-600" /> Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                                    profile.skills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-blue-100 text-blue-800"
                                        >
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
                                {Array.isArray(profile.languages) &&
                                    profile.languages.length > 0 ? (
                                    profile.languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between mb-1">
                                            <span>{lang}</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mt-1.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: "75%" }}
                                                ></div>
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
                                <BookOpen className="mr-2 text-purple-600" /> Github & Social
                                Link
                            </h2>
                            <div className="flex items-center text-sm opacity-80">
                                {profile.socialLinks.github ||
                                    profile.socialLinks.linkedin ||
                                    profile.socialLinks.portfolio ||
                                    profile.socialLinks.twitter ? (
                                    <>
                                        {profile.socialLinks.github && (
                                            <div className="flex items-center">
                                                <a href={profile.socialLinks.github} target="_blank">
                                                    <Github size={25} className="mr-1" />
                                                </a>
                                            </div>
                                        )}
                                        {profile.socialLinks.linkedin && (
                                            <div className="flex items-center">
                                                <a href={profile.socialLinks.linkedin} target="_blank">
                                                    <Linkedin size={25} className="mr-1" />
                                                </a>
                                            </div>
                                        )}
                                        {profile.socialLinks.portfolio && (
                                            <div className="flex items-center">
                                                <a href={profile.socialLinks.portfolio} target="_blank">
                                                    <Globe size={25} className="mr-1" />
                                                </a>
                                            </div>
                                        )}
                                        {profile.socialLinks.twitter && (
                                            <div className="flex items-center">
                                                <a href={profile.socialLinks.twitter} target="_blank">
                                                    <Twitter size={25} className="mr-1" />
                                                </a>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <span>No social links available</span>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-2 space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center border-b pb-2">
                                <Briefcase className="mr-2 text-indigo-600" /> Projects
                            </h2>
                            {Array.isArray(projects) && projects.length > 0 ? (
                                projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-white rounded-lg p-4 shadow-md mb-4 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-blue-800">
                                                    {project.projectName}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {project.techStack}
                                                </p>
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
                                            {Array.isArray(project.features) &&
                                                project.features.length > 0 ? (
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
                                certificates.map(({ project, profile }) => (
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
                                                    Issued by {profile.displayName} on{" "}
                                                    {new Date(project.id).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${project.approved
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-yellow-50 text-yellow-700"
                                                    }`}
                                            >
                                                {project.approved ? "Approved" : "Pending"}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex space-x-3 mt-4">
                                                <a href={`${verificationUrl}/verify/` + project.id}>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Authenticity Of the Certificate
                                                    </Button>
                                                </a>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No certifications available
                                </p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center border-b pb-2">
                                <Smile className="mr-2 text-pink-600" /> Hobbies & Interests
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(profile.hobbiesAndInterests) &&
                                    profile.hobbiesAndInterests.length > 0 ? (
                                    profile.hobbiesAndInterests.map((hobby, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-pink-50 text-pink-800"
                                        >
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
