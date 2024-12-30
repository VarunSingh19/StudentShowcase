'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ZoomProps {
    children: React.ReactNode
}

export function Zoom({ children }: ZoomProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-fit">
                {React.cloneElement(children as React.ReactElement, {
                    className: 'w-full h-full object-contain',
                })}
            </DialogContent>
        </Dialog>
    )
}

