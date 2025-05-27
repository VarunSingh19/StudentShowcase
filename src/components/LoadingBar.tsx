'use client'

import { useState, useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

function LoadingBarContent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const handleStart = () => setIsLoading(true)
        const handleComplete = () => setIsLoading(false)

        // Listen for route changes
        const handleRouteChange = () => {
            handleStart()
            setTimeout(handleComplete, 500) // Simulate a minimum loading time
        }

        handleRouteChange() // Call on initial load

        return () => {
            // Clean up listeners if component unmounts
        }
    }, [pathname, searchParams])

    return (
        <>
            {isLoading && (
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 z-50"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            )}
        </>
    )
}

export function LoadingBar() {
    return (
        <Suspense fallback={null}>
            <LoadingBarContent />
        </Suspense>
    )
}
