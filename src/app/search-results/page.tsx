"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

interface UserProfile {
    id: string
    displayName: string
    email: string
    avatarUrl?: string
}

export default function SearchResultsPage() {
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const searchTerm = searchParams.get("term")

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchTerm) return

            const usersRef = collection(db, "profiles")
            const q = query(
                usersRef,
                where("displayName", ">=", searchTerm),
                where("displayName", "<=", searchTerm + "\uf8ff"),
            )

            const querySnapshot = await getDocs(q)
            const fetchedUsers: UserProfile[] = []
            querySnapshot.forEach((doc) => {
                fetchedUsers.push({ id: doc.id, ...doc.data() } as UserProfile)
            })

            setUsers(fetchedUsers)
            setLoading(false)
        }

        fetchUsers()
    }, [searchTerm])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Search Results for {searchTerm}</h1>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <Link href={`/user/${user.id}`} key={user.id}>
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.displayName}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

