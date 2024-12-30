// 'use client'

// import { useState } from 'react';
// import { auth } from "@/lib/firebase";
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Icons } from "@/components/ui/icons"
// import { motion } from "framer-motion"
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// export function AuthForm() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLogin, setIsLogin] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setIsLoading(true);

//         try {
//             if (isLogin) {
//                 await signInWithEmailAndPassword(auth, email, password);
//             } else {
//                 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//                 // Create initial profile for new users

//                 await setDoc(doc(db, 'profiles', userCredential.user.uid), {
//                     userId: userCredential.user.uid,
//                     displayName: '',
//                     bio: '',
//                     location: '',
//                     skills: [],
//                     socialLinks: {
//                         github: '',
//                         linkedin: '',
//                         twitter: '',
//                         portfolio: ''
//                     },
//                     createdAt: new Date(),
//                     updatedAt: new Date()
//                 });
//             }
//         } catch (err) {
//             setError('Authentication failed. Please try again.' + err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
//             <motion.div

//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="w-full max-w-md"
//             >
//                 <Card className="shadow-lg">
//                     <CardHeader className="space-y-1">
//                         <CardTitle className="text-2xl font-bold text-center">
//                             {isLogin ? 'Welcome back' : 'Create an account'}
//                         </CardTitle>
//                         <CardDescription className="text-center">
//                             {isLogin
//                                 ? 'Enter your credentials to access your account'
//                                 : 'Enter your details to create your account'}
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="email">Email</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     placeholder="m@example.com"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                     className="w-full"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="password">Password</Label>
//                                 <Input
//                                     id="password"
//                                     type="password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                     className="w-full"
//                                 />
//                             </div>
//                             <Button
//                                 type="submit"
//                                 className="w-full"
//                                 disabled={isLoading}
//                             >
//                                 {isLoading && (
//                                     <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//                                 )}
//                                 {isLogin ? 'Sign In' : 'Sign Up'}
//                             </Button>
//                         </form>
//                     </CardContent>
//                     <CardFooter>
//                         <div className="w-full space-y-4">
//                             <div className="relative">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <span className="w-full border-t" />
//                                 </div>
//                                 <div className="relative flex justify-center text-xs uppercase">
//                                     <span className="bg-background px-2 text-muted-foreground">
//                                         Or continue with
//                                     </span>
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <Button variant="outline" className="w-full">
//                                     <Icons.gitHub className="mr-2 h-4 w-4" />
//                                     Github
//                                 </Button>
//                                 <Button variant="outline" className="w-full">
//                                     <Icons.google className="mr-2 h-4 w-4" />
//                                     Google
//                                 </Button>
//                             </div>
//                             <Button
//                                 type="button"
//                                 variant="link"
//                                 onClick={() => setIsLogin(!isLogin)}
//                                 className="w-full"
//                             >
//                                 {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
//                             </Button>
//                             {error && (
//                                 <p className="text-sm font-medium text-red-500 text-center">
//                                     {error}
//                                 </p>
//                             )}
//                         </div>
//                     </CardFooter>
//                 </Card>
//             </motion.div>
//         </div>
//     );
// }

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Import useRouter
// import { auth } from "@/lib/firebase";
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Icons } from "@/components/ui/icons";
// import { motion } from "framer-motion";
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// export function AuthForm() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLogin, setIsLogin] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const router = useRouter(); // Initialize router

// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//         if (isLogin) {
//             await signInWithEmailAndPassword(auth, email, password);
//         } else {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             // Create initial profile for new users
//             await setDoc(doc(db, 'profiles', userCredential.user.uid), {
//                 userId: userCredential.user.uid,
//                 displayName: '',
//                 bio: '',
//                 location: '',
//                 skills: [],
//                 socialLinks: {
//                     github: '',
//                     linkedin: '',
//                     twitter: '',
//                     portfolio: ''
//                 },
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             });
//         }
//         router.push('/profile'); // Redirect to profile after success
//     } catch (err) {
//         setError('Authentication failed. Please try again.' + err);
//     } finally {
//         setIsLoading(false);
//     }
// };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
//             <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="w-full max-w-md"
//             >
//                 <Card className="shadow-lg">
//                     <CardHeader className="space-y-1">
//                         <CardTitle className="text-2xl font-bold text-center">
//                             {isLogin ? 'Welcome back' : 'Create an account'}
//                         </CardTitle>
//                         <CardDescription className="text-center">
//                             {isLogin
//                                 ? 'Enter your credentials to access your account'
//                                 : 'Enter your details to create your account'}
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="email">Email</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     placeholder="m@example.com"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                     className="w-full"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="password">Password</Label>
//                                 <Input
//                                     id="password"
//                                     type="password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                     className="w-full"
//                                 />
//                             </div>
//                             <Button
//                                 type="submit"
//                                 className="w-full"
//                                 disabled={isLoading}
//                             >
//                                 {isLoading && (
//                                     <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//                                 )}
//                                 {isLogin ? 'Sign In' : 'Sign Up'}
//                             </Button>
//                         </form>
//                     </CardContent>
//                     <CardFooter>
//                         <div className="w-full space-y-4">
//                             <div className="relative">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <span className="w-full border-t" />
//                                 </div>
//                                 <div className="relative flex justify-center text-xs uppercase">
//                                     <span className="bg-background px-2 text-muted-foreground">
//                                         Or continue with
//                                     </span>
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <Button variant="outline" className="w-full">
//                                     <Icons.gitHub className="mr-2 h-4 w-4" />
//                                     Github
//                                 </Button>
//                                 <Button variant="outline" className="w-full">
//                                     <Icons.google className="mr-2 h-4 w-4" />
//                                     Google
//                                 </Button>
//                             </div>
//                             <Button
//                                 type="button"
//                                 variant="link"
//                                 onClick={() => setIsLogin(!isLogin)}
//                                 className="w-full"
//                             >
//                                 {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
//                             </Button>
//                             {error && (
//                                 <p className="text-sm font-medium text-red-500 text-center">
//                                     {error}
//                                 </p>
//                             )}
//                         </div>
//                     </CardFooter>
//                 </Card>
//             </motion.div>
//         </div>
//     );
// }

// 'use client'
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Sparkles, Stars, Zap } from 'lucide-react';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
//     CardFooter,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Icons } from '@/components/ui/icons';

// interface AuthFormProps {
//     onSubmit: (e: React.FormEvent) => Promise<void>;
//     isLoading: boolean;
//     error: string | null;
//     email: string;
//     setEmail: (email: string) => void;
//     password: string;
//     setPassword: (password: string) => void;
//     isLogin: boolean;
//     setIsLogin: (isLogin: boolean) => void;
// }

// export default function AuthForm({
//     onSubmit,
//     isLoading,
//     error,
//     email,
//     setEmail,
//     password,
//     setPassword,
//     isLogin,
//     setIsLogin
// }: AuthFormProps) {
//     const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 relative overflow-hidden">
//             {/* Animated background particles */}
//             <div className="absolute inset-0 overflow-hidden">
//                 {[...Array(20)].map((_, i) => (
//                     <motion.div
//                         key={i}
//                         className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
//                         animate={{
//                             x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
//                             y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
//                         }}
//                         transition={{
//                             duration: Math.random() * 10 + 5,
//                             repeat: Infinity,
//                             ease: "linear"
//                         }}
//                     />
//                 ))}
//             </div>

//             <div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="w-full max-w-md relative"
//                 >
//                     {/* Glowing effect behind card */}
//                     <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse" />

//                     <Card className="shadow-xl backdrop-blur-sm bg-white/90 relative">
//                         <CardHeader className="space-y-1">
//                             <motion.div
//                                 initial={{ scale: 0.9 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{ duration: 0.5 }}
//                             >
//                                 <div className="flex justify-center mb-4">
//                                     <motion.div
//                                         animate={{
//                                             rotate: [0, 360],
//                                         }}
//                                         transition={{
//                                             duration: 20,
//                                             repeat: Infinity,
//                                             ease: "linear"
//                                         }}
//                                     >
//                                         <Stars className="w-12 h-12 text-purple-500" />
//                                     </motion.div>
//                                 </div>
//                                 <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
//                                     {isLogin ? 'Welcome back' : 'Join the Community'}
//                                 </CardTitle>
//                             </motion.div>
//                             <CardDescription className="text-center">
//                                 {isLogin
//                                     ? 'Enter your credentials to continue your journey'
//                                     : 'Begin your adventure with us today'}
//                             </CardDescription>
//                         </CardHeader>

