'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DialogTitle } from '@radix-ui/react-dialog'

interface ImageModalProps {
    src: string
    alt: string
}

export function ImageModal({ src, alt }: ImageModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [imageError, setImageError] = useState(false)

    const handleImageError = () => {
        setImageError(true)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Avatar className="h-24 w-24 border-4 border-white cursor-pointer hover:opacity-90 transition-opacity">
                    <AvatarImage src={src} alt={alt} onError={handleImageError} />
                    <AvatarFallback>{alt.charAt(0)}</AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle></DialogTitle>
                {!imageError ? (
                    <div className="relative w-full h-[400px]">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            style={{ objectFit: 'contain' }}
                            onError={handleImageError}
                            priority
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[400px] bg-muted">
                        <p className="text-muted-foreground">Image not available</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

