/* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client'

// import { useEffect, useState } from 'react'
// import { collection, doc, getDoc, getDocs, query, where, addDoc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { UserProfile, Project } from '@/types/profile'
// import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
// import { Button } from '@/components/ui/button'
// import { Github, Linkedin, Mail, Globe, ChevronRight, Download, Code, ExternalLink, Award, Phone } from 'lucide-react'
// import Image from 'next/image'
// import { Card, CardContent } from '@/components/ui/card';
// import { cn } from '@/lib/utils'
// import { Input } from './ui/input'
// import { Textarea } from './ui/textarea'

// export default function PortfolioPage({ username }: { username: string }) {
//     const [profile, setProfile] = useState<UserProfile | null>(null)
//     const [projects, setProjects] = useState<Project[]>([])
//     const [loading, setLoading] = useState(true)
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [activeSection, setActiveSection] = useState('home')
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//     const { scrollYProgress } = useScroll()
//     const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

//     // Contact form states
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         message: ''
//     })
//     const [sending, setSending] = useState(false)
//     const [formMessage, setFormMessage] = useState({ text: '', type: '' })

//     useEffect(() => {
//         const fetchPortfolioData = async () => {
//             try {
//                 const usernameDoc = await getDoc(doc(db, 'portfolioUsernames', username))
//                 if (!usernameDoc.exists()) throw new Error('Portfolio not found')

//                 const userId = usernameDoc.data().userId
//                 const [profileDoc, projectsQuery] = await Promise.all([
//                     getDoc(doc(db, 'profiles', userId)),
//                     getDocs(query(collection(db, 'projects'), where('userId', '==', userId)))
//                 ])

//                 if (profileDoc.exists()) setProfile(profileDoc.data() as UserProfile)
//                 setProjects(projectsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project))
//             } catch (error) {
//                 console.error('Error fetching portfolio:', error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchPortfolioData()
//     }, [username])

//     const sections = [
//         { id: 'home', name: 'Home' },
//         { id: 'expertise', name: 'Expertise' },
//         { id: 'work', name: 'Work' },
//         { id: 'contact', name: 'Contact' }
//     ]

//     const scrollToSection = (sectionId: string) => {
//         document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
//         setMobileMenuOpen(false)
//     }

//     // Handle form changes
//     const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target
//         setFormData(prev => ({ ...prev, [name]: value }))
//     }

//     // Handle form submission
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         if (!profile) return

//         const { name, email, message } = formData

//         // Validate form
//         if (!name.trim() || !email.trim() || !message.trim()) {
//             setFormMessage({ text: 'Please fill in all fields', type: 'error' })
//             return
//         }

//         setSending(true)
//         setFormMessage({ text: '', type: '' })

//         try {
//             // Get the user ID from the username
//             const usernameDoc = await getDoc(doc(db, 'portfolioUsernames', username))

//             if (!usernameDoc.exists()) {
//                 throw new Error('Portfolio owner not found')
//             }

//             const recipientId = usernameDoc.data().userId

//             // Add the message to Firestore
//             await addDoc(collection(db, 'portfolioMessages'), {
//                 name,
//                 email,
//                 message,
//                 recipientId,
//                 createdAt: new Date(),
//                 isRead: false
//             })

//             // Reset form
//             setFormData({ name: '', email: '', message: '' })
//             setFormMessage({ text: 'Message sent successfully! Thank you for reaching out.', type: 'success' })
//         } catch (error) {
//             console.error('Error sending message:', error)
//             setFormMessage({ text: 'Failed to send message. Please try again.', type: 'error' })
//         } finally {
//             setSending(false)
//         }
//     }

//     if (loading)
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-background">
//                 <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
//                     className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
//                 />
//             </div>
//         )

//     if (!profile)
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-background">
//                 <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
//                 <p className="text-muted-foreground">The requested portfolio does not exist.</p>
//             </div>
//         )

//     return (
//         <div className="min-h-screen bg-background">
//             {/* Progress Bar */}
//             <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left" />

