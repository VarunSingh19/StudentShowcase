import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AnimatedRegistrationButton = ({ onClick }) => {
    return (
        <div className="relative group">
            {/* Animated background gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-lg blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>

            {/* Main button */}
            <motion.button
                onClick={onClick}
                className="relative px-8 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
            >
                <span className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
                    <span className="pr-6 text-gray-100 text-lg font-semibold">Registration</span>
                </span>

                {/* Animated gradient border */}
                <motion.span
                    className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200"
                    animate={{
                        color: ['#818cf8', '#ec4899', '#818cf8'],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    Join Now →
                </motion.span>

                {/* Particle effects on hover */}
                <div className="absolute -top-2 -right-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                </div>
                <div className="absolute -bottom-2 -left-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300"></div>
                </div>
            </motion.button>
        </div>
    );
};

export default AnimatedRegistrationButton;