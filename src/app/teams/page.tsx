'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamChat } from '@/components/TeamChat'
import type { Team } from '@/types/profile'

export default function TeamsPage() {
    const [availableTeams, setAvailableTeams] = useState<Team[]>([])
    const [joinedTeams, setJoinedTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [joinMessage, setJoinMessage] = useState('')
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const { user, authChecked } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const teamIdFromQuery = searchParams.get('teamId')

    useEffect(() => {
        if (authChecked) {
            if (!user) {
                router.push('/login')
            } else {
                fetchTeams()
            }
        }
    }, [user, authChecked, router])

    useEffect(() => {
        if (teamIdFromQuery && joinedTeams.length > 0) {
            const team = joinedTeams.find(t => t.id === teamIdFromQuery)
            if (team) {
                setSelectedTeam(team)
            }
        }
    }, [teamIdFromQuery, joinedTeams])

    const fetchTeams = async () => {
        if (!user) {
            setError('You must be logged in to view teams')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError('')

            const availableQuery = query(
                collection(db, 'teams'),
                where('status', '==', 'open')
            )
            const availableSnapshot = await getDocs(availableQuery)
            const availableTeamsData: Team[] = []

            const joinedQuery = query(
                collection(db, 'teams'),
                where('currentMembers', 'array-contains', user.uid)
            )
            const joinedSnapshot = await getDocs(joinedQuery)
            const joinedTeamsData: Team[] = []

            availableSnapshot.forEach((doc) => {
                const team = { id: doc.id, ...doc.data() } as Team
                if (!team.currentMembers.includes(user.uid)) {
                    availableTeamsData.push(team)
                }
            })

            joinedSnapshot.forEach((doc) => {
                joinedTeamsData.push({ id: doc.id, ...doc.data() } as Team)
            })

            setAvailableTeams(availableTeamsData)
            setJoinedTeams(joinedTeamsData)
        } catch (err) {
            console.error('Error fetching teams:', err)
            setError('Failed to load teams. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleJoinRequest = async (teamId: string) => {
        if (!user) {
            setError('You must be logged in to join a team')
            return
        }
        try {
            await addDoc(collection(db, 'teamRequests'), {
                teamId,
                userId: user.uid,
                message: joinMessage,
                status: 'pending',
                createdAt: new Date()
            })
            setJoinMessage('')
            setAvailableTeams(availableTeams.filter(t => t.id !== teamId))
        } catch (err) {
            console.error('Error sending join request:', err)
            setError('Failed to send join request. Please try again.')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Teams</h1>
                <Button onClick={() => router.push('/teams/create')}>
                    Create Team
                </Button>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="available" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="available">Available Teams</TabsTrigger>
                    <TabsTrigger value="joined">Joined Teams</TabsTrigger>
                </TabsList>

                <TabsContent value="available">
                    <div className="grid gap-4">
                        {availableTeams.map((team) => (
                            <Card key={team.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{team.name}</CardTitle>
                                        <Badge variant="outline">
                                            {team.currentMembers.length} / {team.maxMembers} members
                                        </Badge>
                                    </div>
                                    <CardDescription>{team.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Project Description</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {team.projectDescription}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Required Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {team.requiredSkills.map((skill) => (
                                                    <Badge key={skill} variant="secondary">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>Request to Join</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Join Request</DialogTitle>
                                                    <DialogDescription>
                                                        Send a message to the team leader explaining why you'd like to join
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 pt-4">
                                                    <Textarea
                                                        value={joinMessage}
                                                        onChange={(e) => setJoinMessage(e.target.value)}
                                                        placeholder="Tell us about your experience and why you'd be a good fit..."
                                                        rows={4}
                                                    />
                                                    <Button
                                                        onClick={() => handleJoinRequest(team.id)}
                                                        disabled={!joinMessage.trim()}
                                                    >
                                                        Send Request
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {availableTeams.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                No teams available to join at the moment
                            </p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="joined">
                    <div className="grid gap-4">
                        {joinedTeams.map((team) => (
                            <Card key={team.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{team.name}</CardTitle>
                                        <Badge variant="outline">
                                            {team.currentMembers.length} / {team.maxMembers} members
                                        </Badge>
                                    </div>
                                    <CardDescription>{team.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium mb-2">Project Description</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {team.projectDescription}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-2">Required Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {team.requiredSkills.map((skill) => (
                                                    <Badge key={skill} variant="secondary">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <Button onClick={() => setSelectedTeam(team)}>Open Team Chat</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {joinedTeams.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                You haven't joined any teams yet
                            </p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {selectedTeam && (
                <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{selectedTeam.name} - Team Chat</DialogTitle>
                        </DialogHeader>
                        <TeamChat teamId={selectedTeam.id} currentUserId={user!.uid} currentUserName={user!.displayName || 'Anonymous'} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

