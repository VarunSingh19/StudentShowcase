// import './globals.css'
// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { AuthDebug } from '@/components/AuthDebug'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Student Showcase',
//   description: `
//   The Team Collaboration and Management Platform is a web-based application designed to help users 
// create, join, and manage teams for various collaborative projects. Built with a focus on usability and 
// scalability, the platform supports team creation, member management, skill-based matchmaking, 
// and secure communication. This project leverages cutting-edge web development technologies, 
// providing a seamless experience for both individual users and teams working on shared goals.
//   `,
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <nav className="bg-gray-800 text-white p-4">
//           <div className="container mx-auto flex justify-between items-center">
//             <Link href="/" className="text-xl font-bold">Task Manager</Link>
//             <div>
//               <Link href="/">
//                 <Button variant="ghost">Home</Button>
//               </Link>
//               <Link href="/upload-project">
//                 <Button variant="ghost">Upload Project</Button>
//               </Link>
//               <Link href="/projects">
//                 <Button variant="ghost">Projects</Button>
//               </Link>
//               <Link href="/admin">
//                 <Button variant="ghost">Admin</Button>
//               </Link>
//               <Link href="/profile">
//                 <Button variant="ghost">Profile</Button>
//               </Link>
//               <Link href="/teams">
//                 <Button variant="ghost">Teams</Button>
//               </Link>
//               <Link href="/certificates">
//                 <Button variant="ghost">Certificates</Button>
//               </Link>
//               <Link href="/tasklist">
//                 <Button variant="ghost">Tasks</Button>
//               </Link>
//               <Link href="/resume-builder">
//                 <Button variant="ghost">Resume Builder</Button>
//               </Link>
//             </div>
//           </div>
//         </nav>
//         <main className="container mx-auto mt-8">
//           {children}
//         </main>
//         <AuthDebug />
//       </body>
//     </html>
//   )
// }

// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { Inter } from 'next/font/google';
// import { Menu, X, Layers } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import './globals.css';
// import { Footer } from '@/components/Footer';

// const inter = Inter({ subsets: ['latin'] });

// // export const metadata = {
// //   title: 'Student Showcase',
// //   description: ' The Team Collaboration and Management Platform is a web-based application designed to help users create, join, and manage teams for various collaborative projects. Built with a focus on usability and  scalability, the platform supports team creation, member management, skill-based matchmaking, and secure communication. This project leverages cutting-edge web development technologies, providing a seamless experience for both individual users and teams working on shared goals. ',
// // };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const navItems = [
//     { href: '/', label: 'Home' },
//     { href: '/upload-project', label: 'Upload Project' },
//     { href: '/projects', label: 'Projects' },
//     { href: '/admin', label: 'Admin' },
//     { href: '/profile', label: 'Profile' },
//     { href: '/teams', label: 'Teams' },
//     { href: '/certificates', label: 'Certificates' },
//     { href: '/tasklist', label: 'Tasks' },
//     { href: '/resume-builder', label: 'Resume Builder' },
//   ];

//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen`}>
//         <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-90 backdrop-blur-md">
//           <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//             {/* Logo */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="flex items-center"
//             >
//               <Layers className="text-white mr-2" size={32} />
//               <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
//                 Student Showcase
//               </span>
//             </motion.div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex space-x-6 items-center">
//               {navItems.map((item) => (
//                 <motion.div
//                   key={item.href}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="relative group"
//                 >
//                   <Link href={item.href} className="block">
//                     <span className="relative z-10 text-white hover:text-purple-300 transition-colors duration-300">
//                       {item.label}
//                     </span>
//                     <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Mobile Menu Toggle */}
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               className="md:hidden text-white"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </motion.button>
//           </div>

//           {/* Mobile Menu */}
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: -50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -50 }}
//                 className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md"
//               >
//                 <div className="container mx-auto px-4 py-6 space-y-4">
//                   {navItems.map((item) => (
//                     <motion.div
//                       key={item.href}
//                       whileHover={{ x: 10 }}
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       <Link
//                         href={item.href}
//                         className="block text-white text-lg py-2 border-b border-gray-700 hover:text-purple-400 transition-colors"
//                       >
//                         {item.label}
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </nav>

//         {/* Main Content with Top Padding */}
//         <main className="pt-24 container mx-auto px-4">
//           {children}
//         </main>
//         <Footer />
//       </body>
//     </html>
//   );
// }












// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { Inter } from 'next/font/google';
// import { Menu, X, Layers } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import './globals.css';
// import { Footer } from '@/components/Footer';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//   const [isLoggedIn, setIsLoggedIn] = React.useState(false);
//   const navItems =
//     isLoggedIn ?
//       [
//         { href: '/', label: 'Home' },
//         { href: '/upload-project', label: 'Upload Project' },
//         { href: '/projects', label: 'Projects' },
//         { href: '/admin', label: 'Admin' },
//         { href: '/profile', label: 'Profile' },
//         { href: '/teams', label: 'Teams' },
//         { href: '/certificates', label: 'Certificates' },
//         { href: '/tasklist', label: 'Tasks' },
//         { href: '/resume-builder', label: 'Resume Builder' },
//         { href: '/leaderboard', label: 'Leaderboard' },
//         { href: '/authform', label: 'Registration' },
//       ]
//       :
//       [
//         { href: '/', label: 'Home' },
//         { href: '/authform', label: 'Registration' },
//       ];

//   return (
//     <html lang="en">
//       <body className={`${inter.className} min-h-screen bg-gray-100`}> {/* Changed body background */}
//         <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-opacity-90 backdrop-blur-md"> {/* Moved gradient theme here */}
//           <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//             {/* Logo */}
//             <Link href={'/'}>
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="flex items-center relative"
//               >
//                 <div className="relative">
//                   <Layers className="text-white mr-2 animate-pulse" size={32} />
//                   <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1.2, opacity: 1 }}
//                     transition={{ duration: 1, yoyo: Infinity }}
//                     className="absolute inset-0 rounded-full bg-purple-500 opacity-50 blur-lg"
//                   ></motion.div>
//                 </div>
//                 <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">Student Showcase</span>
//               </motion.div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex space-x-6 items-center">
//               {navItems.map((item) => (
//                 <motion.div
//                   key={item.href}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="relative group"
//                 >
//                   <Link href={item.href} className="block">
//                     <span className="relative z-10 text-white hover:text-purple-300 transition-colors duration-300">
//                       {item.label}
//                     </span>
//                     <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Mobile Menu Toggle */}
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               className="md:hidden text-white"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </motion.button>
//           </div>

//           {/* Mobile Menu */}
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: -50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -50 }}
//                 className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md"
//               >
//                 <div className="container mx-auto px-4 py-6 space-y-4">
//                   {navItems.map((item) => (
//                     <motion.div
//                       key={item.href}
//                       whileHover={{ x: 10 }}
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       <Link
//                         href={item.href}
//                         className="block text-white text-lg py-2 border-b border-gray-700 hover:text-purple-400 transition-colors"
//                       >
//                         {item.label}
//                       </Link>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </nav>

//         {/* Main Content with Top Padding */}
//         <main className="pt-24 container mx-auto px-4">
//           {children}
//         </main>
//         <Footer />
//       </body>
//     </html>
//   );
// }



// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { Inter } from 'next/font/google';
// import { Menu, X, Layers, LogOut } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import './globals.css';
// import { Footer } from '@/components/Footer';
// import { useAuth } from '@/hooks/useAuth';
// import { Button } from '@/components/ui/button';
// import { auth } from '../lib/firebase';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const navItems = user
//     ? [
//       { href: '/', label: 'Home' },
//       { href: '/upload-project', label: 'Upload Project' },
//       { href: '/projects', label: 'Projects' },
//       { href: '/admin', label: 'Admin' },
//       { href: '/profile', label: 'Profile' },
//       { href: '/teams', label: 'Teams' },
//       { href: '/certificates', label: 'Certificates' },
//       { href: '/tasklist', label: 'Tasks' },
//       { href: '/resume-builder', label: 'Resume Builder' },
//       { href: '/leaderboard', label: 'Leaderboard' },
//       { href: '/jobportal', label: 'Job Portal' },
//     ]
//     : [
//       { href: '/', label: 'Home' },
//       { href: '/authform', label: 'Registration' },
//     ];

//   return (
//     <html lang="en">
//       <body className={`${inter.className} min-h-screen bg-gray-100`}>
//         <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-opacity-90 backdrop-blur-md">
//           <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//             {/* Logo */}
//             <Link href={'/'}>
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="flex items-center relative"
//               >
//                 <div className="relative">
//                   <Layers className="text-white mr-2 animate-pulse" size={32} />
//                   <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1.2, opacity: 1 }}
//                     transition={{ duration: 1, yoyo: Infinity }}
//                     className="absolute inset-0 rounded-full bg-purple-500 opacity-50 blur-lg"
//                   ></motion.div>
//                 </div>
//                 <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">Student Showcase</span>
//               </motion.div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex space-x-6 items-center">
//               {navItems.map((item) => (
//                 <motion.div
//                   key={item.href}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="relative group"
//                 >
//                   <Link href={item.href} className="block">
//                     <span className="relative z-10 text-white hover:text-purple-300 transition-colors duration-300">
//                       {item.label}
//                     </span>
//                     <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//                   </Link>
//                 </motion.div>
//               ))}