//             {/* Floating Navigation */}
//             <nav className="fixed top-8 right-8 z-50 hidden lg:block">
//                 <div className="flex flex-col gap-4 items-end">
//                     {sections.map((section) => (
//                         <motion.button
//                             key={section.id}
//                             onClick={() => scrollToSection(section.id)}
//                             whileHover={{ x: -10 }}
//                             className={cn(
//                                 'flex items-center gap-2 text-sm font-medium transition-colors',
//                                 activeSection === section.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
//                             )}
//                         >
//                             <span>{section.name}</span>
//                             <div
//                                 className={cn(
//                                     'w-2 h-2 rounded-full transition-colors',
//                                     activeSection === section.id ? 'bg-primary' : 'bg-muted'
//                                 )}
//                             />
//                         </motion.button>
//                     ))}
//                 </div>
//             </nav>

//             {/* Mobile Navigation */}
//             <nav className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md lg:hidden border-b">
//                 <div className="container flex justify-between items-center h-16 px-4">
//                     <span className="font-semibold">{profile.displayName.split(' ')[0]}</span>
//                     <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
//                         <div className="w-6 flex flex-col gap-1">
//                             <span
//                                 className={`h-0.5 bg-foreground transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
//                                     }`}
//                             />
//                             <span className={`h-0.5 bg-foreground transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
//                             <span
//                                 className={`h-0.5 bg-foreground transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
//                                     }`}
//                             />
//                         </div>
//                     </button>
//                 </div>

//                 <AnimatePresence>
//                     {mobileMenuOpen && (
//                         <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: 'auto' }}
//                             exit={{ opacity: 0, height: 0 }}
//                             className="container px-4 pb-4"
//                         >
//                             <div className="flex flex-col gap-2 mt-4">
//                                 {sections.map((section) => (
//                                     <button
//                                         key={section.id}
//                                         onClick={() => scrollToSection(section.id)}
//                                         className={cn(
//                                             'p-3 text-left rounded-lg transition-colors',
//                                             activeSection === section.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
//                                         )}
//                                     >
//                                         {section.name}
//                                     </button>
//                                 ))}
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </nav>

//             {/* Hero Section */}
//             <section id="home" className="min-h-screen flex items-center pt-20 pb-16">
//                 <div className="container px-4">
//                     <div className="grid lg:grid-cols-2 gap-12 items-center">
//                         <motion.div
//                             initial={{ opacity: 0, x: -50 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.8 }}
//                             className="space-y-6"
//                         >
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ delay: 0.4 }}
//                                 className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full"
//                             >
//                                 <Award className="h-5 w-5" />
//                                 <span>{profile.skills[0]} Developer</span>
//                             </motion.div>

//                             <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//                                 Turning Vision Into
//                                 <motion.span
//                                     initial={{ backgroundSize: '0% 100%' }}
//                                     animate={{ backgroundSize: '100% 100%' }}
//                                     transition={{ duration: 1.5, delay: 0.2 }}
//                                     className="bg-gradient-to-r from-primary to-primary/30 bg-no-repeat bg-left-bottom ml-2"
//                                 >
//                                     Reality
//                                 </motion.span>
//                             </h1>

//                             <p className="text-xl text-muted-foreground max-w-2xl">{profile.bio}</p>

//                             <div className="flex gap-4">
//                                 <Button onClick={() => scrollToSection('contact')} className="gap-2">
//                                     Lets Connect <ChevronRight className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="outline" className="gap-2">
//                                     Download CV <Download className="h-4 w-4" />
//                                 </Button>
//                             </div>
//                         </motion.div>

//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.8 }}
//                             className="relative h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-80 lg:w-80 mx-auto"
//                         >
//                             {/* Gradient Background */}
//                             <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent rounded-full blur-3xl opacity-20" />

//                             {/* Avatar Container */}
//                             <div className="relative h-full w-full rounded-full overflow-hidden border-4 sm:border-6 md:border-8 border-background shadow-xl">
//                                 <Image
//                                     src={profile.avatarUrl || '/default-avatar.png'}
//                                     alt={profile.displayName}
//                                     layout="fill"
//                                     className="object-cover"
//                                     priority
//                                 />
//                             </div>
//                         </motion.div>
//                     </div>
//                 </div>
//             </section>

