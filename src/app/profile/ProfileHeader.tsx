// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { Github, Linkedin, Twitter, Globe, Upload } from 'lucide-react';
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import type { UserProfile } from "@/types/profile";

// interface ProfileHeaderProps {
//     profile: Partial<UserProfile>;
//     onUpdate: (updatedProfile: Partial<UserProfile>) => void;
// }

// export function ProfileHeader({ profile, onUpdate }: ProfileHeaderProps) {
//     const [uploading, setUploading] = useState(false);
//     const { toast } = useToast();

//     const uploadImage = async (file: File) => {
//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             setUploading(true);

//             const response = await fetch('/api/upload', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             if (data.secure_url) {
//                 await updateProfileImage(data.secure_url);
//             }
//         } catch (error) {
//             console.error("Error uploading image:", error);
//             toast({
//                 title: "Error",
//                 description: "Failed to upload image. Please try again.",
//                 variant: "destructive",
//             });
//         } finally {
//             setUploading(false);
//         }
//     };

//     const updateProfileImage = async (imageUrl: string) => {
//         try {
//             if (!profile.userId) {
//                 throw new Error("User ID is missing");
//             }
//             await updateDoc(doc(db, "profiles", profile.userId), {
//                 avatarUrl: imageUrl,
//             });
//             const updatedProfile = { ...profile, avatarUrl: imageUrl };
//             onUpdate(updatedProfile);
//             toast({
//                 title: "Profile image updated",
//                 description: "Your profile image has been successfully updated.",
//             });
//         } catch (error) {
//             console.error("Error updating profile image:", error);
//             toast({
//                 title: "Error",
//                 description: "Failed to update profile image. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             uploadImage(file);
//         }
//     };

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-card text-card-foreground shadow-lg rounded-b-3xl p-8 mb-8"
//         >
//             <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
//                 <div className="relative">
//                     <Avatar className="w-32 h-32 border-4 border-primary">
//                         <AvatarImage
//                             src={profile.avatarUrl || "/placeholder.svg"}
//                             alt={profile.displayName || "User"}
//                         />
//                         <AvatarFallback>
//                             {profile.displayName?.charAt(0) || "U"}
//                         </AvatarFallback>
//                     </Avatar>
//                     <label htmlFor="avatar-upload" className="absolute bottom-0 right-0">
//                         <input
//                             id="avatar-upload"
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={handleImageUpload}
//                             disabled={uploading}
//                         />
//                         <Button variant="secondary" size="sm" asChild>
//                             <span>
//                                 {uploading ? (
//                                     "Uploading..."
//                                 ) : (
//                                     <>
//                                         <Upload className="w-4 h-4 mr-2" />
//                                         Change Image
//                                     </>
//                                 )}
//                             </span>
//                         </Button>
//                     </label>
//                 </div>
//                 <div className="text-center md:text-left space-y-4 flex-1">
//                     <h1 className="text-4xl font-bold">
//                         {profile.displayName || "User"}
//                     </h1>
//                     <p className="text-xl text-muted-foreground">
//                         {profile.bio || "No bio available"}
//                     </p>
//                     <div className="flex flex-wrap justify-center md:justify-start gap-2">
//                         {profile.skills?.map((skill) => (
//                             <Badge key={skill} variant="secondary">
//                                 {skill}
//                             </Badge>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="flex gap-4">
//                     {profile.socialLinks?.github && (
//                         <a
//                             href={profile.socialLinks.github}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
//                         </a>
//                     )}
//                     {profile.socialLinks?.linkedin && (
//                         <a
//                             href={profile.socialLinks.linkedin}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
//                         </a>
//                     )}
//                     {profile.socialLinks?.twitter && (
//                         <a
//                             href={profile.socialLinks.twitter}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
//                         </a>
//                     )}
//                     {profile.socialLinks?.portfolio && (
//                         <a
//                             href={profile.socialLinks.portfolio}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                         >
//                             <Globe className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
//                         </a>
//                     )}
//                 </div>
//             </div>
//         </motion.div>
//     );
// }

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'
import { Github, Linkedin, Twitter, Globe, Upload } from 'lucide-react'
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { UserProfile } from "@/types/profile"


