// "use client"

// import { useEffect, useState } from "react"
// import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
// import type { UserProfile } from "@/types/profile"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Calendar, Clock, Tag, Share2 } from "lucide-react"
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { db } from "@/lib/firebase"

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
//     userId: string
// }

// export default function BlogPostPage({ username, slug }: { username: string; slug: string }) {
//     const [profile, setProfile] = useState<UserProfile | null>(null)
//     const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)

//     useEffect(() => {
//         const fetchBlogPost = async () => {
//             if (!username || !slug) {
//                 setError("Username or slug is undefined")
//                 setLoading(false)
//                 return
//             }

//             try {
//                 // Use getDoc with the username as document ID (like in BlogListPage)
//                 const usernameDoc = await getDoc(doc(db, "portfolioUsernames", username))
//                 if (!usernameDoc.exists()) {
//                     setError("Portfolio not found")
//                     setLoading(false)
//                     return
//                 }
//                 const userData = usernameDoc.data()
//                 const userId = userData.userId

//                 if (!userId) {
//                     setError("User ID not found in portfolio")
//                     setLoading(false)
//                     return
//                 }

//                 // Query the blog post with the matching slug and userId
//                 const blogsRef = collection(db, "portfolioBlogPosts")
//                 const q = query(blogsRef, where("userId", "==", userId), where("slug", "==", slug))
//                 const querySnapshot = await getDocs(q)

//                 if (querySnapshot.empty) {
//                     setError("Blog post not found")
//                     setLoading(false)
//                     return
//                 }

//                 const postDoc = querySnapshot.docs[0]
//                 const postData = postDoc.data()

//                 // Get the user profile
//                 const profileDoc = await getDoc(doc(db, "profiles", userId))
//                 if (profileDoc.exists()) {
//                     setProfile(profileDoc.data() as UserProfile)
//                 }

//                 // Set blog post data
//                 setBlogPost({
//                     id: postDoc.id,
//                     title: postData.title,
//                     content: postData.content,
//                     excerpt: postData.excerpt,
//                     coverImage: postData.coverImage,
//                     tags: postData.tags || [],
//                     status: postData.status,
//                     createdAt: postData.createdAt.toDate(),
//                     updatedAt: postData.updatedAt.toDate(),
//                     slug: postData.slug,
//                     userId,
//                 })
//             } catch (error) {
//                 console.error("Error fetching blog post:", error)
//                 setError("Error fetching blog post")
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchBlogPost()
//     }, [username, slug])

//     // Format date for display
//     const formatDate = (date: Date) => {
//         return new Intl.DateTimeFormat("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//         }).format(date)
//     }

//     // Estimate reading time
//     const getReadingTime = (content: string) => {
//         const wordsPerMinute = 200
//         const wordCount = content.split(/\s+/).length
//         const readingTime = Math.ceil(wordCount / wordsPerMinute)
//         return readingTime === 1 ? "1 min read" : `${readingTime} min read`
//     }

//     // Share blog post
//     const shareBlogPost = () => {
//         if (navigator.share) {
//             navigator.share({
//                 title: blogPost?.title,
//                 text: blogPost?.excerpt,
//                 url: window.location.href,
//             })
//         } else {
//             navigator.clipboard.writeText(window.location.href)
//             alert("Link copied to clipboard!")
//         }
//     }

//     // Render markdown content
//     const renderContent = (content: string) => {
//         const elements: JSX.Element[] = []
//         let inCodeBlock = false
//         let codeLanguage = ""
//         let codeContent = ""

//         content.split("\n").forEach((line, index) => {
//             // Handle code blocks
//             if (line.startsWith("```")) {
//                 if (!inCodeBlock) {
//                     inCodeBlock = true
//                     codeLanguage = line.slice(3).trim()
//                     codeContent = ""
//                 } else {
//                     elements.push(
//                         <div key={`code-${index}`} className="bg-muted p-4 rounded-md font-mono text-sm my-4 overflow-x-auto">
//                             {codeLanguage && <div className="text-xs text-muted-foreground mb-2">{codeLanguage}</div>}
//                             <pre>{codeContent}</pre>
//                         </div>
//                     )
//                     inCodeBlock = false
//                     codeLanguage = ""
//                 }
//                 return
//             }

//             if (inCodeBlock) {
//                 codeContent += line + "\n"
//                 return
//             }

//             // Handle headings
//             if (line.startsWith("# ")) {
//                 elements.push(
//                     <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
//                         {line.slice(2)}
//                     </h1>
//                 )
//                 return
//             }

//             if (line.startsWith("## ")) {
//                 elements.push(
//                     <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
//                         {line.slice(3)}
//                     </h2>
//                 )
//                 return
//             }

//             if (line.startsWith("### ")) {
//                 elements.push(
//                     <h3 key={index} className="text-xl font-bold mt-5 mb-2">
//                         {line.slice(4)}
//                     </h3>
//                 )
//                 return
//             }

//             // Handle lists
//             if (line.startsWith("- ")) {
//                 elements.push(
//                     <li key={index} className="ml-6 list-disc">
//                         {line.slice(2)}
//                     </li>
//                 )
//                 return
//             }

//             if (line.startsWith("1. ")) {
//                 elements.push(
//                     <li key={index} className="ml-6 list-decimal">
//                         {line.slice(3)}
//                     </li>
//                 )
//                 return
//             }

//             // Handle blockquotes
//             if (line.startsWith("> ")) {
//                 elements.push(
//                     <blockquote key={index} className="border-l-4 border-primary/30 pl-4 italic my-4">
//                         {line.slice(2)}
//                     </blockquote>
//                 )
//                 return
//             }

//             // Handle empty lines
//             if (line.trim() === "") {
//                 elements.push(<div key={index} className="h-4"></div>)
//                 return
//             }

//             // Default paragraph
//             elements.push(
//                 <p key={index} className="my-2">
//                     {line}
//                 </p>
//             )
//         })

//         return elements
//     }

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-background">
//                 <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//             </div>
//         )
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-background">
//                 <h1 className="text-4xl font-bold mb-4">Error</h1>
//                 <p className="text-muted-foreground mb-6">{error}</p>
//                 <Button asChild>
//                     <Link href={`/portfolio/${username}`}>
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back to Portfolio
//                     </Link>
//                 </Button>
//             </div>
//         )
//     }

//     if (!blogPost || !profile) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-background">
//                 <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
//                 <p className="text-muted-foreground mb-6">The requested blog post does not exist.</p>
//                 <Button asChild>
//                     <Link href={`/portfolio/${username}`}>
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back to Portfolio
//                     </Link>
//                 </Button>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-background">
//             <div className="container max-w-4xl px-4 py-12">
//                 {/* Back Button */}
//                 <div className="mb-8">
//                     <Button variant="ghost" asChild>
//                         <Link href={`/portfolio/${username}`} className="flex items-center gap-2">
//                             <ArrowLeft className="h-4 w-4" />
//                             Back to Portfolio
//                         </Link>
//                     </Button>
//                 </div>

//                 {/* Cover Image */}
//                 {blogPost.coverImage && (
//                     <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
//                         <div
//                             className="absolute inset-0 bg-center bg-cover"
//                             style={{ backgroundImage: `url(${blogPost.coverImage})` }}
//                         />
//                     </div>
//                 )}

//                 {/* Blog Header */}
//                 <div className="mb-8">
//                     <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>

//                     <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
//                         <div className="flex items-center gap-2">
//                             <Calendar className="h-4 w-4" />
//                             <span>{formatDate(blogPost.createdAt)}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <Clock className="h-4 w-4" />
//                             <span>{getReadingTime(blogPost.content)}</span>
//                         </div>
//                         <Button variant="ghost" size="sm" onClick={shareBlogPost} className="ml-auto">
//                             <Share2 className="h-4 w-4 mr-1" />
//                             Share
//                         </Button>
//                     </div>

