
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { Menu, X, Layers, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { auth, db } from "../lib/firebase";
import { MegaMenu } from "@/components/MegaMenu";
import { LoadingBar } from "@/components/LoadingBar";
import { doc, getDoc } from "firebase/firestore";
import { HeaderImageModal } from "@/components/HeaderImageModal";
import Link from "next/link";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import AnimatedRegistrationButton from "@/components/AnimatedRegistrationButton";

interface MenuItem {
  href?: string;
  label: string;
  subItems?: MenuItem[];
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface UserProfile {
  userId: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading, authChecked } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Determine if we should hide the header and footer for portfolio routes
  const hideHeaderFooter = pathname.startsWith("/portfolio/");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !isAdmin) {
        try {
          const userDoc = await getDoc(doc(db, "profiles", user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as Partial<UserProfile>);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user, isAdmin]);

  const menuCategories: MenuCategory[] = React.useMemo(() => {
    if (isAdmin) {
      return [
        {
          name: "Admin",
          items: [{ href: "/admin", label: "Admin Dashboard" }],
        },
      ];
    } else {
      return [
        {
          name: "Main",
          items: [
            { href: "/upload-project", label: "Upload Project" },
            { href: "/projects", label: "Projects" },
            { href: "/users", label: "All Users" },
            { href: "/search", label: "Search Student" },
          ],
        },
        {
          name: "User",
          items: [
            {
              label: "Teams",
              subItems: [
                { href: "/teams", label: "View Teams" },
                { href: "/teams/create", label: "Create Team" },
              ],
            },
            { href: "/certificates", label: "Certificates" },
            { href: "/tasklist", label: "TaskAI" },
          ],
        },
        {
          name: "Career",
          items: [
            { href: "/resume-builder", label: "Resume Builder" },
            { href: "/leaderboard", label: "Leaderboard" },
            { href: "/jobportal", label: "Job Portal" },
            { href: "/skill-assessment", label: "Skill Assessment" },
          ],
        },
        {
          name: "Store",
          items: [
            { href: "/store", label: "Store" },
            { href: "/profile/orders", label: "Your Orders" },
            { href: "/profile/liked-products", label: "Liked Products" },
          ],
        },
      ];
    }
  }, [isAdmin]);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
  };

  if (loading || !authChecked) {
    return (
      <html lang="en">
        <head>
          <title>Loading...</title>
        </head>
        <body>
          <LoadingBar />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>{isAdmin ? "Admin Dashboard" : "Student Showcase"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        {/* Conditionally render header */}
        {!hideHeaderFooter && (
          <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-opacity-90 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              {/* Logo */}
              <div
                onClick={() => handleNavigation("/")}
                className="cursor-pointer"
              >
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center relative"
                >
                  <div className="relative">
                    <Layers
                      className="text-white mr-2 animate-pulse"
                      size={32}
                    />
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      transition={{ duration: 1, yoyo: Infinity }}
                      className="absolute inset-0 rounded-full bg-purple-500 opacity-50 blur-lg"
                    ></motion.div>
                  </div>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
                    {isAdmin ? "Admin Dashboard" : "Student Showcase"}
                  </span>
                </motion.div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-6 items-center">
                {user && (
                  <motion.div
                    onHoverStart={() => setIsMegaMenuOpen(true)}
                    onHoverEnd={() => setIsMegaMenuOpen(false)}
                  >
                    <button
                      className="text-white hover:text-purple-300 transition-colors duration-300 flex items-center"
                      onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                    >
                      Menu <ChevronDown className="ml-1" size={16} />
                    </button>
                    <AnimatePresence>
                      {isMegaMenuOpen && (
                        <MegaMenu
                          categories={menuCategories}
                          onItemClick={(href) => handleNavigation(href)}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
                {user && (
                  <>
                    {!isAdmin && profile && (
                      <button className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors duration-300">
                        <HeaderImageModal
                          src={profile.avatarUrl || "/studentshowcase.jpg"}
                          alt={profile.displayName || "User"}
                        />
                        <Link href={"/profile"}>
                          <span>{profile.displayName || "Username"}</span>
                        </Link>
                      </button>
                    )}
                    <NotificationsDropdown />
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => auth.signOut()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <LogOut className="mr-2" size={20} /> Log Out
                      </Button>
                    </motion.div>
                  </>
                )}

                {!user && (
                  <>
                    <AnimatedRegistrationButton
                      onClick={() => handleNavigation("/authform")}
                    />
                  </>
                )}
              </div>

              {/* Mobile Navigation Section */}
              <div className="md:hidden flex items-center space-x-4">
                {user && !isAdmin && profile && (
                  <>
                    <div className="flex items-center space-x-2 max-w-[200px]">
                      <HeaderImageModal
                        src={profile.avatarUrl || "/studentshowcase.jpg"}
                        alt={profile.displayName || "User"}
                      />
                      <Link href="/profile">
                        <span className=" truncate text-sm  text-purple-400">
                          {profile.displayName || "User"}
                        </span>
                      </Link>
                    </div>
                    <NotificationsDropdown />
                  </>
                )}

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md overflow-hidden"
                >
                  <div className="container mx-auto px-4 py-6 space-y-4">
                    {user && !isAdmin && profile && (
                      <div className="flex items-center space-x-2 mb-4">
                        <HeaderImageModal
                          src={profile.avatarUrl || "/placeholder.svg"}
                          alt={profile.displayName || "User"}
                        />
                        <Link href="/profile">
                          <span className=" truncate text-sm  text-purple-400">
                            {profile.displayName || "User"}
                          </span>
                        </Link>
                      </div>
                    )}
                    {user ? (
                      menuCategories.map((category, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="text-lg font-semibold text-purple-400 mb-2">
                            {category.name}
                          </h3>
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="mb-2">
                              {item.subItems ? (
                                <details className="group">
                                  <summary className="list-none flex justify-between items-center cursor-pointer">
                                    <span className="text-white text-base py-2">
                                      {item.label}
                                    </span>
                                    <ChevronDown
                                      className="text-white group-open:rotate-180 transition-transform"
                                      size={16}
                                    />
                                  </summary>
                                  <ul className="pl-4 mt-2 space-y-2">
                                    {item.subItems.map((subItem, subIndex) => (
                                      <li key={subIndex}>
                                        <button
                                          onClick={() =>
                                            handleNavigation(subItem.href!)
                                          }
                                          className="text-white hover:text-purple-300 transition-colors w-full text-left py-1"
                                        >
                                          {subItem.label}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </details>
                              ) : (
                                <motion.div
                                  whileHover={{ x: 10 }}
                                  onClick={() => handleNavigation(item.href!)}
                                >
                                  <button className="block text-white text-base py-2 hover:text-purple-300 transition-colors w-full text-left">
                                    {item.label}
                                  </button>
                                </motion.div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="mb-4">
                        <AnimatedRegistrationButton
                          onClick={() => handleNavigation("/authform")}
                        />
                      </div>
                    )}

                    {/* Mobile Logout Button */}
                    {user && (
                      <div className="flex justify-center mt-8">
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => {
                              auth.signOut();
                              setIsMenuOpen(false);
                            }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          >
                            <LogOut className="mr-2" size={20} /> Log Out
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        )}

        {/* Main Content */}
        <main className="pt-24 mx-auto">{children}</main>

        {/* Conditionally render footer */}
        {!hideHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
