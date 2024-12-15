// 'use client'

// import { useAuth } from '../hooks/useAuth';
// import { AuthForm } from '../components/AuthForm';
// import { Button } from '@/components/ui/button';
// import { auth } from '../lib/firebase';

// export default function Home() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Student Showcase</h1>
//       {user ? (
//         <>
//           <Button onClick={() => auth.signOut()} className="mb-4">Log Out</Button>

//           {/* <TaskList /> */}
//         </>
//       ) : (
//         <AuthForm />
//       )}
//     </div>
//   );
// }









// "use client";

// import React from 'react';
// import { motion } from 'framer-motion';
// import { useAuth } from '../hooks/useAuth';
// import { AuthForm } from '../components/AuthForm';
// import { Button } from '@/components/ui/button';
// import { auth } from '../lib/firebase';
// import {
//   Award,
//   Users,
//   Upload,
//   FileSearch,
//   ListTodo,
//   FileSpreadsheet,
//   LogOut
// } from 'lucide-react';
// import Link from 'next/link';

// export default function Home() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex justify-center items-center min-h-screen"
//       >
//         <div className="animate-pulse text-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
//           Loading your collaborative workspace...
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <div className="min-h-screen ">
//       <div className="container mx-auto px-4 py-12">
//         {user ? (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="text-center mb-12">
//               <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
//                 Welcome to Student Showcase
//               </h1>
//               <p className="text-gray-300 max-w-2xl mx-auto">
//                 Your comprehensive platform for professional growth and collaboration.
//               </p>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6">
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
//               >
//                 <Upload className="mx-auto mb-4 text-green-400" size={48} />
//                 <h2 className="text-xl font-semibold text-center mb-2">Upload Project</h2>
//                 <p className="text-gray-400 text-center">
//                   Share your innovative projects and collaborate with peers.
//                 </p>
//                 <div className="text-center mt-4">
//                   <Link href="/upload-project">
//                     <Button variant="outline" className="text-black border-purple-500 hover:bg-purple-500/20  bg-purple-300/20">
//                       Go to Upload
//                     </Button>
//                   </Link>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
//               >
//                 <FileSearch className="mx-auto mb-4 text-blue-400" size={48} />
//                 <h2 className="text-xl font-semibold text-center mb-2">Projects Gallery</h2>
//                 <p className="text-gray-400 text-center">
//                   Browse and explore projects from your peers and learn from their work.
//                 </p>
//                 <div className="text-center mt-4">
//                   <Link href="/projects">
//                     <Button variant="outline" className="text-black border-purple-500 hover:bg-purple-500/20  bg-purple-300/20">
//                       View Projects
//                     </Button>
//                   </Link>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
//               >
//                 <Users className="mx-auto mb-4 text-purple-400" size={48} />
//                 <h2 className="text-xl font-semibold text-center mb-2">Team Management</h2>
//                 <p className="text-gray-400 text-center">
//                   Create, join, and collaborate with teams for your projects.
//                 </p>
//                 <div className="text-center mt-4">
//                   <Link href="/teams">
//                     <Button variant="outline" className="text-black border-purple-500 hover:bg-purple-500/20  bg-purple-300/20">
//                     </Button>
//                   </Link>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
//               >
//                 <Award className="mx-auto mb-4 text-yellow-400" size={48} />
//                 <h2 className="text-xl font-semibold text-center mb-2">Certificates</h2>
//                 <p className="text-gray-400 text-center">
//                   Earn and showcase your achievements and skills.
//                 </p>
//                 <div className="text-center mt-4">
//                   <Link href="/certificates">
//                     <Button variant="outline" className="text-black border-purple-500 hover:bg-purple-500/20  bg-purple-300/20">
//                       View Certificates
//                     </Button>
//                   </Link>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
//               >
//                 <ListTodo className="mx-auto mb-4 text-pink-400" size={48} />
//                 <h2 className="text-xl font-semibold text-center mb-2">Task Management</h2>
//                 <p className="text-gray-400 text-center">
//                   Organize and track your project tasks efficiently.
//                 </p>
//                 <div className="text-center mt-4">
//                   <Link href="/tasklist">
//                     <Button variant="outline" className="text-black border-purple-500 hover:bg-purple-500/20  bg-purple-300/20">
//                       Manage Tasks
//                     </Button>
//                   </Link>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
//               >
//                 <FileSpreadsheet className="mx-auto mb-4 text-indigo-400" size={48} />
//                 <h2 className="text-xl font-semibold text-center mb-2">Resume Builder</h2>
//                 <p className="text-gray-400 text-center">
//                   Create a professional resume to showcase your skills and experiences.
//                 </p>
//                 <div className="text-center mt-4">
//                   <Link href="/resume-builder">
//                     <Button variant="outline" className="text-black border-purple-500 hover:bg-purple-500/20  bg-purple-300/20">
//                       Build Resume
//                     </Button>
//                   </Link>
//                 </div>
//               </motion.div>
//             </div>

