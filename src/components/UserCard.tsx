import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Mail, MapPin, Phone } from "lucide-react"
import { HeaderImageModal } from "./HeaderImageModal"

import { UserProfile } from "@/types/profile"

interface UserCardProps {
    user: UserProfile;
}
export function UserCard({ user }: UserCardProps) {

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <HeaderImageModal
                        src={user.avatarUrl || `/studentshowcase.jpg?text=${user.displayName?.charAt(0) || 'U'}`}
                        alt={user.displayName?.charAt(0) || 'U'}

                    />
                    <div>
                        <CardTitle className="text-xl font-bold">{user.displayName || 'Unknown User'}</CardTitle>
                        <p className="text-sm text-muted-foreground">Student</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.skills && user.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                        {user.skills && user.skills.length > 3 && (
                            <Badge variant="secondary">+{user.skills.length - 3}</Badge>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
                        {user.emailAddress && (
                            <span className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                {user.emailAddress}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
                        {user.phoneNumber && (
                            <span className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                {user.phoneNumber}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
                        {user.location && (
                            <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {user.location}
                            </span>
                        )}
                    </div>
                </div>
                <Link href={`/profile/${user.id}`} passHref>
                    <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                </Link>
            </CardContent>
        </Card>
    )
}

