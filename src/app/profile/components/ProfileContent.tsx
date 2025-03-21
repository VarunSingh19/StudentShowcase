// import React, { useState } from 'react'
// import { doc, setDoc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Github, Linkedin, Globe, Loader2 } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'
// import { UserProfile } from '@/types/profile'

// interface ProfileContentProps {
//     initialProfile: UserProfile;
//     userId: string;
// }

// export function ProfileContent({ initialProfile, userId }: ProfileContentProps) {
//     const [profile, setProfile] = useState<UserProfile>(initialProfile)
//     const [skillInput, setSkillInput] = useState('')
//     const [saving, setSaving] = useState(false)
//     const [error, setError] = useState('')

//     const handleSave = async () => {
//         setSaving(true)
//         try {
//             await setDoc(doc(db, 'profiles', userId), {
//                 ...profile,
//                 updatedAt: new Date(),
//             }, { merge: true })
//             toast({
//                 title: "Profile saved",
//                 description: "Your profile has been updated successfully.",
//             })
//         } catch (err) {
//             console.error('Error saving profile:', err)
//             setError('Failed to save profile')
//             toast({
//                 title: "Error",
//                 description: "Failed to save profile. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setSaving(false)
//         }
//     }

//     const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter' && skillInput.trim()) {
//             e.preventDefault()
//             if (!profile.skills.includes(skillInput.trim())) {
//                 setProfile(prev => ({
//                     ...prev,
//                     skills: [...prev.skills, skillInput.trim()]
//                 }))
//             }
//             setSkillInput('')
//         }
//     }

//     const removeSkill = (skillToRemove: string) => {
//         setProfile(prev => ({
//             ...prev,
//             skills: prev.skills.filter(skill => skill !== skillToRemove)
//         }))
//     }

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Profile Information</CardTitle>
//                 <CardDescription>
//                     Update your profile information and social media links
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <Label htmlFor="displayName">Display Name</Label>
//                         <Input
//                             id="displayName"
//                             value={profile.displayName}
//                             onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
//                         />
//                     </div>
//                     <div>
//                         <Label htmlFor="location">Location</Label>
//                         <Input
//                             id="location"
//                             value={profile.location}
//                             onChange={(e) => setProfile({ ...profile, location: e.target.value })}
//                         />
//                     </div>
//                 </div>

// <div>
//     <Label htmlFor="bio">Bio</Label>
//     <Textarea
//         id="bio"
//         value={profile.bio}
//         onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//         rows={4}
//     />
// </div>

//                 <div>
//                     <Label htmlFor="skills">Skills</Label>
//                     <div className="flex items-center space-x-2">
//                         <Input
//                             id="skills"
//                             value={skillInput}
//                             onChange={(e) => setSkillInput(e.target.value)}
//                             onKeyDown={handleAddSkill}
//                             placeholder="Type a skill and press Enter"
//                         />
//                         <Button onClick={() => handleAddSkill({ key: 'Enter', preventDefault: () => { } } as React.KeyboardEvent<HTMLInputElement>)} type="button">
//                             Add
//                         </Button>
//                     </div>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                         {profile.skills.map((skill) => (
//                             <Badge
//                                 key={skill}
//                                 variant="secondary"
//                                 className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
//                                 onClick={() => removeSkill(skill)}
//                             >
//                                 {skill} ×
//                             </Badge>
//                         ))}
//                     </div>
//                 </div>

// <div>
//     <Label htmlFor="hobbiesAndInterests">Hobbies and Interests</Label>
//     <Input
//         id="hobbiesAndInterests"
//         value={(profile.hobbiesAndInterests || []).join(', ')}
//         onChange={(e) =>
//             setProfile({
//                 ...profile,
//                 hobbiesAndInterests: e.target.value
//                     .split(',')
//                     .map((item) => item.trim()),
//             })
//         }
//         placeholder="Enter hobbies and interests, separated by commas"
//     />
// </div>

//                 <div>
//                     <Label htmlFor="languages">Languages</Label>
//                     <Input
//                         id="languages"
//                         value={(profile.languages || []).join(', ')}
//                         onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(',').map(item => item.trim()) })}
//                         placeholder="Enter languages, separated by commas"
//                     />
//                 </div>

//                 <div>
//                     <Label htmlFor="emailAddress">Email Address</Label>
//                     <Input
//                         id="emailAddress"
//                         value={profile.emailAddress}
//                         onChange={(e) => setProfile({ ...profile, emailAddress: e.target.value })}
//                         placeholder="Enter your email address"
//                     />
//                 </div>

//                 <div>
//                     <Label htmlFor="phoneNumber">Phone Number</Label>
//                     <Input
//                         id="phoneNumber"
//                         value={profile.phoneNumber}
//                         onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
//                         placeholder="Enter your phone number"
//                     />
//                 </div>

// <div className="space-y-4">
//     <h3 className="text-lg font-medium">Social Links</h3>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="flex items-center gap-2">
//             <Github className="h-5 w-5" />
//             <Input
//                 placeholder="GitHub URL"
//                 value={profile.socialLinks.github}
//                 onChange={(e) => setProfile({
//                     ...profile,
//                     socialLinks: { ...profile.socialLinks, github: e.target.value }
//                 })}
//             />
//         </div>
//         <div className="flex items-center gap-2">
//             <Linkedin className="h-5 w-5" />
//             <Input
//                 placeholder="LinkedIn URL"
//                 value={profile.socialLinks.linkedin}
//                 onChange={(e) => setProfile({
//                     ...profile,
//                     socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
//                 })}
//             />
//         </div>
//         <div className="flex items-center gap-2">
//             <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> </svg>
//             <Input
//                 placeholder="X.com or Twitter URL"
//                 value={profile.socialLinks.twitter}
//                 onChange={(e) => setProfile({
//                     ...profile,
//                     socialLinks: { ...profile.socialLinks, twitter: e.target.value }
//                 })}
//             />
//         </div>
//         <div className="flex items-center gap-2">
//             <Globe className="h-5 w-5" />
//             <Input
//                 placeholder="Portfolio URL"
//                 value={profile.socialLinks.portfolio}
//                 onChange={(e) => setProfile({
//                     ...profile,
//                     socialLinks: { ...profile.socialLinks, portfolio: e.target.value }
//                 })}
//             />
//         </div>
//     </div>
// </div>