//             <div className="flex justify-center mt-8">
//               <motion.div
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button
//                   onClick={() => auth.signOut()}
//                   className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
//                 >
//                   <LogOut className="mr-2" size={20} /> Log Out
//                 </Button>
//               </motion.div>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="max-w-md mx-auto"
//           >
//             <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 text-center">
//               Student Showcase
//             </h1>
//             <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
//               <AuthForm />
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }











// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Briefcase, Star, Award, Users, Code, Zap, CheckCircle, ArrowRight, Github, Linkedin, Twitter } from 'lucide-react'
// import Link from 'next/link'
// import { AITaskManager } from '@/components/AITaskManager'
// import { ProjectCard } from '@/components/ProjectCard'
// import { ProfileCard } from '@/components/ProfileCard'
// import { useAuth } from '@/hooks/useAuth'
// import { AuthForm } from '@/components/AuthForm'

// export default function HomePage() {
//   const [activeTab, setActiveTab] = useState('projects')
//   const { user } = useAuth();

//   return (
//     <div className="">


//       <main>
//         <HeroSection />
//         <FeaturesSection />
//         <AITaskManagerSection />
//         <ShowcaseSection activeTab={activeTab} setActiveTab={setActiveTab} />
//         <TestimonialsSection />
//         <CallToActionSection />
//       </main>


//     </div>
//   )
// }

// function HeroSection(user) {
//   return (
//     <section className="py-20 overflow-hidden">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="md:w-1/2 mb-8 md:mb-0"
//           >
//             <h1 className="text-5xl md:text-6xl font-bold mb-6">Showcase Your Skills, <br />Build Your Future</h1>
//             <p className="text-xl text-muted-foreground mb-8">
//               StudentShowcase is the ultimate platform for students to display their projects,
//               connect with peers, and catch the eye of potential employers.
//             </p>
//             <div className="flex space-x-4">
//               <Link href={user ? '/profile' : '/auth'}>
//                 <Button size="lg" className="text-lg px-8">
//                   Get Started
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//               <Button size="lg" variant="outline" className="text-lg px-8">
//                 Learn More
//               </Button>
//             </div>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="md:w-1/2"
//           >
//             <img
//               src="/placeholder.svg?height=400&width=600"
//               alt="StudentShowcase Platform"
//               className="rounded-lg shadow-2xl"
//             />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }

// function FeaturesSection() {
//   const features = [
//     { icon: Briefcase, title: "Project Showcase", description: "Display your best work to the world" },
//     { icon: Star, title: "Skill Endorsements", description: "Get recognized for your abilities" },
//     { icon: Award, title: "Certificates", description: "Earn certificates for completed projects" },
//     { icon: Users, title: "Networking", description: "Connect with peers and potential employers" },
//     { icon: Code, title: "Code Repository", description: "Share and collaborate on code" },
//     { icon: Zap, title: "AI-Powered Tools", description: "Enhance your productivity with AI assistance" },
//   ]

//   return (
//     <section className="py-20 bg-secondary/30">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-12">Why Choose StudentShowcase?</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="bg-card text-card-foreground p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
//             >
//               <feature.icon className="h-12 w-12 text-primary mb-4" />
//               <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//               <p className="text-muted-foreground">{feature.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// function AITaskManagerSection() {
//   return (
//     <section className="py-20">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row items-center justify-between">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="md:w-1/2 mb-8 md:mb-0"
//           >
//             <h2 className="text-3xl font-bold mb-4">AI-Powered Task Manager</h2>
//             <p className="text-lg text-muted-foreground mb-6">
//               Boost your productivity with our cutting-edge AI task manager.
//               Let AI help you organize, prioritize, and complete your projects efficiently.
//             </p>
//             <ul className="space-y-2">
//               {[
//                 "Intelligent task prioritization",
//                 "Automated project planning",
//                 "Smart reminders and notifications",
//                 "AI-generated project insights"
//               ].map((feature, index) => (
//                 <li key={index} className="flex items-center">
//                   <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
//                   <span>{feature}</span>
//                 </li>
//               ))}
//             </ul>
//             <Button className="mt-6">Try AI Task Manager</Button>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="md:w-1/2"
//           >
//             <AITaskManager />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }

// function ShowcaseSection({ activeTab, setActiveTab }) {
//   const projects = [
//     { id: 1, title: "E-commerce Platform", tech: "React, Node.js, MongoDB", likes: 42, author: "Alex Johnson" },
//     { id: 2, title: "Machine Learning Model", tech: "Python, TensorFlow, Scikit-learn", likes: 38, author: "Samantha Lee" },
//     { id: 3, title: "Mobile Game", tech: "Unity, C#, Firebase", likes: 56, author: "Michael Chen" },
//     { id: 4, title: "Blockchain Wallet", tech: "Solidity, Web3.js, React", likes: 31, author: "Emily Taylor" },
//   ]

