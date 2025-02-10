// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { collection, query, where, getDocs, limit } from "firebase/firestore"
// import { db } from "@/lib/firebase"
// import { debounce } from "lodash"

// interface Suggestion {
//     id: string
//     displayName: string
// }

// export default function SearchPage() {
//     const [searchTerm, setSearchTerm] = useState("")
//     const [suggestions, setSuggestions] = useState<Suggestion[]>([])
//     const router = useRouter()

//     const fetchSuggestions = useCallback(async (term: string) => {
//         if (term.length < 1) {
//             setSuggestions([])
//             return
//         }

//         const usersRef = collection(db, "profiles")
//         const q = query(usersRef, where("displayName", ">=", term), where("displayName", "<=", term + "\uf8ff"), limit(5))

//         const querySnapshot = await getDocs(q)
//         const fetchedSuggestions: Suggestion[] = []
//         querySnapshot.forEach((doc) => {
//             fetchedSuggestions.push({ id: doc.id, displayName: doc.data().displayName })
//         })

//         setSuggestions(fetchedSuggestions)
//     }, [])

//     const debouncedFetchSuggestions = useCallback(
//         debounce((term: string) => fetchSuggestions(term), 300),
//         [fetchSuggestions],
//     )

//     useEffect(() => {
//         debouncedFetchSuggestions(searchTerm)
//     }, [searchTerm, debouncedFetchSuggestions])

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault()
//         if (searchTerm.trim()) {
//             router.push(`/search-results?term=${encodeURIComponent(searchTerm)}`)
//         }
//     }

//     const handleSuggestionClick = (suggestion: Suggestion) => {
//         setSearchTerm(suggestion.displayName)
//         setSuggestions([])
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <Card className="max-w-md mx-auto">
//                 <CardHeader>
//                     <CardTitle>Search Users</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSearch} className="space-y-4">
//                         <div className="relative">
//                             <Input
//                                 type="text"
//                                 placeholder="Enter name or email"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                             {suggestions.length > 0 && (
//                                 <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
//                                     {suggestions.map((suggestion) => (
//                                         <li
//                                             key={suggestion.id}
//                                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                             onClick={() => handleSuggestionClick(suggestion)}
//                                         >
//                                             {suggestion.displayName}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>
//                         <Button type="submit" className="w-full">
//                             Search
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }
'use client'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Loader2, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { debounce } from "lodash"
import Image from "next/image"

interface Suggestion {
    id: string
    displayName: string
    avatarUrl?: string
    displayNameLower: string
}

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const fetchSuggestions = useCallback(async (term: string) => {
        if (term.length < 1) {
            setSuggestions([])
            setError(null)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const termLower = term.toLowerCase()
            const usersRef = collection(db, "profiles")

            // Try first with displayNameLower field
            let q = query(
                usersRef,
                where("displayNameLower", ">=", termLower),
                where("displayNameLower", "<=", termLower + "\uf8ff"),
                limit(5)
            )

            let querySnapshot = await getDocs(q)
            let fetchedSuggestions: Suggestion[] = []

            // If no results with displayNameLower, try with regular displayName
            if (querySnapshot.empty) {
                q = query(
                    usersRef,
                    where("displayName", ">=", term),
                    where("displayName", "<=", term + "\uf8ff"),
                    limit(5)
                )
                querySnapshot = await getDocs(q)
            }

            // If still no results, try a different approach with orderBy
            if (querySnapshot.empty) {
                q = query(
                    usersRef,
                    orderBy("displayName"),
                    where("displayName", ">=", term),
                    limit(5)
                )
                querySnapshot = await getDocs(q)
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                fetchedSuggestions.push({
                    id: doc.id,
                    displayName: data.displayName || "",
                    avatarUrl: data.avatarUrl || "",
                    displayNameLower: data.displayNameLower || data.displayName.toLowerCase()
                })
            })

            // Filter results client-side to ensure matches
            fetchedSuggestions = fetchedSuggestions.filter(suggestion =>
                suggestion.displayName.toLowerCase().includes(termLower) ||
                suggestion.displayNameLower.includes(termLower)
            )

            setSuggestions(fetchedSuggestions)

            if (fetchedSuggestions.length === 0) {
                setError("No matching users found")
            }

        } catch (error) {
            console.error("Error fetching suggestions:", error)
            setError("Error fetching suggestions")
            setSuggestions([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    const debouncedFetchSuggestions = useCallback(
        debounce((term: string) => fetchSuggestions(term), 300),
        [fetchSuggestions]
    )

    useEffect(() => {
        debouncedFetchSuggestions(searchTerm)
        // Cleanup
        return () => {
            debouncedFetchSuggestions.cancel()
        }
    }, [searchTerm, debouncedFetchSuggestions])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/search-results?term=${encodeURIComponent(searchTerm)}`)
        }
    }

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setSearchTerm(suggestion.displayName)
        setSuggestions([])
        setError(null)
    }

    const clearSearch = () => {
        setSearchTerm("")
        setSuggestions([])
        setError(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="backdrop-blur-lg bg-white/90 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">
                            Search Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="relative">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Enter name to search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                        className="pl-10 pr-10 h-12 text-lg bg-transparent border-2 focus:border-blue-500 transition-colors duration-200"
                                    />
                                    <AnimatePresence>
                                        {searchTerm && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                type="button"
                                                onClick={clearSearch}
                                                className="absolute right-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <X className="w-5 h-5 text-gray-400" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <AnimatePresence>
                                    {isFocused && (suggestions.length > 0 || error) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-10 w-full bg-white shadow-lg rounded-lg mt-2 overflow-hidden border border-gray-100"
                                        >
                                            {error ? (
                                                <div className="px-4 py-3 text-gray-500 text-sm">{error}</div>
                                            ) : (
                                                <ul>
                                                    {suggestions.map((suggestion, index) => (
                                                        <motion.li
                                                            key={suggestion.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 flex items-center space-x-3"
                                                        >
                                                            {suggestion.avatarUrl ? (
                                                                <div className="relative w-8 h-8">
                                                                    <Image
                                                                        src={suggestion.avatarUrl}
                                                                        alt={suggestion.displayName}
                                                                        width={32}
                                                                        height={32}
                                                                        className="w-8 h-8 rounded-full object-cover"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement
                                                                            target.src = "/api/placeholder/32/32"

                                                                        }}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <User className="w-4 h-4 text-blue-500" />
                                                                </div>
                                                            )}
                                                            <span className="text-gray-700 flex-1">{suggestion.displayName}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute right-3 top-3"
                                        >
                                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                    disabled={!searchTerm.trim() || isLoading}
                                >
                                    Search
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}