//                         <CardContent>
//                             <form onSubmit={onSubmit} className="space-y-4">
//                                 <AnimatePresence mode="wait">
//                                     <motion.div
//                                         key="form-fields"
//                                         initial={{ opacity: 0, x: -20 }}
//                                         animate={{ opacity: 1, x: 0 }}
//                                         exit={{ opacity: 0, x: 20 }}
//                                         className="space-y-4"
//                                     >
//                                         <div className="space-y-2">
//                                             <Label htmlFor="email">Email</Label>
//                                             <div className="relative">
//                                                 <Input
//                                                     id="email"
//                                                     type="email"
//                                                     value={email}
//                                                     onChange={(e) => setEmail(e.target.value)}
//                                                     onFocus={() => setFocusedField('email')}
//                                                     onBlur={() => setFocusedField(null)}
//                                                     className="pl-10 transition-all duration-300 border-2 focus:border-purple-500"
//                                                     required
//                                                 />
//                                                 <Zap
//                                                     className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-purple-500' : 'text-gray-400'
//                                                         }`}
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <Label htmlFor="password">Password</Label>
//                                             <div className="relative">
//                                                 <Input
//                                                     id="password"
//                                                     type="password"
//                                                     value={password}
//                                                     onChange={(e) => setPassword(e.target.value)}
//                                                     onFocus={() => setFocusedField('password')}
//                                                     onBlur={() => setFocusedField(null)}
//                                                     className="pl-10 transition-all duration-300 border-2 focus:border-purple-500"
//                                                     required
//                                                 />
//                                                 <Sparkles
//                                                     className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'password' ? 'text-purple-500' : 'text-gray-400'
//                                                         }`}
//                                                 />
//                                             </div>
//                                         </div>

//                                         <motion.div
//                                             whileHover={{ scale: 1.02 }}
//                                             whileTap={{ scale: 0.98 }}
//                                         >
//                                             <Button
//                                                 type="submit"
//                                                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
//                                                 disabled={isLoading}
//                                             >
//                                                 {isLoading ? (
//                                                     <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//                                                 ) : (
//                                                     <motion.span
//                                                         initial={{ opacity: 0 }}
//                                                         animate={{ opacity: 1 }}
//                                                         transition={{ duration: 0.3 }}
//                                                     >
//                                                         {isLogin ? 'Sign In' : 'Sign Up'}
//                                                     </motion.span>
//                                                 )}
//                                             </Button>
//                                         </motion.div>
//                                     </motion.div>
//                                 </AnimatePresence>
//                             </form>
//                         </CardContent>

//                         <CardFooter>
//                             <div className="w-full space-y-4">
//                                 <div className="relative">
//                                     <div className="absolute inset-0 flex items-center">
//                                         <span className="w-full border-t" />
//                                     </div>
//                                     <div className="relative flex justify-center text-xs uppercase">
//                                         <span className="bg-white/90 px-2 text-gray-500">
//                                             Or continue with
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                         <Button variant="outline" className="w-full hover:bg-gray-100/80">
//                                             <Icons.gitHub className="mr-2 h-4 w-4" />
//                                             Github
//                                         </Button>
//                                     </motion.div>
//                                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                                         <Button variant="outline" className="w-full hover:bg-gray-100/80">
//                                             <Icons.google className="mr-2 h-4 w-4" />
//                                             Google
//                                         </Button>
//                                     </motion.div>
//                                 </div>

//                                 <motion.div
//                                     whileHover={{ scale: 1.02 }}
//                                     whileTap={{ scale: 0.98 }}
//                                 >
//                                     <Button
//                                         type="button"
//                                         variant="link"
//                                         onClick={() => setIsLogin(!isLogin)}
//                                         className="w-full text-purple-600 hover:text-purple-700"
//                                     >
//                                         {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
//                                     </Button>
//                                 </motion.div>

//                                 <AnimatePresence>
//                                     {error && (
//                                         <motion.p
//                                             initial={{ opacity: 0, y: -10 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             exit={{ opacity: 0, y: -10 }}
//                                             className="text-sm font-medium text-red-500 text-center"
//                                         >
//                                             {error}
//                                         </motion.p>
//                                     )}
//                                 </AnimatePresence>
//                             </div>
//                         </CardFooter>
//                     </Card>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }

// "use client";
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence, useAnimation } from "framer-motion";
// import {
//     Sparkles,
//     Stars,
//     Zap,
//     Laptop,
//     Briefcase,
//     GraduationCap,
//     Book,
//     Trophy,
//     Users,
//     Code,
//     Rocket,
//     Brain,
// } from "lucide-react";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
//     CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Icons } from "@/components/ui/icons";
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// interface AuthFormProps {
//     onSubmit: (e: React.FormEvent) => Promise<void>;
//     isLoading: boolean;
//     error: string | null;
//     email: string;
//     setEmail: (email: string) => void;
//     password: string;
//     setPassword: (password: string) => void;
//     isLogin: boolean;
//     setIsLogin: (isLogin: boolean) => void;
// }