//             {/* Expertise Section */}
//             <section id="expertise" className="py-20 bg-muted">
//                 <div className="container px-4">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         className="mb-16 text-center"
//                     >
//                         <h2 className="text-3xl font-bold mb-4">Technical Expertise</h2>
//                         <p className="text-muted-foreground max-w-xl mx-auto">
//                             Mastering the tools and technologies that power modern solutions
//                         </p>
//                     </motion.div>

//                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {profile.skills.map((skill, index) => (
//                             <motion.div
//                                 key={skill}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: index * 0.1 }}
//                                 className="bg-card p-6 rounded-xl border hover:border-primary/50 transition-all group"
//                             >
//                                 <div className="flex items-center gap-4 mb-4">
//                                     <div className="p-3 bg-primary/10 rounded-lg">
//                                         <Code className="h-6 w-6 text-primary" />
//                                     </div>
//                                     <h3 className="text-xl font-semibold">{skill}</h3>
//                                 </div>
//                                 <p className="text-muted-foreground">
//                                     Leveraging {skill} to build scalable and efficient solutions that drive business value.
//                                 </p>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Work Section */}
//             <section id="work" className="py-20">
//                 <div className="container px-4">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         className="mb-16 text-center"
//                     >
//                         <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
//                         <p className="text-muted-foreground max-w-xl mx-auto">
//                             A curated selection of my most impactful work
//                         </p>
//                     </motion.div>

//                     <div className="grid md:grid-cols-2 gap-8">
//                         {projects.map((project, index) => (
//                             <motion.div
//                                 key={project.id}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: index * 0.1 }}
//                                 className="group relative overflow-hidden rounded-xl border bg-card"
//                             >
//                                 <div className="relative h-64">
//                                     <Image
//                                         src={project.imageUrl || '/default-project.png'}
//                                         alt={project.projectName}
//                                         fill
//                                         className="object-cover group-hover:scale-105 transition-transform"
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
//                                 </div>

//                                 <div className="p-6">
//                                     <div className="flex items-center justify-between mb-4">
//                                         <h3 className="text-xl font-semibold">{project.projectName}</h3>
//                                         <div className="flex gap-2">
//                                             {project.repoUrl && (
//                                                 <Button variant="ghost" size="icon" asChild>
//                                                     <a href={project.repoUrl} target="_blank">
//                                                         <Github className="h-5 w-5" />
//                                                     </a>
//                                                 </Button>
//                                             )}
//                                             {project.repoUrl && (
//                                                 <Button variant="ghost" size="icon" asChild>
//                                                     <a href={project.repoUrl} target="_blank">
//                                                         <ExternalLink className="h-5 w-5" />
//                                                     </a>
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <p className="text-muted-foreground mb-4">{project.description}</p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {Array.isArray(project.techStack)
//                                             ? project.techStack.map((tech: string) => (
//                                                 <span key={tech} className="px-3 py-1 text-sm rounded-full bg-muted">
//                                                     {tech}
//                                                 </span>
//                                             ))
//                                             : profile.skills.slice(0, 3).map((tech: string) => (
//                                                 <span key={tech} className="px-3 py-1 text-sm rounded-full bg-muted">
//                                                     {tech}
//                                                 </span>
//                                             ))}
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Contact Section */}
//             <section id="contact" className="py-20 bg-muted">
//                 <div className="container px-4">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         className="mb-16 text-center"
//                     >
//                         <h2 className="text-3xl font-bold mb-4">Let&apos;s Connect</h2>
//                         <p className="text-muted-foreground max-w-xl mx-auto">
//                             Have a project in mind? Let&apos;s make it happen.
//                         </p>
//                     </motion.div>

