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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { motion } from "framer-motion";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Initialize router

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Create initial profile for new users
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
            router.push('/profile'); // Redirect to profile after success
        } catch (err) {
            setError('Authentication failed. Please try again.' + err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {isLogin
                                ? 'Enter your credentials to access your account'
                                : 'Enter your details to create your account'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full">
                                    <Icons.gitHub className="mr-2 h-4 w-4" />
                                    Github
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Icons.google className="mr-2 h-4 w-4" />
                                    Google
                                </Button>
                            </div>
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => setIsLogin(!isLogin)}
                                className="w-full"
                            >
                                {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                            </Button>
                            {error && (
                                <p className="text-sm font-medium text-red-500 text-center">
                                    {error}
                                </p>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