//                 {error && (
//                     <Alert variant="destructive">
//                         <AlertDescription>{error}</AlertDescription>
//                     </Alert>
//                 )}

//                 <Button onClick={handleSave} disabled={saving}>
//                     {saving ? (
//                         <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Saving...
//                         </>
//                     ) : (
//                         'Save Profile'
//                     )}
//                 </Button>
//             </CardContent>
//         </Card>
//     )
// }

import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    Github,
    Linkedin,
    Globe,
    Loader2,
    Award,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/profile';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Timestamp } from 'firebase/firestore';

interface ProfileContentProps {
    initialProfile: UserProfile;
    userId: string;
}


type EducationType = 'School' | 'College' | 'University' | 'Graduate';
interface Education {
    id: string;
    institution: string;
    educationType: EducationType | '';
    // For non-school education
    degree?: string;
    fieldOfStudy?: string;
    // For school-specific education
    board?: string;
    percentage?: string;
    startDate: string;
    endDate: string;
    location: string;
    gpa?: string;
    description?: string;
}


interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    achievements: string[];
    isCurrentPosition: boolean;
}

interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    githubUrl?: string;
    demoUrl?: string;
    imageUrl?: string;
    highlights: string[];
}

interface Certificate {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialUrl?: string;
    credentialId?: string;
    description?: string;
}

interface Reference {
    id: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone?: string;
    relationship: string;
}

interface Award {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
}

