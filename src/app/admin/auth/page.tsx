'use client'

import { useState } from 'react';
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/adminUseAuth';

export default function AdminAuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { user, isAdmin } = useAuth();

    // Redirect if user is already logged in and is an admin
    if (user && isAdmin) {
        router.push('/admin/store');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Set admin status in Firestore
                await setDoc(doc(db, 'adminUsers', userCredential.user.uid), {
                    email: userCredential.user.email,
                    isAdmin: true
                });
            }

            // Check if user is admin
            const adminDoc = await getDoc(doc(db, 'adminUsers', userCredential.user.uid));
            if (adminDoc.exists() && adminDoc.data().isAdmin) {
                toast({
                    title: "Success",
                    description: isLogin ? "Admin logged in successfully." : "Admin account created successfully.",
                });
                // Redirect to admin dashboard or store management page
                window.location.href = '/admin/store';
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{isLogin ? 'Admin Login' : 'Create Admin Account'}</CardTitle>
                    <CardDescription>
                        {isLogin ? 'Enter your credentials to access the admin panel' : 'Create a new admin account'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
                        </Button>
                    </form>
                    <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsLogin(!isLogin)}
                        className="w-full mt-4"
                    >
                        {isLogin ? 'Need to create an admin account?' : 'Already have an admin account?'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