//   const profiles = [
//     { id: 1, name: "Alex Johnson", role: "Full Stack Developer", skills: ["React", "Node.js", "MongoDB"], projects: 12, likes: 156 },
//     { id: 2, name: "Samantha Lee", role: "UX/UI Designer", skills: ["Figma", "Adobe XD", "Sketch"], projects: 8, likes: 92 },
//     { id: 3, name: "Michael Chen", role: "Data Scientist", skills: ["Python", "TensorFlow", "SQL"], projects: 15, likes: 203 },
//     { id: 4, name: "Emily Taylor", role: "Mobile App Developer", skills: ["Swift", "Kotlin", "Flutter"], projects: 10, likes: 127 },
//   ]

//   return (
//     <section className="py-20 bg-secondary/30">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-12">Discover Amazing Work</h2>
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-8">
//             <TabsTrigger value="projects">Featured Projects</TabsTrigger>
//             <TabsTrigger value="profiles">Student Profiles</TabsTrigger>
//           </TabsList>
//           <AnimatePresence mode="wait">
//             <TabsContent value="projects" className="mt-0">
//               <motion.div
//                 key="projects"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//               >
//                 {projects.map((project) => (
//                   <ProjectCard key={project.id} project={project} />
//                 ))}
//               </motion.div>
//             </TabsContent>
//             <TabsContent value="profiles" className="mt-0">
//               <motion.div
//                 key="profiles"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//               >
//                 {profiles.map((profile) => (
//                   <ProfileCard key={profile.id} profile={profile} />
//                 ))}
//               </motion.div>
//             </TabsContent>
//           </AnimatePresence>
//         </Tabs>
//         <div className="text-center mt-12">
//           <Button size="lg">Explore All {activeTab === 'projects' ? 'Projects' : 'Profiles'}</Button>
//         </div>
//       </div>
//     </section>
//   )
// }

// function TestimonialsSection() {
//   const testimonials = [
//     { name: "Sarah M.", role: "Computer Science Student", quote: "StudentShowcase helped me land my dream internship!" },
//     { name: "David L.", role: "Recent Graduate", quote: "The AI task manager revolutionized my project workflow." },
//     { name: "Jessica K.", role: "Hiring Manager", quote: "We've found amazing talent through StudentShowcase." },
//   ]

//   return (
//     <section className="py-20">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="bg-card text-card-foreground p-6 rounded-lg shadow-lg"
//             >
//               <p className="text-lg mb-4">"{testimonial.quote}"</p>
//               <div className="flex items-center">
//                 <div className="w-12 h-12 bg-primary/10 rounded-full mr-4"></div>
//                 <div>
//                   <p className="font-semibold">{testimonial.name}</p>
//                   <p className="text-sm text-muted-foreground">{testimonial.role}</p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// function CallToActionSection(user) {
//   return (


//     <section className="py-20" >
//       <div className="container mx-auto px-4">
//         <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center">
//           <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Skills?</h2>
//           <p className="text-xl mb-8">Join StudentShowcase today and take the first step towards a brighter future.</p>
//           <Button size="lg" variant="secondary" className="text-lg px-8">
//             {user ? 'Explore' : 'Sign Up Now'}
//             <ArrowRight className="ml-2 h-5 w-5" />
//           </Button>
//         </div>
//       </div>
//     </section>



//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Star, Award, Users, Code, Zap, CheckCircle, ArrowRight, Github, Linkedin, Twitter, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { AITaskManager } from '@/components/AITaskManager'
import { fetchUserProfiles } from '@/lib/userUtils'



import Image from 'next/image'
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { LikeButton } from '@/components/LikeButton'
import { UserCard } from '@/components/UserCard'


export default function HomePage() {
  const [activeTab, setActiveTab] = useState('projects')

  return (
    // <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">


    <main>
      <HeroSection />
      <FeaturesSection />
      <AITaskManagerSection />
      <ShowcaseSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <TestimonialsSection />
      <CallToActionSection />
    </main>
    // </div> 
  )
}

