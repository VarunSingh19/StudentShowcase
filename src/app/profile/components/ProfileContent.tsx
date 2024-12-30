import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Globe, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { UserProfile } from '@/types/profile'

interface ProfileContentProps {
    initialProfile: UserProfile;
    userId: string;
}

export function ProfileContent({ initialProfile, userId }: ProfileContentProps) {
    const [profile, setProfile] = useState<UserProfile>(initialProfile)
    const [skillInput, setSkillInput] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const handleSave = async () => {
        setSaving(true)
        try {
            await setDoc(doc(db, 'profiles', userId), {
                ...profile,
                updatedAt: new Date(),
            }, { merge: true })
            toast({
                title: "Profile saved",
                description: "Your profile has been updated successfully.",
            })
        } catch (err) {
            console.error('Error saving profile:', err)
            setError('Failed to save profile')
            toast({
                title: "Error",
                description: "Failed to save profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault()
            if (!profile.skills.includes(skillInput.trim())) {
                setProfile(prev => ({
                    ...prev,
                    skills: [...prev.skills, skillInput.trim()]
                }))
            }
            setSkillInput('')
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your profile information and social media links
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
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
                    <Label htmlFor="skills">Skills</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id="skills"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleAddSkill}
                            placeholder="Type a skill and press Enter"
                        />
                        <Button onClick={() => handleAddSkill({ key: 'Enter', preventDefault: () => { } } as React.KeyboardEvent<HTMLInputElement>)} type="button">
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profile.skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                onClick={() => removeSkill(skill)}
                            >
                                {skill} ×
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* <div>
                    <Label htmlFor="hobbiesAndInterests">Hobbies and Interests</Label>
                    <Input
                        id="hobbiesAndInterests"
                        value={profile.hobbiesAndInterests.join(', ')}
                        onChange={(e) => setProfile({ ...profile, hobbiesAndInterests: e.target.value.split(',').map(item => item.trim()) })}
                        placeholder="Enter hobbies and interests, separated by commas"
                    />
                </div> */}

                <div>
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                        id="languages"
                        value={(profile.languages || []).join(', ')}
                        onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(',').map(item => item.trim()) })}
                        placeholder="Enter languages, separated by commas"
                    />
                </div>

                <div>
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                        id="emailAddress"
                        value={profile.emailAddress}
                        onChange={(e) => setProfile({ ...profile, emailAddress: e.target.value })}
                        placeholder="Enter your email address"
                    />
                </div>

                <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Github className="h-5 w-5" />
                            <Input
                                placeholder="GitHub URL"
                                value={profile.socialLinks.github}
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
                                value={profile.socialLinks.linkedin}
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
                                value={profile.socialLinks.twitter}
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
                                value={profile.socialLinks.portfolio}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    socialLinks: { ...profile.socialLinks, portfolio: e.target.value }
                                })}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Profile'
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

