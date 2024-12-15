'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Star, Award, Users, Code, Zap, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { AITaskManager } from '@/components/AITaskManager'
import { fetchUserProfiles } from '@/lib/userUtils'



import Image from 'next/image'
import { collection, query, where, orderBy, onSnapshot, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { LikeButton } from '@/components/LikeButton'
import { UserCard } from '@/components/UserCard'


export default function HomePage() {
  const [activeTab, setActiveTab] = useState('projects')

  return (


    <main>
      <HeroSection />
      <FeaturesSection />
      <AITaskManagerSection />
      <ShowcaseSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <TestimonialsSection />
      <CallToActionSection />
    </main>
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
            <Image
              src="/studentshowcase.jpg"
              alt="StudentShowcase Platform"
              width={600}
              height={400}
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
function ShowcaseSection({
  activeTab,
  setActiveTab
}: {
  activeTab: string,
  setActiveTab: (tab: string) => void
}) {

  interface Project {
    id: string;
    projectName: string;
    name: string;
    imageUrl: string;
    techStack: string;
    repoUrl: string;
    likes: number;
    createdAt: Date | Timestamp; // or use a more specific type like Timestamp
    approved: boolean;
  }

  interface UserProfile {
    id: string;
    displayName?: string;
    emailAddress?: string;
    // Add other properties as needed
  }
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars
  const [users, setUsers] = useState<UserProfile[]>([]);

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
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError('Failed to load data: ' + errorMessage);
        setLoading(false);
      }
    }

    loadData()
  }, [activeTab])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'profiles');
        const userSnapshot = await getDocs(usersCollection);
        const userList: UserProfile[] = userSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,  // spread first
            id: doc.id,  // then explicitly set id to ensure it's from the document
            displayName: data.displayName || '',
            emailAddress: data.emailAddress || ''
          } as UserProfile;
        });
        setUsers(userList);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching users:", error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const filteredUsers = users.filter(user =>
    (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
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
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                Featured Projects
              </span>
            </TabsTrigger>
            <TabsTrigger value="profiles">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
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
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
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
              <p className="text-lg mb-4">{testimonial.quote}</p>
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