//               {/* Logout Button */}
//               {user && (
//                 <div className="flex justify-center mt-8">
//                   <motion.div
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Button
//                       onClick={() => auth.signOut()}
//                       className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
//                     >
//                       <LogOut className="mr-2" size={20} /> Log Out
//                     </Button>
//                   </motion.div>
//                 </div>
//               )}
//             </div>

//             {/* Mobile Menu Toggle */}
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               className="md:hidden text-white"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </motion.button>
//           </div>

//           {/* Mobile Menu */}
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: -50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -50 }}
//                 className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md"
//               >
//                 <div className="container mx-auto px-4 py-6 space-y-4">
//                   {navItems.map((item) => (
//                     <motion.div
//                       key={item.href}
//                       whileHover={{ x: 10 }}
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       <Link
//                         href={item.href}
//                         className="block text-white text-lg py-2 border-b border-gray-700 hover:text-purple-400 transition-colors"
//                       >
//                         {item.label}
//                       </Link>
//                     </motion.div>
//                   ))}

//                   {/* Mobile Logout Button */}
//                   {user && (
//                     <div className="flex justify-center mt-8">
//                       <motion.div
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         <Button
//                           onClick={() => auth.signOut()}
//                           className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
//                         >
//                           <LogOut className="mr-2" size={20} /> Log Out
//                         </Button>
//                       </motion.div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </nav>

//         {/* Main Content with Top Padding */}
//         <main className="pt-24 container mx-auto px-4">
//           {children}
//         </main>
//         <Footer />
//       </body>
//     </html>
//   );
// }


// "use client";

// import React from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Inter } from 'next/font/google';
// import { Menu, X, Layers, LogOut, ChevronDown } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import './globals.css';
// import { Footer } from '@/components/Footer';
// import { useAuth } from '@/hooks/useAuth';
// import { Button } from '@/components/ui/button';
// import { auth } from '../lib/firebase';
// import { MegaMenu } from '@/components/MegaMenu';
// import { LoadingBar } from '@/components/LoadingBar';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//   const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
//   const router = useRouter();

//   const menuCategories = [
//     {
//       name: 'Main',
//       items: [
//         { href: '/', label: 'Home' },
//         { href: '/upload-project', label: 'Upload Project' },
//         { href: '/projects', label: 'Projects' },
//       ],
//     },
//     {
//       name: 'User',
//       items: [
//         { href: '/profile', label: 'Profile' },
//         { href: '/teams', label: 'Teams' },
//         { href: '/certificates', label: 'Certificates' },
//         { href: '/tasklist', label: 'Tasks' },
//       ],
//     },
//     {
//       name: 'Career',
//       items: [
//         { href: '/resume-builder', label: 'Resume Builder' },
//         { href: '/leaderboard', label: 'Leaderboard' },
//         { href: '/jobportal', label: 'Job Portal' },
//       ],
//     },
//   ];

//   const allNavItems = menuCategories.flatMap(category => category.items);

//   const handleNavigation = (href: string) => {
//     router.push(href);
//     setIsMenuOpen(false);
//     setIsMegaMenuOpen(false);
//   };

