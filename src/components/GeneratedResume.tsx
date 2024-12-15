import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Download, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from '@/hooks/use-toast'

interface GeneratedResumeProps {
    initialContent: string
}

export function GeneratedResume({ initialContent }: GeneratedResumeProps) {
    const [content, setContent] = useState(initialContent)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownloadPDF = async () => {
        setIsDownloading(true)
        try {
            const element = document.getElementById('resume-content')
            if (element) {
                const canvas = await html2canvas(element, {
                    scale: 2, // Increases resolution
                    useCORS: true // Helps with cross-origin images
                })
                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF('p', 'mm', 'a4')
                const imgProps = pdf.getImageProperties(imgData)
                const pdfWidth = pdf.internal.pageSize.getWidth()
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

                // Use name in filename if available
                const filename = name ? `${name.replace(/\s+/g, '_')}_resume.pdf` : 'resume.pdf'
                pdf.save(filename)

                toast({
                    title: "PDF Downloaded",
                    description: "Your resume has been downloaded successfully."
                })
            }
        } catch (error) {
            console.error('PDF download error:', error)
            toast({
                title: "Download Failed",
                description: "Unable to download PDF. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generated Resume</CardTitle>
                <Button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Downloading...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </>
                    )}
                </Button>
            </CardHeader>
            <CardContent>
                <div id="resume-content" className="space-y-6 p-6 border rounded-lg">
                    <div className="space-y-2">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="text-2xl font-bold"
                        />
                        <div className="flex space-x-4">
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                type="email"
                            />
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone"
                                type="tel"
                            />
                        </div>
                    </div>
                    <Textarea

                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[500px] font-serif"
                    />
                </div>
            </CardContent>

        </Card>
    )
}


// import React, { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Download, Plus, Minus } from 'lucide-react'
// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'

// interface GeneratedResumeProps {
//     initialContent: {
//         name: string;
//         email: string;
//         phone: string;
//         summary: string;
//         skills: string[];
//         projects: {
//             id: string;
//             name: string;
//             description: string;
//             features: string[];
//         }[];
//         certificates: {
//             id: string;
//             name: string;
//             issuer: string;
//             date: string;
//         }[];
//         additionalInfo: {
//             languages: string;
//             hobbies: string;
//         };
//     };
// }

// export function GeneratedResume({ initialContent }: GeneratedResumeProps) {
//     const [content, setContent] = useState(initialContent)

//     const handleDownloadPDF = async () => {
//         const element = document.getElementById('resume-content')
//         if (element) {
//             const canvas = await html2canvas(element)
//             const imgData = canvas.toDataURL('image/png')
//             const pdf = new jsPDF()
//             const imgProps = pdf.getImageProperties(imgData)
//             const pdfWidth = pdf.internal.pageSize.getWidth()
//             const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
//             pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
//             pdf.save('resume.pdf')
//         }
//     }

//     const handleChange = (field: string, value: any) => {
//         setContent(prev => ({ ...prev, [field]: value }))
//     }

//     const handleProjectChange = (index: number, field: string, value: any) => {
//         const newProjects = [...content.projects]
//         newProjects[index] = { ...newProjects[index], [field]: value }
//         handleChange('projects', newProjects)
//     }

//     const handleCertificateChange = (index: number, field: string, value: string) => {
//         const newCertificates = [...content.certificates]
//         newCertificates[index] = { ...newCertificates[index], [field]: value }
//         handleChange('certificates', newCertificates)
//     }

//     const handleSkillChange = (index: number, value: string) => {
//         const newSkills = [...content.skills]
//         newSkills[index] = value
//         handleChange('skills', newSkills)
//     }

//     const addSkill = () => {
//         handleChange('skills', [...content.skills, ''])
//     }

//     const removeSkill = (index: number) => {
//         const newSkills = content.skills.filter((_, i) => i !== index)
//         handleChange('skills', newSkills)
//     }

//     const addProjectFeature = (projectIndex: number) => {
//         const newProjects = [...content.projects]
//         newProjects[projectIndex].features.push('')
//         handleChange('projects', newProjects)
//     }

//     const removeProjectFeature = (projectIndex: number, featureIndex: number) => {
//         const newProjects = [...content.projects]
//         newProjects[projectIndex].features = newProjects[projectIndex].features.filter((_, i) => i !== featureIndex)
//         handleChange('projects', newProjects)
//     }

//     return (
//         <Card className="w-full max-w-4xl mx-auto">
//             <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle>Generated Resume</CardTitle>
//                 <Button onClick={handleDownloadPDF}>
//                     <Download className="mr-2 h-4 w-4" />
//                     Download PDF
//                 </Button>
//             </CardHeader>
//             <CardContent>
//                 <div id="resume-content" className="space-y-6 p-6 border rounded-lg">
//                     <div className="space-y-2">
//                         <Input
//                             value={content.name}
//                             onChange={(e) => handleChange('name', e.target.value)}
//                             placeholder="Your Name"
//                             className="text-2xl font-bold"
//                         />
//                         <div className="flex space-x-4">
//                             <Input
//                                 value={content.email}
//                                 onChange={(e) => handleChange('email', e.target.value)}
//                                 placeholder="Email"
//                                 type="email"
//                             />
//                             <Input
//                                 value={content.phone}
//                                 onChange={(e) => handleChange('phone', e.target.value)}
//                                 placeholder="Phone"
//                                 type="tel"
//                             />
//                         </div>
//                     </div>

//                     <section>
//                         <h2 className="text-xl font-semibold mb-2">Professional Summary</h2>
//                         <Textarea
//                             value={content.summary}
//                             onChange={(e) => handleChange('summary', e.target.value)}
//                             placeholder="Your professional summary"
//                             rows={4}
//                         />
//                     </section>

//                     <section>
//                         <h2 className="text-xl font-semibold mb-2">Skills</h2>
//                         <div className="flex flex-wrap gap-2">
//                             {content.skills.map((skill, index) => (
//                                 <div key={index} className="flex items-center">
//                                     <Input
//                                         value={skill}
//                                         onChange={(e) => handleSkillChange(index, e.target.value)}
//                                         className="w-32"
//                                     />
//                                     <Button variant="ghost" size="sm" onClick={() => removeSkill(index)}>
//                                         <Minus className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             ))}
//                             <Button variant="outline" size="sm" onClick={addSkill}>
//                                 <Plus className="h-4 w-4 mr-2" />
//                                 Add Skill
//                             </Button>
//                         </div>
//                     </section>

//                     <section>
//                         <h2 className="text-xl font-semibold mb-2">Projects</h2>
//                         {content.projects.map((project, projectIndex) => (
//                             <div key={project.id} className="mb-4">
//                                 <Input
//                                     value={project.name}
//                                     onChange={(e) => handleProjectChange(projectIndex, 'name', e.target.value)}
//                                     className="font-semibold mb-2"
//                                 />
//                                 <Textarea
//                                     value={project.description}
//                                     onChange={(e) => handleProjectChange(projectIndex, 'description', e.target.value)}
//                                     rows={2}
//                                     className="mb-2"
//                                 />
//                                 <ul className="list-disc list-inside">
//                                     {project.features.map((feature, featureIndex) => (
//                                         <li key={featureIndex} className="flex items-center mb-1">
//                                             <Input
//                                                 value={feature}
//                                                 onChange={(e) => {
//                                                     const newFeatures = [...project.features]
//                                                     newFeatures[featureIndex] = e.target.value
//                                                     handleProjectChange(projectIndex, 'features', newFeatures)
//                                                 }}
//                                                 className="flex-grow"
//                                             />
//                                             <Button variant="ghost" size="sm" onClick={() => removeProjectFeature(projectIndex, featureIndex)}>
//                                                 <Minus className="h-4 w-4" />
//                                             </Button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                                 <Button variant="outline" size="sm" onClick={() => addProjectFeature(projectIndex)}>
//                                     <Plus className="h-4 w-4 mr-2" />
//                                     Add Feature
//                                 </Button>
//                             </div>
//                         ))}
//                     </section>

//                     <section>
//                         <h2 className="text-xl font-semibold mb-2">Certifications</h2>
//                         {content.certificates.map((cert, index) => (
//                             <div key={cert.id} className="mb-2">
//                                 <Input
//                                     value={cert.name}
//                                     onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
//                                     className="font-semibold mb-1"
//                                 />
//                                 <div className="flex space-x-2">
//                                     <Input
//                                         value={cert.issuer}
//                                         onChange={(e) => handleCertificateChange(index, 'issuer', e.target.value)}
//                                         placeholder="Issuer"
//                                     />
//                                     <Input
//                                         value={cert.date}
//                                         onChange={(e) => handleCertificateChange(index, 'date', e.target.value)}
//                                         placeholder="Date"
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </section>

//                     <section>
//                         <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
//                         <div className="space-y-2">
//                             <Label htmlFor="languages">Languages</Label>
//                             <Input
//                                 id="languages"
//                                 value={content.additionalInfo.languages}
//                                 onChange={(e) => handleChange('additionalInfo', { ...content.additionalInfo, languages: e.target.value })}
//                             />
//                             <Label htmlFor="hobbies">Hobbies & Interests</Label>
//                             <Input
//                                 id="hobbies"
//                                 value={content.additionalInfo.hobbies}
//                                 onChange={(e) => handleChange('additionalInfo', { ...content.additionalInfo, hobbies: e.target.value })}
//                             />
//                         </div>
//                     </section>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }
