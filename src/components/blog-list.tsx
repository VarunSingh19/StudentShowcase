"use client"

import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { UserProfile } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface BlogPost {
    id: string
    title: string
    content: string
    excerpt: string
    coverImage: string
    tags: string[]
    status: "published" | "draft"
    createdAt: Date
    updatedAt: Date
    slug: string
}

export default function BlogListPage({ username }: { username: string }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [allTags, setAllTags] = useState<string[]>([])

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                // Get user ID from username
                const usernameDoc = await getDoc(doc(db, "portfolioUsernames", username))
                if (!usernameDoc.exists()) throw new Error("Portfolio not found")

                const userId = usernameDoc.data().userId

                // Get user profile
                const profileDoc = await getDoc(doc(db, "profiles", userId))
                if (profileDoc.exists()) setProfile(profileDoc.data() as UserProfile)

                // Query for published blog posts
                const blogsRef = collection(db, "portfolioBlogPosts")
                const q = query(
                    blogsRef,
                    where("userId", "==", userId),
                    where("status", "==", "published"),
                    orderBy("createdAt", "desc"),
                )
                const querySnapshot = await getDocs(q)

                // Process blog posts
                const posts: BlogPost[] = []
                const tagsSet = new Set<string>()

                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    posts.push({
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        excerpt: data.excerpt,
                        coverImage: data.coverImage,
                        tags: data.tags || [],
                        status: data.status,
                        createdAt: data.createdAt.toDate(),
                        updatedAt: data.updatedAt.toDate(),
                        slug: data.slug,
                    })

                    // Collect all unique tags
                    if (data.tags && Array.isArray(data.tags)) {
                        data.tags.forEach((tag) => tagsSet.add(tag))
                    }
                })

                setBlogPosts(posts)
                setAllTags(Array.from(tagsSet))
            } catch (error) {
                console.error("Error fetching blog posts:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBlogPosts()
    }, [username])

    // Format date for display
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date)
    }

    // Format blog content for preview
    const formatBlogPreview = (content: string, maxLength = 150) => {
        // Remove markdown syntax
        const plainText = content
            .replace(/```[\s\S]*?```/g, "") // Remove code blocks
            .replace(/\[([^\]]+)\]$$([^)]+)$$/g, "$1") // Replace links with just the text
            .replace(/[*_~`]/g, "") // Remove formatting characters

        if (plainText.length <= maxLength) return plainText

        return plainText.substring(0, maxLength) + "..."
    }

    // Filter blog posts based on search term and selected tag
    const filteredBlogPosts = blogPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true

        return matchesSearch && matchesTag
    })

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
                <p className="text-muted-foreground mb-6">The requested portfolio does not exist.</p>
                <Button asChild>
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <Button variant="ghost" asChild>
                            <Link href={`/portfolio/${username}`} className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Portfolio
                            </Link>
                        </Button>
                    </div>

                    <h1 className="text-4xl font-bold mb-4">Blog</h1>
                    <p className="text-xl text-muted-foreground">Thoughts, insights, and expertise by
                        <Link href={`/profile/${profile.userId}`}>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                {" " + profile.displayName}
                            </span>
                        </Link>
                    </p>
                </div>

                {/* Search and filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            <Search className="h-4 w-4" />
                        </div>
                    </div>

                    {allTags.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    {selectedTag ? `Tag: ${selectedTag}` : "Filter by Tag"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedTag(null)}>All Tags</DropdownMenuItem>
                                <Separator className="my-1" />
                                {allTags.map((tag) => (
                                    <DropdownMenuItem key={tag} onClick={() => setSelectedTag(tag)}>
                                        {tag}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Blog posts */}
                {filteredBlogPosts.length === 0 ? (
                    <div className="text-center py-16 border rounded-lg">
                        <h3 className="text-xl font-medium mb-2">No articles found</h3>
                        <p className="text-muted-foreground">
                            {searchTerm || selectedTag
                                ? "Try adjusting your search or filter settings."
                                : "No blog posts have been published yet."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredBlogPosts.map((post) => (
                            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="md:flex">
                                    {post.coverImage && (
                                        <div className="md:w-1/3 h-48 md:h-auto relative">
                                            <div
                                                className="absolute inset-0 bg-center bg-cover"
                                                style={{ backgroundImage: `url(${post.coverImage})` }}
                                            />
                                        </div>
                                    )}
                                    <CardContent className={`p-6 ${post.coverImage ? "md:w-2/3" : "w-full"}`}>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(post.createdAt)}</span>
                                        </div>

                                        <Link href={`/portfolio/${username}/blog/${post.slug}`} className="hover:underline">
                                            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                                        </Link>

                                        <p className="text-muted-foreground mb-4">{post.excerpt || formatBlogPreview(post.content, 200)}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant={selectedTag === tag ? "default" : "secondary"}
                                                    className="cursor-pointer"
                                                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <Link href={`/portfolio/${username}/blog/${post.slug}`}>
                                            <Button variant="outline">Read Article</Button>
                                        </Link>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

