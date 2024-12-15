'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserCard } from '@/components/UserCard'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'

export default function AllUsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users...")
                const usersCollection = collection(db, 'profiles')  // Changed 'users' to 'profile'
                const userSnapshot = await getDocs(usersCollection)
                console.log("User snapshot:", userSnapshot)
                const userList = userSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                console.log("User list:", userList)
                setUsers(userList)
            } catch (error) {
                console.error("Error fetching users:", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const filteredUsers = users.filter(user =>
        (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )

    return (
        <div className="min-h-screen bg-background">

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">All Users</h1>
                <div className="mb-6">
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">
                        <p>Error: {error}</p>
                        <p>Please check the console for more details.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map(user => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                )}
                {!loading && filteredUsers.length === 0 && (
                    <p className="text-center text-muted-foreground">No users found.</p>
                )}
            </main>
        </div>
    )
}