//                     <div className="max-w-3xl mx-auto space-y-8">
//                         {/* Contact Info */}
//                         <div className="flex flex-wrap gap-2 justify-center sm:justify-center bg-card p-6 rounded-xl border shadow-sm">
//                             <div className="flex flex-col sm:flex-row items-center gap-4">
//                                 <div className="p-4 bg-primary/10 rounded-xl">
//                                     <Mail className="h-8 w-8 text-primary" />
//                                 </div>
//                                 <div className="text-center sm:text-left">
//                                     <h3 className="text-xl font-semibold">Email</h3>
//                                     <p className="text-muted-foreground break-all">{profile.emailAddress}</p>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col sm:flex-row items-center gap-4">
//                                 <div className="p-4 bg-primary/10 rounded-xl">
//                                     <Phone className="h-8 w-8 text-primary" />
//                                 </div>
//                                 <div className="text-center sm:text-left">
//                                     <h3 className="text-xl font-semibold">Phone</h3>
//                                     <p className="text-muted-foreground">{profile.phoneNumber}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Social Presence */}
//                         <div className="space-y-4 p-4 bg-card rounded-xl border shadow-sm">
//                             <h3 className="flex flex-wrap gap-2 justify-center sm:justify-center">
//                                 Social Presence
//                             </h3>
//                             <div className="flex flex-wrap gap-2 justify-center sm:justify-center">
//                                 {profile.socialLinks.github && (
//                                     <Button
//                                         variant="outline"
//                                         className="w-full sm:w-auto flex items-center justify-center gap-2"
//                                         asChild
//                                     >
//                                         <a
//                                             href={profile.socialLinks.github}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                         >
//                                             <Github className="h-5 w-5" /> GitHub
//                                         </a>
//                                     </Button>
//                                 )}
//                                 {profile.socialLinks.linkedin && (
//                                     <Button
//                                         variant="outline"
//                                         className="w-full sm:w-auto flex items-center justify-center gap-2"
//                                         asChild
//                                     >
//                                         <a
//                                             href={profile.socialLinks.linkedin}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                         >
//                                             <Linkedin className="h-5 w-5" /> LinkedIn
//                                         </a>
//                                     </Button>
//                                 )}
//                                 {profile.socialLinks.portfolio && (
//                                     <Button
//                                         variant="outline"
//                                         className="w-full sm:w-auto flex items-center justify-center gap-2"
//                                         asChild
//                                     >
//                                         <a
//                                             href={profile.socialLinks.portfolio}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                         >
//                                             <Globe className="h-5 w-5" /> Portfolio
//                                         </a>
//                                     </Button>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Contact Form */}
//                         {/* <div className="bg-card p-6 sm:p-8 rounded-xl border">
//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         placeholder="Your Name"
//                                         className="input"
//                                         value={formData.name}
//                                         onChange={handleFormChange}
//                                     />
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         placeholder="Your Email"
//                                         className="input"
//                                         value={formData.email}
//                                         onChange={handleFormChange}
//                                     />
//                                 </div>
//                                 <textarea
//                                     name="message"
//                                     placeholder="Your Message"
//                                     className="input"
//                                     rows={5}
//                                     value={formData.message}
//                                     onChange={handleFormChange}
//                                 />
//                                 {formMessage.text && (
//                                     <p className={formMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}>
//                                         {formMessage.text}
//                                     </p>
//                                 )}
//                                 <Button type="submit" disabled={sending}>
//                                     {sending ? 'Sending...' : 'Send Message'}
//                                 </Button>
//                             </form>
//                         </div> */}
//                         <Card className="max-w-lg w-full mx-auto shadow-lg border rounded-2xl p-6 md:p-8">
//                             <CardContent>
//                                 <h2 className="text-2xl font-semibold mb-4 text-center">Contact Us</h2>
//                                 <form onSubmit={handleSubmit} className="space-y-4">
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <Input
//                                             type="text"
//                                             name="name"
//                                             placeholder="Your Name"
//                                             value={formData.name}
//                                             onChange={handleFormChange}
//                                         />
//                                         <Input
//                                             type="email"
//                                             name="email"
//                                             placeholder="Your Email"
//                                             value={formData.email}
//                                             onChange={handleFormChange}
//                                         />
//                                     </div>
//                                     <Textarea
//                                         name="message"
//                                         placeholder="Your Message"
//                                         rows={5}
//                                         value={formData.message}
//                                         onChange={handleFormChange}
//                                     />
//                                     {formMessage.text && (
//                                         <p className={formMessage.type === "error" ? "text-red-500" : "text-green-500"}>
//                                             {formMessage.text}
//                                         </p>
//                                     )}
//                                     <Button type="submit" disabled={sending} className="w-full">
//                                         {sending ? "Sending..." : "Send Message"}
//                                     </Button>
//                                 </form>
//                             </CardContent>
//                         </Card>


