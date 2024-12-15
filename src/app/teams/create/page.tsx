'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from 'lucide-react'
import type { Team, TeamRequest } from '@/types/profile'

export default function CreateTeamPage() {
    const [team, setTeam] = useState<Partial<Team>>({
        name: '',
        description: '',
        projectDescription: '',
        requiredSkills: [],
        maxMembers: 5,
        status: 'open'
    })
    const [myTeams, setMyTeams] = useState<Team[]>([])
    const [requests, setRequests] = useState<TeamRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [skillInput, setSkillInput] = useState('')
    const { user, loading: authLoading, authChecked } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Only redirect if auth check is complete and user is null
        if (authChecked && !user && !authLoading) {
            router.push('/')
            return
        }

        // Only fetch data if we have a user
        if (user) {
            fetchMyTeams()
            setLoading(false)
        }
    }, [user, authChecked, authLoading])

    const fetchMyTeams = async () => {
        try {
            const q = query(collection(db, 'teams'), where('createdBy', '==', user!.uid))
            const querySnapshot = await getDocs(q)
            const teamsData: Team[] = []
            querySnapshot.forEach((doc) => {
                teamsData.push({ id: doc.id, ...doc.data() } as Team)
            })
            setMyTeams(teamsData)

            // Fetch requests for all teams
            const requestsData: TeamRequest[] = []
            for (const team of teamsData) {
                const requestsQuery = query(
                    collection(db, 'teamRequests'),
                    where('teamId', '==', team.id),
                    where('status', '==', 'pending')
                )
                const requestsSnapshot = await getDocs(requestsQuery)
                requestsSnapshot.forEach((doc) => {
                    requestsData.push({ id: doc.id, ...doc.data() } as TeamRequest)
                })
            }
            setRequests(requestsData)
        } catch (err) {
            console.error('Error fetching teams:', err)
            setError('Failed to load teams')
        }
    }

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setSaving(true)
        try {
            await addDoc(collection(db, 'teams'), {
                ...team,
                createdBy: user.uid,
                currentMembers: [user.uid],
                createdAt: new Date(),
            })
            router.push('/teams')
        } catch (err) {
            console.error('Error creating team:', err)
            setError('Failed to create team')
        } finally {
            setSaving(false)
        }
    }

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            if (!team.requiredSkills?.includes(skillInput.trim())) {
                setTeam(prev => ({
                    ...prev,
                    requiredSkills: [...(prev.requiredSkills || []), skillInput.trim()]
                }))
            }
            setSkillInput('')
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setTeam(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills?.filter(skill => skill !== skillToRemove)
        }))
    }

    const handleRequest = async (requestId: string, status: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'teamRequests', requestId), {
                status,
                updatedAt: new Date()
            })

            if (status === 'approved') {
                const request = requests.find(r => r.id === requestId)
                if (request) {
                    const teamRef = doc(db, 'teams', request.teamId)
                    const team = myTeams.find(t => t.id === request.teamId)
                    if (team) {
                        await updateDoc(teamRef, {
                            currentMembers: [...team.currentMembers, request.userId]
                        })
                    }
                }
            }

            // Refresh requests
            setRequests(requests.filter(r => r.id !== requestId))
        } catch (err) {
            console.error('Error handling request:', err)
            setError('Failed to process request')
        }
    }

    // Show loading state while auth is being checked
    if (authLoading || !authChecked) {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground">Checking authentication...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show loading state while teams are being fetched
    if (loading) {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground">Loading teams...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <Tabs defaultValue="create" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="create">Create Team</TabsTrigger>
                    <TabsTrigger value="manage">Manage Teams</TabsTrigger>
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create a New Team</CardTitle>
                            <CardDescription>
                                Create a team and start collaborating on projects
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateTeam} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Team Name</Label>
                                    <Input
                                        id="name"
                                        value={team.name}
                                        onChange={(e) => setTeam({ ...team, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Team Description</Label>
                                    <Textarea
                                        id="description"
                                        value={team.description}
                                        onChange={(e) => setTeam({ ...team, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="projectDescription">Project Description</Label>
                                    <Textarea
                                        id="projectDescription"
                                        value={team.projectDescription}
                                        onChange={(e) => setTeam({ ...team, projectDescription: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="maxMembers">Maximum Team Members</Label>
                                    <Input
                                        id="maxMembers"
                                        type="number"
                                        min="2"
                                        max="10"
                                        value={team.maxMembers}
                                        onChange={(e) => setTeam({ ...team, maxMembers: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="skills">Required Skills</Label>
                                    <Input
                                        id="skills"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        placeholder="Type a skill and press Enter"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {team.requiredSkills?.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="cursor-pointer"
                                                onClick={() => removeSkill(skill)}
                                            >
                                                {skill} ×
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button type="submit" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Team'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="manage">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Teams</CardTitle>
                            <CardDescription>
                                Manage your created teams
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {myTeams.map((team) => (
                                    <div
                                        key={team.id}
                                        className="p-4 border rounded-lg space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">{team.name}</h3>
                                            <Badge variant={team.status === 'open' ? "success" : "secondary"}>
                                                {team.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{team.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {team.requiredSkills.map((skill) => (
                                                <Badge key={skill} variant="outline">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-sm">
                                            Members: {team.currentMembers.length} / {team.maxMembers}
                                        </p>
                                    </div>
                                ))}
                                {myTeams.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">
                                        You have not created any teams yet
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Join Requests</CardTitle>
                            <CardDescription>
                                Review and manage requests to join your teams
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {requests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="p-4 border rounded-lg space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">
                                                Request for {myTeams.find(t => t.id === request.teamId)?.name}
                                            </h3>
                                            <Badge>Pending</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{request.message}</p>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleRequest(request.id, 'approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRequest(request.id, 'rejected')}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {requests.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">
                                        No pending join requests
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

