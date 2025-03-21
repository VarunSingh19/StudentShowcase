// "use client"
// import { useState, useEffect, useRef } from "react"
// import type React from "react"
// import { sha1 } from "js-sha1";
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//     doc,
//     getDoc,
//     updateDoc,
//     setDoc,
//     collection,
//     query,
//     where,
//     getDocs,
//     deleteDoc,
//     addDoc,
//     orderBy,
// } from "firebase/firestore"
// import { db } from "@/lib/firebase"
// import type { UserProfile } from "@/types/profile"
// import { toast } from "@/hooks/use-toast"
// import {
//     Copy,
//     ExternalLink,
//     Loader2,
//     Trash2,
//     User,
//     MessageSquare,
//     Eye,
//     Filter,
//     Settings2Icon,
//     FileText,
//     Plus,
//     Edit,
//     ImageIcon,
//     CodeIcon,
//     Save,
//     ArrowLeft,
//     Calendar,
//     Search,
// } from "lucide-react"
// import Link from "next/link"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
// } from "@/components/ui/dialog"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { cn } from "@/lib/utils"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

// // Define the types for portfolio messages and usernames
// interface PortfolioMessage {
//     id: string
//     name: string
//     email: string
//     message: string
//     createdAt: Date
//     isRead: boolean
// }

// interface UsernameRecord {
//     username: string
//     userId: string
//     createdAt: Date
// }

// // Define the type for blog posts
// interface BlogPost {
//     id: string
//     title: string
//     content: string
//     excerpt: string
//     coverImage: string
//     tags: string[]
//     status: "published" | "draft"
//     createdAt: Date
//     updatedAt: Date
//     slug: string
// }

// export function PortfolioContent({ userId, profile }: { userId: string; profile: UserProfile }) {
//     const [isPublic, setIsPublic] = useState(profile.portfolioSettings?.isPublic ?? true)
//     const [customUsername, setCustomUsername] = useState(profile.portfolioSettings?.customUsername || "")
//     const [isAvailable, setIsAvailable] = useState(true)
//     const [isChecking, setIsChecking] = useState(false)
//     const [isSaving, setIsSaving] = useState(false)
//     const [portfolioUrl, setPortfolioUrl] = useState("")
//     const [activeTab, setActiveTab] = useState("settings")

//     // Add states for messages and usernames
//     const [messages, setMessages] = useState<PortfolioMessage[]>([])
//     const [usernames, setUsernames] = useState<UsernameRecord[]>([])
//     const [loadingMessages, setLoadingMessages] = useState(false)
//     const [loadingUsernames, setLoadingUsernames] = useState(false)
//     const [deletingUsername, setDeletingUsername] = useState("")
//     const [deletingMessageId, setDeletingMessageId] = useState("")

//     // New states for enhanced message UI
//     const [selectedMessage, setSelectedMessage] = useState<PortfolioMessage | null>(null)
//     const [searchTerm, setSearchTerm] = useState("")
//     const [messageFilter, setMessageFilter] = useState<"all" | "read" | "unread">("all")
//     const [isDeleting, setIsDeleting] = useState(false)

//     // Blog states
//     const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
//     const [loadingBlogs, setLoadingBlogs] = useState(false)
//     const [blogView, setBlogView] = useState<"list" | "editor" | "preview">("list")
//     const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({
//         title: "",
//         content: "",
//         excerpt: "",
//         coverImage: "",
//         tags: [],
//         status: "draft",
//     })
//     const [savingBlog, setSavingBlog] = useState(false)
//     const [deletingBlogId, setDeletingBlogId] = useState("")
//     const [showDeleteBlogDialog, setShowDeleteBlogDialog] = useState(false)
//     const [blogSearchTerm, setBlogSearchTerm] = useState("")
//     const [blogStatusFilter, setBlogStatusFilter] = useState<"all" | "published" | "draft">("all")
//     const [newTag, setNewTag] = useState("")
//     const [uploadingImage, setUploadingImage] = useState(false)
//     const [editorMode, setEditorMode] = useState<"create" | "edit">("create")
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     // Generate portfolio URL based on username or user ID
//     useEffect(() => {
//         const username = customUsername || profile.displayName?.toLowerCase().replace(/\s+/g, "-") || userId
//         const baseUrl = window.location.origin
//         setPortfolioUrl(`${baseUrl}/portfolio/${username}`)
//     }, [customUsername, profile.displayName, userId])

//     // Fetch portfolio messages
//     useEffect(() => {
//         const fetchMessages = async () => {
//             if (activeTab === "messages") {
//                 setLoadingMessages(true)
//                 try {
//                     const messagesRef = collection(db, "portfolioMessages")
//                     const q = query(messagesRef, where("recipientId", "==", userId))
//                     const querySnapshot = await getDocs(q)

//                     const messagesList: PortfolioMessage[] = []
//                     querySnapshot.forEach((doc) => {
//                         const data = doc.data()
//                         messagesList.push({
//                             id: doc.id,
//                             name: data.name,
//                             email: data.email,
//                             message: data.message,
//                             createdAt: data.createdAt.toDate(),
//                             isRead: data.isRead || false,
//                         })
//                     })

//                     // Sort messages by date (newest first)
//                     messagesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
//                     setMessages(messagesList)
//                 } catch (error) {
//                     console.error("Error fetching messages:", error)
//                     toast({
//                         title: "Error loading messages",
//                         description: "There was a problem loading your portfolio messages",
//                         variant: "destructive",
//                     })
//                 } finally {
//                     setLoadingMessages(false)
//                 }
//             }
//         }

//         fetchMessages()
//     }, [userId, activeTab])

//     // Fetch usernames
//     useEffect(() => {
//         const fetchUsernames = async () => {
//             if (activeTab === "usernames") {
//                 setLoadingUsernames(true)
//                 try {
//                     const usernamesRef = collection(db, "portfolioUsernames")
//                     const q = query(usernamesRef, where("userId", "==", userId))
//                     const querySnapshot = await getDocs(q)

//                     const usernamesList: UsernameRecord[] = []
//                     querySnapshot.forEach((doc) => {
//                         const data = doc.data()
//                         usernamesList.push({
//                             username: doc.id,
//                             userId: data.userId,
//                             createdAt: data.createdAt.toDate(),
//                         })
//                     })

//                     setUsernames(usernamesList)
//                 } catch (error) {
//                     console.error("Error fetching usernames:", error)
//                     toast({
//                         title: "Error loading usernames",
//                         description: "There was a problem loading your portfolio usernames",
//                         variant: "destructive",
//                     })
//                 } finally {
//                     setLoadingUsernames(false)
//                 }
//             }
//         }

//         fetchUsernames()
//     }, [userId, activeTab])

//     // Fetch blog posts
//     useEffect(() => {
//         const fetchBlogPosts = async () => {
//             if (activeTab === "blog") {
//                 setLoadingBlogs(true)
//                 try {
//                     const blogsRef = collection(db, "portfolioBlogPosts")
//                     const q = query(blogsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
//                     const querySnapshot = await getDocs(q)

//                     const blogsList: BlogPost[] = []
//                     querySnapshot.forEach((doc) => {
//                         const data = doc.data()
//                         blogsList.push({
//                             id: doc.id,
//                             title: data.title,
//                             content: data.content,
//                             excerpt: data.excerpt,
//                             coverImage: data.coverImage,
//                             tags: data.tags || [],
//                             status: data.status,
//                             createdAt: data.createdAt.toDate(),
//                             updatedAt: data.updatedAt.toDate(),
//                             slug: data.slug,
//                         })
//                     })

//                     setBlogPosts(blogsList)
//                 } catch (error) {
//                     console.error("Error fetching blog posts:", error)
//                     toast({
//                         title: "Error loading blog posts",
//                         description: "There was a problem loading your blog posts",
//                         variant: "destructive",
//                     })
//                 } finally {
//                     setLoadingBlogs(false)
//                 }
//             }
//         }

//         fetchBlogPosts()
//     }, [userId, activeTab])

//     // Check username availability
//     const checkUsernameAvailability = async () => {
//         if (!customUsername) return

//         setIsChecking(true)
//         try {
//             // Check if username exists in any other profile
//             const profilesRef = doc(db, "portfolioUsernames", customUsername)
//             const docSnap = await getDoc(profilesRef)

//             // If document exists and belongs to another user
//             if (docSnap.exists() && docSnap.data().userId !== userId) {
//                 setIsAvailable(false)
//             } else {
//                 setIsAvailable(true)
//             }
//         } catch (error) {
//             console.error("Error checking username:", error)
//             // Assume username is available if there's an error checking
//             setIsAvailable(true)
//         } finally {
//             setIsChecking(false)
//         }
//     }

//     // Save portfolio settings
//     const savePortfolioSettings = async () => {
//         if (!isAvailable && customUsername) {
//             toast({
//                 title: "Username not available",
//                 description: "Please choose a different username for your portfolio",
//                 variant: "destructive",
//             })
//             return
//         }

//         setIsSaving(true)
//         try {
//             // Update profile with portfolio settings
//             const profileRef = doc(db, "profiles", userId)
//             await updateDoc(profileRef, {
//                 "portfolioSettings.isPublic": isPublic,
//                 "portfolioSettings.customUsername": customUsername,
//                 "portfolioSettings.lastUpdated": new Date(),
//             })

//             // Reserve the username
//             if (customUsername) {
//                 const usernameRef = doc(db, "portfolioUsernames", customUsername)
//                 await setDoc(usernameRef, {
//                     userId: userId,
//                     createdAt: new Date(),
//                 })
//             }

//             toast({
//                 title: "Portfolio settings saved",
//                 description: "Your portfolio settings have been updated successfully",
//             })
//         } catch (error) {
//             console.error("Error saving portfolio settings:", error)
//             toast({
//                 title: "Error saving settings",
//                 description: "There was a problem saving your portfolio settings",
//                 variant: "destructive",
//             })
//         } finally {
//             setIsSaving(false)
//         }
//     }

//     // Copy portfolio URL to clipboard
//     const copyPortfolioUrl = () => {
//         navigator.clipboard.writeText(portfolioUrl)
//         toast({
//             title: "URL copied",
//             description: "Portfolio URL copied to clipboard",
//         })
//     }

//     // Mark message as read
//     const markMessageAsRead = async (messageId: string) => {
//         try {
//             const messageRef = doc(db, "portfolioMessages", messageId)
//             await updateDoc(messageRef, {
//                 isRead: true,
//             })

//             // Update local state
//             setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)))

//             // If the selected message is being marked as read, update it too
//             if (selectedMessage?.id === messageId) {
//                 setSelectedMessage({ ...selectedMessage, isRead: true })
//             }

//             toast({
//                 title: "Message marked as read",
//                 description: "The message has been marked as read",
//             })
//         } catch (error) {
//             console.error("Error marking message as read:", error)
//             toast({
//                 title: "Error updating message",
//                 description: "There was a problem marking the message as read",
//                 variant: "destructive",
//             })
//         }
//     }

//     // Delete message
//     const deleteMessage = async (messageId: string) => {
//         setDeletingMessageId(messageId)
//         setIsDeleting(true)
//         try {
//             const messageRef = doc(db, "portfolioMessages", messageId)
//             await deleteDoc(messageRef)

//             // Remove from local state
//             setMessages(messages.filter((msg) => msg.id !== messageId))

//             // Close modal if the deleted message was selected
//             if (selectedMessage?.id === messageId) {
//                 setSelectedMessage(null)
//             }

//             toast({
//                 title: "Message deleted",
//                 description: "The message has been deleted successfully",
//             })
//         } catch (error) {
//             console.error("Error deleting message:", error)
//             toast({
//                 title: "Error deleting message",
//                 description: "There was a problem deleting the message",
//                 variant: "destructive",
//             })
//         } finally {
//             setDeletingMessageId("")
//             setIsDeleting(false)
//         }
//     }

//     // Delete username
//     const deleteUsername = async (username: string) => {
//         setDeletingUsername(username)
//         try {
//             const usernameRef = doc(db, "portfolioUsernames", username)
//             await deleteDoc(usernameRef)

//             // Remove from local state
//             setUsernames(usernames.filter((u) => u.username !== username))

//             // If this was the active username, also clear from profile
//             if (customUsername === username) {
//                 setCustomUsername("")
//                 const profileRef = doc(db, "profiles", userId)
//                 await updateDoc(profileRef, {
//                     "portfolioSettings.customUsername": "",
//                 })
//             }

//             toast({
//                 title: "Username deleted",
//                 description: `The username "${username}" has been deleted`,
//             })
//         } catch (error) {
//             console.error("Error deleting username:", error)
//             toast({
//                 title: "Error deleting username",
//                 description: "There was a problem deleting the username",
//                 variant: "destructive",
//             })
//         } finally {
//             setDeletingUsername("")
//         }
//     }

//     // Format date for display
//     const formatDate = (date: Date) => {
//         return new Intl.DateTimeFormat("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//             hour: "numeric",
//             minute: "numeric",
//         }).format(date)
//     }