//                     {/* Tags */}
//                     {blogPost.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mb-4">
//                             {blogPost.tags.map((tag) => (
//                                 <Badge key={tag} variant="secondary">
//                                     {tag}
//                                 </Badge>
//                             ))}
//                         </div>
//                     )}

//                     {/* Author Info */}
//                     <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
//                         <Avatar className="h-12 w-12">
//                             <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
//                             <AvatarFallback>
//                                 {profile.displayName
//                                     .split(" ")
//                                     .map((n) => n[0])
//                                     .join("")
//                                     .toUpperCase()}
//                             </AvatarFallback>
//                         </Avatar>
//                         <div>
//                             <div className="font-medium">{profile.displayName}</div>
//                             <div className="text-sm text-muted-foreground">Author</div>
//                         </div>
//                     </div>
//                 </div>

//                 <Separator className="my-8" />

//                 {/* Blog Excerpt */}
//                 {blogPost.excerpt && (
//                     <div className="mb-8 text-lg italic text-muted-foreground border-l-4 border-primary/20 pl-4 py-2">
//                         {blogPost.excerpt}
//                     </div>
//                 )}

//                 {/* Blog Content */}
//                 <article className="prose prose-sm sm:prose max-w-none">
//                     {renderContent(blogPost.content)}
//                 </article>

//                 <Separator className="my-8" />

//                 {/* Footer */}
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                     <div className="flex flex-wrap gap-2">
//                         <Tag className="h-5 w-5 text-muted-foreground" />
//                         {blogPost.tags.map((tag) => (
//                             <Badge key={tag} variant="outline">
//                                 {tag}
//                             </Badge>
//                         ))}
//                     </div>
//                     <Button variant="outline" onClick={shareBlogPost}>
//                         <Share2 className="h-4 w-4 mr-2" />
//                         Share Article
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }
"use client"

import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import type { UserProfile } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Tag, Share2, ThumbsUp, MessageSquare, Bookmark } from 'lucide-react'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/firebase"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CommentsBox } from "./CommentsBox"
interface BlogPost {
    id: string
    title: string
    content: string
    rawContent?: any
    excerpt: string
    coverImage: string
    tags: string[]
    status: "published" | "draft"
    createdAt: Date
    updatedAt: Date
    slug: string
    userId: string
}

