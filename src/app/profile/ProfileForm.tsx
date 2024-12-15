'use client'

import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Globe, Loader2 } from 'lucide-react'
import type { UserProfile } from '@/types/profile'

interface ProfileFormProps {
    profile: Partial<UserProfile>
    setProfile: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>
}

export function ProfileForm({ profile, setProfile }: ProfileFormProps) {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [skillInput, setSkillInput] = useState('')
    const { user } = useAuth()

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        try {
            await setDoc(doc(db, 'profiles', user.uid), {
                ...profile,
                userId: user.uid,
                updatedAt: new Date(),
            }, { merge: true })
        } catch (err) {
            console.error('Error saving profile:', err)
            setError('Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            if (!profile.skills?.includes(skillInput.trim())) {
                setProfile(prev => ({
                    ...prev,
                    skills: [...(prev.skills || []), skillInput.trim()]
                }))
            }
            setSkillInput('')
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills?.filter(skill => skill !== skillToRemove)
        }))
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                        id="displayName"
                        value={profile.displayName}
                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    />
                </div>

                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                    />
                </div>

                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                </div>

                <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                        id="skills"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="Type a skill and press Enter"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills?.map((skill) => (
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

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Links</h3>

                    <div className="grid gap-4">
                        <div className="flex items-center gap-2">
                            <Github className="h-5 w-5" />
                            <Input
                                placeholder="GitHub URL"
                                value={profile.socialLinks?.github}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, github: e.target.value }
                                })}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Linkedin className="h-5 w-5" />
                            <Input
                                placeholder="LinkedIn URL"
                                value={profile.socialLinks?.linkedin}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                                })}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Twitter className="h-5 w-5" />
                            <Input
                                placeholder="Twitter URL"
                                value={profile.socialLinks?.twitter}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                                })}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            <Input
                                placeholder="Portfolio URL"
                                value={profile.socialLinks?.portfolio}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, portfolio: e.target.value }
                                })}
                            />
                        </div>
                    </div>
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
                        Saving...
                    </>
                ) : (
                    'Save Profile'
                )}
            </Button>
        </form>
    )
}

