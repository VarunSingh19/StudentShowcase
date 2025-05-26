// 'use client'

// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Briefcase, Star, Award, Users, Code, Zap, CheckCircle, ArrowRight, Loader2, Brain, Sparkles, Bot, Network, Cpu } from 'lucide-react'
// import { AITaskManager } from '@/components/AITaskManager'
// import { fetchUserProfiles } from '@/lib/userUtils'
// import Image from 'next/image'
// import { collection, query, where, orderBy, onSnapshot, getDocs, Timestamp } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from 'lucide-react'
// import { LikeButton } from '@/components/LikeButton'
// import { UserCard } from '@/components/UserCard'
// import Link from 'next/link'
// import { HeaderImageModal } from '@/components/HeaderImageModal'


// export default function HomePageClient() {
//   const [activeTab, setActiveTab] = useState('projects')
//   return (
//     <main>
//       <HeroSection />
//       <FeaturesSection />
//       <AICapabilitiesSection />
//       <AITaskManagerSection />
//       <ShowcaseSection activeTab={activeTab} setActiveTab={setActiveTab} />
//       <TestimonialsSection />
//       <CallToActionSection />
//     </main>
//   )
// }

// function HeroSection() {
//   const features = [
//     { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: "AI-Powered Learning" },
//     { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: "Personalized Feedback" },
//     { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: "Project Showcase" },
//   ];

//   return (
//     <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
//       {/* Animated background gradient */}
//       <div className="absolute inset-0 "></div>

//       {/* Floating elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(20)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute h-2 w-2 bg-primary/20 rounded-full"
//             animate={{
//               x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
//               y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
//             }}
//             transition={{
//               duration: Math.random() * 10 + 10,
//               repeat: Infinity,
//               repeatType: "reverse",
//             }}
//           />
//         ))}
//       </div>

//       <div className="container relative mx-auto px-4">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="w-full md:w-1/2 space-y-4 sm:space-y-6"
//           >
//             <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary">
//               <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
//               <span className="text-sm sm:text-base">AI-Powered Innovation</span>
//             </div>

//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x">
//                 The Future of AI
//               </span>
//               <br />
//               <span>Is Here </span>
//               <span className="text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x">
//                 StudentShowcase
//               </span>
//             </h1>

//             <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
//               Experience the next generation of AI technology that adapts to your needs,
//               learns from your interactions, and helps you achieve more.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 w-full sm:w-auto">
//                 Get Started
//                 <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
//               </Button>
//               <Button size="lg" variant="outline" className="border-2 w-full sm:w-auto">
//                 Watch Demo
//               </Button>
//             </div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
//               {features.map((feature, i) => (
//                 <motion.div
//                   key={i}
//                   className="flex items-center"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.2 }}
//                 >
//                   <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
//                     {feature.icon}
//                   </div>
//                   <span className="ml-2 text-xs sm:text-sm">{feature.text}</span>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//           {/* Animated background gradient */}
//           <div className="absolute inset-0 "></div>

//           {/* Floating elements */}
//           <div className="absolute inset-0 overflow-hidden">
//             {[...Array(20)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute h-2 w-2 bg-primary/20 rounded-full"
//                 animate={{
//                   x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
//                   y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
//                 }}
//                 transition={{
//                   duration: Math.random() * 10 + 10,
//                   repeat: Infinity,
//                   repeatType: "reverse",
//                 }}
//               />
//             ))}
//           </div>


//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8 }}
//             className="w-full md:w-1/2 relative"
//           >
//             <div className="relative w-full aspect-square max-w-sm sm:max-w-md md:max-w-lg mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
//               {/* Animated background gradient */}
//               <div className="absolute inset-0 "></div>

//               {/* Floating elements */}
//               <div className="absolute inset-0 overflow-hidden">
//                 {[...Array(20)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="absolute h-2 w-2 bg-primary/20 rounded-full"
//                     animate={{
//                       x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
//                       y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
//                     }}
//                     transition={{
//                       duration: Math.random() * 10 + 10,
//                       repeat: Infinity,
//                       repeatType: "reverse",
//                     }}
//                   />
//                 ))}
//               </div>

