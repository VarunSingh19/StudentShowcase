import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Mail } from 'lucide-react'
import Link from 'next/link'

export function UserCard({ user }) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={user.avatarUrl || `/placeholder.svg?text=${user.name?.charAt(0) || 'U'}`} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl font-bold">{user.displayName || 'Unknown User'}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.role || 'Student'}</p>
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
                </div>
                <Link href={`/profile/${user.id}`} passHref>
                    <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                </Link>
            </CardContent>
        </Card>
    )
}

