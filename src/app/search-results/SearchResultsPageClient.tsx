"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Mail, User, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface UserProfile {
    id: string
    displayName: string
    email: string
    avatarUrl?: string
    displayNameLower?: string
    emailAddress: string;
}

export default function SearchResultsPageClient() {
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const searchTerm = searchParams.get("term")

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchTerm) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const usersRef = collection(db, "profiles")
                const termLower = searchTerm.toLowerCase()

                // Try multiple search approaches
                let fetchedUsers: UserProfile[] = []

                // First attempt: search by displayNameLower
                let q = query(
                    usersRef,
                    where("displayNameLower", ">=", termLower),
                    where("displayNameLower", "<=", termLower + "\uf8ff"),
                    limit(20)
                )

                let querySnapshot = await getDocs(q)

                // If no results, try with regular displayName
                if (querySnapshot.empty) {
                    q = query(
                        usersRef,
                        where("displayName", ">=", searchTerm),
                        where("displayName", "<=", searchTerm + "\uf8ff"),
                        limit(20)
                    )
                    querySnapshot = await getDocs(q)
                }

                // If still no results, try with orderBy
                if (querySnapshot.empty) {
                    q = query(
                        usersRef,
                        orderBy("displayName"),
                        where("displayName", ">=", searchTerm),
                        limit(20)
                    )
                    querySnapshot = await getDocs(q)
                }

                querySnapshot.forEach((doc) => {
                    const data = doc.data()
                    fetchedUsers.push({
                        id: doc.id,
                        ...data,
                        displayNameLower: data.displayNameLower || data.displayName.toLowerCase()
                    } as UserProfile)
                })

                // Client-side filtering to ensure matches
                fetchedUsers = fetchedUsers.filter(user =>
                    user.displayName.toLowerCase().includes(termLower) ||
                    (user.displayNameLower && user.displayNameLower.includes(termLower))
                )

                setUsers(fetchedUsers)
            } catch (err) {
                console.error("Error fetching users:", err)
                setError("An error occurred while fetching results. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [searchTerm])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/search" className="inline-flex items-center">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Search
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        Search Results for &quot;{searchTerm}&quot;
                    </h1>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-600">Searching for users...</p>
                        </div>
                    ) : error ? (
                        <Card className="bg-red-50 border-red-200">
                            <CardContent className="pt-6">
                                <p className="text-red-600">{error}</p>
                            </CardContent>
                        </Card>
                    ) : users.length === 0 ? (
                        <Card className="bg-gray-50">
                            <CardContent className="pt-6">
                                <div className="text-center py-8">
                                    <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600">No users found matching &quot;{searchTerm}&quot;</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <motion.div
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {users.map((user) => (
                                <motion.div
                                    key={user.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >

                                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-4">
                                                <Avatar className="h-12 w-12 border-2 border-blue-100">
                                                    <AvatarImage src={user.avatarUrl} />
                                                    <AvatarFallback className="bg-blue-500 text-white">
                                                        {user.displayName[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-lg">{user.displayName}</h3>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Mail className="h-4 w-4 mr-1" />
                                                        <span>{user.emailAddress}</span>
                                                    </div>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-end">
                                                <Link href={`/profile/${user.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        View Profile
                                                    </Button>
                                                </Link>
                                                <Link href={`/user/${user.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        View Project Verification
                                                    </Button>
                                                </Link>
                                            </div>

                                        </CardContent>
                                    </Card>

                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}