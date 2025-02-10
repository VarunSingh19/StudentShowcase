// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// export default function SearchPage() {
//     const [searchTerm, setSearchTerm] = useState("")
//     const router = useRouter()

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault()
//         if (searchTerm.trim()) {
//             router.push(`/search-results?term=${encodeURIComponent(searchTerm)}`)
//         }
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <Card className="max-w-md mx-auto">
//                 <CardHeader>
//                     <CardTitle>Search Users</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSearch} className="space-y-4">
//                         <Input
//                             type="text"
//                             placeholder="Enter name or email"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                         <Button type="submit" className="w-full">
//                             Search
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { debounce } from "lodash"

interface Suggestion {
    id: string
    displayName: string
}

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const router = useRouter()

    const fetchSuggestions = useCallback(async (term: string) => {
        if (term.length < 1) {
            setSuggestions([])
            return
        }

        const usersRef = collection(db, "profiles")
        const q = query(usersRef, where("displayName", ">=", term), where("displayName", "<=", term + "\uf8ff"), limit(5))

        const querySnapshot = await getDocs(q)
        const fetchedSuggestions: Suggestion[] = []
        querySnapshot.forEach((doc) => {
            fetchedSuggestions.push({ id: doc.id, displayName: doc.data().displayName })
        })

        setSuggestions(fetchedSuggestions)
    }, [])

    const debouncedFetchSuggestions = useCallback(
        debounce((term: string) => fetchSuggestions(term), 300),
        [fetchSuggestions],
    )

    useEffect(() => {
        debouncedFetchSuggestions(searchTerm)
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
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Search Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Enter name or email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                                    {suggestions.map((suggestion) => (
                                        <li
                                            key={suggestion.id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion.displayName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Button type="submit" className="w-full">
                            Search
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