//     // Filter messages based on search term and read/unread filter
//     const filteredMessages = messages.filter((message) => {
//         const matchesSearch =
//             message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             message.message.toLowerCase().includes(searchTerm.toLowerCase())

//         if (messageFilter === "read") return matchesSearch && message.isRead
//         if (messageFilter === "unread") return matchesSearch && !message.isRead
//         return matchesSearch
//     })

//     // Filter blog posts based on search term and status filter
//     const filteredBlogPosts = blogPosts.filter((post) => {
//         const matchesSearch =
//             post.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
//             post.content.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
//             post.tags.some((tag) => tag.toLowerCase().includes(blogSearchTerm.toLowerCase()))

//         if (blogStatusFilter === "published") return matchesSearch && post.status === "published"
//         if (blogStatusFilter === "draft") return matchesSearch && post.status === "draft"
//         return matchesSearch
//     })

//     // Count unread messages
//     const unreadCount = messages.filter((msg) => !msg.isRead).length

//     // Get initials from name for avatar
//     const getInitials = (name: string) => {
//         return name
//             .split(" ")
//             .map((part) => part[0])
//             .join("")
//             .toUpperCase()
//             .substring(0, 2)
//     }

//     // Create a new blog post
//     const createNewBlog = () => {
//         setCurrentBlog({
//             title: "",
//             content: "",
//             excerpt: "",
//             coverImage: "",
//             tags: [],
//             status: "draft",
//         })
//         setEditorMode("create")
//         setBlogView("editor")
//     }

//     // Edit an existing blog post
//     const editBlog = (blog: BlogPost) => {
//         setCurrentBlog(blog)
//         setEditorMode("edit")
//         setBlogView("editor")
//     }

//     // Generate a slug from the title
//     const generateSlug = (title: string) => {
//         return title
//             .toLowerCase()
//             .replace(/[^\w\s]/gi, "")
//             .replace(/\s+/g, "-")
//             .trim()
//     }

//     // Save blog post
//     const saveBlogPost = async () => {
//         if (!currentBlog.title) {
//             toast({
//                 title: "Title required",
//                 description: "Please provide a title for your blog post",
//                 variant: "destructive",
//             })
//             return
//         }

//         setSavingBlog(true)
//         try {
//             const slug = currentBlog.slug || generateSlug(currentBlog.title)
//             const now = new Date()

//             if (editorMode === "create") {
//                 // Create new blog post
//                 const blogData = {
//                     userId,
//                     title: currentBlog.title,
//                     content: currentBlog.content || "",
//                     excerpt: currentBlog.excerpt || "",
//                     coverImage: currentBlog.coverImage || "",
//                     tags: currentBlog.tags || [],
//                     status: currentBlog.status || "draft",
//                     createdAt: now,
//                     updatedAt: now,
//                     slug,
//                 }

//                 const docRef = await addDoc(collection(db, "portfolioBlogPosts"), blogData)

//                 // Add to local state
//                 setBlogPosts([
//                     {
//                         id: docRef.id,
//                         ...blogData,
//                         createdAt: now,
//                         updatedAt: now,
//                         slug,
//                     } as BlogPost,
//                     ...blogPosts,
//                 ])

//                 toast({
//                     title: "Blog post created",
//                     description: "Your blog post has been created successfully",
//                 })
//             } else {
//                 // Update existing blog post
//                 if (!currentBlog.id) return

//                 const blogRef = doc(db, "portfolioBlogPosts", currentBlog.id)
//                 const blogData = {
//                     title: currentBlog.title,
//                     content: currentBlog.content || "",
//                     excerpt: currentBlog.excerpt || "",
//                     coverImage: currentBlog.coverImage || "",
//                     tags: currentBlog.tags || [],
//                     status: currentBlog.status || "draft",
//                     updatedAt: now,
//                     slug,
//                 }

//                 await updateDoc(blogRef, blogData)

//                 // Update local state
//                 setBlogPosts(
//                     blogPosts.map((post) => (post.id === currentBlog.id ? { ...post, ...blogData, updatedAt: now } : post)),
//                 )

//                 toast({
//                     title: "Blog post updated",
//                     description: "Your blog post has been updated successfully",
//                 })
//             }

//             // Return to list view
//             setBlogView("list")
//         } catch (error) {
//             console.error("Error saving blog post:", error)
//             toast({
//                 title: "Error saving blog post",
//                 description: "There was a problem saving your blog post",
//                 variant: "destructive",
//             })
//         } finally {
//             setSavingBlog(false)
//         }
//     }

//     // Delete blog post
//     const deleteBlogPost = async () => {
//         if (!deletingBlogId) return

//         try {
//             const blogRef = doc(db, "portfolioBlogPosts", deletingBlogId)
//             await deleteDoc(blogRef)

//             // Remove from local state
//             setBlogPosts(blogPosts.filter((post) => post.id !== deletingBlogId))

//             toast({
//                 title: "Blog post deleted",
//                 description: "Your blog post has been deleted successfully",
//             })
//         } catch (error) {
//             console.error("Error deleting blog post:", error)
//             toast({
//                 title: "Error deleting blog post",
//                 description: "There was a problem deleting your blog post",
//                 variant: "destructive",
//             })
//         } finally {
//             setDeletingBlogId("")
//             setShowDeleteBlogDialog(false)
//         }
//     }

//     // Add a tag to the current blog post
//     const addTag = () => {
//         if (!newTag.trim()) return

//         if (!currentBlog.tags) {
//             setCurrentBlog({ ...currentBlog, tags: [newTag.trim()] })
//         } else if (!currentBlog.tags.includes(newTag.trim())) {
//             setCurrentBlog({
//                 ...currentBlog,
//                 tags: [...currentBlog.tags, newTag.trim()],
//             })
//         }

//         setNewTag("")
//     }

//     // Remove a tag from the current blog post
//     const removeTag = (tagToRemove: string) => {
//         if (!currentBlog.tags) return

//         setCurrentBlog({
//             ...currentBlog,
//             tags: currentBlog.tags.filter((tag) => tag !== tagToRemove),
//         })
//     }

//     const uploadImage = async (file: File) => {
//         setUploadingImage(true);

//         try {
//             // Set required parameters
//             const uploadPreset = "ml_default"; // Your upload preset
//             const timestamp = Math.floor(Date.now() / 1000);
//             const apiKey = "988965663417232";
//             const apiSecret = "Vo8HobpUEydUNcPg8GNw916jupI";
//             const cloudName = "dvbw76boh";

//             // Create the signature string and hash it.
//             // Signature string format: "timestamp=<timestamp>&upload_preset=<preset><API_SECRET>"
//             const signatureString = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
//             const signature = sha1(signatureString);

//             // Create a FormData object to send the file and credentials
//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("upload_preset", uploadPreset);
//             formData.append("timestamp", String(timestamp));
//             formData.append("api_key", apiKey);
//             formData.append("signature", signature);

//             // Cloudinary upload endpoint using your cloud name
//             const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

//             // Upload the image
//             const response = await fetch(CLOUDINARY_UPLOAD_URL, {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to upload image");
//             }

//             const data = await response.json();

//             // Update your blog post state with the image URL
//             setCurrentBlog((prev) => ({
//                 ...prev,
//                 coverImage: data.secure_url,
//             }));

//             toast({
//                 title: "Image uploaded",
//                 description: "Your image has been uploaded successfully",
//             });
//         } catch (error) {
//             console.error("Error uploading image:", error);
//             toast({
//                 title: "Error uploading image",
//                 description: "There was a problem uploading your image",
//                 variant: "destructive",
//             });
//         } finally {
//             setUploadingImage(false);
//         }
//     };

//     // Handle file input change
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0]
//         if (file) {
//             uploadImage(file)
//         }
//     }

//     // Insert code snippet into content
//     const insertCodeSnippet = () => {
//         const codeTemplate = "\n```\n// Your code here\n```\n"
//         setCurrentBlog({
//             ...currentBlog,
//             content: (currentBlog.content || "") + codeTemplate,
//         })
//     }

//     // Preview the current blog post
//     const previewBlog = () => {
//         setBlogView("preview")
//     }

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Portfolio Management</CardTitle>
//                 <CardDescription>Manage your portfolio settings, messages, usernames, and blog posts</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//                     <TabsList className="grid grid-cols-4 mb-6">
//                         <TabsTrigger value="settings" className="flex items-center gap-2">
//                             <Settings2Icon className="h-4 w-4" />
//                             <span>Settings</span>
//                         </TabsTrigger>
//                         <TabsTrigger value="messages" className="flex items-center gap-2">
//                             <MessageSquare className="h-4 w-4" />
//                             <span>Messages</span>
//                             {unreadCount > 0 && (
//                                 <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
//                                     {unreadCount}
//                                 </Badge>
//                             )}
//                         </TabsTrigger>
//                         <TabsTrigger value="usernames" className="flex items-center gap-2">
//                             <User className="h-4 w-4" />
//                             <span>Usernames</span>
//                         </TabsTrigger>
//                         <TabsTrigger value="blog" className="flex items-center gap-2">
//                             <FileText className="h-4 w-4" />
//                             <span>Blog</span>
//                         </TabsTrigger>
//                     </TabsList>

//                     {/* Settings Tab */}
//                     <TabsContent value="settings" className="space-y-6">
//                         <div className="flex items-center justify-between space-x-2">
//                             <div>
//                                 <Label htmlFor="portfolio-visibility" className="text-base">
//                                     Portfolio Visibility
//                                 </Label>
//                                 <p className="text-sm text-muted-foreground">Make your portfolio visible to the public</p>
//                             </div>
//                             <Switch id="portfolio-visibility" checked={isPublic} onCheckedChange={setIsPublic} />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="custom-username">Custom Username</Label>
//                             <div className="flex space-x-2">
//                                 <Input
//                                     id="custom-username"
//                                     placeholder="your-username"
//                                     value={customUsername}
//                                     onChange={(e) => setCustomUsername(e.target.value)}
//                                     onBlur={checkUsernameAvailability}
//                                 />
//                                 {isChecking && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
//                             </div>
//                             {customUsername && !isChecking && (
//                                 <p className={`text-sm ${isAvailable ? "text-green-500" : "text-red-500"}`}>
//                                     {isAvailable ? "Username is available" : "Username is already taken"}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label>Your Portfolio URL</Label>
//                             <div className="flex items-center space-x-2">
//                                 <Input value={portfolioUrl} readOnly className="bg-muted" />
//                                 <Button variant="outline" size="icon" onClick={copyPortfolioUrl}>
//                                     <Copy className="h-4 w-4" />
//                                 </Button>
//                             </div>
//                         </div>

//                         <div className="flex justify-between items-center pt-4">
//                             <Button
//                                 variant="default"
//                                 onClick={savePortfolioSettings}
//                                 disabled={isSaving || (customUsername !== "" && !isAvailable)}
//                             >
//                                 {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                                 Save Settings
//                             </Button>

//                             {isPublic && (
//                                 <Link href={portfolioUrl} target="_blank">
//                                     <Button variant="outline" className="flex items-center gap-2">
//                                         <ExternalLink className="h-4 w-4" />
//                                         View Portfolio
//                                     </Button>
//                                 </Link>
//                             )}
//                         </div>
//                     </TabsContent>

//                     {/* Enhanced Messages Tab */}
//                     <TabsContent value="messages" className="space-y-4">
//                         {loadingMessages ? (
//                             <div className="flex justify-center py-12">
//                                 <div className="flex flex-col items-center gap-2">
//                                     <Loader2 className="h-10 w-10 animate-spin text-primary" />
//                                     <p className="text-muted-foreground">Loading your messages...</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Message filtering and search bar */}
//                                 <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
//                                     <div className="relative w-full md:w-auto flex-1">
//                                         <Input
//                                             placeholder="Search messages..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             className="pl-10"
//                                         />
//                                         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
//                                             <Search className="h-4 w-4" />
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center gap-2 w-full md:w-auto">
//                                         <DropdownMenu>
//                                             <DropdownMenuTrigger asChild>
//                                                 <Button variant="outline" className="flex gap-2 items-center">
//                                                     <Filter className="h-4 w-4" />
//                                                     <span>
//                                                         {messageFilter === "all" && "All Messages"}
//                                                         {messageFilter === "read" && "Read Messages"}
//                                                         {messageFilter === "unread" && "Unread Messages"}
//                                                     </span>
//                                                 </Button>
//                                             </DropdownMenuTrigger>
//                                             <DropdownMenuContent align="end">
//                                                 <DropdownMenuItem onClick={() => setMessageFilter("all")}>All Messages</DropdownMenuItem>
//                                                 <DropdownMenuItem onClick={() => setMessageFilter("read")}>Read Messages</DropdownMenuItem>
//                                                 <DropdownMenuItem onClick={() => setMessageFilter("unread")}>Unread Messages</DropdownMenuItem>
//                                             </DropdownMenuContent>
//                                         </DropdownMenu>

