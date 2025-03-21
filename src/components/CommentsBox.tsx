"use client"

import { useEffect, useState } from "react"
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MessageSquare, Edit, Trash2, Reply } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Comment {
    id: string
    name: string
    email: string
    content: string
    createdAt: Date
    postId: string
    parentId: string | null
    replies?: Comment[]
}

export function CommentsBox({ postId, username, slug }: { postId: string, username: string, slug: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [replyingToName, setReplyingToName] = useState<string>("")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        content: ""
    })
    const [currentUserEmail, setCurrentUserEmail] = useState<string>("")

    useEffect(() => {
        const savedEmail = localStorage.getItem("portfolioCommentEmail")
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }))
            setCurrentUserEmail(savedEmail)
        }
        fetchComments()
    }, [postId])

    const fetchComments = async () => {
        try {
            setLoading(true)
            const commentsRef = collection(db, "portfolioBlogComments")
            const q = query(
                commentsRef,
                where("postId", "==", postId),
                orderBy("createdAt", "desc")
            )

            const querySnapshot = await getDocs(q)
            const commentsMap: Record<string, Comment> = {}
            const topLevelComments: Comment[] = []

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const comment: Comment = {
                    id: doc.id,
                    name: data.name,
                    email: data.email,
                    content: data.content,
                    createdAt: data.createdAt.toDate(),
                    postId: data.postId,
                    parentId: data.parentId || null,
                    replies: []
                }
                commentsMap[comment.id] = comment
            })

            Object.values(commentsMap).forEach(comment => {
                if (comment.parentId === null) {
                    topLevelComments.push(comment)
                } else if (commentsMap[comment.parentId]) {
                    commentsMap[comment.parentId].replies!.push(comment)
                } else {
                    comment.parentId = null
                    topLevelComments.push(comment)
                }
            })

            Object.values(commentsMap).forEach(comment => {
                if (comment.replies && comment.replies.length > 0) {
                    comment.replies.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                }
            })

            setComments(topLevelComments)
        } catch (error) {
            console.error("Error fetching comments:", error)
            toast({
                title: "Error",
                description: "Could not load comments",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleReply = (commentId: string, commentAuthor: string) => {
        setReplyingTo(commentId)
        setReplyingToName(commentAuthor)
        document.getElementById("comment-form")?.scrollIntoView({ behavior: "smooth" })
    }

    const handleEdit = (comment: Comment) => {
        setEditingCommentId(comment.id)
        setFormData({
            name: comment.name,
            email: comment.email,
            content: comment.content
        })
        document.getElementById("comment-form")?.scrollIntoView({ behavior: "smooth" })
    }

    const cancelAction = () => {
        setReplyingTo(null)
        setEditingCommentId(null)
        setFormData({
            name: "",
            email: currentUserEmail,
            content: ""
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
            toast({
                title: "Missing information",
                description: "Please fill out all fields",
                variant: "destructive"
            })
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address",
                variant: "destructive"
            })
            return
        }

        try {
            setSubmitting(true)
            localStorage.setItem("portfolioCommentEmail", formData.email)

            if (editingCommentId) {
                await updateDoc(doc(db, "portfolioBlogComments", editingCommentId), {
                    content: formData.content,
                    name: formData.name,
                    updatedAt: serverTimestamp()
                })
                toast({
                    title: "Comment updated",
                    description: "Your comment has been updated successfully"
                })
            } else {
                await addDoc(collection(db, "portfolioBlogComments"), {
                    name: formData.name,
                    email: formData.email,
                    content: formData.content,
                    postId,
                    postSlug: slug,
                    username,
                    parentId: replyingTo,
                    createdAt: serverTimestamp()
                })
                toast({
                    title: replyingTo ? "Reply added" : "Comment added",
                    description: replyingTo ? "Your reply has been posted successfully" : "Your comment has been posted successfully"
                })
            }

            cancelAction()
            fetchComments()
        } catch (error) {
            console.error("Error submitting comment:", error)
            toast({
                title: "Error",
                description: "Failed to post your comment",
                variant: "destructive"
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (commentId: string) => {
        try {
            setActionLoading(commentId)
            await deleteDoc(doc(db, "portfolioBlogComments", commentId))
            toast({
                title: "Comment deleted",
                description: "Your comment has been deleted successfully"
            })
            fetchComments()
        } catch (error) {
            console.error("Error deleting comment:", error)
            toast({
                title: "Error",
                description: "Failed to delete comment",
                variant: "destructive"
            })
        } finally {
            setActionLoading(null)
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date)
    }

    const renderComment = (comment: Comment, isReply = false, depth = 0) => (
        <div key={comment.id} className={cn("relative group", depth > 0 && "ml-8")}>
            {depth > 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-muted via-muted/50 to-transparent" />
            )}
            <Card className={cn(
                "overflow-hidden transition-all hover:border-primary/20 mb-4",
                isReply && "border-0 shadow-none bg-muted/20"
            )}>
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                                {comment.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <h4 className="font-semibold">{comment.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(comment.createdAt)}
                                    </p>
                                </div>
                                {comment.email === currentUserEmail && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => handleEdit(comment)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Delete Comment?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. Are you sure you want to delete this comment?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => handleDelete(comment.id)}
                                                        disabled={actionLoading === comment.id}
                                                    >
                                                        {actionLoading === comment.id ? "Deleting..." : "Delete"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {comment.content}
                            </p>
                            {!editingCommentId && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="h-8 px-0 text-muted-foreground"
                                    onClick={() => handleReply(comment.id, comment.name)}
                                >
                                    <Reply className="h-4 w-4 mr-2" />
                                    Reply
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-4">
                    {comment.replies.map(reply => renderComment(reply, true, depth + 1))}
                </div>
            )}
        </div>
    )

    return (
        <section className="mt-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
                <h2 className="text-3xl font-bold flex items-center gap-2 px-4">
                    <MessageSquare className="h-6 w-6" />
                    Discussion {comments.length > 0 && <span className="text-primary">({comments.length})</span>}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
            </div>

            <Card className="mb-8 shadow-lg" id="comment-form">
                <CardHeader className="border-b">
                    <h3 className="font-semibold">
                        {editingCommentId ? "Edit Comment" : replyingTo ? `Reply to ${replyingToName}` : "Join the conversation"}
                    </h3>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="focus-visible:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Share your thoughts..."
                                    rows={4}
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    className="focus-visible:ring-primary"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="gap-2"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="animate-pulse">⏳</span>
                                            {editingCommentId ? "Updating..." : "Posting..."}
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare className="h-4 w-4" />
                                            {editingCommentId ? "Update Comment" : "Post Comment"}
                                        </>
                                    )}
                                </Button>
                                {(replyingTo || editingCommentId) && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={cancelAction}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-8">
                    {comments.map(comment => renderComment(comment))}
                </div>
            ) : (
                <div className="text-center py-12 space-y-4">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No comments yet</h3>
                    <p className="text-muted-foreground">Start the conversation by posting the first comment!</p>
                </div>
            )}
        </section>
    )
}