//               <Image
//                 src="/studentshowcase.jpg"
//                 alt="AI Visualization"
//                 fill
//                 className="object-cover rounded-3xl"
//               />
//             </div>
//             {/* Animated background gradient */}
//             <div className="absolute inset-0 "></div>

//             {/* Floating elements */}
//             <div className="absolute inset-0 overflow-hidden">
//               {[...Array(20)].map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="absolute h-2 w-2 bg-primary/20 rounded-full"
//                   animate={{
//                     x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
//                     y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
//                   }}
//                   transition={{
//                     duration: Math.random() * 10 + 10,
//                     repeat: Infinity,
//                     repeatType: "reverse",
//                   }}
//                 />
//               ))}
//             </div>


//             {/* Floating badges */}
//             <motion.div
//               animate={{
//                 y: [0, -10, 0],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//               }}
//               className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-xl shadow-lg"
//             >
//               <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
//             </motion.div>

//             <motion.div
//               animate={{
//                 y: [0, 10, 0],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 delay: 0.5,
//               }}
//               className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-xl shadow-lg"
//             >
//               <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-pink-600" />
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
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
//     <section className="py-24 bg-secondary/30">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl font-bold mb-6">
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
//               Powerful Features
//             </span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Experience the next generation of AI technology
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <Card className="group hover:shadow-xl transition-all duration-300">
//                 <CardContent className="p-6">
//                   <motion.div
//                     whileHover={{ scale: 1.1 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                   >
//                     <feature.icon className="h-12 w-12 mb-4 text-primary group-hover:text-purple-600 transition-colors duration-300" />
//                   </motion.div>
//                   <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//                   <p className="text-muted-foreground">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// function AICapabilitiesSection() {
//   const capabilities = [
//     {
//       icon: Brain,
//       title: "Advanced Learning",
//       description: "Adaptive AI that learns from your interactions and improves over time"
//     },
//     {
//       icon: Network,
//       title: "Neural Networks",
//       description: "State-of-the-art neural networks for complex problem solving"
//     },
//     {
//       icon: Cpu,
//       title: "Processing Power",
//       description: "High-performance computing for rapid AI operations"
//     },
//     {
//       icon: Sparkles,
//       title: "Smart Automation",
//       description: "Intelligent automation of repetitive tasks and workflows"
//     }
//   ]

//   return (
//     <section className="py-24 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 "></div>

