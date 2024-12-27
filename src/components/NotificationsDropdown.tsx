'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Bell } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Notification {
    teamId: string;
    teamName: string;
    unreadCount: number;
    users: string[];
}

interface UserProfile {
    userId: string;
    displayName: string;
}

export function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [totalUnread, setTotalUnread] = useState(0);
    const { user, teamNotifications } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchTeamDetails = async () => {
            if (user && teamNotifications) {
                const userProfiles = await fetchUserProfiles();
                const notificationsData: Notification[] = await Promise.all(
                    Object.entries(teamNotifications).map(async ([teamId, unreadCount]) => {
                        const teamDoc = await getDoc(doc(db, 'teams', teamId));
                        const teamData = teamDoc.exists() ? teamDoc.data() : null;
                        const teamName = teamData ? teamData.name : `Team ${teamId}`;
                        const memberIds: string[] = teamData ? teamData.currentMembers : [];
                        const users = memberIds.map((id: string) => userProfiles[id] || 'Unknown User');
                        return {
                            teamId,
                            teamName,
                            unreadCount,
                            users
                        };
                    })
                );

                const filteredNotifications = notificationsData.filter(notification => notification.unreadCount > 0);
                setNotifications(filteredNotifications);
                setTotalUnread(filteredNotifications.reduce((sum, notification) => sum + notification.unreadCount, 0));
            }
        };

        fetchTeamDetails();
    }, [user, teamNotifications]);

    const fetchUserProfiles = async (): Promise<{ [key: string]: string }> => {
        const profiles: { [key: string]: string } = {};
        const profilesSnapshot = await getDocs(collection(db, 'profiles'));
        profilesSnapshot.forEach((doc) => {
            const data = doc.data() as UserProfile;
            profiles[data.userId] = data.displayName;
        });
        return profiles;
    };

    const handleTeamClick = (teamId: string) => {
        router.push(`/teams?teamId=${teamId}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {totalUnread > 0 && (
                        <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                            {totalUnread}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                {notifications.length === 0 ? (
                    <DropdownMenuItem>No new messages</DropdownMenuItem>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.teamId}
                            onClick={() => handleTeamClick(notification.teamId)}
                            className="flex flex-col items-start"
                        >
                            <div className="flex justify-between w-full">
                                <span className="font-semibold">{notification.teamName}</span>
                                <Badge variant="secondary">{notification.unreadCount}</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {notification.users.slice(0, 3).join(', ')}
                                {notification.users.length > 3 ? `, +${notification.users.length - 3} more` : ''}
                            </span>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}