// const features = [
//     {
//         icon: Code,
//         text: "Showcase Projects",
//         description: "Display your best work",
//     },
//     {
//         icon: Users,
//         text: "Team Formation",
//         description: "Find like-minded collaborators",
//     },
//     { icon: Rocket, text: "Start Selling", description: "Launch your products" },
//     { icon: Trophy, text: "Get Certified", description: "Earn recognition" },
//     { icon: Brain, text: "Learn & Grow", description: "Develop new skills" },
// ];

// const containerVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: {
//         opacity: 1,
//         scale: 1,
//         transition: {
//             duration: 0.5,
//             staggerChildren: 0.1,
//         },
//     },
// };

// const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//         y: 0,
//         opacity: 1,
//         transition: { type: "spring", stiffness: 300, damping: 24 },
//     },
// };

// export default function AuthForm({
//     onSubmit,
//     isLoading,
//     error,
//     email,
//     setEmail,
//     password,
//     setPassword,
//     isLogin,
//     setIsLogin,
// }: AuthFormProps) {
//     const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
//         null
//     );
//     const [activeFeature, setActiveFeature] = useState<number | null>(null);
//     const controls = useAnimation();
//         const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLogin, setIsLogin] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const router = useRouter(); // Initialize router

//     useEffect(() => {
//         controls.start("visible");
//     }, []);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setIsLoading(true);

//         try {
//             if (isLogin) {
//                 await signInWithEmailAndPassword(auth, email, password);
//             } else {
//                 const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//                 // Create initial profile for new users
//                 await setDoc(doc(db, 'profiles', userCredential.user.uid), {
//                     userId: userCredential.user.uid,
//                     displayName: '',
//                     bio: '',
//                     location: '',
//                     skills: [],
//                     socialLinks: {
//                         github: '',
//                         linkedin: '',
//                         twitter: '',
//                         portfolio: ''
//                     },
//                     createdAt: new Date(),
//                     updatedAt: new Date()
//                 });
//             }
//             router.push('/profile'); // Redirect to profile after success
//         } catch (err) {
//             setError('Authentication failed. Please try again.' + err);
//         } finally {
//             setIsLoading(false);
//         }
//     };


//     const gradientBg = `
//         radial-gradient(circle at 100% 100%, #4338ca, transparent 40%),
//         radial-gradient(circle at 0% 0%, #7e22ce, transparent 40%),
//         linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #d946ef 100%)
//     `;

//     return (
//         <div
//             className="min-h-screen p-4 relative overflow-hidden"
//             style={{ background: gradientBg }}
//         >
//             {/* 3D Floating Elements */}
//             <div className="absolute inset-0 overflow-hidden perspective-1000">
//                 {[...Array(20)].map((_, i) => (
//                     <motion.div
//                         key={i}
//                         className="absolute"
//                         style={{
//                             width: Math.random() * 100 + 20,
//                             height: Math.random() * 100 + 20,
//                             background: `rgba(255, 255, 255, ${Math.random() * 0.1})`,
//                             borderRadius: "50%",
//                             filter: "blur(4px)",
//                             zIndex: 0,
//                         }}
//                         animate={{
//                             x: [
//                                 Math.random() * window.innerWidth,
//                                 Math.random() * window.innerWidth,
//                             ],
//                             y: [
//                                 Math.random() * window.innerHeight,
//                                 Math.random() * window.innerHeight,
//                             ],
//                             rotateX: [0, 360],
//                             rotateY: [0, 360],
//                         }}
//                         transition={{
//                             duration: Math.random() * 20 + 10,
//                             repeat: Infinity,
//                             ease: "linear",
//                         }}
//                     />
//                 ))}
//             </div>

//             <div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
//                 <motion.div
//                     variants={containerVariants}
//                     initial="hidden"
//                     animate="visible"
//                     className="w-full max-w-6xl relative z-10"
//                 >
//                     <div className="grid lg:grid-cols-2 gap-8 items-center">
//                         {/* Features Section */}
//                         <motion.div className="hidden lg:block space-y-8 p-8 bg-white/10 rounded-2xl backdrop-blur-lg">
//                             <motion.div variants={itemVariants} className="text-center">
//                                 <GraduationCap className="w-20 h-20 text-white mx-auto mb-6" />
//                                 <h1 className="text-4xl font-bold text-white mb-4">
//                                     Student Showcase
//                                 </h1>
//                                 <p className="text-white/80">
//                                     Where Innovation Meets Opportunity
//                                 </p>
//                             </motion.div>

