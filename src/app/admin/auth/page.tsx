'use client'

import { useState, useEffect } from 'react';
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/adminUseAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';

export default function AdminAuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { user, isAdmin } = useAuth();

    useEffect(() => {
        if (user && isAdmin) {
            router.push('/admin/store');
        }
    }, [user, isAdmin, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, 'adminUsers', userCredential.user.uid), {
                    email: userCredential.user.email,
                    isAdmin: true
                });
            }

            const adminDoc = await getDoc(doc(db, 'adminUsers', userCredential.user.uid));
            if (adminDoc.exists() && adminDoc.data().isAdmin) {
                toast({
                    title: "Success",
                    description: isLogin ? "Admin logged in successfully." : "Admin account created successfully.",
                });
                router.push('/admin/store');
            } else {
                throw new Error("User is not an admin");
            }
        } catch (err) {
            console.error('Authentication failed:', err);
            toast({
                title: "Error",
                description: "Authentication failed. Please ensure you have admin privileges.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#020817] text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="relative backdrop-blur-2xl bg-white bg-opacity-10 border border-gray-800 shadow-2xl">
                        <CardContent className="p-6">
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <UserIcon size={40} className="text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-center mb-6">
                                {isLogin ? 'Admin Login' : 'Create Admin Account'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="pl-10 pr-4 py-2 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
                                        />
                                        <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-300">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10 pr-4 py-2 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
                                        />
                                        <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 ease-in-out"
                                        disabled={isLoading}
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={isLoading ? 'loading' : 'ready'}
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
                                            </motion.span>
                                        </AnimatePresence>
                                    </Button>
                                </motion.div>
                            </form>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="w-full mt-4 text-blue-400 hover:text-blue-300 transition duration-300 ease-in-out"
                                >
                                    {isLogin ? 'Need to create an admin account?' : 'Already have an admin account?'}
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