interface ProfileHeaderProps {
    profile: Partial<UserProfile>
    onUpdate: (updatedProfile: UserProfile) => void  // Changed from Partial<UserProfile>
}

export function ProfileHeader({ profile, onUpdate }: ProfileHeaderProps) {
    const [uploading, setUploading] = useState(false)
    const { toast } = useToast()

    const uploadImage = async (file: File, type: 'profile' | 'project') => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Failed to upload image')
        }

        const data = await response.json()
        return data.secure_url
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                setUploading(true)
                const imageUrl = await uploadImage(file, 'profile')
                await updateProfileImage(imageUrl)
            } catch (error) {
                console.error('Error uploading image:', error)
                toast({
                    title: "Error",
                    description: "Failed to upload image. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setUploading(false)
            }
        }
    }

    // const updateProfileImage = async (imageUrl: string) => {
    //     try {
    //         if (!profile.userId) {
    //             throw new Error("User ID is missing")
    //         }
    //         await updateDoc(doc(db, "profiles", profile.userId), {
    //             avatarUrl: imageUrl,
    //         })
    //         const updatedProfile = { ...profile, avatarUrl: imageUrl }
    //         onUpdate(updatedProfile)
    //         toast({
    //             title: "Profile image updated",
    //             description: "Your profile image has been successfully updated.",
    //         })
    //     } catch (error) {
    //         console.error("Error updating profile image:", error)
    //         toast({
    //             title: "Error",
    //             description: "Failed to update profile image. Please try again.",
    //             variant: "destructive",
    //         })
    //     }
    // }

    const updateProfileImage = async (imageUrl: string) => {
        try {
            if (!profile.userId) {
                throw new Error("User ID is missing")
            }
            await updateDoc(doc(db, "profiles", profile.userId), {
                avatarUrl: imageUrl,
            })

            // Cast the merged profile to UserProfile
            const updatedProfile = {
                ...profile,
                avatarUrl: imageUrl
            } as UserProfile

            onUpdate(updatedProfile)
            toast({
                title: "Profile image updated",
                description: "Your profile image has been successfully updated.",
            })
        } catch (error) {
            console.error("Error updating profile image:", error)
            toast({
                title: "Error",
                description: "Failed to update profile image. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card text-card-foreground shadow-lg rounded-b-3xl p-8 mb-8"
        >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage
                            src={profile.avatarUrl || "/placeholder.svg"}
                            alt={profile.displayName || "User"}
                        />
                        <AvatarFallback>
                            {profile.displayName?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0">
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                        <Button variant="secondary" size="sm" asChild>
                            <span>
                                {uploading ? (
                                    "Uploading..."
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Change Image
                                    </>
                                )}
                            </span>
                        </Button>
                    </label>
                </div>
                <div className="text-center md:text-left space-y-4 flex-1">
                    <h1 className="text-4xl font-bold">
                        {profile.displayName || "User"}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {profile.bio || "No bio available"}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {profile.skills?.map((skill) => (
                            <Badge key={skill} variant="secondary">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    {profile.socialLinks?.github && (
                        <a
                            href={profile.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                        </a>
                    )}
                    {profile.socialLinks?.linkedin && (
                        <a
                            href={profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                        </a>
                    )}
                    {profile.socialLinks?.twitter && (
                        <a
                            href={profile.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                        </a>
                    )}
                    {profile.socialLinks?.portfolio && (
                        <a
                            href={profile.socialLinks.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Globe className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { useToast } from '@/hooks/use-toast'
// import { Github, Linkedin, Twitter, Globe, Upload, MapPin, Mail, Phone } from 'lucide-react'
// import { doc, updateDoc } from 'firebase/firestore'
// import { db } from '@/lib/firebase'
// import type { UserProfile } from '@/types/profile'

// interface ProfileHeaderProps {
//     profile: Partial<UserProfile>
//     onUpdate: (updatedProfile: Partial<UserProfile>) => void
// }

// export function ProfileHeader({ profile, onUpdate }: ProfileHeaderProps) {
//     const [uploading, setUploading] = useState(false)
//     const { toast } = useToast()

//     const uploadImage = async (file: File) => {
//         const formData = new FormData()
//         formData.append('file', file)
//         formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

//         try {
//             setUploading(true)
//             const response = await fetch(
//                 `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//                 {
//                     method: 'POST',
//                     body: formData,
//                 }
//             )
//             const data = await response.json()
//             if (data.secure_url) {
//                 await updateProfileImage(data.secure_url)
//             }
//         } catch (error) {
//             console.error('Error uploading image:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to upload image. Please try again.",
//                 variant: "destructive",
//             })
//         } finally {
//             setUploading(false)
//         }
//     }

//     const updateProfileImage = async (imageUrl: string) => {
//         try {
//             await updateDoc(doc(db, 'profiles', profile.userId!), {
//                 avatarUrl: imageUrl
//             })
//             onUpdate({ ...profile, avatarUrl: imageUrl })
//             toast({
//                 title: "Profile image updated",
//                 description: "Your profile image has been successfully updated.",
//             })
//         } catch (error) {
//             console.error('Error updating profile image:', error)
//             toast({
//                 title: "Error",
//                 description: "Failed to update profile image. Please try again.",
//                 variant: "destructive",
//             })
//         }
//     }

//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0]
//         if (file) {
//             uploadImage(file)
//         }
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-8 rounded-3xl shadow-xl"
//         >
//             <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
//                 <div className="relative">
//                     <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
//                         <AvatarImage src={profile.avatarUrl || '/placeholder.svg'} alt={profile.displayName || 'User'} />
//                         <AvatarFallback>{profile.displayName?.charAt(0) || 'U'}</AvatarFallback>
//                     </Avatar>
//                     <label htmlFor="avatar-upload" className="absolute bottom-0 right-0">
//                         <input
//                             id="avatar-upload"
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={handleImageUpload}
//                             disabled={uploading}
//                         />
//                         <Button variant="secondary" size="sm" className="rounded-full">
//                             <Upload className="w-4 h-4" />
//                         </Button>
//                     </label>
//                 </div>
//                 <div className="text-center md:text-left space-y-4 flex-1">
//                     <h1 className="text-4xl font-bold">{profile.displayName || 'User'}</h1>
//                     <p className="text-xl opacity-90">{profile.bio || 'No bio available'}</p>
//                     <div className="flex flex-wrap justify-center md:justify-start gap-2">
//                         {profile.skills?.map((skill) => (
//                             <Badge key={skill} variant="secondary" className="bg-white/20 text-white">
//                                 {skill}
//                             </Badge>
//                         ))}
//                     </div>
//                     <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm opacity-80">
//                         {profile.location && <div className="flex items-center"><MapPin size={16} className="mr-1" /> {profile.location}</div>}
//                         {profile.emailAddress && <div className="flex items-center"><Mail size={16} className="mr-1" /> {profile.emailAddress}</div>}
//                         {profile.phoneNumber && <div className="flex items-center"><Phone size={16} className="mr-1" /> {profile.phoneNumber}</div>}
//                     </div>
//                 </div>
//                 <div className="flex gap-4">
//                     {profile.socialLinks?.github && (
//                         <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
//                             <Github className="h-6 w-6" />
//                         </a>
//                     )}
//                     {profile.socialLinks?.linkedin && (
//                         <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
//                             <Linkedin className="h-6 w-6" />
//                         </a>
//                     )}
//                     {profile.socialLinks?.twitter && (
//                         <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
//                             <Twitter className="h-6 w-6" />
//                         </a>
//                     )}
//                     {profile.socialLinks?.portfolio && (
//                         <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
//                             <Globe className="h-6 w-6" />
//                         </a>
//                     )}
//                 </div>
//             </div>
//         </motion.div>
//     )
// }