//                             <div className="space-y-4">
//                                 {features.map((feature, index) => (
//                                     <motion.div
//                                         key={index}
//                                         variants={itemVariants}
//                                         onHoverStart={() => setActiveFeature(index)}
//                                         onHoverEnd={() => setActiveFeature(null)}
//                                         whileHover={{ scale: 1.05, x: 10 }}
//                                         className={`
//                                             flex items-center space-x-4 p-6 rounded-xl
//                                             transition-all duration-300 cursor-pointer
//                                             ${activeFeature === index
//                                                 ? "bg-white/20 shadow-lg"
//                                                 : "bg-white/10"
//                                             }
//                                         `}
//                                     >
//                                         <motion.div
//                                             animate={{
//                                                 rotate: activeFeature === index ? 360 : 0,
//                                                 scale: activeFeature === index ? 1.2 : 1,
//                                             }}
//                                             transition={{ duration: 0.3 }}
//                                             className="p-3 rounded-lg bg-white/20"
//                                         >
//                                             <feature.icon className="w-6 h-6 text-white" />
//                                         </motion.div>
//                                         <div>
//                                             <h3 className="text-white font-semibold">
//                                                 {feature.text}
//                                             </h3>
//                                             <p className="text-white/70 text-sm">
//                                                 {feature.description}
//                                             </p>
//                                         </div>
//                                     </motion.div>
//                                 ))}
//                             </div>
//                         </motion.div>

//                         {/* Auth Form */}
//                         <motion.div variants={itemVariants} className="relative">
//                             <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-xl opacity-80" />

//                             <Card className="relative overflow-hidden backdrop-blur-xl bg-white/90 border-0 shadow-2xl">
//                                 <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent" />

//                                 <CardHeader className="relative space-y-1">
//                                     <motion.div
//                                         animate={{
//                                             rotateY: [0, 360],
//                                         }}
//                                         transition={{
//                                             duration: 2,
//                                             repeat: Infinity,
//                                             ease: "linear",
//                                             repeatDelay: 5,
//                                         }}
//                                         className="flex justify-center mb-6"
//                                     >
//                                         <div className="p-4 bg-purple-500/10 rounded-full">
//                                             <Stars className="w-12 h-12 text-purple-600" />
//                                         </div>
//                                     </motion.div>

//                                     <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
//                                         {isLogin ? "Welcome Back!" : "Join the Innovation"}
//                                     </CardTitle>
//                                 </CardHeader>