//       <div className="container mx-auto px-4 relative">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl font-bold mb-6">
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
//               AI Capabilities
//             </span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Powered by cutting-edge artificial intelligence to deliver exceptional results
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {capabilities.map((capability, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
//                 <CardContent className="p-6">
//                   {/* Animated gradient border */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

//                   <div className="relative z-10">
//                     <capability.icon className="h-12 w-12 mb-4 text-primary" />
//                     <h3 className="text-xl font-semibold mb-2">{capability.title}</h3>
//                     <p className="text-muted-foreground">{capability.description}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// function AITaskManagerSection() {
//   return (
//     <section className="py-24 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 "></div>

//       <div className="container mx-auto px-4 relative">
//         <div className="flex flex-col lg:flex-row items-center gap-12">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="lg:w-1/2 space-y-6"
//           >
//             <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10">
//               <Cpu className="w-5 h-5 mr-2 text-purple-600" />
//               <span className="text-purple-600 font-medium">AI-Powered Management</span>
//             </div>

//             <h2 className="text-4xl font-bold">
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
//                 Intelligent Task Management
//               </span>
//             </h2>

//             <p className="text-xl text-muted-foreground">
//               Experience the power of AI-driven task management. Our system learns from your workflow
//               and optimizes tasks automatically for maximum efficiency.
//             </p>

//             <ul className="space-y-3">
//               {[
//                 "Real-time task analysis and optimization",
//                 "Intelligent workload distribution",
//                 "Automated priority management",
//                 "Smart deadline predictions"
//               ].map((feature, index) => (
//                 <motion.li
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="flex items-center space-x-2"
//                 >
//                   <div className="h-2 w-2 rounded-full bg-purple-600" />
//                   <span>{feature}</span>
//                 </motion.li>
//               ))}
//             </ul>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="lg:w-1/2"
//           >
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-xl" />
//               <div className="relative">
//                 <AITaskManager />
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }
// function ShowcaseSection({
//   activeTab,
//   setActiveTab
// }: {
//   activeTab: string,
//   setActiveTab: (tab: string) => void
// }) {



//   interface Project {
//     id: string;
//     projectName: string;
//     name: string;
//     imageUrl: string;
//     techStack: string;
//     repoUrl: string;
//     likes: number;
//     createdAt: Date | Timestamp; // or use a more specific type like Timestamp
//     approved: boolean;
//   }

//   interface UserProfile {
//     id: string;
//     userId: string;
//     avatarUrl?: string;
//     displayName: string;
//     bio: string;
//     location: string;
//     skills: string[];
//     socialLinks: {
//       github: string;
//       linkedin: string;
//       twitter: string;
//       portfolio: string;
//     };
//     hobbiesAndInterests: string[];
//     languages: string[];
//     emailAddress: string;
//     phoneNumber: string;
//     points: number;
//     orderHistory: any[];
//     likedProducts: string[];
//     createdAt: Date | Timestamp;
//     updatedAt: Date | Timestamp;
//   }
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [profiles, setProfiles] = useState<UserProfile[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [searchTerm, setSearchTerm] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars
//   const [users, setUsers] = useState<UserProfile[]>([]);

//   useEffect(() => {
//     async function loadData() {
//       setLoading(true)
//       try {
//         if (activeTab === 'projects') {
//           const q = query(
//             collection(db, 'projects'),
//             where('approved', '==', true),
//             orderBy('createdAt', 'desc')
//           )

//           const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const fetchedProjects: Project[] = []
//             querySnapshot.forEach((doc) => {
//               const data = doc.data()
//               fetchedProjects.push({
//                 id: doc.id,
//                 ...data,
//                 likes: data.likes || 0,
//                 imageUrl: data.imageUrl || '/studentshowcase.jpg'
//               } as Project)
//             })
//             setProjects(fetchedProjects)
//             setLoading(false)
//           }, (err) => {
//             setError('Failed to fetch projects: ' + err.message)
//             setLoading(false)
//           })

//           return () => unsubscribe()
//         } else {
//           const fetchedProfiles = await fetchUserProfiles()
//           setProfiles(fetchedProfiles)
//           setLoading(false)
//         }
//       } catch (err: unknown) {
//         const errorMessage = err instanceof Error ? err.message : String(err);
//         setError('Failed to load data: ' + errorMessage);
//         setLoading(false);
//       }
//     }

//     loadData()
//   }, [activeTab])
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const usersCollection = collection(db, 'profiles');
//         const userSnapshot = await getDocs(usersCollection);
//         const userList: UserProfile[] = userSnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             ...data,  // spread first
//             id: doc.id,  // then explicitly set id to ensure it's from the document
//             displayName: data.displayName || '',
//             emailAddress: data.emailAddress || ''
//           } as UserProfile;
//         });
//         setUsers(userList);
//       } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : String(error);
//         console.error("Error fetching users:", error);
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);
//   const filteredUsers = users.filter(user =>
//     (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//     (user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <section className="py-24 relative overflow-hidden">
//       {/* Animated gradient background */}
//       <div className="absolute inset-0 "></div>

//       <div className="container mx-auto px-4 relative">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl font-bold mb-6">
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-x">
//               Discover Amazing Work
//             </span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Explore innovative projects and connect with talented students
//           </p>
//         </motion.div>

//         {error && (
//           <Alert variant="destructive" className="mb-8 bg-red-50 border-red-200">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-12 bg-secondary/50 p-1 rounded-lg">
//             <TabsTrigger
//               value="projects"
//               className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
//             >
//               <span className="font-semibold text-lg">Featured Projects</span>
//             </TabsTrigger>
//             <TabsTrigger
//               value="profiles"
//               className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
//             >
//               <span className="font-semibold text-lg">Student Profiles</span>
//             </TabsTrigger>
//           </TabsList>

//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-20">
//               <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
//               <p className="text-lg text-muted-foreground">Loading amazing content...</p>
//             </div>
//           ) : (
//             <>
//               {activeTab === 'projects' && (
//                 <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                   {projects.length === 0 ? (
//                     <Alert className="col-span-full bg-secondary/50 border-none">
//                       <AlertCircle className="h-4 w-4" />
//                       <AlertTitle>No Projects Yet</AlertTitle>
//                       <AlertDescription>
//                         Be the first to showcase your amazing project!
//                       </AlertDescription>
//                     </Alert>
//                   ) : (
//                     projects.map((project) => (
//                       <motion.div
//                         key={project.id}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <Card className="group h-full hover:shadow-2xl transition-all duration-500 bg-white/50 backdrop-blur-sm border-purple-100">
//                           <CardHeader>
//                             <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                               {project.projectName}
//                             </CardTitle>
//                             <CardDescription className="text-sm">
//                               By {project.name}
//                             </CardDescription>
//                           </CardHeader>
//                           <CardContent className="space-y-4">
//                             <div className="relative w-full h-48 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-500">
//                               <Image
//                                 src={project.imageUrl || '/studentshowcase.jpg'}
//                                 alt={project.projectName}
//                                 fill
//                                 className="object-cover"
//                               />
//                               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                             </div>
//                             <div className="space-y-2">
//                               <p className="font-medium">
//                                 <span className="text-purple-600">Tech Stack:</span> {project.techStack}
//                               </p>
//                               <p>
//                                 <a
//                                   href={project.repoUrl}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
//                                 >
//                                   View Repository →
//                                 </a>
//                               </p>
//                               <div className="flex items-center justify-between pt-4 border-t border-purple-100">
//                                 <LikeButton
//                                   projectId={project.id}
//                                   initialLikes={project.likes}
//                                 />
//                                 <span className="text-sm text-muted-foreground">
//                                   {project.likes} likes
//                                 </span>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       </motion.div>
//                     ))
//                   )}
//                 </div>
//               )}

//               {activeTab === 'profiles' && (
//                 <div className="space-y-8">
//                   {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                       <Loader2 className="h-8 w-8 animate-spin" />
//                     </div>
//                   ) : error ? (
//                     <div className="text-center text-red-500">
//                       <p>Error: {error}</p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                       {filteredUsers.slice(0, 6).map(user => (
//                         <motion.div
//                           key={user.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <UserCard user={user} />
//                         </motion.div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </Tabs>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center mt-16"
//         >
//           <Link href={activeTab === 'projects' ? '/projects' : '/users'}>
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               Explore All {activeTab === 'projects' ? 'Projects' : 'Profiles'}
//             </Button>
//           </Link>
//         </motion.div>
//       </div>
//     </section>
//   )
// }


// function TestimonialsSection() {
//   const testimonials = [
//     { name: "Divyansh S.", role: "Computer Science Student", quote: "StudentShowcase helped me land my dream internship!", image: "/divyansh.jpg" },
//     { name: "Rohan S.", role: "Recent Graduate", quote: "The AI task manager revolutionized my project workflow.", image: "/rohan.jpg" },
//     { name: "Jatin M.", role: "Hiring Manager", quote: "We've found amazing talent through StudentShowcase.", image: "/jatin.png" },
//   ]

//   return (
//     <section className="py-20  from-background to-secondary/30">
//       <div className="container mx-auto px-4">
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-4xl font-bold text-center mb-12"
//         >
//           <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
//             What Our Users Say
//           </span>
//         </motion.h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className="bg-card text-card-foreground p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
//             >
//               <p className="text-lg mb-4 italic">{testimonial.quote}</p>
//               <div className="flex items-center">
//                 <HeaderImageModal src={testimonial.image}
//                   alt={testimonial.name}
//                 />
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

// function CallToActionSection() {
//   return (
//     <section className="py-24 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 "></div>

//       <div className="container mx-auto px-4 relative">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-4xl mx-auto text-center"
//         >
//           <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-px rounded-3xl">
//             <div className="bg-background rounded-3xl p-12">
//               <h2 className="text-4xl font-bold mb-6">
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
//                   Ready to Experience the Future?
//                 </span>
//               </h2>
//               <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//                 Join us in shaping your future with AI technology. Start your journey today.
//               </p>
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
//                   Get Started
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </motion.div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }


// app/search/results/page.tsx
import React, { Suspense } from 'react'
import HomePageClient from './HomePageClient'

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading search results…</div>}>
      <HomePageClient />
    </Suspense>
  )
}
