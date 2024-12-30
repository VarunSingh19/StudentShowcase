import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {


    const socialLinks = [
        {
            icon: Github,
            href: "https://github.com/your-organization",
            color: "text-gray-200 hover:text-white"
        },
        {
            icon: Linkedin,
            href: "https://linkedin.com/company/your-organization",
            color: "text-blue-400 hover:text-blue-300"
        },
        {
            icon: Twitter,
            href: "https://twitter.com/your-organization",
            color: "text-sky-400 hover:text-sky-300"
        },
        {
            icon: Mail,
            href: "mailto:contact@yourdomain.com",
            color: "text-red-400 hover:text-red-300"
        }
    ];

    const quickLinks = [
        { label: "Home", href: "/" },
        { label: "Profile", href: "/profile" },
        { label: "Upload Project", href: "/upload-project" },
        { label: "Projects", href: "/projects" },
        { label: "Teams", href: "/teams" },
        { label: "Certificates", href: "/certificates" },
        { label: "Tasks", href: "/tasklist" },
        { label: "Resume Builder", href: "/resume-builder" }
    ];

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Logo and Description */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Layers className="mr-2" size={32} />
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                Student Showcase
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Empowering students to collaborate, showcase their projects, and grow professionally.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`${social.color} transition-all duration-300`}
                                >
                                    <social.icon size={24} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            Quick Links
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {quickLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="text-gray-300 hover:text-purple-400 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact and Newsletter */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            Stay Connected
                        </h3>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-2 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-md transition-all"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-6 text-center">
                    <p className="text-gray-400">
                        © 2024 Student Showcase. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};