//                                 <CardContent className="relative">
//                                     <form onSubmit={onSubmit} className="space-y-6">
//                                         <AnimatePresence mode="wait">
//                                             <motion.div
//                                                 key="form-fields"
//                                                 initial={{ x: -30, opacity: 0 }}
//                                                 animate={{ x: 0, opacity: 1 }}
//                                                 exit={{ x: 30, opacity: 0 }}
//                                                 transition={{
//                                                     type: "spring",
//                                                     stiffness: 500,
//                                                     damping: 30,
//                                                 }}
//                                                 className="space-y-4"
//                                             >
//                                                 <div className="space-y-2">
//                                                     <Label htmlFor="email" className="text-gray-700">
//                                                         Student Email
//                                                     </Label>
//                                                     <div className="relative group">
//                                                         <motion.div
//                                                             animate={{
//                                                                 scale: focusedField === "email" ? 1.2 : 1,
//                                                             }}
//                                                             className="absolute left-3 top-1/2 -translate-y-1/2"
//                                                         >
//                                                             <Zap
//                                                                 className={`w-5 h-5 transition-colors duration-300 ${focusedField === "email"
//                                                                     ? "text-purple-500"
//                                                                     : "text-gray-400"
//                                                                     }`}
//                                                             />
//                                                         </motion.div>
//                                                         <Input
//                                                             id="email"
//                                                             type="email"
//                                                             value={email}
//                                                             onChange={(e) => setEmail(e.target.value)}
//                                                             onFocus={() => setFocusedField("email")}
//                                                             onBlur={() => setFocusedField(null)}
//                                                             className={`
//                                 pl-12 h-12 bg-white/50 border-2
//                                 transition-all duration-300
//                                 focus:ring-4 ring-purple-500/20
//                                 ${focusedField === "email"
//                                                                     ? "border-purple-500 shadow-lg shadow-purple-500/20"
//                                                                     : "border-gray-200"
//                                                                 }
//                             `}
//                                                             required
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <div className="space-y-2">
//                                                     <Label htmlFor="password" className="text-gray-700">
//                                                         Password
//                                                     </Label>
//                                                     <div className="relative group">
//                                                         <motion.div
//                                                             animate={{
//                                                                 scale: focusedField === "password" ? 1.2 : 1,
//                                                                 rotate: focusedField === "password" ? 180 : 0,
//                                                             }}
//                                                             className="absolute left-3 top-1/2 -translate-y-1/2"
//                                                         >
//                                                             <Sparkles
//                                                                 className={`w-5 h-5 transition-colors duration-300 ${focusedField === "password"
//                                                                     ? "text-purple-500"
//                                                                     : "text-gray-400"
//                                                                     }`}
//                                                             />
//                                                         </motion.div>
//                                                         <Input
//                                                             id="password"
//                                                             type="password"
//                                                             value={password}
//                                                             onChange={(e) => setPassword(e.target.value)}
//                                                             onFocus={() => setFocusedField("password")}
//                                                             onBlur={() => setFocusedField(null)}
//                                                             className={`
//                                 pl-12 h-12 bg-white/50 border-2
//                                 transition-all duration-300
//                                 focus:ring-4 ring-purple-500/20
//                                 ${focusedField === "password"
//                                                                     ? "border-purple-500 shadow-lg shadow-purple-500/20"
//                                                                     : "border-gray-200"
//                                                                 }
//                             `}
//                                                             required
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <motion.div
//                                                     whileHover={{ scale: 1.02 }}
//                                                     whileTap={{ scale: 0.98 }}
//                                                 >
//                                                     <Button
//                                                         type="submit"
//                                                         className={`
//                             w-full h-12 relative overflow-hidden
//                             bg-gradient-to-r from-purple-600 to-pink-600
//                             hover:from-purple-700 hover:to-pink-700
//                             text-white text-lg font-semibold
//                             shadow-lg shadow-purple-500/30
//                             transition-all duration-300
//                         `}
//                                                         disabled={isLoading}
//                                                     >
//                                                         <AnimatePresence mode="wait">
//                                                             {isLoading ? (
//                                                                 <motion.div
//                                                                     key="loading"
//                                                                     initial={{ opacity: 0 }}
//                                                                     animate={{ opacity: 1 }}
//                                                                     exit={{ opacity: 0 }}
//                                                                     className="absolute inset-0 flex items-center justify-center"
//                                                                 >
//                                                                     <motion.div
//                                                                         animate={{ rotate: 360 }}
//                                                                         transition={{
//                                                                             duration: 1,
//                                                                             repeat: Infinity,
//                                                                             ease: "linear",
//                                                                         }}
//                                                                     >
//                                                                         <Icons.spinner className="w-6 h-6" />
//                                                                     </motion.div>
//                                                                 </motion.div>
//                                                             ) : (
//                                                                 <motion.span
//                                                                     key="text"
//                                                                     initial={{ opacity: 0, y: 20 }}
//                                                                     animate={{ opacity: 1, y: 0 }}
//                                                                     exit={{ opacity: 0, y: -20 }}
//                                                                     className="absolute inset-0 flex items-center justify-center"
//                                                                 >
//                                                                     {isLogin
//                                                                         ? "Welcome Back!"
//                                                                         : "Start Your Journey"}
//                                                                 </motion.span>
//                                                             )}
//                                                         </AnimatePresence>
//                                                     </Button>
//                                                 </motion.div>

//                                                 {error && (
//                                                     <motion.div
//                                                         key="error"
//                                                         initial={{ opacity: 0 }}
//                                                         animate={{ opacity: 1 }}
//                                                         exit={{ opacity: 0 }}
//                                                         className="text-red-500 text-sm text-center mt-2"
//                                                     >
//                                                         {error}
//                                                     </motion.div>
//                                                 )}

//                                                 <div className="text-center text-gray-500 text-sm">
//                                                     {isLogin ? (
//                                                         <span>
//                                                             Don’t have an account?{" "}
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => setIsLogin(false)}
//                                                                 className="text-purple-500 hover:underline focus:outline-none"
//                                                             >
//                                                                 Sign up here
//                                                             </button>
//                                                         </span>
//                                                     ) : (
//                                                         <span>
//                                                             Already have an account?{" "}
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => setIsLogin(true)}
//                                                                 className="text-purple-500 hover:underline focus:outline-none"
//                                                             >
//                                                                 Log in here
//                                                             </button>
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </motion.div>
//                                         </AnimatePresence>
//                                     </form>
//                                 </CardContent>