//   return (
//     <html lang="en">
//       <body className={`${inter.className} min-h-screen bg-gray-100`}>
//         <LoadingBar />
//         <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-opacity-90 backdrop-blur-md">
//           <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//             {/* Logo */}
//             <div onClick={() => handleNavigation('/')} className="cursor-pointer">
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="flex items-center relative"
//               >
//                 <div className="relative">
//                   <Layers className="text-white mr-2 animate-pulse" size={32} />
//                   <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1.2, opacity: 1 }}
//                     transition={{ duration: 1, yoyo: Infinity }}
//                     className="absolute inset-0 rounded-full bg-purple-500 opacity-50 blur-lg"
//                   ></motion.div>
//                 </div>
//                 <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">Student Showcase</span>
//               </motion.div>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex space-x-6 items-center">
//               <motion.div
//                 onHoverStart={() => setIsMegaMenuOpen(true)}
//                 onHoverEnd={() => setIsMegaMenuOpen(false)}
//               >
//                 <button
//                   className="text-white hover:text-purple-300 transition-colors duration-300 flex items-center"
//                   onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
//                 >
//                   Menu <ChevronDown className="ml-1" size={16} />
//                 </button>
//                 <AnimatePresence>
//                   {isMegaMenuOpen && (
//                     <MegaMenu
//                       categories={menuCategories}
//                       onItemClick={(href) => handleNavigation(href)}
//                     />
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {user && (
//                 <>
//                   <button onClick={() => handleNavigation('/admin')} className="text-white hover:text-purple-300 transition-colors duration-300">
//                     Admin
//                   </button>
//                   <motion.div whileTap={{ scale: 0.95 }}>
//                     <Button
//                       onClick={() => auth.signOut()}
//                       className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
//                     >
//                       <LogOut className="mr-2" size={20} /> Log Out
//                     </Button>
//                   </motion.div>
//                 </>
//               )}

//               {!user && (
//                 <button onClick={() => handleNavigation('/authform')} className="text-white hover:text-purple-300 transition-colors duration-300">
//                   Registration
//                 </button>
//               )}
//             </div>

//             {/* Mobile Menu Toggle */}
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               className="md:hidden text-white"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </motion.button>
//           </div>

//           {/* Mobile Menu */}
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md overflow-hidden"
//               >
//                 <div className="container mx-auto px-4 py-6 space-y-4">
//                   {menuCategories.map((category, index) => (
//                     <div key={index} className="mb-4">
//                       <h3 className="text-lg font-semibold text-purple-400 mb-2">{category.name}</h3>
//                       {category.items.map((item) => (
//                         <motion.div
//                           key={item.href}
//                           whileHover={{ x: 10 }}
//                           onClick={() => handleNavigation(item.href)}
//                         >
//                           <button
//                             className="block text-white text-base py-2 hover:text-purple-300 transition-colors w-full text-left"
//                           >
//                             {item.label}
//                           </button>
//                         </motion.div>
//                       ))}
//                     </div>
//                   ))}

//                   {/* Mobile Logout Button */}
//                   {user && (
//                     <div className="flex justify-center mt-8">
//                       <motion.div whileTap={{ scale: 0.95 }}>
//                         <Button
//                           onClick={() => {
//                             auth.signOut();
//                             setIsMenuOpen(false);
//                           }}
//                           className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
//                         >
//                           <LogOut className="mr-2" size={20} /> Log Out
//                         </Button>
//                       </motion.div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </nav>

//         {/* Main Content with Top Padding */}
//         <main className="pt-24 container mx-auto px-4">
//           {children}
//         </main>
//         <Footer />
//       </body>
//     </html>
//   );
// }



"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import { Menu, X, Layers, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './globals.css';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { auth } from '../lib/firebase';
import { MegaMenu } from '@/components/MegaMenu';
import { LoadingBar } from '@/components/LoadingBar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const router = useRouter();

  const menuCategories = [
    {
      name: 'Main',
      items: [
        { href: '/', label: 'Home' },
        { href: '/upload-project', label: 'Upload Project' },
        { href: '/projects', label: 'Projects' },
        { href: '/users', label: 'All Users' },
      ],
    },
    {
      name: 'User',
      items: [
        { href: '/profile', label: 'Profile' },
        { href: '/teams', label: 'Teams' },
        { href: '/certificates', label: 'Certificates' },
        { href: '/tasklist', label: 'Tasks' },
      ],
    },
    {
      name: 'Career',
      items: [
        { href: '/resume-builder', label: 'Resume Builder' },
        { href: '/leaderboard', label: 'Leaderboard' },
        { href: '/jobportal', label: 'Job Portal' },
      ],
    },
  ];


  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
    setIsMegaMenuOpen(false);
  };

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <LoadingBar />
        <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-opacity-90 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo */}
            <div onClick={() => handleNavigation('/')} className="cursor-pointer">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center relative"
              >
                <div className="relative">
                  <Layers className="text-white mr-2 animate-pulse" size={32} />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ duration: 1, yoyo: Infinity }}
                    className="absolute inset-0 rounded-full bg-purple-500 opacity-50 blur-lg"
                  ></motion.div>
                </div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">Student Showcase</span>
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
                  <button onClick={() => handleNavigation('/profile')} className="text-white hover:text-purple-300 transition-colors duration-300">
                    User
                  </button>
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
                  <button onClick={() => handleNavigation('/authform')} className="text-white hover:text-purple-300 transition-colors duration-300">
                    Registration
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md overflow-hidden"
              >
                <div className="container mx-auto px-4 py-6 space-y-4">
                  {user ? (
                    menuCategories.map((category, index) => (
                      <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">{category.name}</h3>
                        {category.items.map((item) => (
                          <motion.div
                            key={item.href}
                            whileHover={{ x: 10 }}
                            onClick={() => handleNavigation(item.href)}
                          >
                            <button
                              className="block text-white text-base py-2 hover:text-purple-300 transition-colors w-full text-left"
                            >
                              {item.label}
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="mb-4">
                      <motion.div
                        whileHover={{ x: 10 }}
                        onClick={() => handleNavigation('/authform')}
                      >
                        <button
                          className="block text-white text-base py-2 hover:text-purple-300 transition-colors w-full text-left"
                        >
                          Registration
                        </button>
                      </motion.div>
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

        {/* Main Content with Top Padding */}
        <main className="pt-24 container mx-auto px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