//                     </div>
//                 </div>
//             </section>
//             {/* Footer */}
//             <footer className="py-8 border-t">
//                 <div className="container px-4 text-center">
//                     <p className="text-sm text-muted-foreground">
//                         © {new Date().getFullYear()} {profile.displayName}. All rights reserved.
//                     </p>
//                 </div>
//             </footer>
//         </div >

//     )
// }




"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, query, where, addDoc, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { UserProfile, Project } from "@/types/profile"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Github,
    Linkedin,
    Mail,
    Globe,
    ChevronRight,
    Download,
    Code,
    ExternalLink,
    Award,
    Phone,
    FileText,
    Calendar,
    ArrowRight,
    Tag,
} from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Define the type for blog posts
interface BlogPost {
    id: string
    title: string
    content: string
    excerpt: string
    coverImage: string
    tags: string[]
    status: "published" | "draft"
    createdAt: Date
    updatedAt: Date
    slug: string
}

export default function PortfolioPage({ username }: { username: string }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [activeSection, setActiveSection] = useState("home")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { scrollYProgress } = useScroll()
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

    // Contact form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })
    const [sending, setSending] = useState(false)
    const [formMessage, setFormMessage] = useState({ text: "", type: "" })

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const usernameDoc = await getDoc(doc(db, "portfolioUsernames", username))
                if (!usernameDoc.exists()) throw new Error("Portfolio not found")

                const userId = usernameDoc.data().userId
                const [profileDoc, projectsQuery, blogPostsQuery] = await Promise.all([
                    getDoc(doc(db, "profiles", userId)),
                    getDocs(query(collection(db, "projects"), where("userId", "==", userId))),
                    getDocs(
                        query(
                            collection(db, "portfolioBlogPosts"),
                            where("userId", "==", userId),
                            where("status", "==", "published"),
                            orderBy("createdAt", "desc"),
                            limit(6),
                        ),
                    ),
                ])

                if (profileDoc.exists()) setProfile(profileDoc.data() as UserProfile)
                setProjects(projectsQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project))

                // Set blog posts
                const posts = blogPostsQuery.docs.map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        excerpt: data.excerpt,
                        coverImage: data.coverImage,
                        tags: data.tags || [],
                        status: data.status,
                        createdAt: data.createdAt.toDate(),
                        updatedAt: data.updatedAt.toDate(),
                        slug: data.slug,
                    } as BlogPost
                })
                setBlogPosts(posts)
            } catch (error) {
                console.error("Error fetching portfolio:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPortfolioData()
    }, [username])

    const sections = [
        { id: "home", name: "Home" },
        { id: "expertise", name: "Expertise" },
        { id: "work", name: "Work" },
        { id: "blog", name: "Blog" },
        { id: "contact", name: "Contact" },
    ]

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
        setMobileMenuOpen(false)
    }

    // Handle form changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!profile) return

        const { name, email, message } = formData

        // Validate form
        if (!name.trim() || !email.trim() || !message.trim()) {
            setFormMessage({ text: "Please fill in all fields", type: "error" })
            return
        }

        setSending(true)
        setFormMessage({ text: "", type: "" })

        try {
            // Get the user ID from the username
            const usernameDoc = await getDoc(doc(db, "portfolioUsernames", username))

            if (!usernameDoc.exists()) {
                throw new Error("Portfolio owner not found")
            }

            const recipientId = usernameDoc.data().userId

            // Add the message to Firestore
            await addDoc(collection(db, "portfolioMessages"), {
                name,
                email,
                message,
                recipientId,
                createdAt: new Date(),
                isRead: false,
            })

            // Reset form
            setFormData({ name: "", email: "", message: "" })
            setFormMessage({ text: "Message sent successfully! Thank you for reaching out.", type: "success" })
        } catch (error) {
            console.error("Error sending message:", error)
            setFormMessage({ text: "Failed to send message. Please try again.", type: "error" })
        } finally {
            setSending(false)
        }
    }

    // Format date for display
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date)
    }

    // Format blog content for preview
    const formatBlogPreview = (content: string, maxLength = 150) => {
        // Remove markdown syntax
        const plainText = content
            .replace(/```[\s\S]*?```/g, "") // Remove code blocks
            .replace(/\[([^\]]+)\]$$([^)]+)$$/g, "$1") // Replace links with just the text
            .replace(/[*_~`]/g, "") // Remove formatting characters

        if (plainText.length <= maxLength) return plainText

        return plainText.substring(0, maxLength) + "..."
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        )

    if (!profile)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
                <p className="text-muted-foreground">The requested portfolio does not exist.</p>
            </div>
        )

    return (
        <div className="min-h-screen bg-background">
            {/* Progress Bar */}
            <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left" />

            {/* Floating Navigation */}
            <nav className="fixed top-8 right-8 z-50 hidden lg:block">
                <div className="flex flex-col gap-4 items-end">
                    {sections.map((section) => (
                        <motion.button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            whileHover={{ x: -10 }}
                            className={cn(
                                "flex items-center gap-2 text-sm font-medium transition-colors",
                                activeSection === section.id ? "text-primary" : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <span>{section.name}</span>
                            <div
                                className={cn(
                                    "w-2 h-2 rounded-full transition-colors",
                                    activeSection === section.id ? "bg-primary" : "bg-muted",
                                )}
                            />
                        </motion.button>
                    ))}
                </div>
            </nav>

            {/* Mobile Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md lg:hidden border-b">
                <div className="container flex justify-between items-center h-16 px-4">
                    <span className="font-semibold">{profile.displayName.split(" ")[0]}</span>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                        <div className="w-6 flex flex-col gap-1">
                            <span
                                className={`h-0.5 bg-foreground transition-all ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                            />
                            <span className={`h-0.5 bg-foreground transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
                            <span
                                className={`h-0.5 bg-foreground transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                            />
                        </div>
                    </button>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="container px-4 pb-4"
                        >
                            <div className="flex flex-col gap-2 mt-4">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={cn(
                                            "p-3 text-left rounded-lg transition-colors",
                                            activeSection === section.id ? "bg-primary/10 text-primary" : "hover:bg-muted",
                                        )}
                                    >
                                        {section.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center pt-20 pb-16">
                <div className="container px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full"
                            >
                                <Award className="h-5 w-5" />
                                <span>{profile.jobTitle} Developer</span>
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                Turning Vision Into
                                <motion.span
                                    initial={{ backgroundSize: "0% 100%" }}
                                    animate={{ backgroundSize: "100% 100%" }}
                                    transition={{ duration: 1.5, delay: 0.2 }}
                                    className="bg-gradient-to-r from-primary to-primary/30 bg-no-repeat bg-left-bottom ml-2"
                                >
                                    Reality
                                </motion.span>
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-2xl">{profile.bio}</p>



                            <div className="flex gap-4">
                                <Button onClick={() => scrollToSection("contact")} className="gap-2">
                                    Lets Connect <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    Download CV <Download className="h-4 w-4" />
                                </Button>

                            </div>

                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-80 lg:w-80 mx-auto"
                        >
                            {/* Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent rounded-full blur-3xl opacity-20" />

                            {/* Avatar Container */}
                            <div className="relative h-full w-full rounded-full overflow-hidden border-4 sm:border-6 md:border-8 border-background shadow-xl">
                                <Image
                                    src={profile.avatarUrl || "/default-avatar.png"}
                                    alt={profile.displayName}
                                    layout="fill"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Expertise Section */}
            <section id="expertise" className="py-20 bg-muted">
                <div className="container px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-16 text-center">
                        <h2 className="text-3xl font-bold mb-4">Technical Expertise</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Mastering the tools and technologies that power modern solutions
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {profile.skills.map((skill, index) => (
                            <motion.div
                                key={skill}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card p-6 rounded-xl border hover:border-primary/50 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Code className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{skill}</h3>
                                </div>
                                <p className="text-muted-foreground">
                                    Leveraging {skill} to build scalable and efficient solutions that drive business value.
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Work Section */}
            <section id="work" className="py-20">
                <div className="container px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-16 text-center">
                        <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">A curated selection of my most impactful work</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-xl border bg-card"
                            >
                                <div className="relative h-64">
                                    <Image
                                        src={project.imageUrl || "/default-project.png"}
                                        alt={project.projectName}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold">{project.projectName}</h3>
                                        <div className="flex gap-2">
                                            {project.repoUrl && (
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                                                        <Github className="h-5 w-5" />
                                                    </a>
                                                </Button>
                                            )}
                                            {project.repoUrl && (
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={project.repoUrl} target="_blank" rel="noreferrer">
                                                        <ExternalLink className="h-5 w-5" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-4">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(project.techStack)
                                            ? project.techStack.map((tech: string) => (
                                                <span key={tech} className="px-3 py-1 text-sm rounded-full bg-muted">
                                                    {tech}
                                                </span>
                                            ))
                                            : profile.skills.slice(0, 3).map((tech: string) => (
                                                <span key={tech} className="px-3 py-1 text-sm rounded-full bg-muted">
                                                    {tech}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-20 bg-muted">
                <div className="container px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-16 text-center">
                        <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Thoughts, insights, and expertise on technology and development
                        </p>
                    </motion.div>

                    {blogPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-medium mb-2">No blog posts yet</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">Check back soon for articles and insights.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogPosts.slice(0, 6).map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-card rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="relative h-48">
                                            {post.coverImage ? (
                                                <div
                                                    className="absolute inset-0 bg-center bg-cover"
                                                    style={{ backgroundImage: `url(${post.coverImage})` }}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-primary/10">
                                                    <FileText className="h-12 w-12 text-primary/50" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(post.createdAt)}</span>
                                                {post.tags.length > 0 && (
                                                    <>
                                                        <Separator orientation="vertical" className="h-4" />
                                                        <Tag className="h-4 w-4" />
                                                        <span>{post.tags[0]}</span>
                                                    </>
                                                )}
                                            </div>
                                            <Link href={`/portfolio/${username}/blog/${post.slug}`} className="hover:underline">
                                                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                                            </Link>
                                            <p className="text-muted-foreground mb-4 line-clamp-3">
                                                {post.excerpt || formatBlogPreview(post.content)}
                                            </p>
                                            <Link href={`/portfolio/${username}/blog/${post.slug}`}>
                                                <Button variant="outline" className="w-full">
                                                    Read Article
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {blogPosts.length > 6 && (
                                <div className="flex justify-center mt-12">
                                    <Link href={`/portfolio/${username}/blog`}>
                                        <Button variant="outline" className="gap-2">
                                            View All Articles
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20">
                <div className="container px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-16 text-center">
                        <h2 className="text-3xl font-bold mb-4">Let&apos;s Connect</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Have a project in mind? Let&apos;s make it happen.</p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Contact Info */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-center bg-card p-6 rounded-xl border shadow-sm">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="p-4 bg-primary/10 rounded-xl">
                                    <Mail className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-semibold">Email</h3>
                                    <p className="text-muted-foreground break-all">{profile.emailAddress}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="p-4 bg-primary/10 rounded-xl">
                                    <Phone className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-semibold">Phone</h3>
                                    <p className="text-muted-foreground">{profile.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Presence */}
                        <div className="space-y-4 p-4 bg-card rounded-xl border shadow-sm">
                            <h3 className="flex flex-wrap gap-2 justify-center sm:justify-center">Social Presence</h3>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-center">
                                {profile.socialLinks.github && (
                                    <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2" asChild>
                                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                            <Github className="h-5 w-5" /> GitHub
                                        </a>
                                    </Button>
                                )}
                                {profile.socialLinks.linkedin && (
                                    <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2" asChild>
                                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="h-5 w-5" /> LinkedIn
                                        </a>
                                    </Button>
                                )}
                                {profile.socialLinks.portfolio && (
                                    <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2" asChild>
                                        <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                                            <Globe className="h-5 w-5" /> Portfolio
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <Card className="max-w-lg w-full mx-auto shadow-lg border rounded-2xl p-6 md:p-8">
                            <CardContent>
                                <h2 className="text-2xl font-semibold mb-4 text-center">Contact Me</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                        />
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                    <Textarea
                                        name="message"
                                        placeholder="Your Message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleFormChange}
                                    />
                                    {formMessage.text && (
                                        <p className={formMessage.type === "error" ? "text-red-500" : "text-green-500"}>
                                            {formMessage.text}
                                        </p>
                                    )}
                                    <Button type="submit" disabled={sending} className="w-full">
                                        {sending ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t">
                <div className="container px-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {profile.displayName}. All rights reserved.
                    </p>

                </div>
            </footer>
        </div>
    )
}