//                                 <CardFooter className="relative ">
//                                     <div className="text-center text-gray-400 text-xs">
//                                         By signing up, you agree to our{" "}
//                                         <a
//                                             href="/terms"
//                                             className="text-purple-500 hover:underline"
//                                         >
//                                             Terms of Service
//                                         </a>{" "}
//                                         and{" "}
//                                         <a
//                                             href="/privacy"
//                                             className="text-purple-500 hover:underline"
//                                         >
//                                             Privacy Policy
//                                         </a>
//                                         .
//                                     </div>
//                                 </CardFooter>
//                             </Card>
//                         </motion.div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }



"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
    Sparkles, Stars, Zap, Code, Rocket, Brain,
    Users, Trophy, GraduationCap
} from "lucide-react";
import {
    Card, CardContent, CardHeader,
    CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const features = [
    {
        icon: Code,
        text: "Showcase Projects",
        description: "Display your best work",
    },
    {
        icon: Users,
        text: "Team Formation",
        description: "Find like-minded collaborators",
    },
    {
        icon: Rocket,
        text: "Start Selling",
        description: "Launch your products"
    },
    {
        icon: Trophy,
        text: "Get Certified",
        description: "Earn recognition"
    },
    {
        icon: Brain,
        text: "Learn & Grow",
        description: "Develop new skills"
    },
];

const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 },
    },
};