export function ProfileContent({ initialProfile, userId }: ProfileContentProps) {
    const [profile, setProfile] = useState<UserProfile>(initialProfile);
    const [skillInput, setSkillInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Initialize state for all resume sections
    const [education, setEducation] = useState<Education[]>(profile.education || []);
    const [workExperience, setWorkExperience] = useState<WorkExperience[]>(profile.workExperience || []);
    const [projects, setProjects] = useState<Project[]>(profile.projects || []);
    const [certificates, setCertificates] = useState<Certificate[]>(profile.certificates || []);
    const [references, setReferences] = useState<Reference[]>(profile.references || []);
    const [awards, setAwards] = useState<Award[]>(profile.awards || []);

    // State for new education entry with additional fields
    const [newEducation, setNewEducation] = useState<Education>({
        id: Date.now().toString(),
        institution: '',
        educationType: '',
        degree: '',
        fieldOfStudy: '',
        board: '',
        percentage: '',
        startDate: '',
        endDate: '',
        location: '',
        gpa: '',
        description: ''
    });
    const [newWorkExperience, setNewWorkExperience] = useState<WorkExperience>({
        id: Date.now().toString(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        location: '',
        description: '',
        achievements: [],
        isCurrentPosition: false
    });

    const [newProject, setNewProject] = useState<Project>({
        id: Date.now().toString(),
        title: '',
        description: '',
        technologies: [],
        startDate: '',
        endDate: '',
        githubUrl: '',
        demoUrl: '',
        imageUrl: '',
        highlights: []
    });

    const [newCertificate, setNewCertificate] = useState<Certificate>({
        id: Date.now().toString(),
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialUrl: '',
        credentialId: '',
        description: ''
    });

    const [newReference, setNewReference] = useState<Reference>({
        id: Date.now().toString(),
        name: '',
        position: '',
        company: '',
        email: '',
        phone: '',
        relationship: ''
    });

    const [newAward, setNewAward] = useState<Award>({
        id: Date.now().toString(),
        title: '',
        issuer: '',
        date: '',
        description: ''
    });




    // Per-item input states
    const [techInputs, setTechInputs] = useState<{ [key: string]: string }>({});
    const [highlightInputs, setHighlightInputs] = useState<{ [key: string]: string }>({});
    const [achievementInputs, setAchievementInputs] = useState<{ [key: string]: string }>({});
    const [newTechInput, setNewTechInput] = useState('');
    const [newHighlightInput, setNewHighlightInput] = useState('');
    const [newAchievementInput, setNewAchievementInput] = useState('');

    // Save all profile data
    const handleSave = async () => {
        setSaving(true);
        try {
            const updatedProfile = {
                ...profile,
                education: education,
                workExperience: workExperience,
                projects: projects,
                certificates: certificates,
                references: references,
                awards: awards,
                updatedAt: Timestamp.fromDate(new Date()),
            };

            await setDoc(doc(db, 'profiles', userId), updatedProfile, { merge: true });

            toast({
                title: "Profile saved",
                description: "Your resume has been updated successfully.",
            });
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile');
            toast({
                title: "Error",
                description: "Failed to save profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    // **Skills Handlers**
    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!profile.skills.includes(skillInput.trim())) {
                setProfile(prev => ({
                    ...prev,
                    skills: [...prev.skills, skillInput.trim()]
                }));
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    // **Technology Handlers for Projects**
    const addTechnologyToProject = (projectId: string, technology: string) => {
        if (technology.trim() && !projects.find(proj => proj.id === projectId)?.technologies.includes(technology.trim())) {
            setProjects(projects.map(proj =>
                proj.id === projectId
                    ? { ...proj, technologies: [...proj.technologies, technology.trim()] }
                    : proj
            ));
        }
    };

    const removeTechnologyFromProject = (projectId: string, techToRemove: string) => {
        setProjects(projects.map(proj =>
            proj.id === projectId
                ? { ...proj, technologies: proj.technologies.filter(tech => tech !== techToRemove) }
                : proj
        ));
    };

    const handleAddNewProjectTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTechInput.trim()) {
            e.preventDefault();
            if (!newProject.technologies.includes(newTechInput.trim())) {
                setNewProject(prev => ({
                    ...prev,
                    technologies: [...prev.technologies, newTechInput.trim()]
                }));
            }
            setNewTechInput('');
        }
    };

    const removeNewProjectTechnology = (techToRemove: string) => {
        setNewProject(prev => ({
            ...prev,
            technologies: prev.technologies.filter(tech => tech !== techToRemove)
        }));
    };

    // **Highlight Handlers for Projects**
    const addHighlightToProject = (projectId: string, highlight: string) => {
        if (highlight.trim() && !projects.find(proj => proj.id === projectId)?.highlights.includes(highlight.trim())) {
            setProjects(projects.map(proj =>
                proj.id === projectId
                    ? { ...proj, highlights: [...proj.highlights, highlight.trim()] }
                    : proj
            ));
        }
    };

    const removeHighlightFromProject = (projectId: string, highlightToRemove: string) => {
        setProjects(projects.map(proj =>
            proj.id === projectId
                ? { ...proj, highlights: proj.highlights.filter(highlight => highlight !== highlightToRemove) }
                : proj
        ));
    };

    const handleAddNewProjectHighlight = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newHighlightInput.trim()) {
            e.preventDefault();
            if (!newProject.highlights.includes(newHighlightInput.trim())) {
                setNewProject(prev => ({
                    ...prev,
                    highlights: [...prev.highlights, newHighlightInput.trim()]
                }));
            }
            setNewHighlightInput('');
        }
    };

    const removeNewProjectHighlight = (highlightToRemove: string) => {
        setNewProject(prev => ({
            ...prev,
            highlights: prev.highlights.filter(highlight => highlight !== highlightToRemove)
        }));
    };

    // **Achievement Handlers for Work Experience**
    const addAchievementToWorkExperience = (workExpId: string, achievement: string) => {
        if (achievement.trim() && !workExperience.find(exp => exp.id === workExpId)?.achievements.includes(achievement.trim())) {
            setWorkExperience(workExperience.map(exp =>
                exp.id === workExpId
                    ? { ...exp, achievements: [...exp.achievements, achievement.trim()] }
                    : exp
            ));
        }
    };

    const removeAchievementFromWorkExperience = (workExpId: string, achievementToRemove: string) => {
        setWorkExperience(workExperience.map(exp =>
            exp.id === workExpId
                ? { ...exp, achievements: exp.achievements.filter(achievement => achievement !== achievementToRemove) }
                : exp
        ));
    };

    const handleAddNewWorkExperienceAchievement = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newAchievementInput.trim()) {
            e.preventDefault();
            if (!newWorkExperience.achievements.includes(newAchievementInput.trim())) {
                setNewWorkExperience(prev => ({
                    ...prev,
                    achievements: [...prev.achievements, newAchievementInput.trim()]
                }));
            }
            setNewAchievementInput('');
        }
    };

    const removeNewWorkExperienceAchievement = (achievementToRemove: string) => {
        setNewWorkExperience(prev => ({
            ...prev,
            achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
        }));
    };

    // Add new education entry; for School, require board and percentage instead of degree/fieldOfStudy
    const addEducation = () => {
        if (
            newEducation.institution.trim() &&
            newEducation.educationType.trim() &&
            (newEducation.educationType === 'School'
                ? newEducation.board?.trim() && newEducation.percentage?.trim()
                : newEducation.degree?.trim() && newEducation.fieldOfStudy?.trim())
        ) {
            setEducation([...education, newEducation]);
            setNewEducation({
                id: Date.now().toString(),
                institution: '',
                educationType: '',
                degree: '',
                fieldOfStudy: '',
                board: '',
                percentage: '',
                startDate: '',
                endDate: '',
                location: '',
                gpa: '',
                description: ''
            });
        }
    };

    const addWorkExperience = () => {
        if (newWorkExperience.company.trim() && newWorkExperience.position.trim()) {
            setWorkExperience([...workExperience, newWorkExperience]);
            setNewWorkExperience({
                id: Date.now().toString(),
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                location: '',
                description: '',
                achievements: [],
                isCurrentPosition: false
            });
            setNewAchievementInput('');
        }
    };

    const addProject = () => {
        if (newProject.title.trim() && newProject.description.trim()) {
            setProjects([...projects, newProject]);
            setNewProject({
                id: Date.now().toString(),
                title: '',
                description: '',
                technologies: [],
                startDate: '',
                endDate: '',
                githubUrl: '',
                demoUrl: '',
                imageUrl: '',
                highlights: []
            });
            setNewTechInput('');
            setNewHighlightInput('');
        }
    };

    const addCertificate = () => {
        if (newCertificate.name.trim() && newCertificate.issuer.trim()) {
            setCertificates([...certificates, newCertificate]);
            setNewCertificate({
                id: Date.now().toString(),
                name: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                credentialUrl: '',
                credentialId: '',
                description: ''
            });
        }
    };

    const addReference = () => {
        if (newReference.name.trim() && newReference.email.trim()) {
            setReferences([...references, newReference]);
            setNewReference({
                id: Date.now().toString(),
                name: '',
                position: '',
                company: '',
                email: '',
                phone: '',
                relationship: ''
            });
        }
    };

    const addAward = () => {
        if (newAward.title.trim() && newAward.issuer.trim()) {
            setAwards([...awards, newAward]);
            setNewAward({
                id: Date.now().toString(),
                title: '',
                issuer: '',
                date: '',
                description: ''
            });
        }
    };

    // **Delete Item Functions**
    const deleteEducation = (id: string) => {
        setEducation(education.filter(edu => edu.id !== id));
    };

    const deleteWorkExperience = (id: string) => {
        setWorkExperience(workExperience.filter(exp => exp.id !== id));
    };

    const deleteProject = (id: string) => {
        setProjects(projects.filter(proj => proj.id !== id));
    };

    const deleteCertificate = (id: string) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const deleteReference = (id: string) => {
        setReferences(references.filter(ref => ref.id !== id));
    };

    const deleteAward = (id: string) => {
        setAwards(awards.filter(award => award.id !== id));
    };




    // Render form fields conditionally for an education item (both for display and editing)
    const renderEducationFields = (
        edu: Education,
        onChange: (field: keyof Education, value: string) => void
    ) => {
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                        <Input
                            id={`institution-${edu.id}`}
                            value={edu.institution}
                            onChange={(e) => onChange('institution', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor={`educationType-${edu.id}`}>Education Type</Label>
                        <select
                            id={`educationType-${edu.id}`}
                            value={edu.educationType}
                            onChange={(e) => onChange('educationType', e.target.value)}
                            className="input"
                        >
                            <option value="">Select Type</option>
                            <option value="School">School</option>
                            <option value="College">College</option>
                            <option value="University">University</option>
                            <option value="Graduate">Graduate</option>
                        </select>
                    </div>
                </div>

                {edu.educationType === 'School' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor={`board-${edu.id}`}>Board</Label>
                                <Input
                                    id={`board-${edu.id}`}
                                    value={edu.board || ''}
                                    onChange={(e) => onChange('board', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`percentage-${edu.id}`}>Percentage</Label>
                                <Input
                                    id={`percentage-${edu.id}`}
                                    value={edu.percentage || ''}
                                    onChange={(e) => onChange('percentage', e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                                <Input
                                    id={`degree-${edu.id}`}
                                    value={edu.degree || ''}
                                    onChange={(e) => onChange('degree', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`fieldOfStudy-${edu.id}`}>Field of Study</Label>
                                <Input
                                    id={`fieldOfStudy-${edu.id}`}
                                    value={edu.fieldOfStudy || ''}
                                    onChange={(e) => onChange('fieldOfStudy', e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor={`location-${edu.id}`}>Location</Label>
                        <Input
                            id={`location-${edu.id}`}
                            value={edu.location}
                            onChange={(e) => onChange('location', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                        <Input
                            id={`startDate-${edu.id}`}
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => onChange('startDate', e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                        <Input
                            id={`endDate-${edu.id}`}
                            type="date"
                            value={edu.endDate}
                            onChange={(e) => onChange('endDate', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor={`gpa-${edu.id}`}>GPA</Label>
                        <Input
                            id={`gpa-${edu.id}`}
                            value={edu.gpa || ''}
                            onChange={(e) => onChange('gpa', e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor={`description-${edu.id}`}>Description</Label>
                    <Textarea
                        id={`description-${edu.id}`}
                        value={edu.description || ''}
                        onChange={(e) => onChange('description', e.target.value)}
                        rows={4}
                    />
                </div>
            </>
        );
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                    Complete all sections to create a comprehensive professional resume
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="displayName">Full Name</Label>
                            <Input
                                id="displayName"
                                value={profile.displayName}
                                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="jobTitle">Professional Title</Label>
                            <Input
                                id="jobTitle"
                                value={profile.jobTitle || ''}
                                onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="emailAddress">Email Address</Label>
                            <Input
                                id="emailAddress"
                                value={profile.emailAddress}
                                onChange={(e) => setProfile({ ...profile, emailAddress: e.target.value })}
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={profile.location}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                placeholder="Enter your city, state"
                            />
                        </div>
                        <div>
                            <Label htmlFor="website">Personal Website</Label>
                            <Input
                                id="website"
                                value={profile.website || ''}
                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                placeholder="Enter your personal website"
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Social Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Github className="h-5 w-5" />
                                    <Input
                                        placeholder="GitHub URL"
                                        value={profile.socialLinks.github}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            socialLinks: { ...profile.socialLinks, github: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Linkedin className="h-5 w-5" />
                                    <Input
                                        placeholder="LinkedIn URL"
                                        value={profile.socialLinks.linkedin}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> </svg>
                                    <Input
                                        placeholder="X.com or Twitter URL"
                                        value={profile.socialLinks.twitter}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                                        })}
                                    />
                                </div>



                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    <Input
                                        placeholder="Portfolio URL"
                                        value={profile.socialLinks.portfolio}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            socialLinks: { ...profile.socialLinks, portfolio: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="hobbiesAndInterests">Hobbies and Interests</Label>
                            <Input
                                id="hobbiesAndInterests"
                                value={(profile.hobbiesAndInterests || []).join(', ')}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        hobbiesAndInterests: e.target.value
                                            .split(',')
                                            .map((item) => item.trim()),
                                    })
                                }
                                placeholder="Enter hobbies and interests, separated by commas"
                            />
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div>
                    <h3 className="text-xl font-medium">Skills</h3>
                    <div className="flex items-center space-x-2">
                        <Input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleAddSkill}
                            placeholder="Type a skill and press Enter"
                        />
                        <Button onClick={() => handleAddSkill({ key: 'Enter', preventDefault: () => { } } as React.KeyboardEvent<HTMLInputElement>)} type="button">
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                onClick={() => removeSkill(skill)}
                            >
                                {skill} ×
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Education Section */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="education">
                        <AccordionTrigger>
                            <h3 className="text-xl font-medium">Education</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6">
                                {education.map(edu => (
                                    <Accordion type="single" collapsible key={edu.id}>
                                        <AccordionItem value={edu.id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center justify-between w-full">
                                                    <h4 className="text-lg font-medium">
                                                        {edu.institution} - {edu.educationType}{' '}
                                                        {edu.educationType === 'School'
                                                            ? `(Board: ${edu.board || '-'})`
                                                            : `(Degree: ${edu.degree || '-'})`}
                                                    </h4>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteEducation(edu.id);
                                                        }}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {renderEducationFields(edu, (field, value) =>
                                                    setEducation(
                                                        education.map(item =>
                                                            item.id === edu.id ? { ...item, [field]: value } : item
                                                        )
                                                    )
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}

                                {/* New Education Form */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium">Add New Education</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-institution">Institution</Label>
                                            <Input
                                                id="new-institution"
                                                value={newEducation.institution}
                                                onChange={(e) =>
                                                    setNewEducation({ ...newEducation, institution: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-educationType">Education Type</Label>
                                            <select
                                                id="new-educationType"
                                                value={newEducation.educationType}
                                                onChange={(e) =>
                                                    setNewEducation({
                                                        ...newEducation,
                                                        educationType: e.target.value as EducationType,

                                                        // Reset conditional fields when type changes
                                                        degree: '',
                                                        fieldOfStudy: '',
                                                        board: '',
                                                        percentage: ''
                                                    })
                                                }
                                                className="input"
                                            >

                                                <option value="">Select Type</option>
                                                <option value="School">School</option>
                                                <option value="College">College</option>
                                                <option value="University">University</option>
                                                <option value="Graduate">Graduate</option>


                                            </select>
                                        </div>
                                    </div>

                                    {/* Conditionally render additional fields based on educationType */}
                                    {newEducation.educationType === 'School' ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label htmlFor="new-board">Board</Label>
                                                    <Input
                                                        id="new-board"
                                                        value={newEducation.board || ''}
                                                        onChange={(e) =>
                                                            setNewEducation({ ...newEducation, board: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="new-percentage">Percentage</Label>
                                                    <Input
                                                        id="new-percentage"
                                                        value={newEducation.percentage || ''}
                                                        onChange={(e) =>
                                                            setNewEducation({ ...newEducation, percentage: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label htmlFor="new-degree">Degree</Label>
                                                    <Input
                                                        id="new-degree"
                                                        value={newEducation.degree || ''}
                                                        onChange={(e) =>
                                                            setNewEducation({ ...newEducation, degree: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="new-fieldOfStudy">Field of Study</Label>
                                                    <Input
                                                        id="new-fieldOfStudy"
                                                        value={newEducation.fieldOfStudy || ''}
                                                        onChange={(e) =>
                                                            setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Common fields for both types */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-location">Location</Label>
                                            <Input
                                                id="new-location"
                                                value={newEducation.location}
                                                onChange={(e) =>
                                                    setNewEducation({ ...newEducation, location: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-startDate">Start Date</Label>
                                            <Input
                                                id="new-startDate"
                                                type="date"
                                                value={newEducation.startDate}
                                                onChange={(e) =>
                                                    setNewEducation({ ...newEducation, startDate: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-endDate">End Date</Label>
                                            <Input
                                                id="new-endDate"
                                                type="date"
                                                value={newEducation.endDate}
                                                onChange={(e) =>
                                                    setNewEducation({ ...newEducation, endDate: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-gpa">GPA</Label>
                                            <Input
                                                id="new-gpa"
                                                value={newEducation.gpa || ''}
                                                onChange={(e) =>
                                                    setNewEducation({ ...newEducation, gpa: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="new-description">Description</Label>
                                        <Textarea
                                            id="new-description"
                                            value={newEducation.description || ''}
                                            onChange={(e) =>
                                                setNewEducation({ ...newEducation, description: e.target.value })
                                            }
                                            rows={4}
                                        />
                                    </div>
                                    <Button onClick={addEducation}>Add Education</Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


                {/* Work Experience Section */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="work-experience">
                        <AccordionTrigger>
                            <h3 className="text-xl font-medium">Work Experience</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6">
                                {workExperience.map(exp => (
                                    <Accordion type="single" collapsible key={exp.id}>
                                        <AccordionItem value={exp.id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center justify-between w-full">
                                                    <h4 className="text-lg font-medium">{exp.position} at {exp.company}</h4>
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); deleteWorkExperience(exp.id); }}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`company-${exp.id}`}>Company</Label>
                                                        <Input
                                                            id={`company-${exp.id}`}
                                                            value={exp.company}
                                                            onChange={(e) => setWorkExperience(workExperience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`position-${exp.id}`}>Position</Label>
                                                        <Input
                                                            id={`position-${exp.id}`}
                                                            value={exp.position}
                                                            onChange={(e) => setWorkExperience(workExperience.map(item => item.id === exp.id ? { ...item, position: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`location-${exp.id}`}>Location</Label>
                                                        <Input
                                                            id={`location-${exp.id}`}
                                                            value={exp.location}
                                                            onChange={(e) => setWorkExperience(workExperience.map(item => item.id === exp.id ? { ...item, location: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                                                        <Input
                                                            id={`startDate-${exp.id}`}
                                                            type="date"
                                                            value={exp.startDate}
                                                            onChange={(e) => setWorkExperience(workExperience.map(item => item.id === exp.id ? { ...item, startDate: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                                                        <Input
                                                            id={`endDate-${exp.id}`}
                                                            type="date"
                                                            value={exp.endDate}
                                                            onChange={(e) => setWorkExperience(workExperience.map(item => item.id === exp.id ? { ...item, endDate: e.target.value } : item))}
                                                            disabled={exp.isCurrentPosition}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`isCurrentPosition-${exp.id}`}>Current Position</Label>
                                                        <input
                                                            id={`isCurrentPosition-${exp.id}`}
                                                            type="checkbox"
                                                            checked={exp.isCurrentPosition}
                                                            onChange={(e) => setWorkExperience(workExperience.map(item => item.id === exp.id ? { ...item, isCurrentPosition: e.target.checked, endDate: e.target.checked ? '' : item.endDate } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor={`description-${exp.id}`}>Description</Label>
                                                    <Textarea
                                                        id={`description-${exp.id}`}
                                                        value={exp.description}
                                                        onChange={(e) => setWorkExperience(workExperience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item))}
                                                        rows={4}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`achievements-${exp.id}`}>Achievements</Label>
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            id={`achievements-${exp.id}`}
                                                            value={achievementInputs[exp.id] || ''}
                                                            onChange={(e) => setAchievementInputs({ ...achievementInputs, [exp.id]: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && achievementInputs[exp.id]?.trim()) {
                                                                    e.preventDefault();
                                                                    addAchievementToWorkExperience(exp.id, achievementInputs[exp.id].trim());
                                                                    setAchievementInputs({ ...achievementInputs, [exp.id]: '' });
                                                                }
                                                            }}
                                                            placeholder="Type an achievement and press Enter"
                                                        />
                                                        <Button onClick={() => {
                                                            if (achievementInputs[exp.id]?.trim()) {
                                                                addAchievementToWorkExperience(exp.id, achievementInputs[exp.id].trim());
                                                                setAchievementInputs({ ...achievementInputs, [exp.id]: '' });
                                                            }
                                                        }} type="button">
                                                            Add
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {exp.achievements.map((achievement) => (
                                                            <Badge
                                                                key={achievement}
                                                                variant="secondary"
                                                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                                onClick={() => removeAchievementFromWorkExperience(exp.id, achievement)}
                                                            >
                                                                {achievement} ×
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium">Add New Work Experience</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-company">Company</Label>
                                            <Input
                                                id="new-company"
                                                value={newWorkExperience.company}
                                                onChange={(e) => setNewWorkExperience({ ...newWorkExperience, company: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-position">Position</Label>
                                            <Input
                                                id="new-position"
                                                value={newWorkExperience.position}
                                                onChange={(e) => setNewWorkExperience({ ...newWorkExperience, position: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-location">Location</Label>
                                            <Input
                                                id="new-location"
                                                value={newWorkExperience.location}
                                                onChange={(e) => setNewWorkExperience({ ...newWorkExperience, location: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-startDate">Start Date</Label>
                                            <Input
                                                id="new-startDate"
                                                type="date"
                                                value={newWorkExperience.startDate}
                                                onChange={(e) => setNewWorkExperience({ ...newWorkExperience, startDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-endDate">End Date</Label>
                                            <Input
                                                id="new-endDate"
                                                type="date"
                                                value={newWorkExperience.endDate}
                                                onChange={(e) => setNewWorkExperience({ ...newWorkExperience, endDate: e.target.value })}
                                                disabled={newWorkExperience.isCurrentPosition}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-isCurrentPosition">Current Position</Label>
                                            <input
                                                id="new-isCurrentPosition"
                                                type="checkbox"
                                                checked={newWorkExperience.isCurrentPosition}
                                                onChange={(e) => setNewWorkExperience({ ...newWorkExperience, isCurrentPosition: e.target.checked, endDate: e.target.checked ? '' : newWorkExperience.endDate })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="new-description">Description</Label>
                                        <Textarea
                                            id="new-description"
                                            value={newWorkExperience.description}
                                            onChange={(e) => setNewWorkExperience({ ...newWorkExperience, description: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-achievements">Achievements</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="new-achievements"
                                                value={newAchievementInput}
                                                onChange={(e) => setNewAchievementInput(e.target.value)}
                                                onKeyDown={handleAddNewWorkExperienceAchievement}
                                                placeholder="Type an achievement and press Enter"
                                            />
                                            <Button onClick={() => handleAddNewWorkExperienceAchievement({ key: 'Enter', preventDefault: () => { } } as React.KeyboardEvent<HTMLInputElement>)} type="button">
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {newWorkExperience.achievements.map((achievement) => (
                                                <Badge
                                                    key={achievement}
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                    onClick={() => removeNewWorkExperienceAchievement(achievement)}
                                                >
                                                    {achievement} ×
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button onClick={addWorkExperience}>Add Work Experience</Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Projects Section */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="projects">
                        <AccordionTrigger>
                            <h3 className="text-xl font-medium">Projects</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6">
                                {projects.map(proj => (
                                    <Accordion type="single" collapsible key={proj.id}>
                                        <AccordionItem value={proj.id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center justify-between w-full">
                                                    <h4 className="text-lg font-medium">{proj.title}</h4>
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`title-${proj.id}`}>Title</Label>
                                                        <Input
                                                            id={`title-${proj.id}`}
                                                            value={proj.title}
                                                            onChange={(e) => setProjects(projects.map(item => item.id === proj.id ? { ...item, title: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`startDate-${proj.id}`}>Start Date</Label>
                                                        <Input
                                                            id={`startDate-${proj.id}`}
                                                            type="date"
                                                            value={proj.startDate}
                                                            onChange={(e) => setProjects(projects.map(item => item.id === proj.id ? { ...item, startDate: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`endDate-${proj.id}`}>End Date</Label>
                                                        <Input
                                                            id={`endDate-${proj.id}`}
                                                            type="date"
                                                            value={proj.endDate}
                                                            onChange={(e) => setProjects(projects.map(item => item.id === proj.id ? { ...item, endDate: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`imageUrl-${proj.id}`}>Image URL</Label>
                                                        <Input
                                                            id={`imageUrl-${proj.id}`}
                                                            value={proj.imageUrl}
                                                            onChange={(e) => setProjects(projects.map(item => item.id === proj.id ? { ...item, imageUrl: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor={`description-${proj.id}`}>Description</Label>
                                                    <Textarea
                                                        id={`description-${proj.id}`}
                                                        value={proj.description}
                                                        onChange={(e) => setProjects(projects.map(item => item.id === proj.id ? { ...item, description: e.target.value } : item))}
                                                        rows={4}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`technologies-${proj.id}`}>Technologies</Label>
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            id={`technologies-${proj.id}`}
                                                            value={techInputs[proj.id] || ''}
                                                            onChange={(e) => setTechInputs({ ...techInputs, [proj.id]: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && techInputs[proj.id]?.trim()) {
                                                                    e.preventDefault();
                                                                    addTechnologyToProject(proj.id, techInputs[proj.id].trim());
                                                                    setTechInputs({ ...techInputs, [proj.id]: '' });
                                                                }
                                                            }}
                                                            placeholder="Type a technology and press Enter"
                                                        />
                                                        <Button onClick={() => {
                                                            if (techInputs[proj.id]?.trim()) {
                                                                addTechnologyToProject(proj.id, techInputs[proj.id].trim());
                                                                setTechInputs({ ...techInputs, [proj.id]: '' });
                                                            }
                                                        }} type="button">
                                                            Add
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {proj.technologies.map((tech) => (
                                                            <Badge
                                                                key={tech}
                                                                variant="secondary"
                                                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                                onClick={() => removeTechnologyFromProject(proj.id, tech)}
                                                            >
                                                                {tech} ×
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor={`highlights-${proj.id}`}>Highlights</Label>
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            id={`highlights-${proj.id}`}
                                                            value={highlightInputs[proj.id] || ''}
                                                            onChange={(e) => setHighlightInputs({ ...highlightInputs, [proj.id]: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && highlightInputs[proj.id]?.trim()) {
                                                                    e.preventDefault();
                                                                    addHighlightToProject(proj.id, highlightInputs[proj.id].trim());
                                                                    setHighlightInputs({ ...highlightInputs, [proj.id]: '' });
                                                                }
                                                            }}
                                                            placeholder="Type a highlight and press Enter"
                                                        />
                                                        <Button onClick={() => {
                                                            if (highlightInputs[proj.id]?.trim()) {
                                                                addHighlightToProject(proj.id, highlightInputs[proj.id].trim());
                                                                setHighlightInputs({ ...highlightInputs, [proj.id]: '' });
                                                            }
                                                        }} type="button">
                                                            Add
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {proj.highlights.map((highlight) => (
                                                            <Badge
                                                                key={highlight}
                                                                variant="secondary"
                                                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                                onClick={() => removeHighlightFromProject(proj.id, highlight)}
                                                            >
                                                                {highlight} ×
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium">Add New Project</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-title">Title</Label>
                                            <Input
                                                id="new-title"
                                                value={newProject.title}
                                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-startDate">Start Date</Label>
                                            <Input
                                                id="new-startDate"
                                                type="date"
                                                value={newProject.startDate}
                                                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-endDate">End Date</Label>
                                            <Input
                                                id="new-endDate"
                                                type="date"
                                                value={newProject.endDate}
                                                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-imageUrl">Image URL</Label>
                                            <Input
                                                id="new-imageUrl"
                                                value={newProject.imageUrl}
                                                onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="new-description">Description</Label>
                                        <Textarea
                                            id="new-description"
                                            value={newProject.description}
                                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-technologies">Technologies</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="new-technologies"
                                                value={newTechInput}
                                                onChange={(e) => setNewTechInput(e.target.value)}
                                                onKeyDown={handleAddNewProjectTechnology}
                                                placeholder="Type a technology and press Enter"
                                            />
                                            <Button onClick={() => handleAddNewProjectTechnology({ key: 'Enter', preventDefault: () => { } } as React.KeyboardEvent<HTMLInputElement>)} type="button">
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {newProject.technologies.map((tech) => (
                                                <Badge
                                                    key={tech}
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                    onClick={() => removeNewProjectTechnology(tech)}
                                                >
                                                    {tech} ×
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="new-highlights">Highlights</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="new-highlights"
                                                value={newHighlightInput}
                                                onChange={(e) => setNewHighlightInput(e.target.value)}
                                                onKeyDown={handleAddNewProjectHighlight}
                                                placeholder="Type a highlight and press Enter"
                                            />
                                            <Button onClick={() => handleAddNewProjectHighlight({ key: 'Enter', preventDefault: () => { } } as React.KeyboardEvent<HTMLInputElement>)} type="button">
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {newProject.highlights.map((highlight) => (
                                                <Badge
                                                    key={highlight}
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                    onClick={() => removeNewProjectHighlight(highlight)}
                                                >
                                                    {highlight} ×
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Button onClick={addProject}>Add Project</Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Certificates Section */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="certificates">
                        <AccordionTrigger>
                            <h3 className="text-xl font-medium">Certificates</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6">
                                {certificates.map(cert => (
                                    <Accordion type="single" collapsible key={cert.id}>
                                        <AccordionItem value={cert.id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center justify-between w-full">
                                                    <h4 className="text-lg font-medium">{cert.name}</h4>
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); deleteCertificate(cert.id); }}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`name-${cert.id}`}>Name</Label>
                                                        <Input
                                                            id={`name-${cert.id}`}
                                                            value={cert.name}
                                                            onChange={(e) => setCertificates(certificates.map(item => item.id === cert.id ? { ...item, name: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`issuer-${cert.id}`}>Issuer</Label>
                                                        <Input
                                                            id={`issuer-${cert.id}`}
                                                            value={cert.issuer}
                                                            onChange={(e) => setCertificates(certificates.map(item => item.id === cert.id ? { ...item, issuer: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`issueDate-${cert.id}`}>Issue Date</Label>
                                                        <Input
                                                            id={`issueDate-${cert.id}`}
                                                            type="date"
                                                            value={cert.issueDate}
                                                            onChange={(e) => setCertificates(certificates.map(item => item.id === cert.id ? { ...item, issueDate: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`expiryDate-${cert.id}`}>Expiry Date</Label>
                                                        <Input
                                                            id={`expiryDate-${cert.id}`}
                                                            type="date"
                                                            value={cert.expiryDate}
                                                            onChange={(e) => setCertificates(certificates.map(item => item.id === cert.id ? { ...item, expiryDate: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor={`credentialUrl-${cert.id}`}>Credential URL</Label>
                                                    <Input
                                                        id={`credentialUrl-${cert.id}`}
                                                        value={cert.credentialUrl}
                                                        onChange={(e) => setCertificates(certificates.map(item => item.id === cert.id ? { ...item, credentialUrl: e.target.value } : item))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`description-${cert.id}`}>Description</Label>
                                                    <Textarea
                                                        id={`description-${cert.id}`}
                                                        value={cert.description}
                                                        onChange={(e) => setCertificates(certificates.map(item => item.id === cert.id ? { ...item, description: e.target.value } : item))}
                                                        rows={4}
                                                    />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium">Add New Certificate</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-name">Name</Label>
                                            <Input
                                                id="new-name"
                                                value={newCertificate.name}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-issuer">Issuer</Label>
                                            <Input
                                                id="new-issuer"
                                                value={newCertificate.issuer}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-issueDate">Issue Date</Label>
                                            <Input
                                                id="new-issueDate"
                                                type="date"
                                                value={newCertificate.issueDate}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-expiryDate">Expiry Date</Label>
                                            <Input
                                                id="new-expiryDate"
                                                type="date"
                                                value={newCertificate.expiryDate}
                                                onChange={(e) => setNewCertificate({ ...newCertificate, expiryDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="new-credentialUrl">Credential URL</Label>
                                        <Input
                                            id="new-credentialUrl"
                                            value={newCertificate.credentialUrl}
                                            onChange={(e) => setNewCertificate({ ...newCertificate, credentialUrl: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-description">Description</Label>
                                        <Textarea
                                            id="new-description"
                                            value={newCertificate.description}
                                            onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                    <Button onClick={addCertificate}>Add Certificate</Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* References Section */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="references">
                        <AccordionTrigger>
                            <h3 className="text-xl font-medium">References</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6">
                                {references.map(ref => (
                                    <Accordion type="single" collapsible key={ref.id}>
                                        <AccordionItem value={ref.id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center justify-between w-full">
                                                    <h4 className="text-lg font-medium">{ref.name}</h4>
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); deleteReference(ref.id); }}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`name-${ref.id}`}>Name</Label>
                                                        <Input
                                                            id={`name-${ref.id}`}
                                                            value={ref.name}
                                                            onChange={(e) => setReferences(references.map(item => item.id === ref.id ? { ...item, name: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`position-${ref.id}`}>Position</Label>
                                                        <Input
                                                            id={`position-${ref.id}`}
                                                            value={ref.position}
                                                            onChange={(e) => setReferences(references.map(item => item.id === ref.id ? { ...item, position: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`company-${ref.id}`}>Company</Label>
                                                        <Input
                                                            id={`company-${ref.id}`}
                                                            value={ref.company}
                                                            onChange={(e) => setReferences(references.map(item => item.id === ref.id ? { ...item, company: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`email-${ref.id}`}>Email</Label>
                                                        <Input
                                                            id={`email-${ref.id}`}
                                                            value={ref.email}
                                                            onChange={(e) => setReferences(references.map(item => item.id === ref.id ? { ...item, email: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`phone-${ref.id}`}>Phone</Label>
                                                        <Input
                                                            id={`phone-${ref.id}`}
                                                            value={ref.phone}
                                                            onChange={(e) => setReferences(references.map(item => item.id === ref.id ? { ...item, phone: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`relationship-${ref.id}`}>Relationship</Label>
                                                        <Input
                                                            id={`relationship-${ref.id}`}
                                                            value={ref.relationship}
                                                            onChange={(e) => setReferences(references.map(item => item.id === ref.id ? { ...item, relationship: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium">Add New Reference</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-name">Name</Label>
                                            <Input
                                                id="new-name"
                                                value={newReference.name}
                                                onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-position">Position</Label>
                                            <Input
                                                id="new-position"
                                                value={newReference.position}
                                                onChange={(e) => setNewReference({ ...newReference, position: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-company">Company</Label>
                                            <Input
                                                id="new-company"
                                                value={newReference.company}
                                                onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-email">Email</Label>
                                            <Input
                                                id="new-email"
                                                value={newReference.email}
                                                onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-phone">Phone</Label>
                                            <Input
                                                id="new-phone"
                                                value={newReference.phone}
                                                onChange={(e) => setNewReference({ ...newReference, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-relationship">Relationship</Label>
                                            <Input
                                                id="new-relationship"
                                                value={newReference.relationship}
                                                onChange={(e) => setNewReference({ ...newReference, relationship: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={addReference}>Add Reference</Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Awards Section */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="awards">
                        <AccordionTrigger>
                            <h3 className="text-xl font-medium">Awards</h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6">
                                {awards.map(award => (
                                    <Accordion type="single" collapsible key={award.id}>
                                        <AccordionItem value={award.id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center justify-between w-full">
                                                    <h4 className="text-lg font-medium">{award.title}</h4>
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); deleteAward(award.id); }}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor={`title-${award.id}`}>Title</Label>
                                                        <Input
                                                            id={`title-${award.id}`}
                                                            value={award.title}
                                                            onChange={(e) => setAwards(awards.map(item => item.id === award.id ? { ...item, title: e.target.value } : item))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`issuer-${award.id}`}>Issuer</Label>
                                                        <Input
                                                            id={`issuer-${award.id}`}
                                                            value={award.issuer}
                                                            onChange={(e) => setAwards(awards.map(item => item.id === award.id ? { ...item, issuer: e.target.value } : item))}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor={`date-${award.id}`}>Date</Label>
                                                    <Input
                                                        id={`date-${award.id}`}
                                                        type="date"
                                                        value={award.date}
                                                        onChange={(e) => setAwards(awards.map(item => item.id === award.id ? { ...item, date: e.target.value } : item))}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`description-${award.id}`}>Description</Label>
                                                    <Textarea
                                                        id={`description-${award.id}`}
                                                        value={award.description}
                                                        onChange={(e) => setAwards(awards.map(item => item.id === award.id ? { ...item, description: e.target.value } : item))}
                                                        rows={4}
                                                    />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium">Add New Award</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="new-title">Title</Label>
                                            <Input
                                                id="new-title"
                                                value={newAward.title}
                                                onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-issuer">Issuer</Label>
                                            <Input
                                                id="new-issuer"
                                                value={newAward.issuer}
                                                onChange={(e) => setNewAward({ ...newAward, issuer: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="new-date">Date</Label>
                                        <Input
                                            id="new-date"
                                            type="date"
                                            value={newAward.date}
                                            onChange={(e) => setNewAward({ ...newAward, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-description">Description</Label>
                                        <Textarea
                                            id="new-description"
                                            value={newAward.description}
                                            onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
                                            rows={4}
                                        />
                                    </div>
                                    <Button onClick={addAward}>Add Award</Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Error Display */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Profile
                </Button>
            </CardFooter>
        </Card>
    );
};