export default function BlogPostPage({ username, slug }: { username: string; slug: string }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

    useEffect(() => {
        const fetchBlogPost = async () => {
            if (!username || !slug) {
                setError("Username or slug is undefined")
                setLoading(false)
                return
            }

            try {
                // Use getDoc with the username as document ID (like in BlogListPage)
                const usernameDoc = await getDoc(doc(db, "portfolioUsernames", username))
                if (!usernameDoc.exists()) {
                    setError("Portfolio not found")
                    setLoading(false)
                    return
                }
                const userData = usernameDoc.data()
                const userId = userData.userId

                if (!userId) {
                    setError("User ID not found in portfolio")
                    setLoading(false)
                    return
                }

                // Query the blog post with the matching slug and userId
                const blogsRef = collection(db, "portfolioBlogPosts")
                const q = query(
                    blogsRef,
                    where("userId", "==", userId),
                    where("slug", "==", slug),
                    where("status", "==", "published")      // ← add this
                )
                const querySnapshot = await getDocs(q)

                if (querySnapshot.empty) {
                    setError("Blog post not found")
                    setLoading(false)
                    return
                }

                const postDoc = querySnapshot.docs[0]
                const postData = postDoc.data()

                // Get the user profile
                const profileDoc = await getDoc(doc(db, "profiles", userId))
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data() as UserProfile)
                }

                // Set blog post data
                setBlogPost({
                    id: postDoc.id,
                    title: postData.title,
                    content: postData.content,
                    rawContent: postData.rawContent || null,
                    excerpt: postData.excerpt,
                    coverImage: postData.coverImage,
                    tags: postData.tags || [],
                    status: postData.status,
                    createdAt: postData.createdAt.toDate(),
                    updatedAt: postData.updatedAt.toDate(),
                    slug: postData.slug,
                    userId,
                })

                // Fetch related posts (posts with similar tags)
                if (postData.tags && postData.tags.length > 0) {
                    const relatedPostsQuery = query(
                        blogsRef,
                        where("userId", "==", userId),
                        where("status", "==", "published"),
                        where("tags", "array-contains-any", postData.tags)
                    )
                    const relatedPostsSnapshot = await getDocs(relatedPostsQuery)

                    const relatedPostsList: BlogPost[] = []
                    relatedPostsSnapshot.forEach((doc) => {
                        // Don't include the current post
                        if (doc.id !== postDoc.id) {
                            const data = doc.data()
                            relatedPostsList.push({
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
                                userId,
                            })
                        }
                    })

                    // Limit to 3 related posts
                    setRelatedPosts(relatedPostsList.slice(0, 3))
                }
            } catch (error) {
                console.error("Error fetching blog post:", error)
                setError("Error fetching blog post")
            } finally {
                setLoading(false)
            }
        }

        fetchBlogPost()
    }, [username, slug])

    // Format date for display
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date)
    }

    // Estimate reading time
    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200
        const wordCount = content.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / wordsPerMinute)
        return readingTime === 1 ? "1 min read" : `${readingTime} min read`
    }

    // Share blog post
    const shareBlogPost = () => {
        if (navigator.share) {
            navigator.share({
                title: blogPost?.title,
                text: blogPost?.excerpt,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast({
                title: "Link copied",
                description: "Blog post URL copied to clipboard",
            })
        }
    }


    // Toggle like
    const toggleLike = () => {
        setLiked(!liked)
        toast({
            title: liked ? "Removed like" : "Added like",
            description: liked ? "You've removed your like from this post" : "You've liked this post",
        })
    }

    // Toggle bookmark
    const toggleBookmark = () => {
        setBookmarked(!bookmarked)
        toast({
            title: bookmarked ? "Removed bookmark" : "Added bookmark",
            description: bookmarked ? "Post removed from your bookmarks" : "Post added to your bookmarks",
        })
    }

    // Render markdown content with enhanced formatting
    const renderContent = (content: string) => {
        // Process markdown
        let html = content
            // Handle headings
            .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>')

            // Handle bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')

            // Handle lists
            .replace(/^\s*- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
            .replace(/^\s*(\d+)\. (.*$)/gm, '<li class="ml-6 list-decimal">$1. $2</li>')

            // Handle blockquotes
            .replace(/^\> (.*$)/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 italic my-4">$1</blockquote>')

            // Handle links
            .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')

            // Handle images
            .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" class="rounded-md my-4 max-w-full" />')

            // Handle code blocks with copy button
            .replace(/```([\s\S]*?)```/g, (match, p1) => {
                const lines = p1.trim().split('\n');
                let language = '';
                let code = p1;

                // Check if the first line is a language identifier
                if (lines.length > 0 && !lines[0].includes(' ')) {
                    language = lines[0];
                    code = lines.slice(1).join('\n');
                }

                const codeId = `code-${Math.random().toString(36).substring(2, 9)}`;

                return `<div class="bg-muted p-4 rounded-md font-mono text-sm my-4 overflow-x-auto relative group">
                    ${language ? `<div class="text-xs text-muted-foreground mb-2 flex justify-between">
                        <span>${language}</span>
                        <button onclick="copyCodeBlock('${codeId}')" class="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="inline-block mr-1"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            Copy
                        </button>
                    </div>` : ''}
                    <pre id="${codeId}">${code}</pre>
                </div>`;
            })

            // Handle inline code
            .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')

            // Handle HTML tags for custom styling (color, background, etc.)
            // We don't need to process these as they're already HTML

            // Handle paragraphs (must come last)
            .replace(/^(?!<[a-z])(.*$)/gm, (match) => {
                if (match.trim() === '') return '';
                return `<p class="my-2">${match}</p>`;
            });

        // Clean up any consecutive paragraph tags
        html = html.replace(/<\/p>\s*<p>/g, '</p><p>');

        // Group list items
        html = html.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>)/g, '$1$2');
        html = html.replace(/(<li[^>]*>.*?<\/li>)(?!\s*<li)/g, '<ul>$1</ul>');

        return html;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="text-4xl font-bold mb-4">Error</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button asChild>
                    <Link href={`/portfolio/${username}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Portfolio
                    </Link>
                </Button>
            </div>
        )
    }

    if (!blogPost || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
                <p className="text-muted-foreground mb-6">The requested blog post does not exist.</p>
                <Button asChild>
                    <Link href={`/portfolio/${username}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Portfolio
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl px-4 py-12">
                {/* Back Button */}
                <div className="mb-8">
                    <Button variant="ghost" asChild>
                        <Link href={`/portfolio/${username}`} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Portfolio
                        </Link>
                    </Button>
                </div>

                {/* Cover Image */}
                {blogPost.coverImage && (
                    <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
                        <div
                            className="absolute inset-0 bg-center bg-cover"
                            style={{ backgroundImage: `url(${blogPost.coverImage})` }}
                        />
                    </div>
                )}

                {/* Blog Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(blogPost.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{getReadingTime(blogPost.content)}</span>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={shareBlogPost} className="ml-auto">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Share post</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={toggleLike}>
                                        <ThumbsUp className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{liked ? "Unlike" : "Like"}</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={toggleBookmark}>
                                        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-primary text-primary" : ""}`} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{bookmarked ? "Remove bookmark" : "Bookmark"}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Tags */}
                    {blogPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {blogPost.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Author Info */}
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                            <AvatarFallback>
                                {profile.displayName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{profile.displayName}</div>
                            <div className="text-sm text-muted-foreground">Author</div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Blog Excerpt */}
                {blogPost.excerpt && (
                    <div className="mb-8 text-lg italic text-muted-foreground border-l-4 border-primary/20 pl-4 py-2">
                        {blogPost.excerpt}
                    </div>
                )}

                {/* Blog Content */}
                <article className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: renderContent(blogPost.content) }} />
                </article>

                <Separator className="my-8" />

                {/* Interactive Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        <Tag className="h-5 w-5 text-muted-foreground" />
                        {blogPost.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={toggleLike} className="flex items-center gap-2">
                            <ThumbsUp className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
                            {liked ? "Liked" : "Like"}
                        </Button>
                        <Button variant="outline" onClick={shareBlogPost} className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            Share
                        </Button>
                        <Button variant="outline" onClick={toggleBookmark} className="flex items-center gap-2">
                            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-primary text-primary" : ""}`} />
                            {bookmarked ? "Saved" : "Save"}
                        </Button>
                    </div>
                </div>
                {/* Comments Section */}
                <CommentsBox postId={blogPost.id} username={username} slug={slug} />
                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedPosts.map((post) => (
                                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-40 bg-muted relative">
                                        {post.coverImage ? (
                                            <div
                                                className="absolute inset-0 bg-center bg-cover"
                                                style={{ backgroundImage: `url(${post.coverImage})` }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-primary/10">
                                                <MessageSquare className="h-8 w-8 text-primary/50" />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {post.excerpt || post.content.substring(0, 100)}
                                        </p>
                                        <Button variant="link" asChild className="p-0 h-auto">
                                            <Link href={`/portfolio/${username}/blog/${post.slug}`}>
                                                Read more
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