function HeroSection() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                Showcase Your Skills,
              </span>
              <br />
              <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                Build Your Future
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              StudentShowcase is the ultimate platform for students to display their projects,
              connect with peers, and catch the eye of potential employers.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" className="text-lg px-8">
                <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

                  Get Started
                </span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

                  Learn More
                </span>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <img
              src="/studentshowcase.jpg?height=400&width=600"
              alt="StudentShowcase Platform"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: Briefcase, title: "Project Showcase", description: "Display your best work to the world" },
    { icon: Star, title: "Skill Endorsements", description: "Get recognized for your abilities" },
    { icon: Award, title: "Certificates", description: "Earn certificates for completed projects" },
    { icon: Users, title: "Networking", description: "Connect with peers and potential employers" },
    { icon: Code, title: "Code Repository", description: "Share and collaborate on code" },
    { icon: Zap, title: "AI-Powered Tools", description: "Enhance your productivity with AI assistance" },
  ]

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

            Why Choose StudentShowcase?
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card text-card-foreground p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

                  {feature.title}
                </span>
              </h3>

              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AITaskManagerSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

                AI-Powered Task Manager
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Boost your productivity with our cutting-edge AI task manager.
              Let AI help you organize, prioritize, and complete your projects efficiently.
            </p>
            <ul className="space-y-2">
              {[
                "Intelligent task prioritization",
                "Automated project planning",
                "Smart reminders and notifications",
                "AI-generated project insights"
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-6">
              <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

                Try AI Task Manager
              </span>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <AITaskManager />
          </motion.div>
        </div>
      </div>
    </section>
  )
}


function ShowcaseSection({ activeTab, setActiveTab }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        if (activeTab === 'projects') {
          const q = query(
            collection(db, 'projects'),
            where('approved', '==', true),
            orderBy('createdAt', 'desc')
          )

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedProjects: Project[] = []
            querySnapshot.forEach((doc) => {
              const data = doc.data()
              fetchedProjects.push({
                id: doc.id,
                ...data,
                likes: data.likes || 0,
                imageUrl: data.imageUrl || '/placeholder.svg'
              } as Project)
            })
            setProjects(fetchedProjects)
            setLoading(false)
          }, (err) => {
            setError('Failed to fetch projects: ' + err.message)
            setLoading(false)
          })

          return () => unsubscribe()
        } else {
          const fetchedProfiles = await fetchUserProfiles()
          setProfiles(fetchedProfiles)
          setLoading(false)
        }
      } catch (err) {
        setError('Failed to load data')
        setLoading(false)
      }
    }

    loadData()
  }, [activeTab])


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...")
        const usersCollection = collection(db, 'profiles')  // Changed 'users' to 'profile'
        const userSnapshot = await getDocs(usersCollection)
        console.log("User snapshot:", userSnapshot)
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log("User list:", userList)
        setUsers(userList)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  )


  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

            Discover Amazing Work
          </span>
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="projects">
              <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

                Featured Projects
              </span>
            </TabsTrigger>
            <TabsTrigger value="profiles">
              <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

                Student Profiles
              </span>
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center h-screen text-xl font-semibold">
              Loading...
            </div>
          ) : (
            <>
              {activeTab === 'projects' && (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {projects.length === 0 ? (
                    <Alert className="col-span-full">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No Projects</AlertTitle>
                      <AlertDescription>
                        There are no approved projects to display at the moment.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    projects.map((project) => (
                      <Card
                        key={project.id}
                        className="flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300"
                      >
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-gray-800">
                            {project.projectName}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500">
                            By {project.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                          <div className="relative w-full h-48 mb-4">
                            <Image
                              src={project.imageUrl}
                              alt={project.projectName}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded-md"
                            />
                          </div>
                          <p className="mb-2">
                            <strong>Tech Stack:</strong> {project.techStack}
                          </p>
                          <p className="mb-2">
                            <strong>Repository:</strong>{' '}
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {new URL(project.repoUrl).host}
                            </a>
                          </p>
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <LikeButton
                              projectId={project.id}
                              initialLikes={project.likes}
                            />
                            <span className="text-sm text-gray-500">
                              {project.likes} likes
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'profiles' && (
                <div className="">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500">
                      <p>Error: {error}</p>
                      <p>Please check the console for more details.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                  )}
                  {!loading && filteredUsers.length === 0 && (
                    <p className="text-center text-muted-foreground">No users found.</p>
                  )}
                </div>
              )}
            </>
          )}
        </Tabs>

        <div className="text-center mt-12">
          <Button size="lg">
            <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

              Explore All {activeTab === 'projects' ? 'Projects' : 'Profiles'}
            </span>
          </Button>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah M.", role: "Computer Science Student", quote: "StudentShowcase helped me land my dream internship!" },
    { name: "David L.", role: "Recent Graduate", quote: "The AI task manager revolutionized my project workflow." },
    { name: "Jessica K.", role: "Hiring Manager", quote: "We've found amazing talent through StudentShowcase." },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

            What Our Users Say
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card text-card-foreground p-6 rounded-lg shadow-lg"
            >
              <p className="text-lg mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CallToActionSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Showcase Your Skills?</h2>
          <p className="text-xl mb-8">Join StudentShowcase today and take the first step towards a brighter future.</p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">

              Sign Up Now
            </span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