//                                         {messages.length > 0 && (
//                                             <Badge variant="outline" className="ml-2">
//                                                 <span className="font-semibold">{filteredMessages.length}</span> / {messages.length} messages
//                                             </Badge>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {messages.length === 0 ? (
//                                     <div className="text-center py-16 border rounded-lg bg-muted/30">
//                                         <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//                                         <h3 className="text-xl font-medium mb-2">No messages yet</h3>
//                                         <p className="text-muted-foreground max-w-md mx-auto">
//                                             When someone sends you a message from your portfolio, it will appear here. Share your portfolio to
//                                             get started.
//                                         </p>
//                                     </div>
//                                 ) : filteredMessages.length === 0 ? (
//                                     <div className="text-center py-12 border rounded-lg bg-muted/30">
//                                         <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
//                                         <h3 className="text-lg font-medium mb-2">No matching messages</h3>
//                                         <p className="text-muted-foreground">Try adjusting your search or filter settings.</p>
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-4">
//                                         {filteredMessages.map((message) => (
//                                             <Card
//                                                 key={message.id}
//                                                 className={cn(
//                                                     "transition-all duration-200 hover:shadow-md cursor-pointer",
//                                                     !message.isRead ? "border-l-4 border-l-primary" : "border",
//                                                 )}
//                                                 onClick={() => {
//                                                     setSelectedMessage(message)
//                                                     if (!message.isRead) {
//                                                         markMessageAsRead(message.id)
//                                                     }
//                                                 }}
//                                             >
//                                                 <CardContent className="p-4">
//                                                     <div className="flex items-start gap-3">
//                                                         <Avatar className="h-10 w-10 mt-1">
//                                                             <AvatarFallback className="bg-primary/10 text-primary">
//                                                                 {getInitials(message.name)}
//                                                             </AvatarFallback>
//                                                         </Avatar>

//                                                         <div className="flex-1 min-w-0">
//                                                             <div className="flex justify-between items-start gap-2">
//                                                                 <div>
//                                                                     <h3 className="font-medium truncate">{message.name}</h3>
//                                                                     <p className="text-sm text-muted-foreground truncate">{message.email}</p>
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1">
//                                                                     <div className="text-xs text-muted-foreground whitespace-nowrap">
//                                                                         {formatDate(message.createdAt)}
//                                                                     </div>

//                                                                     {!message.isRead && (
//                                                                         <Badge variant="default" className="ml-2">
//                                                                             New
//                                                                         </Badge>
//                                                                     )}
//                                                                 </div>
//                                                             </div>

//                                                             <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{message.message}</p>

//                                                             <div className="flex justify-end mt-2">
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="sm"
//                                                                     className="flex items-center gap-1 text-xs"
//                                                                     onClick={(e) => {
//                                                                         e.stopPropagation()
//                                                                         setSelectedMessage(message)
//                                                                     }}
//                                                                 >
//                                                                     <Eye className="h-3 w-3" />
//                                                                     View
//                                                                 </Button>

//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="sm"
//                                                                     className="flex items-center gap-1 text-xs text-destructive hover:text-destructive"
//                                                                     onClick={(e) => {
//                                                                         e.stopPropagation()
//                                                                         deleteMessage(message.id)
//                                                                     }}
//                                                                     disabled={deletingMessageId === message.id && isDeleting}
//                                                                 >
//                                                                     {deletingMessageId === message.id && isDeleting ? (
//                                                                         <Loader2 className="h-3 w-3 animate-spin" />
//                                                                     ) : (
//                                                                         <Trash2 className="h-3 w-3" />
//                                                                     )}
//                                                                     Delete
//                                                                 </Button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </CardContent>
//                                             </Card>
//                                         ))}
//                                     </div>
//                                 )}
//                             </>
//                         )}

//                         {/* Message Detail Modal */}
//                         <Dialog open={selectedMessage !== null} onOpenChange={(open) => !open && setSelectedMessage(null)}>
//                             {selectedMessage && (
//                                 <DialogContent className="sm:max-w-lg">
//                                     <DialogHeader>
//                                         <DialogTitle className="flex justify-between items-center">
//                                             <span>Message from {selectedMessage.name}</span>
//                                             {!selectedMessage.isRead && (
//                                                 <Badge variant="outline" className="ml-2 bg-primary/10">
//                                                     New
//                                                 </Badge>
//                                             )}
//                                         </DialogTitle>
//                                         <DialogDescription>Received on {formatDate(selectedMessage.createdAt)}</DialogDescription>
//                                     </DialogHeader>

//                                     <div className="space-y-4 my-2">
//                                         <div className="flex items-center gap-2">
//                                             <Avatar className="h-8 w-8">
//                                                 <AvatarFallback className="bg-primary/10 text-primary">
//                                                     {getInitials(selectedMessage.name)}
//                                                 </AvatarFallback>
//                                             </Avatar>
//                                             <div>
//                                                 <p className="font-medium">{selectedMessage.name}</p>
//                                                 <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
//                                             </div>
//                                         </div>

//                                         <div className="bg-muted/30 p-4 rounded-lg border text-sm whitespace-pre-wrap">
//                                             {selectedMessage.message}
//                                         </div>
//                                     </div>

//                                     <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between">
//                                         <Button
//                                             variant="destructive"
//                                             className="flex items-center gap-1"
//                                             onClick={() => {
//                                                 deleteMessage(selectedMessage.id)
//                                                 setSelectedMessage(null)
//                                             }}
//                                             disabled={isDeleting}
//                                         >
//                                             {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
//                                             Delete Message
//                                         </Button>

//                                         <div className="flex gap-2">
//                                             <Button
//                                                 variant="outline"
//                                                 onClick={() => {
//                                                     navigator.clipboard.writeText(selectedMessage.email)
//                                                     toast({
//                                                         title: "Email copied",
//                                                         description: "Email address copied to clipboard",
//                                                     })
//                                                 }}
//                                             >
//                                                 <Copy className="h-4 w-4 mr-2" />
//                                                 Copy Email
//                                             </Button>
//                                             <Button onClick={() => setSelectedMessage(null)}>Close</Button>
//                                         </div>
//                                     </DialogFooter>
//                                 </DialogContent>
//                             )}
//                         </Dialog>
//                     </TabsContent>

