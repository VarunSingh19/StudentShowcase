'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { doc, updateDoc, increment, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

interface LikeButtonProps {
    projectId: string
    initialLikes: number
}

export function LikeButton({ projectId, initialLikes }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [isLiked, setIsLiked] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            const checkLikeStatus = async () => {
                const likeRef = doc(db, 'userLikes', `${user.uid}_${projectId}`)
                const likeDoc = await getDoc(likeRef)
                setIsLiked(likeDoc.exists())
            }
            checkLikeStatus()
        }
    }, [user, projectId])

    const handleLike = async () => {
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please log in to like projects.",
                variant: "destructive",
            })
            return
        }

        const projectRef = doc(db, 'projects', projectId)
        const likeRef = doc(db, 'userLikes', `${user.uid}_${projectId}`)
        const likeChange = isLiked ? -1 : 1

        try {
            await updateDoc(projectRef, {
                likes: increment(likeChange)
            })

            if (isLiked) {
                await deleteDoc(likeRef)
            } else {
                await setDoc(likeRef, {
                    userId: user.uid,
                    projectId: projectId,
                    createdAt: new Date()
                })
            }

            setLikes(prevLikes => prevLikes + likeChange)
            setIsLiked(!isLiked)
        } catch (error) {
            console.error('Error updating like:', error)
            toast({
                title: "Error",
                description: "Failed to update like. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
            <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            Like ({likes})
        </Button>
    )
}