export default function AuthForm() {
    const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
    const [activeFeature, setActiveFeature] = useState<number | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const controls = useAnimation();
    const router = useRouter();

    useEffect(() => {
        controls.start("visible");
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, 'profiles', userCredential.user.uid), {
                    userId: userCredential.user.uid,
                    displayName: '',
                    bio: '',
                    location: '',
                    skills: [],
                    socialLinks: {
                        github: '',
                        linkedin: '',
                        twitter: '',
                        portfolio: ''
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
            router.push('/profile');
        } catch (err) {
            setError('Authentication failed. Please try again: ' + err);
        } finally {
            setIsLoading(false);
        }
    };

    const gradientBg = `
        radial-gradient(circle at 100% 100%, #4338ca, transparent 40%),
        radial-gradient(circle at 0% 0%, #7e22ce, transparent 40%),
        linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #d946ef 100%)
    `;

    return (
        <div className="min-h-screen p-4 relative overflow-hidden" style={{ background: gradientBg }}>
            <div className="absolute inset-0 overflow-hidden perspective-1000">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            width: Math.random() * 100 + 20,
                            height: Math.random() * 100 + 20,
                            background: `rgba(255, 255, 255, ${Math.random() * 0.1})`,
                            borderRadius: "50%",
                            filter: "blur(4px)",
                            zIndex: 0,
                        }}
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                            rotateX: [0, 360],
                            rotateY: [0, 360],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-6xl relative z-10"
                >
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <motion.div className="hidden lg:block space-y-8 p-8 bg-white/10 rounded-2xl backdrop-blur-lg">
                            <motion.div variants={itemVariants} className="text-center">
                                <GraduationCap className="w-20 h-20 text-white mx-auto mb-6" />
                                <h1 className="text-4xl font-bold text-white mb-4">
                                    Student Showcase
                                </h1>
                                <p className="text-white/80">
                                    Where Innovation Meets Opportunity
                                </p>
                            </motion.div>

                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        onHoverStart={() => setActiveFeature(index)}
                                        onHoverEnd={() => setActiveFeature(null)}
                                        whileHover={{ scale: 1.05, x: 10 }}
                                        className={`
                                            flex items-center space-x-4 p-6 rounded-xl
                                            transition-all duration-300 cursor-pointer
                                            ${activeFeature === index ? "bg-white/20 shadow-lg" : "bg-white/10"}
                                        `}
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: activeFeature === index ? 360 : 0,
                                                scale: activeFeature === index ? 1.2 : 1,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="p-3 rounded-lg bg-white/20"
                                        >
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-white font-semibold">{feature.text}</h3>
                                            <p className="text-white/70 text-sm">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative">
                            <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-xl opacity-80" />

                            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/90 border-0 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent" />

                                <CardHeader className="relative space-y-1">
                                    <motion.div
                                        animate={{
                                            rotateY: [0, 360],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                            repeatDelay: 5,
                                        }}
                                        className="flex justify-center mb-6"
                                    >
                                        <div className="p-4 bg-purple-500/10 rounded-full">
                                            <Stars className="w-12 h-12 text-purple-600" />
                                        </div>
                                    </motion.div>

                                    <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                        {isLogin ? "Welcome Back!" : "Join the Innovation"}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="relative">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key="form-fields"
                                                initial={{ x: -30, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 30, opacity: 0 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30,
                                                }}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-gray-700">
                                                        Student Email
                                                    </Label>
                                                    <div className="relative group">
                                                        <motion.div
                                                            animate={{
                                                                scale: focusedField === "email" ? 1.2 : 1,
                                                            }}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2"
                                                        >
                                                            <Zap
                                                                className={`w-5 h-5 transition-colors duration-300 
                                                                ${focusedField === "email" ? "text-purple-500" : "text-gray-400"}`}
                                                            />
                                                        </motion.div>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            onFocus={() => setFocusedField("email")}
                                                            onBlur={() => setFocusedField(null)}
                                                            className={`
                                                                pl-12 h-12 bg-white/50 border-2
                                                                transition-all duration-300
                                                                focus:ring-4 ring-purple-500/20
                                                                ${focusedField === "email"
                                                                    ? "border-purple-500 shadow-lg shadow-purple-500/20"
                                                                    : "border-gray-200"}
                                                            `}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="password" className="text-gray-700">
                                                        Password
                                                    </Label>
                                                    <div className="relative group">
                                                        <motion.div
                                                            animate={{
                                                                scale: focusedField === "password" ? 1.2 : 1,
                                                                rotate: focusedField === "password" ? 180 : 0,
                                                            }}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2"
                                                        >
                                                            <Sparkles
                                                                className={`w-5 h-5 transition-colors duration-300 
                                                                ${focusedField === "password" ? "text-purple-500" : "text-gray-400"}`}
                                                            />
                                                        </motion.div>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            onFocus={() => setFocusedField("password")}
                                                            onBlur={() => setFocusedField(null)}
                                                            className={`
                                                                pl-12 h-12 bg-white/50 border-2
                                                                transition-all duration-300
                                                                focus:ring-4 ring-purple-500/20
                                                                ${focusedField === "password"
                                                                    ? "border-purple-500 shadow-lg shadow-purple-500/20"
                                                                    : "border-gray-200"}
                                                            `}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Button
                                                        type="submit"
                                                        className={`
                                                            w-full h-12 relative overflow-hidden
                                                            bg-gradient-to-r from-purple-600 to-pink-600
                                                            hover:from-purple-700 hover:to-pink-700
                                                            text-white text-lg font-semibold
                                                            shadow-lg shadow-purple-500/30
                                                            transition-all duration-300
                                                        `}
                                                        disabled={isLoading}
                                                    >
                                                        <AnimatePresence mode="wait">
                                                            {isLoading ? (
                                                                <motion.div
                                                                    key="loading"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="absolute inset-0 flex items-center justify-center"
                                                                >
                                                                    <motion.div
                                                                        animate={{ rotate: 360 }}
                                                                        transition={{
                                                                            duration: 1,
                                                                            repeat: Infinity,
                                                                            ease: "linear",
                                                                        }}
                                                                    >
                                                                        <Icons.spinner className="w-6 h-6" />
                                                                    </motion.div>
                                                                </motion.div>
                                                            ) : (
                                                                <motion.span
                                                                    key="text"
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -20 }}
                                                                    className="absolute inset-0 flex items-center justify-center"
                                                                >
                                                                    {isLogin ? "Welcome Back!" : "Start Your Journey"}
                                                                </motion.span>
                                                            )}
                                                        </AnimatePresence>
                                                    </Button>
                                                </motion.div>

                                                {error && (
                                                    <motion.div
                                                        key="error"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="text-red-500 text-sm text-center mt-2"
                                                    >
                                                        {error}
                                                    </motion.div>
                                                )}

                                                <div className="text-center text-gray-500 text-sm">
                                                    {isLogin ? (
                                                        <span>
                                                            Don't have an account?{" "}
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsLogin(false)}
                                                                className="text-purple-500 hover:underline focus:outline-none"
                                                            >
                                                                Sign up here
                                                            </button>
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            Already have an account?{" "}
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsLogin(true)}
                                                                className="text-purple-500 hover:underline focus:outline-none"
                                                            >
                                                                Log in here
                                                            </button>
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </form>
                                </CardContent>

                                <CardFooter className="relative">
                                    <div className="text-center text-gray-400 text-xs">
                                        By signing up, you agree to our{" "}
                                        <a href="/terms" className="text-purple-500 hover:underline">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="/privacy" className="text-purple-500 hover:underline">
                                            Privacy Policy
                                        </a>
                                        .
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}