//                     {/* Usernames Tab */}
//                     <TabsContent value="usernames" className="space-y-6">
//                         {loadingUsernames ? (
//                             <div className="flex justify-center py-8">
//                                 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//                             </div>
//                         ) : usernames.length === 0 ? (
//                             <div className="text-center py-8">
//                                 <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                                 <h3 className="text-lg font-medium">No custom usernames</h3>
//                                 <p className="text-muted-foreground">
//                                     Create custom usernames to share your portfolio with a unique URL.
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {usernames.map((item) => (
//                                     <Card key={item.username} className="flex items-center justify-between p-4">
//                                         <div>
//                                             <h3 className="font-medium">{item.username}</h3>
//                                             <p className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</p>
//                                         </div>
//                                         <div>
//                                             {item.username === customUsername ? (
//                                                 <Button variant="ghost" size="icon" disabled>
//                                                     <span className="text-primary">Active</span>
//                                                 </Button>
//                                             ) : (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     onClick={() => deleteUsername(item.username)}
//                                                     disabled={deletingUsername === item.username}
//                                                 >
//                                                     <Trash2 className="h-4 w-4 text-destructive" />
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </Card>
//                                 ))}
//                             </div>
//                         )}
//                     </TabsContent>

//                     {/* Blog Tab */}
//                     <TabsContent value="blog" className="space-y-6">
//                         {blogView === "list" ? (
//                             <>
//                                 <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
//                                     <div className="relative w-full md:w-auto flex-1">
//                                         <Input
//                                             placeholder="Search blog posts..."
//                                             value={blogSearchTerm}
//                                             onChange={(e) => setBlogSearchTerm(e.target.value)}
//                                             className="pl-10"
//                                         />
//                                         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
//                                             <Search className="h-4 w-4" />
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center gap-2 w-full md:w-auto">
//                                         <DropdownMenu>
//                                             <DropdownMenuTrigger asChild>
//                                                 <Button variant="outline" className="flex gap-2 items-center">
//                                                     <Filter className="h-4 w-4" />
//                                                     <span>
//                                                         {blogStatusFilter === "all" && "All Posts"}
//                                                         {blogStatusFilter === "published" && "Published Posts"}
//                                                         {blogStatusFilter === "draft" && "Draft Posts"}
//                                                     </span>
//                                                 </Button>
//                                             </DropdownMenuTrigger>
//                                             <DropdownMenuContent align="end">
//                                                 <DropdownMenuItem onClick={() => setBlogStatusFilter("all")}>All Posts</DropdownMenuItem>
//                                                 <DropdownMenuItem onClick={() => setBlogStatusFilter("published")}>
//                                                     Published Posts
//                                                 </DropdownMenuItem>
//                                                 <DropdownMenuItem onClick={() => setBlogStatusFilter("draft")}>Draft Posts</DropdownMenuItem>
//                                             </DropdownMenuContent>
//                                         </DropdownMenu>

//                                         <Button onClick={createNewBlog} className="flex items-center gap-2">
//                                             <Plus className="h-4 w-4" />
//                                             New Post
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 {loadingBlogs ? (
//                                     <div className="flex justify-center py-12">
//                                         <div className="flex flex-col items-center gap-2">
//                                             <Loader2 className="h-10 w-10 animate-spin text-primary" />
//                                             <p className="text-muted-foreground">Loading your blog posts...</p>
//                                         </div>
//                                     </div>
//                                 ) : blogPosts.length === 0 ? (
//                                     <div className="text-center py-16 border rounded-lg bg-muted/30">
//                                         <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//                                         <h3 className="text-xl font-medium mb-2">No blog posts yet</h3>
//                                         <p className="text-muted-foreground max-w-md mx-auto">
//                                             Share your knowledge and expertise by creating blog posts for your portfolio.
//                                         </p>
//                                         <Button onClick={createNewBlog} className="mt-4">
//                                             Create Your First Post
//                                         </Button>
//                                     </div>
//                                 ) : filteredBlogPosts.length === 0 ? (
//                                     <div className="text-center py-12 border rounded-lg bg-muted/30">
//                                         <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
//                                         <h3 className="text-lg font-medium mb-2">No matching blog posts</h3>
//                                         <p className="text-muted-foreground">Try adjusting your search or filter settings.</p>
//                                     </div>
//                                 ) : (
//                                     <div className="grid md:grid-cols-2 gap-6">
//                                         {filteredBlogPosts.map((post) => (
//                                             <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
//                                                 <div className="relative h-48 bg-muted">
//                                                     {post.coverImage ? (
//                                                         <div
//                                                             className="absolute inset-0 bg-center bg-cover"
//                                                             style={{ backgroundImage: `url(${post.coverImage})` }}
//                                                         />
//                                                     ) : (
//                                                         <div className="flex items-center justify-center h-full bg-primary/10">
//                                                             <FileText className="h-12 w-12 text-primary/50" />
//                                                         </div>
//                                                     )}
//                                                     <div className="absolute top-2 right-2">
//                                                         <Badge variant={post.status === "published" ? "default" : "outline"}>
//                                                             {post.status === "published" ? "Published" : "Draft"}
//                                                         </Badge>
//                                                     </div>
//                                                 </div>
//                                                 <CardContent className="p-6">
//                                                     <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//                                                         <Calendar className="h-4 w-4" />
//                                                         <span>{formatDate(post.createdAt)}</span>
//                                                     </div>
//                                                     <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
//                                                     <p className="text-muted-foreground mb-4 line-clamp-3">
//                                                         {post.excerpt || post.content.substring(0, 150)}
//                                                     </p>

//                                                     <div className="flex flex-wrap gap-2 mb-4">
//                                                         {post.tags.map((tag) => (
//                                                             <Badge key={tag} variant="secondary" className="text-xs">
//                                                                 {tag}
//                                                             </Badge>
//                                                         ))}
//                                                     </div>

//                                                     <div className="flex justify-between items-center">
//                                                         <Button
//                                                             variant="outline"
//                                                             size="sm"
//                                                             onClick={() => {
//                                                                 setDeletingBlogId(post.id)
//                                                                 setShowDeleteBlogDialog(true)
//                                                             }}
//                                                             className="text-destructive hover:text-destructive"
//                                                         >
//                                                             <Trash2 className="h-4 w-4 mr-1" />
//                                                             Delete
//                                                         </Button>
//                                                         <div className="flex gap-2">
//                                                             <Button variant="outline" size="sm" asChild>
//                                                                 <Link href={`/portfolio/${customUsername || userId}/blog/${post.slug}`} target="_blank">
//                                                                     <Eye className="h-4 w-4 mr-1" />
//                                                                     View
//                                                                 </Link>
//                                                             </Button>
//                                                             <Button variant="default" size="sm" onClick={() => editBlog(post)}>
//                                                                 <Edit className="h-4 w-4 mr-1" />
//                                                                 Edit
//                                                             </Button>
//                                                         </div>
//                                                     </div>
//                                                 </CardContent>
//                                             </Card>
//                                         ))}
//                                     </div>
//                                 )}

//                                 {/* Delete Blog Confirmation Dialog */}
//                                 <AlertDialog open={showDeleteBlogDialog} onOpenChange={setShowDeleteBlogDialog}>
//                                     <AlertDialogContent>
//                                         <AlertDialogHeader>
//                                             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                                             <AlertDialogDescription>
//                                                 This action cannot be undone. This will permanently delete your blog post.
//                                             </AlertDialogDescription>
//                                         </AlertDialogHeader>
//                                         <AlertDialogFooter>
//                                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                             <AlertDialogAction
//                                                 onClick={deleteBlogPost}
//                                                 className="bg-destructive text-destructive-foreground"
//                                             >
//                                                 Delete
//                                             </AlertDialogAction>
//                                         </AlertDialogFooter>
//                                     </AlertDialogContent>
//                                 </AlertDialog>
//                             </>
//                         ) : blogView === "editor" ? (
//                             <div className="space-y-6">
//                                 <div className="flex items-center justify-between">
//                                     <Button variant="outline" onClick={() => setBlogView("list")} className="flex items-center gap-2">
//                                         <ArrowLeft className="h-4 w-4" />
//                                         Back to Posts
//                                     </Button>
//                                     <div className="flex items-center gap-2">
//                                         <Button variant="outline" onClick={previewBlog} className="flex items-center gap-2">
//                                             <Eye className="h-4 w-4" />
//                                             Preview
//                                         </Button>
//                                         <Button
//                                             onClick={saveBlogPost}
//                                             disabled={savingBlog || !currentBlog.title}
//                                             className="flex items-center gap-2"
//                                         >
//                                             {savingBlog ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//                                             Save Post
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <div className="grid gap-6">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="blog-title">Title</Label>
//                                         <Input
//                                             id="blog-title"
//                                             placeholder="Enter blog title"
//                                             value={currentBlog.title || ""}
//                                             onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
//                                             className="text-lg"
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="blog-excerpt">Excerpt</Label>
//                                         <Textarea
//                                             id="blog-excerpt"
//                                             placeholder="Brief summary of your post"
//                                             value={currentBlog.excerpt || ""}
//                                             onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
//                                             className="resize-none h-20"
//                                         />
//                                     </div>

//                                     <div className="grid md:grid-cols-2 gap-6">
//                                         <div className="space-y-2">
//                                             <Label>Cover Image</Label>
//                                             <div className="border rounded-lg overflow-hidden bg-muted">
//                                                 {currentBlog.coverImage ? (
//                                                     <div className="relative h-48">
//                                                         <div
//                                                             className="absolute inset-0 bg-center bg-cover"
//                                                             style={{ backgroundImage: `url(${currentBlog.coverImage})` }}
//                                                         />
//                                                         <div className="absolute bottom-2 right-2">
//                                                             <Button
//                                                                 variant="destructive"
//                                                                 size="sm"
//                                                                 onClick={() => setCurrentBlog({ ...currentBlog, coverImage: "" })}
//                                                             >
//                                                                 <Trash2 className="h-4 w-4" />
//                                                             </Button>
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     <div className="flex flex-col items-center justify-center h-48 p-4">
//                                                         <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
//                                                         <p className="text-sm text-muted-foreground text-center mb-4">
//                                                             Upload a cover image for your blog post
//                                                         </p>
//                                                         <input
//                                                             type="file"
//                                                             accept="image/*"
//                                                             ref={fileInputRef}
//                                                             onChange={handleFileChange}
//                                                             className="hidden"
//                                                         />
//                                                         <Button
//                                                             variant="outline"
//                                                             onClick={() => fileInputRef.current?.click()}
//                                                             disabled={uploadingImage}
//                                                         >
//                                                             {uploadingImage ? (
//                                                                 <>
//                                                                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                                                                     Uploading...
//                                                                 </>
//                                                             ) : (
//                                                                 <>
//                                                                     <ImageIcon className="h-4 w-4 mr-2" />
//                                                                     Upload Image
//                                                                 </>
//                                                             )}
//                                                         </Button>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div className="space-y-4">
//                                             <div className="space-y-2">
//                                                 <Label htmlFor="blog-status">Status</Label>
//                                                 <Select
//                                                     value={currentBlog.status || "draft"}
//                                                     onValueChange={(value) =>
//                                                         setCurrentBlog({
//                                                             ...currentBlog,
//                                                             status: value as "published" | "draft",
//                                                         })
//                                                     }
//                                                 >
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select status" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         <SelectItem value="draft">Draft</SelectItem>
//                                                         <SelectItem value="published">Published</SelectItem>
//                                                     </SelectContent>
//                                                 </Select>
//                                             </div>

//                                             <div className="space-y-2">
//                                                 <Label>Tags</Label>
//                                                 <div className="flex flex-wrap gap-2 mb-2">
//                                                     {currentBlog.tags?.map((tag) => (
//                                                         <Badge key={tag} variant="secondary" className="flex items-center gap-1">
//                                                             {tag}
//                                                             <Button
//                                                                 variant="ghost"
//                                                                 size="icon"
//                                                                 className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
//                                                                 onClick={() => removeTag(tag)}
//                                                             >
//                                                                 <span className="sr-only">Remove tag</span>
//                                                                 <svg
//                                                                     xmlns="http://www.w3.org/2000/svg"
//                                                                     width="14"
//                                                                     height="14"
//                                                                     viewBox="0 0 24 24"
//                                                                     fill="none"
//                                                                     stroke="currentColor"
//                                                                     strokeWidth="2"
//                                                                     strokeLinecap="round"
//                                                                     strokeLinejoin="round"
//                                                                 >
//                                                                     <path d="M18 6 6 18" />
//                                                                     <path d="m6 6 12 12" />
//                                                                 </svg>
//                                                             </Button>
//                                                         </Badge>
//                                                     ))}
//                                                 </div>
//                                                 <div className="flex gap-2">
//                                                     <Input
//                                                         placeholder="Add a tag"
//                                                         value={newTag}
//                                                         onChange={(e) => setNewTag(e.target.value)}
//                                                         onKeyDown={(e) => {
//                                                             if (e.key === "Enter" && newTag.trim()) {
//                                                                 e.preventDefault()
//                                                                 addTag()
//                                                             }
//                                                         }}
//                                                     />
//                                                     <Button variant="outline" onClick={addTag} disabled={!newTag.trim()}>
//                                                         Add
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <div className="flex items-center justify-between">
//                                             <Label htmlFor="blog-content">Content</Label>
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 onClick={insertCodeSnippet}
//                                                 className="flex items-center gap-1"
//                                             >
//                                                 <CodeIcon className="h-4 w-4" />
//                                                 Insert Code Snippet
//                                             </Button>
//                                         </div>
//                                         <Textarea
//                                             id="blog-content"
//                                             placeholder="Write your blog post content here..."
//                                             value={currentBlog.content || ""}
//                                             onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
//                                             className="min-h-[400px] font-mono"
//                                         />
//                                         <p className="text-xs text-muted-foreground">
//                                             Use Markdown for formatting. Insert code snippets with ```code``` syntax.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             // Preview mode
//                             <div className="space-y-6">
//                                 <div className="flex items-center justify-between">
//                                     <Button variant="outline" onClick={() => setBlogView("editor")} className="flex items-center gap-2">
//                                         <ArrowLeft className="h-4 w-4" />
//                                         Back to Editor
//                                     </Button>
//                                     <Button
//                                         onClick={saveBlogPost}
//                                         disabled={savingBlog || !currentBlog.title}
//                                         className="flex items-center gap-2"
//                                     >
//                                         {savingBlog ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//                                         Save Post
//                                     </Button>
//                                 </div>

//                                 <div className="border rounded-lg overflow-hidden">
//                                     <div className="relative">
//                                         {currentBlog.coverImage ? (
//                                             <div className="h-64 relative">
//                                                 <div
//                                                     className="absolute inset-0 bg-center bg-cover"
//                                                     style={{ backgroundImage: `url(${currentBlog.coverImage})` }}
//                                                 />
//                                                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
//                                                 <div className="absolute bottom-4 left-4 right-4">
//                                                     <Badge variant={currentBlog.status === "published" ? "default" : "outline"} className="mb-2">
//                                                         {currentBlog.status === "published" ? "Published" : "Draft"}
//                                                     </Badge>
//                                                     <h1 className="text-3xl font-bold text-white">{currentBlog.title}</h1>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="bg-muted p-6">
//                                                 <Badge variant={currentBlog.status === "published" ? "default" : "outline"} className="mb-2">
//                                                     {currentBlog.status === "published" ? "Published" : "Draft"}
//                                                 </Badge>
//                                                 <h1 className="text-3xl font-bold">{currentBlog.title}</h1>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="p-6">
//                                         <div className="flex flex-wrap gap-2 mb-4">
//                                             {currentBlog.tags?.map((tag) => (
//                                                 <Badge key={tag} variant="secondary">
//                                                     {tag}
//                                                 </Badge>
//                                             ))}
//                                         </div>

//                                         {currentBlog.excerpt && (
//                                             <div className="mb-6 italic text-muted-foreground border-l-4 border-primary/20 pl-4 py-2">
//                                                 {currentBlog.excerpt}
//                                             </div>
//                                         )}

//                                         <div className="prose prose-sm sm:prose max-w-none">
//                                             {/* This is a simplified preview - in a real app, you'd use a Markdown renderer */}
//                                             {currentBlog.content?.split("\n").map((line, i) => {
//                                                 // Simple code block detection
//                                                 if (line.startsWith("```") && line.length > 3) {
//                                                     return (
//                                                         <div key={i} className="bg-muted p-4 rounded-md font-mono text-sm my-4 overflow-x-auto">
//                                                             <div className="text-xs text-muted-foreground mb-2">{line.slice(3)}</div>
//                                                             <pre>{/* Code content would go here */}</pre>
//                                                         </div>
//                                                     )
//                                                 }

//                                                 // Regular paragraph
//                                                 return <p key={i}>{line}</p>
//                                             })}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </TabsContent>
//                 </Tabs>
//             </CardContent>
//         </Card>
//     )
// }

"use client";
import { useState, useEffect, useRef } from "react";
import type React from "react";
import { sha1 } from "js-sha1";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    addDoc,
    orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/types/profile";
import { toast } from "@/hooks/use-toast";
import {
    Copy,
    ExternalLink,
    Loader2,
    Trash2,
    User,
    MessageSquare,
    Eye,
    Filter,
    Settings2Icon,
    FileText,
    Plus,
    Edit,
    ImageIcon,
    CodeIcon,
    Save,
    ArrowLeft,
    Calendar,
    Search,
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    LinkIcon,
    Highlighter,
    Strikethrough,
} from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import PortfolioPage from "../PortfolioPage";

// Define the types for portfolio messages and usernames
interface PortfolioMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Date;
    isRead: boolean;
}

interface UsernameRecord {
    username: string;
    userId: string;
    createdAt: Date;
}

// Define the type for blog posts with enhanced content structure
interface BlogPost {
    id: string;
    title: string;
    content: string;
    rawContent?: any; // For storing rich text content
    excerpt: string;
    coverImage: string;
    tags: string[];
    status: "published" | "draft";
    createdAt: Date;
    updatedAt: Date;
    slug: string;
}

export function PortfolioContent({
    userId,
    profile,
}: {
    userId: string;
    profile: UserProfile;
}) {
    const [isPublic, setIsPublic] = useState(
        profile.portfolioSettings?.isPublic ?? true
    );
    const [customUsername, setCustomUsername] = useState(
        profile.portfolioSettings?.customUsername || ""
    );
    const [isAvailable, setIsAvailable] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [portfolioUrl, setPortfolioUrl] = useState("");
    const [activeTab, setActiveTab] = useState("settings");

    // Add states for messages and usernames
    const [messages, setMessages] = useState<PortfolioMessage[]>([]);
    const [usernames, setUsernames] = useState<UsernameRecord[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingUsernames, setLoadingUsernames] = useState(false);
    const [deletingUsername, setDeletingUsername] = useState("");
    const [deletingMessageId, setDeletingMessageId] = useState("");

    // New states for enhanced message UI
    const [selectedMessage, setSelectedMessage] =
        useState<PortfolioMessage | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [messageFilter, setMessageFilter] = useState<"all" | "read" | "unread">(
        "all"
    );
    const [isDeleting, setIsDeleting] = useState(false);

    // Blog states
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [blogView, setBlogView] = useState<"list" | "editor" | "preview">(
        "list"
    );
    const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({
        title: "",
        content: "",
        rawContent: null,
        excerpt: "",
        coverImage: "",
        tags: [],
        status: "draft",
    });
    const [savingBlog, setSavingBlog] = useState(false);
    const [deletingBlogId, setDeletingBlogId] = useState("");
    const [showDeleteBlogDialog, setShowDeleteBlogDialog] = useState(false);
    const [blogSearchTerm, setBlogSearchTerm] = useState("");
    const [blogStatusFilter, setBlogStatusFilter] = useState<
        "all" | "published" | "draft"
    >("all");
    const [newTag, setNewTag] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkPopover, setShowLinkPopover] = useState(false);
    const [selectedText, setSelectedText] = useState({
        start: 0,
        end: 0,
        text: "",
    });
    const [textColor, setTextColor] = useState("#000000");
    const [showColorPopover, setShowColorPopover] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [showBgColorPopover, setShowBgColorPopover] = useState(false);

    // Add these to your existing state variables
    const [similarUsernames, setSimilarUsernames] = useState([]);
    const [accentColor, setAccentColor] = useState("#3b82f6");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [portfolioTemplate, setPortfolioTemplate] = useState("minimal");
    const [metaDescription, setMetaDescription] = useState("");
    const [enableAnalytics, setEnableAnalytics] = useState(false);

    // Generate portfolio URL based on username or user ID
    useEffect(() => {
        const username =
            customUsername ||
            profile.displayName?.toLowerCase().replace(/\s+/g, "-") ||
            userId;
        const baseUrl = window.location.origin;
        setPortfolioUrl(`${baseUrl}/portfolio/${username}`);
    }, [customUsername, profile.displayName, userId]);

    // Fetch portfolio messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (activeTab === "messages") {
                setLoadingMessages(true);
                try {
                    const messagesRef = collection(db, "portfolioMessages");
                    const q = query(messagesRef, where("recipientId", "==", userId));
                    const querySnapshot = await getDocs(q);

                    const messagesList: PortfolioMessage[] = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        messagesList.push({
                            id: doc.id,
                            name: data.name,
                            email: data.email,
                            message: data.message,
                            createdAt: data.createdAt.toDate(),
                            isRead: data.isRead || false,
                        });
                    });

                    // Sort messages by date (newest first)
                    messagesList.sort(
                        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
                    );
                    setMessages(messagesList);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    toast({
                        title: "Error loading messages",
                        description: "There was a problem loading your portfolio messages",
                        variant: "destructive",
                    });
                } finally {
                    setLoadingMessages(false);
                }
            }
        };

        fetchMessages();
    }, [userId, activeTab]);

    // Fetch usernames
    useEffect(() => {
        const fetchUsernames = async () => {
            if (activeTab === "usernames") {
                setLoadingUsernames(true);
                try {
                    const usernamesRef = collection(db, "portfolioUsernames");
                    const q = query(usernamesRef, where("userId", "==", userId));
                    const querySnapshot = await getDocs(q);

                    const usernamesList: UsernameRecord[] = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        usernamesList.push({
                            username: doc.id,
                            userId: data.userId,
                            createdAt: data.createdAt.toDate(),
                        });
                    });

                    setUsernames(usernamesList);
                } catch (error) {
                    console.error("Error fetching usernames:", error);
                    toast({
                        title: "Error loading usernames",
                        description: "There was a problem loading your portfolio usernames",
                        variant: "destructive",
                    });
                } finally {
                    setLoadingUsernames(false);
                }
            }
        };

        fetchUsernames();
    }, [userId, activeTab]);

    // Fetch blog posts
    useEffect(() => {
        const fetchBlogPosts = async () => {
            if (activeTab === "blog") {
                setLoadingBlogs(true);
                try {
                    const blogsRef = collection(db, "portfolioBlogPosts");
                    const q = query(
                        blogsRef,
                        where("userId", "==", userId),
                        orderBy("createdAt", "desc")
                    );
                    const querySnapshot = await getDocs(q);

                    const blogsList: BlogPost[] = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        blogsList.push({
                            id: doc.id,
                            title: data.title,
                            content: data.content,
                            rawContent: data.rawContent || null,
                            excerpt: data.excerpt,
                            coverImage: data.coverImage,
                            tags: data.tags || [],
                            status: data.status,
                            createdAt: data.createdAt.toDate(),
                            updatedAt: data.updatedAt.toDate(),
                            slug: data.slug,
                        });
                    });

                    setBlogPosts(blogsList);
                } catch (error) {
                    console.error("Error fetching blog posts:", error);
                    toast({
                        title: "Error loading blog posts",
                        description: "There was a problem loading your blog posts",
                        variant: "destructive",
                    });
                } finally {
                    setLoadingBlogs(false);
                }
            }
        };

        fetchBlogPosts();
    }, [userId, activeTab]);

    // Add this function to your component
    const fetchSimilarUsernames = async (input) => {
        if (!input || input.length < 3) return;

        try {
            // Get similar available usernames based on input
            const suggestions = [
                `${input}123`,
                `${input}_dev`,
                `${input}_pro`,
                `${input}_${Math.floor(Math.random() * 1000)}`,
                `the_${input}`,
            ];

            // Filter out suggestions that are already taken
            const availableSuggestions = [];
            for (const suggestion of suggestions) {
                const usernameRef = doc(db, "portfolioUsernames", suggestion);
                const docSnap = await getDoc(usernameRef);
                if (!docSnap.exists()) {
                    availableSuggestions.push(suggestion);
                }
            }

            setSimilarUsernames(availableSuggestions);
        } catch (error) {
            console.error("Error fetching similar usernames:", error);
            setSimilarUsernames([]);
        }
    };

    // Check username availability
    const checkUsernameAvailability = async () => {
        if (!customUsername) return;

        setIsChecking(true);
        try {
            // Check if username exists in any other profile
            const profilesRef = doc(db, "portfolioUsernames", customUsername);
            const docSnap = await getDoc(profilesRef);

            // If document exists and belongs to another user
            if (docSnap.exists() && docSnap.data().userId !== userId) {
                setIsAvailable(false);
            } else {
                setIsAvailable(true);
            }
        } catch (error) {
            console.error("Error checking username:", error);
            // Assume username is available if there's an error checking
            setIsAvailable(true);
        } finally {
            setIsChecking(false);
        }
    };

    // Update your savePortfolioSettings function
    const savePortfolioSettings = async () => {
        if (!isAvailable && customUsername) {
            toast({
                title: "Username not available",
                description: "Please choose a different username for your portfolio",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            // Update profile with portfolio settings
            const profileRef = doc(db, "profiles", userId);
            await updateDoc(profileRef, {
                "portfolioSettings.isPublic": isPublic,
                "portfolioSettings.customUsername": customUsername,
                "portfolioSettings.lastUpdated": new Date(),
                "portfolioSettings.accentColor": accentColor,
                "portfolioSettings.template": portfolioTemplate,
                "portfolioSettings.metaDescription": metaDescription,
                "portfolioSettings.enableAnalytics": enableAnalytics,
            });

            // Reserve the username
            if (customUsername) {
                const usernameRef = doc(db, "portfolioUsernames", customUsername);
                await setDoc(usernameRef, {
                    userId: userId,
                    createdAt: new Date(),
                });
            }

            toast({
                title: "Portfolio settings saved",
                description: "Your portfolio settings have been updated successfully",
            });
        } catch (error) {
            console.error("Error saving portfolio settings:", error);
            toast({
                title: "Error saving settings",
                description: "There was a problem saving your portfolio settings",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Copy portfolio URL to clipboard
    const copyPortfolioUrl = () => {
        navigator.clipboard.writeText(portfolioUrl);
        toast({
            title: "URL copied",
            description: "Portfolio URL copied to clipboard",
        });
    };

    // Mark message as read
    const markMessageAsRead = async (messageId: string) => {
        try {
            const messageRef = doc(db, "portfolioMessages", messageId);
            await updateDoc(messageRef, {
                isRead: true,
            });

            // Update local state
            setMessages(
                messages.map((msg) =>
                    msg.id === messageId ? { ...msg, isRead: true } : msg
                )
            );

            // If the selected message is being marked as read, update it too
            if (selectedMessage?.id === messageId) {
                setSelectedMessage({ ...selectedMessage, isRead: true });
            }

            toast({
                title: "Message marked as read",
                description: "The message has been marked as read",
            });
        } catch (error) {
            console.error("Error marking message as read:", error);
            toast({
                title: "Error updating message",
                description: "There was a problem marking the message as read",
                variant: "destructive",
            });
        }
    };

    // Delete message
    const deleteMessage = async (messageId: string) => {
        setDeletingMessageId(messageId);
        setIsDeleting(true);
        try {
            const messageRef = doc(db, "portfolioMessages", messageId);
            await deleteDoc(messageRef);

            // Remove from local state
            setMessages(messages.filter((msg) => msg.id !== messageId));

            // Close modal if the deleted message was selected
            if (selectedMessage?.id === messageId) {
                setSelectedMessage(null);
            }

            toast({
                title: "Message deleted",
                description: "The message has been deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting message:", error);
            toast({
                title: "Error deleting message",
                description: "There was a problem deleting the message",
                variant: "destructive",
            });
        } finally {
            setDeletingMessageId("");
            setIsDeleting(false);
        }
    };

    // Delete username
    const deleteUsername = async (username: string) => {
        setDeletingUsername(username);
        try {
            const usernameRef = doc(db, "portfolioUsernames", username);
            await deleteDoc(usernameRef);

            // Remove from local state
            setUsernames(usernames.filter((u) => u.username !== username));

            // If this was the active username, also clear from profile
            if (customUsername === username) {
                setCustomUsername("");
                const profileRef = doc(db, "profiles", userId);
                await updateDoc(profileRef, {
                    "portfolioSettings.customUsername": "",
                });
            }

            toast({
                title: "Username deleted",
                description: `The username "${username}" has been deleted`,
            });
        } catch (error) {
            console.error("Error deleting username:", error);
            toast({
                title: "Error deleting username",
                description: "There was a problem deleting the username",
                variant: "destructive",
            });
        } finally {
            setDeletingUsername("");
        }
    };

    // Format date for display
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(date);
    };

    // Filter messages based on search term and read/unread filter
    const filteredMessages = messages.filter((message) => {
        const matchesSearch =
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase());

        if (messageFilter === "read") return matchesSearch && message.isRead;
        if (messageFilter === "unread") return matchesSearch && !message.isRead;
        return matchesSearch;
    });

    // Filter blog posts based on search term and status filter
    const filteredBlogPosts = blogPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
            post.tags.some((tag) =>
                tag.toLowerCase().includes(blogSearchTerm.toLowerCase())
            );

        if (blogStatusFilter === "published")
            return matchesSearch && post.status === "published";
        if (blogStatusFilter === "draft")
            return matchesSearch && post.status === "draft";
        return matchesSearch;
    });

    // Count unread messages
    const unreadCount = messages.filter((msg) => !msg.isRead).length;

    // Get initials from name for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Create a new blog post
    const createNewBlog = () => {
        setCurrentBlog({
            title: "",
            content: "",
            rawContent: null,
            excerpt: "",
            coverImage: "",
            tags: [],
            status: "draft",
        });
        setEditorMode("create");
        setBlogView("editor");
    };

    // Edit an existing blog post
    const editBlog = (blog: BlogPost) => {
        setCurrentBlog(blog);
        setEditorMode("edit");
        setBlogView("editor");
    };

    // Generate a slug from the title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "-")
            .trim();
    };

    // Save blog post
    const saveBlogPost = async () => {
        if (!currentBlog.title) {
            toast({
                title: "Title required",
                description: "Please provide a title for your blog post",
                variant: "destructive",
            });
            return;
        }

        setSavingBlog(true);
        try {
            const slug = currentBlog.slug || generateSlug(currentBlog.title);
            const now = new Date();

            if (editorMode === "create") {
                // Create new blog post
                const blogData = {
                    userId,
                    title: currentBlog.title,
                    content: currentBlog.content || "",
                    rawContent: currentBlog.rawContent || null,
                    excerpt: currentBlog.excerpt || "",
                    coverImage: currentBlog.coverImage || "",
                    tags: currentBlog.tags || [],
                    status: currentBlog.status || "draft",
                    createdAt: now,
                    updatedAt: now,
                    slug,
                };

                const docRef = await addDoc(
                    collection(db, "portfolioBlogPosts"),
                    blogData
                );

                // Add to local state
                setBlogPosts([
                    {
                        id: docRef.id,
                        ...blogData,
                        createdAt: now,
                        updatedAt: now,
                        slug,
                    } as BlogPost,
                    ...blogPosts,
                ]);

                toast({
                    title: "Blog post created",
                    description: "Your blog post has been created successfully",
                });
            } else {
                // Update existing blog post
                if (!currentBlog.id) return;

                const blogRef = doc(db, "portfolioBlogPosts", currentBlog.id);
                const blogData = {
                    title: currentBlog.title,
                    content: currentBlog.content || "",
                    rawContent: currentBlog.rawContent || null,
                    excerpt: currentBlog.excerpt || "",
                    coverImage: currentBlog.coverImage || "",
                    tags: currentBlog.tags || [],
                    status: currentBlog.status || "draft",
                    updatedAt: now,
                    slug,
                };

                await updateDoc(blogRef, blogData);

                // Update local state
                setBlogPosts(
                    blogPosts.map((post) =>
                        post.id === currentBlog.id
                            ? { ...post, ...blogData, updatedAt: now }
                            : post
                    )
                );

                toast({
                    title: "Blog post updated",
                    description: "Your blog post has been updated successfully",
                });
            }

            // Return to list view
            setBlogView("list");
        } catch (error) {
            console.error("Error saving blog post:", error);
            toast({
                title: "Error saving blog post",
                description: "There was a problem saving your blog post",
                variant: "destructive",
            });
        } finally {
            setSavingBlog(false);
        }
    };

    // Delete blog post
    const deleteBlogPost = async () => {
        if (!deletingBlogId) return;

        try {
            const blogRef = doc(db, "portfolioBlogPosts", deletingBlogId);
            await deleteDoc(blogRef);

            // Remove from local state
            setBlogPosts(blogPosts.filter((post) => post.id !== deletingBlogId));

            toast({
                title: "Blog post deleted",
                description: "Your blog post has been deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting blog post:", error);
            toast({
                title: "Error deleting blog post",
                description: "There was a problem deleting your blog post",
                variant: "destructive",
            });
        } finally {
            setDeletingBlogId("");
            setShowDeleteBlogDialog(false);
        }
    };

    // Add a tag to the current blog post
    const addTag = () => {
        if (!newTag.trim()) return;

        if (!currentBlog.tags) {
            setCurrentBlog({ ...currentBlog, tags: [newTag.trim()] });
        } else if (!currentBlog.tags.includes(newTag.trim())) {
            setCurrentBlog({
                ...currentBlog,
                tags: [...currentBlog.tags, newTag.trim()],
            });
        }

        setNewTag("");
    };

    // Remove a tag from the current blog post
    const removeTag = (tagToRemove: string) => {
        if (!currentBlog.tags) return;

        setCurrentBlog({
            ...currentBlog,
            tags: currentBlog.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    const uploadImage = async (file: File) => {
        setUploadingImage(true);

        try {
            // Set required parameters
            const uploadPreset = "ml_default"; // Your upload preset
            const timestamp = Math.floor(Date.now() / 1000);
            const apiKey = "988965663417232";
            const apiSecret = "Vo8HobpUEydUNcPg8GNw916jupI";
            const cloudName = "dvbw76boh";

            // Create the signature string and hash it.
            // Signature string format: "timestamp=<timestamp>&upload_preset=<preset><API_SECRET>"
            const signatureString = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
            const signature = sha1(signatureString);

            // Create a FormData object to send the file and credentials
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);
            formData.append("timestamp", String(timestamp));
            formData.append("api_key", apiKey);
            formData.append("signature", signature);

            // Cloudinary upload endpoint using your cloud name
            const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

            // Upload the image
            const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await response.json();

            // Update your blog post state with the image URL
            setCurrentBlog((prev) => ({
                ...prev,
                coverImage: data.secure_url,
            }));

            toast({
                title: "Image uploaded",
                description: "Your image has been uploaded successfully",
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            toast({
                title: "Error uploading image",
                description: "There was a problem uploading your image",
                variant: "destructive",
            });
        } finally {
            setUploadingImage(false);
        }
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    // Get the current selection in the editor
    const getSelection = () => {
        if (!editorRef.current) return { start: 0, end: 0, text: "" };

        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
        const text = editorRef.current.value.substring(start, end);

        return { start, end, text };
    };

    // Apply formatting to selected text
    const applyFormatting = (prefix: string, suffix: string = prefix) => {
        if (!editorRef.current) return;

        const { start, end, text } = getSelection();

        if (start === end) {
            // No selection, insert placeholder
            const newContent =
                editorRef.current.value.substring(0, start) +
                prefix +
                "text" +
                suffix +
                editorRef.current.value.substring(end);

            setCurrentBlog({
                ...currentBlog,
                content: newContent,
            });

            // Set cursor position to select the placeholder text
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.focus();
                    editorRef.current.selectionStart = start + prefix.length;
                    editorRef.current.selectionEnd = start + prefix.length + 4; // "text" is 4 chars
                }
            }, 0);
        } else {
            // Apply formatting to selection
            const newContent =
                editorRef.current.value.substring(0, start) +
                prefix +
                text +
                suffix +
                editorRef.current.value.substring(end);

            setCurrentBlog({
                ...currentBlog,
                content: newContent,
            });

            // Maintain selection with formatting
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.focus();
                    editorRef.current.selectionStart = start;
                    editorRef.current.selectionEnd = end + prefix.length + suffix.length;
                }
            }, 0);
        }
    };

    // Insert code snippet into content
    const insertCodeSnippet = () => {
        applyFormatting("```\n", "\n```");
    };

    // Insert link
    const insertLink = () => {
        const selection = getSelection();
        setSelectedText(selection);
        setLinkUrl("");
        setShowLinkPopover(true);
    };

    // Apply link to selected text
    const applyLink = () => {
        if (!editorRef.current || !linkUrl) return;

        const { start, end, text } = selectedText;
        const linkText = text || "link text";

        const newContent =
            editorRef.current.value.substring(0, start) +
            `[${linkText}](${linkUrl})` +
            editorRef.current.value.substring(end);

        setCurrentBlog({
            ...currentBlog,
            content: newContent,
        });

        setShowLinkPopover(false);
    };

    // Apply text color
    const applyTextColor = () => {
        if (!editorRef.current) return;

        const { start, end, text } = selectedText;
        const selectedContent = text || "colored text";

        const newContent =
            editorRef.current.value.substring(0, start) +
            `<span style="color:${textColor}">${selectedContent}</span>` +
            editorRef.current.value.substring(end);

        setCurrentBlog({
            ...currentBlog,
            content: newContent,
        });

        setShowColorPopover(false);
    };

    // Apply background color
    const applyBackgroundColor = () => {
        if (!editorRef.current) return;

        const { start, end, text } = selectedText;
        const selectedContent = text || "highlighted text";

        const newContent =
            editorRef.current.value.substring(0, start) +
            `<span style="background-color:${backgroundColor}">${selectedContent}</span>` +
            editorRef.current.value.substring(end);

        setCurrentBlog({
            ...currentBlog,
            content: newContent,
        });

        setShowBgColorPopover(false);
    };

    // Preview the current blog post
    const previewBlog = () => {
        setBlogView("preview");
    };

    // Format text as bold
    const formatBold = () => {
        applyFormatting("**");
    };

    // Format text as italic
    const formatItalic = () => {
        applyFormatting("*");
    };

    // Format text as underlined
    const formatUnderline = () => {
        applyFormatting("<u>", "</u>");
    };

    // Format text as strikethrough
    const formatStrikethrough = () => {
        applyFormatting("~~");
    };

    // Format text as heading 1
    const formatH1 = () => {
        applyFormatting("# ");
    };

    // Format text as heading 2
    const formatH2 = () => {
        applyFormatting("## ");
    };

    // Format text as heading 3
    const formatH3 = () => {
        applyFormatting("### ");
    };

    // Format text as unordered list
    const formatUnorderedList = () => {
        if (!editorRef.current) return;

        const { start, end, text } = getSelection();

        if (text) {
            // Convert each line to a list item
            const listItems = text
                .split("\n")
                .map((line) => `- ${line}`)
                .join("\n");

            const newContent =
                editorRef.current.value.substring(0, start) +
                listItems +
                editorRef.current.value.substring(end);

            setCurrentBlog({
                ...currentBlog,
                content: newContent,
            });
        } else {
            // Insert a single list item
            applyFormatting("- ");
        }
    };

    // Format text as ordered list
    const formatOrderedList = () => {
        if (!editorRef.current) return;

        const { start, end, text } = getSelection();

        if (text) {
            // Convert each line to a numbered list item
            const lines = text.split("\n");
            const listItems = lines
                .map((line, index) => `${index + 1}. ${line}`)
                .join("\n");

            const newContent =
                editorRef.current.value.substring(0, start) +
                listItems +
                editorRef.current.value.substring(end);

            setCurrentBlog({
                ...currentBlog,
                content: newContent,
            });
        } else {
            // Insert a single list item
            applyFormatting("1. ");
        }
    };

    // Format text as blockquote
    const formatBlockquote = () => {
        if (!editorRef.current) return;

        const { start, end, text } = getSelection();

        if (text) {
            // Convert each line to a blockquote
            const blockquote = text
                .split("\n")
                .map((line) => `> ${line}`)
                .join("\n");

            const newContent =
                editorRef.current.value.substring(0, start) +
                blockquote +
                editorRef.current.value.substring(end);

            setCurrentBlog({
                ...currentBlog,
                content: newContent,
            });
        } else {
            // Insert a single blockquote
            applyFormatting("> ");
        }
    };

    // Apply text highlight
    const applyHighlight = () => {
        setSelectedText(getSelection());
        setBackgroundColor("#ffff00"); // Default yellow highlight
        setShowBgColorPopover(true);
    };

    // Apply text color

    // Insert image at cursor position
    const insertImageAtCursor = (imageUrl: string) => {
        if (!editorRef.current) return;

        const { start } = getSelection();

        const imageMarkdown = `![Image](${imageUrl})`;

        const newContent =
            editorRef.current.value.substring(0, start) +
            imageMarkdown +
            editorRef.current.value.substring(start);

        setCurrentBlog({
            ...currentBlog,
            content: newContent,
        });
    };

    // Insert inline image
    const insertInlineImage = () => {
        // Create a temporary file input
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setUploadingImage(true);
                try {
                    // Use the same upload function as for cover images
                    const uploadPreset = "ml_default";
                    const timestamp = Math.floor(Date.now() / 1000);
                    const apiKey = "988965663417232";
                    const apiSecret = "Vo8HobpUEydUNcPg8GNw916jupI";
                    const cloudName = "dvbw76boh";

                    const signatureString = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
                    const signature = sha1(signatureString);

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", uploadPreset);
                    formData.append("timestamp", String(timestamp));
                    formData.append("api_key", apiKey);
                    formData.append("signature", signature);

                    const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Failed to upload image");
                    }

                    const data = await response.json();

                    // Insert the image at cursor position
                    insertImageAtCursor(data.secure_url);

                    toast({
                        title: "Image uploaded",
                        description: "Your inline image has been uploaded and inserted",
                    });
                } catch (error) {
                    console.error("Error uploading inline image:", error);
                    toast({
                        title: "Error uploading image",
                        description: "There was a problem uploading your inline image",
                        variant: "destructive",
                    });
                } finally {
                    setUploadingImage(false);
                }
            }
        };

        input.click();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>
                    Manage your portfolio settings, messages, usernames, and blog posts
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid grid-cols-4 mb-6">
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings2Icon className="h-4 w-4" />
                            <span>Settings</span>
                        </TabsTrigger>
                        <TabsTrigger value="messages" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Messages</span>
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="usernames" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Usernames</span>
                        </TabsTrigger>
                        <TabsTrigger value="blog" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Blog</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Settings Tab
                    // <TabsContent value="settings" className="space-y-6">
                    //     <div className="flex items-center justify-between space-x-2">
                    //         <div>
                    //             <Label htmlFor="portfolio-visibility" className="text-base">
                    //                 Portfolio Visibility
                    //             </Label>
                    //             <p className="text-sm text-muted-foreground">Make your portfolio visible to the public</p>
                    //         </div>
                    //         <Switch id="portfolio-visibility" checked={isPublic} onCheckedChange={setIsPublic} />
                    //     </div>

                    //     <div className="space-y-2">
                    //         <Label htmlFor="custom-username">Custom Username</Label>
                    //         <div className="flex space-x-2">
                    //             <Input
                    //                 id="custom-username"
                    //                 placeholder="your-username"
                    //                 value={customUsername}
                    //                 onChange={(e) => setCustomUsername(e.target.value)}
                    //                 onBlur={checkUsernameAvailability}
                    //             />
                    //             {isChecking && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                    //         </div>
                    //         {customUsername && !isChecking && (
                    //             <p className={`text-sm ${isAvailable ? "text-green-500" : "text-red-500"}`}>
                    //                 {isAvailable ? "Username is available" : "Username is already taken"}
                    //             </p>
                    //         )}
                    //     </div>

                    //     <div className="space-y-2">
                    //         <Label>Your Portfolio URL</Label>
                    //         <div className="flex items-center space-x-2">
                    //             <Input value={portfolioUrl} readOnly className="bg-muted" />
                    //             <Button variant="outline" size="icon" onClick={copyPortfolioUrl}>
                    //                 <Copy className="h-4 w-4" />
                    //             </Button>
                    //         </div>
                    //     </div>

                    //     <div className="flex justify-between items-center pt-4">
                    //         <Button
                    //             variant="default"
                    //             onClick={savePortfolioSettings}
                    //             disabled={isSaving || (customUsername !== "" && !isAvailable)}
                    //         >
                    //             {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    //             Save Settings
                    //         </Button>

                    //         {isPublic && (
                    //             <Link href={portfolioUrl} target="_blank">
                    //                 <Button variant="outline" className="flex items-center gap-2">
                    //                     <ExternalLink className="h-4 w-4" />
                    //                     View Portfolio
                    //                 </Button>
                    //             </Link>
                    //         )}
                    //     </div>
                    // </TabsContent> */}

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <div>
                                <Label htmlFor="portfolio-visibility" className="text-base">
                                    Portfolio Visibility
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Make your portfolio visible to the public
                                </p>
                            </div>
                            <Switch
                                id="portfolio-visibility"
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="custom-username">Custom Username</Label>
                            <div className="relative">
                                <div className="flex space-x-2">
                                    <Input
                                        id="custom-username"
                                        placeholder="your-username"
                                        value={customUsername}
                                        onChange={(e) => {
                                            setCustomUsername(e.target.value);
                                            if (e.target.value.length > 2) {
                                                checkUsernameAvailability();
                                                fetchSimilarUsernames(e.target.value);
                                            }
                                        }}
                                        onBlur={checkUsernameAvailability}
                                        className="pr-10"
                                    />
                                    {isChecking ? (
                                        <div className="absolute right-3 top-3">
                                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : customUsername ? (
                                        <div className="absolute right-3 top-3">
                                            {isAvailable ? (
                                                <div className="text-green-500">✓</div>
                                            ) : (
                                                <div className="text-red-500">✗</div>
                                            )}
                                        </div>
                                    ) : null}
                                </div>

                                {customUsername && !isChecking && (
                                    <p
                                        className={`text-sm mt-1 ${isAvailable ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {isAvailable
                                            ? "Username is available"
                                            : "Username is already taken"}
                                    </p>
                                )}

                                {!isAvailable && similarUsernames.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium mb-1">
                                            Similar available usernames:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {similarUsernames.map((username, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-primary/10"
                                                    onClick={() => {
                                                        setCustomUsername(username);
                                                        setIsAvailable(true);
                                                    }}
                                                >
                                                    {username}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {customUsername && customUsername.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Username preview:
                                        </p>
                                        <div className="p-3 border rounded-md bg-muted/30">
                                            <div className="flex items-center space-x-2">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                                <span className="font-medium">{customUsername}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {portfolioUrl}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Your Portfolio URL</Label>
                            <div className="flex items-center space-x-2">
                                <Input value={portfolioUrl} readOnly className="bg-muted" />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={copyPortfolioUrl}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Copy URL</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-medium">Portfolio Customization</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accent-color">Accent Color</Label>
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-8 h-8 rounded-full border cursor-pointer"
                                            style={{ backgroundColor: accentColor }}
                                            onClick={() => setShowColorPicker(!showColorPicker)}
                                        />
                                        <Input
                                            id="accent-color"
                                            value={accentColor}
                                            onChange={(e) => setAccentColor(e.target.value)}
                                            className="w-24"
                                        />
                                        {showColorPicker && (
                                            <div className="absolute mt-24 z-10">
                                                <div
                                                    className="fixed inset-0"
                                                    onClick={() => setShowColorPicker(false)}
                                                />
                                                <div className="relative bg-background p-2 rounded-md shadow-lg border">
                                                    {/* Color picker would go here */}
                                                    <div className="grid grid-cols-5 gap-1">
                                                        {[
                                                            "#1e40af",
                                                            "#2563eb",
                                                            "#3b82f6",
                                                            "#60a5fa",
                                                            "#93c5fd",
                                                            "#ef4444",
                                                            "#f97316",
                                                            "#eab308",
                                                            "#22c55e",
                                                            "#14b8a6",
                                                        ].map((color) => (
                                                            <div
                                                                key={color}
                                                                className="w-6 h-6 rounded-full cursor-pointer border"
                                                                style={{ backgroundColor: color }}
                                                                onClick={() => {
                                                                    setAccentColor(color);
                                                                    setShowColorPicker(false);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="portfolio-template">Portfolio Template</Label>
                                    <Select
                                        value={portfolioTemplate}
                                        onValueChange={setPortfolioTemplate}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="minimal">Minimal</SelectItem>
                                            <SelectItem value="professional">Professional</SelectItem>
                                            <SelectItem value="creative">Creative</SelectItem>
                                            <SelectItem value="dark">Dark Mode</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meta-description">SEO Meta Description</Label>
                                <Textarea
                                    id="meta-description"
                                    placeholder="A brief description of your portfolio (helps with search engines)"
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    className="resize-none"
                                    maxLength={160}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {160 - (metaDescription?.length || 0)} characters remaining
                                </p>
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div>
                                    <Label htmlFor="portfolio-analytics" className="text-base">
                                        Enable Analytics
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Collect anonymous visitor data
                                    </p>
                                </div>
                                <Switch
                                    id="portfolio-analytics"
                                    checked={enableAnalytics}
                                    onCheckedChange={setEnableAnalytics}
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <Card className="bg-muted/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Portfolio Preview</CardTitle>
                                    <CardDescription>
                                        See how your portfolio will look
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PortfolioPage username={customUsername || userId} />
                                </CardContent>

                            </Card>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <Button
                                variant="default"
                                onClick={savePortfolioSettings}
                                disabled={isSaving || (customUsername !== "" && !isAvailable)}
                            >
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Settings
                            </Button>

                            {isPublic && (
                                <Link href={portfolioUrl} target="_blank">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <ExternalLink className="h-4 w-4" />
                                        View Portfolio
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </TabsContent>

                    {/* Enhanced Messages Tab */}
                    <TabsContent value="messages" className="space-y-4">
                        {loadingMessages ? (
                            <div className="flex justify-center py-12">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-muted-foreground">
                                        Loading your messages...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Message filtering and search bar */}
                                <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
                                    <div className="relative w-full md:w-auto flex-1">
                                        <Input
                                            placeholder="Search messages..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                            <Search className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex gap-2 items-center"
                                                >
                                                    <Filter className="h-4 w-4" />
                                                    <span>
                                                        {messageFilter === "all" && "All Messages"}
                                                        {messageFilter === "read" && "Read Messages"}
                                                        {messageFilter === "unread" && "Unread Messages"}
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => setMessageFilter("all")}
                                                >
                                                    All Messages
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setMessageFilter("read")}
                                                >
                                                    Read Messages
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setMessageFilter("unread")}
                                                >
                                                    Unread Messages
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {messages.length > 0 && (
                                            <Badge variant="outline" className="ml-2">
                                                <span className="font-semibold">
                                                    {filteredMessages.length}
                                                </span>{" "}
                                                / {messages.length} messages
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {messages.length === 0 ? (
                                    <div className="text-center py-16 border rounded-lg bg-muted/30">
                                        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <h3 className="text-xl font-medium mb-2">
                                            No messages yet
                                        </h3>
                                        <p className="text-muted-foreground max-w-md mx-auto">
                                            When someone sends you a message from your portfolio, it
                                            will appear here. Share your portfolio to get started.
                                        </p>
                                    </div>
                                ) : filteredMessages.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-muted/30">
                                        <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <h3 className="text-lg font-medium mb-2">
                                            No matching messages
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Try adjusting your search or filter settings.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredMessages.map((message) => (
                                            <Card
                                                key={message.id}
                                                className={cn(
                                                    "transition-all duration-200 hover:shadow-md cursor-pointer",
                                                    !message.isRead
                                                        ? "border-l-4 border-l-primary"
                                                        : "border"
                                                )}
                                                onClick={() => {
                                                    setSelectedMessage(message);
                                                    if (!message.isRead) {
                                                        markMessageAsRead(message.id);
                                                    }
                                                }}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="h-10 w-10 mt-1">
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {getInitials(message.name)}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <div>
                                                                    <h3 className="font-medium truncate">
                                                                        {message.name}
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground truncate">
                                                                        {message.email}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                                        {formatDate(message.createdAt)}
                                                                    </div>

                                                                    {!message.isRead && (
                                                                        <Badge variant="default" className="ml-2">
                                                                            New
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                                                {message.message}
                                                            </p>

                                                            <div className="flex justify-end mt-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="flex items-center gap-1 text-xs"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedMessage(message);
                                                                    }}
                                                                >
                                                                    <Eye className="h-3 w-3" />
                                                                    View
                                                                </Button>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="flex items-center gap-1 text-xs text-destructive hover:text-destructive"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteMessage(message.id);
                                                                    }}
                                                                    disabled={
                                                                        deletingMessageId === message.id &&
                                                                        isDeleting
                                                                    }
                                                                >
                                                                    {deletingMessageId === message.id &&
                                                                        isDeleting ? (
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-3 w-3" />
                                                                    )}
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Message Detail Modal */}
                        <Dialog
                            open={selectedMessage !== null}
                            onOpenChange={(open) => !open && setSelectedMessage(null)}
                        >
                            {selectedMessage && (
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle className="flex justify-between items-center">
                                            <span>Message from {selectedMessage.name}</span>
                                            {!selectedMessage.isRead && (
                                                <Badge variant="outline" className="ml-2 bg-primary/10">
                                                    New
                                                </Badge>
                                            )}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Received on {formatDate(selectedMessage.createdAt)}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 my-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getInitials(selectedMessage.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{selectedMessage.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedMessage.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 p-4 rounded-lg border text-sm whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </div>
                                    </div>

                                    <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between">
                                        <Button
                                            variant="destructive"
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                deleteMessage(selectedMessage.id);
                                                setSelectedMessage(null);
                                            }}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                            Delete Message
                                        </Button>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedMessage.email);
                                                    toast({
                                                        title: "Email copied",
                                                        description: "Email address copied to clipboard",
                                                    });
                                                }}
                                            >
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy Email
                                            </Button>
                                            <Button onClick={() => setSelectedMessage(null)}>
                                                Close
                                            </Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            )}
                        </Dialog>
                    </TabsContent>

                    {/* Usernames Tab */}
                    <TabsContent value="usernames" className="space-y-6">
                        {loadingUsernames ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : usernames.length === 0 ? (
                            <div className="text-center py-8">
                                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No custom usernames</h3>
                                <p className="text-muted-foreground">
                                    Create custom usernames to share your portfolio with a unique
                                    URL.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {usernames.map((item) => (
                                    <Card
                                        key={item.username}
                                        className="flex items-center justify-between p-4"
                                    >
                                        <div>
                                            <h3 className="font-medium">{item.username}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(item.createdAt)}
                                            </p>
                                        </div>
                                        <div>
                                            {item.username === customUsername ? (
                                                <Button variant="ghost" size="icon" disabled>
                                                    <span className="text-primary">Active</span>
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteUsername(item.username)}
                                                    disabled={deletingUsername === item.username}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Blog Tab */}
                    <TabsContent value="blog" className="space-y-6">
                        {blogView === "list" ? (
                            <>
                                <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
                                    <div className="relative w-full md:w-auto flex-1">
                                        <Input
                                            placeholder="Search blog posts..."
                                            value={blogSearchTerm}
                                            onChange={(e) => setBlogSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                            <Search className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex gap-2 items-center"
                                                >
                                                    <Filter className="h-4 w-4" />
                                                    <span>
                                                        {blogStatusFilter === "all" && "All Posts"}
                                                        {blogStatusFilter === "published" &&
                                                            "Published Posts"}
                                                        {blogStatusFilter === "draft" && "Draft Posts"}
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => setBlogStatusFilter("all")}
                                                >
                                                    All Posts
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setBlogStatusFilter("published")}
                                                >
                                                    Published Posts
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setBlogStatusFilter("draft")}
                                                >
                                                    Draft Posts
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Button
                                            onClick={createNewBlog}
                                            className="flex items-center gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            New Post
                                        </Button>
                                    </div>
                                </div>

                                {loadingBlogs ? (
                                    <div className="flex justify-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                            <p className="text-muted-foreground">
                                                Loading your blog posts...
                                            </p>
                                        </div>
                                    </div>
                                ) : blogPosts.length === 0 ? (
                                    <div className="text-center py-16 border rounded-lg bg-muted/30">
                                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <h3 className="text-xl font-medium mb-2">
                                            No blog posts yet
                                        </h3>
                                        <p className="text-muted-foreground max-w-md mx-auto">
                                            Share your knowledge and expertise by creating blog posts
                                            for your portfolio.
                                        </p>
                                        <Button onClick={createNewBlog} className="mt-4">
                                            Create Your First Post
                                        </Button>
                                    </div>
                                ) : filteredBlogPosts.length === 0 ? (
                                    <div className="text-center py-12 border rounded-lg bg-muted/30">
                                        <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <h3 className="text-lg font-medium mb-2">
                                            No matching blog posts
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Try adjusting your search or filter settings.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {filteredBlogPosts.map((post) => (
                                            <Card
                                                key={post.id}
                                                className="overflow-hidden hover:shadow-md transition-shadow"
                                            >
                                                <div className="relative h-48 bg-muted">
                                                    {post.coverImage ? (
                                                        <div
                                                            className="absolute inset-0 bg-center bg-cover"
                                                            style={{
                                                                backgroundImage: `url(${post.coverImage})`,
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full bg-primary/10">
                                                            <FileText className="h-12 w-12 text-primary/50" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 right-2">
                                                        <Badge
                                                            variant={
                                                                post.status === "published"
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                        >
                                                            {post.status === "published"
                                                                ? "Published"
                                                                : "Draft"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(post.createdAt)}</span>
                                                    </div>
                                                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-muted-foreground mb-4 line-clamp-3">
                                                        {post.excerpt || post.content.substring(0, 150)}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {post.tags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setDeletingBlogId(post.id);
                                                                setShowDeleteBlogDialog(true);
                                                            }}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Delete
                                                        </Button>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link
                                                                    href={`/portfolio/${customUsername || userId
                                                                        }/blog/${post.slug}`}
                                                                    target="_blank"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    View
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => editBlog(post)}
                                                            >
                                                                <Edit className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Delete Blog Confirmation Dialog */}
                                <AlertDialog
                                    open={showDeleteBlogDialog}
                                    onOpenChange={setShowDeleteBlogDialog}
                                >
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently
                                                delete your blog post.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={deleteBlogPost}
                                                className="bg-destructive text-destructive-foreground"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        ) : blogView === "editor" ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBlogView("list")}
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Posts
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={previewBlog}
                                            className="flex items-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Preview
                                        </Button>
                                        <Button
                                            onClick={saveBlogPost}
                                            disabled={savingBlog || !currentBlog.title}
                                            className="flex items-center gap-2"
                                        >
                                            {savingBlog ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )}
                                            Save Post
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="blog-title">Title</Label>
                                        <Input
                                            id="blog-title"
                                            placeholder="Enter blog title"
                                            value={currentBlog.title || ""}
                                            onChange={(e) =>
                                                setCurrentBlog({
                                                    ...currentBlog,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="text-lg"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="blog-excerpt">Excerpt</Label>
                                        <Textarea
                                            id="blog-excerpt"
                                            placeholder="Brief summary of your post"
                                            value={currentBlog.excerpt || ""}
                                            onChange={(e) =>
                                                setCurrentBlog({
                                                    ...currentBlog,
                                                    excerpt: e.target.value,
                                                })
                                            }
                                            className="resize-none h-20"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Cover Image</Label>
                                            <div className="border rounded-lg overflow-hidden bg-muted">
                                                {currentBlog.coverImage ? (
                                                    <div className="relative h-48">
                                                        <div
                                                            className="absolute inset-0 bg-center bg-cover"
                                                            style={{
                                                                backgroundImage: `url(${currentBlog.coverImage})`,
                                                            }}
                                                        />
                                                        <div className="absolute bottom-2 right-2">
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setCurrentBlog({
                                                                        ...currentBlog,
                                                                        coverImage: "",
                                                                    })
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-48 p-4">
                                                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground text-center mb-4">
                                                            Upload a cover image for your blog post
                                                        </p>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            ref={fileInputRef}
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            disabled={uploadingImage}
                                                        >
                                                            {uploadingImage ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                                    Uploading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ImageIcon className="h-4 w-4 mr-2" />
                                                                    Upload Image
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="blog-status">Status</Label>
                                                <Select
                                                    value={currentBlog.status || "draft"}
                                                    onValueChange={(value) =>
                                                        setCurrentBlog({
                                                            ...currentBlog,
                                                            status: value as "published" | "draft",
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Published</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tags</Label>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {currentBlog.tags?.map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                            className="flex items-center gap-1"
                                                        >
                                                            {tag}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                                                onClick={() => removeTag(tag)}
                                                            >
                                                                <span className="sr-only">Remove tag</span>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <path d="M18 6 6 18" />
                                                                    <path d="m6 6 12 12" />
                                                                </svg>
                                                            </Button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Add a tag"
                                                        value={newTag}
                                                        onChange={(e) => setNewTag(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && newTag.trim()) {
                                                                e.preventDefault();
                                                                addTag();
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        onClick={addTag}
                                                        disabled={!newTag.trim()}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="blog-content">Content</Label>
                                        </div>

                                        {/* Enhanced Rich Text Editor Toolbar */}
                                        <div className="border rounded-t-lg bg-muted p-2 flex flex-wrap gap-1">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatBold}
                                                        >
                                                            <Bold className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Bold</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatItalic}
                                                        >
                                                            <Italic className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Italic</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatUnderline}
                                                        >
                                                            <Underline className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Underline</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatStrikethrough}
                                                        >
                                                            <Strikethrough className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Strikethrough</TooltipContent>
                                                </Tooltip>

                                                <div className="w-px h-6 bg-border mx-1" />

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatH1}
                                                        >
                                                            <Heading1 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Heading 1</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatH2}
                                                        >
                                                            <Heading2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Heading 2</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatH3}
                                                        >
                                                            <Heading3 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Heading 3</TooltipContent>
                                                </Tooltip>

                                                <div className="w-px h-6 bg-border mx-1" />

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatUnorderedList}
                                                        >
                                                            <List className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Bullet List</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatOrderedList}
                                                        >
                                                            <ListOrdered className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Numbered List</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={formatBlockquote}
                                                        >
                                                            <Quote className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Blockquote</TooltipContent>
                                                </Tooltip>

                                                <div className="w-px h-6 bg-border mx-1" />

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={insertCodeSnippet}
                                                        >
                                                            <CodeIcon className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Code Block</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={insertLink}
                                                        >
                                                            <LinkIcon className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Insert Link</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={insertInlineImage}
                                                        >
                                                            <ImageIcon className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Insert Image</TooltipContent>
                                                </Tooltip>

                                                <div className="w-px h-6 bg-border mx-1" />

                                                <Popover
                                                    open={showColorPopover}
                                                    onOpenChange={setShowColorPopover}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedText(getSelection());
                                                                setShowColorPopover(true);
                                                            }}
                                                        >
                                                            <span className="sr-only">Text Color</span>
                                                            <svg
                                                                width="15"
                                                                height="15"
                                                                viewBox="0 0 15 15"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                            >
                                                                <path
                                                                    d="M3 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                                                    fill="currentColor"
                                                                />
                                                                <path
                                                                    d="M7.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                                                    fill="currentColor"
                                                                />
                                                                <path
                                                                    d="M12 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                                                                    fill="currentColor"
                                                                />
                                                            </svg>
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-64">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="text-color">Text Color</Label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    id="text-color"
                                                                    type="color"
                                                                    value={textColor}
                                                                    onChange={(e) => setTextColor(e.target.value)}
                                                                    className="w-10 h-10 p-1"
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    value={textColor}
                                                                    onChange={(e) => setTextColor(e.target.value)}
                                                                    className="flex-1"
                                                                />
                                                            </div>
                                                            <div className="flex justify-end gap-2 mt-4">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setShowColorPopover(false)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button size="sm" onClick={applyTextColor}>
                                                                    Apply
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={applyHighlight}
                                                        >
                                                            <Highlighter className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Highlight Text</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        <Textarea
                                            id="blog-content"
                                            ref={editorRef}
                                            placeholder="Write your blog post content here..."
                                            value={currentBlog.content || ""}
                                            onChange={(e) =>
                                                setCurrentBlog({
                                                    ...currentBlog,
                                                    content: e.target.value,
                                                })
                                            }
                                            className="min-h-[400px] font-mono rounded-t-none"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Use the toolbar above for formatting or use Markdown
                                            syntax. HTML tags are also supported for advanced
                                            formatting.
                                        </p>
                                    </div>
                                </div>

                                {/* Link Popover */}
                                <Popover
                                    open={showLinkPopover}
                                    onOpenChange={setShowLinkPopover}
                                >
                                    <PopoverContent className="w-80">
                                        <div className="space-y-2">
                                            <Label htmlFor="link-url">Link URL</Label>
                                            <Input
                                                id="link-url"
                                                placeholder="https://example.com"
                                                value={linkUrl}
                                                onChange={(e) => setLinkUrl(e.target.value)}
                                            />
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowLinkPopover(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={applyLink}
                                                    disabled={!linkUrl}
                                                >
                                                    Insert Link
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Background Color Popover */}
                                <Popover
                                    open={showBgColorPopover}
                                    onOpenChange={setShowBgColorPopover}
                                >
                                    <PopoverContent className="w-64">
                                        <div className="space-y-2">
                                            <Label htmlFor="bg-color">Highlight Color</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="bg-color"
                                                    type="color"
                                                    value={backgroundColor}
                                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                                    className="w-10 h-10 p-1"
                                                />
                                                <Input
                                                    type="text"
                                                    value={backgroundColor}
                                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                                    className="flex-1"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowBgColorPopover(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button size="sm" onClick={applyBackgroundColor}>
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        ) : (
                            // Preview mode
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBlogView("editor")}
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Editor
                                    </Button>
                                    <Button
                                        onClick={saveBlogPost}
                                        disabled={savingBlog || !currentBlog.title}
                                        className="flex items-center gap-2"
                                    >
                                        {savingBlog ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        Save Post
                                    </Button>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <div className="relative">
                                        {currentBlog.coverImage ? (
                                            <div className="h-64 relative">
                                                <div
                                                    className="absolute inset-0 bg-center bg-cover"
                                                    style={{
                                                        backgroundImage: `url(${currentBlog.coverImage})`,
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <Badge
                                                        variant={
                                                            currentBlog.status === "published"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="mb-2"
                                                    >
                                                        {currentBlog.status === "published"
                                                            ? "Published"
                                                            : "Draft"}
                                                    </Badge>
                                                    <h1 className="text-3xl font-bold text-white">
                                                        {currentBlog.title}
                                                    </h1>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-muted p-6">
                                                <Badge
                                                    variant={
                                                        currentBlog.status === "published"
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    className="mb-2"
                                                >
                                                    {currentBlog.status === "published"
                                                        ? "Published"
                                                        : "Draft"}
                                                </Badge>
                                                <h1 className="text-3xl font-bold">
                                                    {currentBlog.title}
                                                </h1>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {currentBlog.tags?.map((tag) => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        {currentBlog.excerpt && (
                                            <div className="mb-6 italic text-muted-foreground border-l-4 border-primary/20 pl-4 py-2">
                                                {currentBlog.excerpt}
                                            </div>
                                        )}

                                        <div
                                            className="prose prose-sm sm:prose max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: renderContent(currentBlog.content || ""),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

// Helper function to render markdown content with HTML support
const renderContent = (content: string): string => {
    // Process markdown
    let html = content
        // Handle headings
        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>')

        // Handle bold and italic
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/~~(.*?)~~/g, "<del>$1</del>")

        // Handle lists
        .replace(/^\s*- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
        .replace(/^\s*(\d+)\. (.*$)/gm, '<li class="ml-6 list-decimal">$1. $2</li>')

        // Handle blockquotes
        .replace(
            /^\> (.*$)/gm,
            '<blockquote class="border-l-4 border-primary/30 pl-4 italic my-4">$1</blockquote>'
        )

        // Handle links
        .replace(
            /\[(.*?)\]$$(.*?)$$/g,
            '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>'
        )

        // Handle images
        .replace(
            /!\[(.*?)\]$$(.*?)$$/g,
            '<img src="$2" alt="$1" class="rounded-md my-4 max-w-full" />'
        )

        // Handle code blocks
        .replace(/\`\`\`([\s\S]*?)\`\`\`/g, (match, p1) => {
            const lines = p1.trim().split("\n");
            let language = "";
            let code = p1;

            // Check if the first line is a language identifier
            if (lines.length > 0 && !lines[0].includes(" ")) {
                language = lines[0];
                code = lines.slice(1).join("\n");
            }

            return `<div class="bg-zinc-900 rounded-lg overflow-hidden my-6">
                    ${language
                    ? `<div class="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                            <span class="text-xs font-mono text-zinc-400">${language}</span>
                            <button onclick="document.execCommand('copy')" class="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                                </svg>
                                Copy
                            </button>
                        </div>`
                    : ""
                }
                    <div class="p-4 overflow-x-auto">
                        <pre class="text-sm font-mono text-zinc-200 whitespace-pre">${code}</pre>
                    </div>
                </div>`;
        })

        // Handle inline code
        .replace(
            /`([^`]+)`/g,
            '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>'
        )

        // Handle paragraphs (must come last)
        .replace(/^(?!<[a-z])(.*$)/gm, (match) => {
            if (match.trim() === "") return "";
            return `<p class="my-2">${match}</p>`;
        });

    // Clean up any consecutive paragraph tags
    html = html.replace(/<\/p>\s*<p>/g, "</p><p>");

    // Group list items
    html = html.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>)/g, "$1$2");
    html = html.replace(/(<li[^>]*>.*?<\/li>)(?!\s*<li)/g, "<ul>$1</ul>");

    return html;
};
