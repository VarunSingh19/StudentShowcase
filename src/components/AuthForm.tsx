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