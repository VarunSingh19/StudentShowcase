
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Edit, Trash, Check } from 'lucide-react';
import { pusherClient } from '@/lib/pusher';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
    userId: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
    skills: string[];
    socialLinks: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        portfolio?: string;
    };
}

interface Message {
    _id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    isDeleted: boolean;
    readBy: string[];
    userImageUrl?: string;
}

interface TeamChatProps {
    teamId: string;
    currentUserId: string;
    currentUserName: string;
    currentUserImageUrl?: string;
}

export function TeamChat({
    teamId,
    currentUserId,
    currentUserName,
    currentUserImageUrl
}: TeamChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [userProfiles, setUserProfiles] = useState<{ [key: string]: Partial<UserProfile> }>({});
    const { toast } = useToast();

    useEffect(() => {
        const fetchUserProfiles = async () => {
            try {
                const profilesSnapshot = await getDocs(collection(db, 'profiles'));
                const profiles: { [key: string]: Partial<UserProfile> } = {};
                profilesSnapshot.forEach((doc) => {
                    profiles[doc.id] = doc.data() as Partial<UserProfile>;
                });
                setUserProfiles(profiles);
            } catch (error) {
                console.error('Error fetching user profiles:', error);
            }
        };

        fetchUserProfiles();
    }, []);

    useEffect(() => {
        const channel = pusherClient.subscribe(`team-${teamId}`);
        channel.bind('new-message', (data: Message) => {
            setMessages((prevMessages) => {
                const messageIndex = prevMessages.findIndex(msg => msg._id === data._id);
                if (messageIndex !== -1) {
                    // Update existing message
                    const updatedMessages = [...prevMessages];
                    updatedMessages[messageIndex] = data;
                    return updatedMessages;
                } else {
                    // Add new message
                    return [...prevMessages, data];
                }
            });
        });
        channel.bind('message-updated', (data: Message) => {
            setMessages((prevMessages) => {
                const messageIndex = prevMessages.findIndex(msg => msg._id === data._id);
                if (messageIndex !== -1) {
                    // Update existing message
                    const updatedMessages = [...prevMessages];
                    updatedMessages[messageIndex] = data;
                    return updatedMessages;
                } else {
                    // Add new message
                    return [...prevMessages, data];
                }
            });
        });
        channel.bind('message-deleted', (data: Message) => {
            setMessages((prevMessages) => {
                const messageIndex = prevMessages.findIndex(msg => msg._id === data._id);
                if (messageIndex !== -1) {
                    // Update existing message
                    const updatedMessages = [...prevMessages];
                    updatedMessages[messageIndex] = data;
                    return updatedMessages;
                } else {
                    // Add new message
                    return [...prevMessages, data];
                }
            });
        });
        channel.bind('message-read', (data: Message) => {
            setMessages((prevMessages) => {
                const messageIndex = prevMessages.findIndex(msg => msg._id === data._id);
                if (messageIndex !== -1) {
                    // Update existing message
                    const updatedMessages = [...prevMessages];
                    updatedMessages[messageIndex] = data;
                    return updatedMessages;
                } else {
                    // Add new message
                    return [...prevMessages, data];
                }
            });
        });

        fetch(`/api/messages/${teamId}`)
            .then((res) => res.json())
            .then((data) => {
                setMessages(data);
                setLoading(false);
            });

        return () => {
            pusherClient.unsubscribe(`team-${teamId}`);
        };
    }, [teamId]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const currentUserProfile = userProfiles[currentUserId];
        const message = {
            userId: currentUserId,
            userName: currentUserProfile?.displayName || currentUserName,
            content: newMessage.trim(),
            createdAt: new Date().toISOString(),
            userImageUrl: currentUserProfile?.avatarUrl || currentUserImageUrl || "/placeholder.svg",
        };

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamId, message }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditMessage = async (messageId: string, newContent: string) => {
        try {
            const response = await fetch(`/api/messages/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageId, content: newContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to edit message');
            }

            setEditingMessageId(null);
            setEditingContent('');
        } catch (err) {
            console.error('Error editing message:', err);
            toast({
                title: "Error",
                description: "Failed to edit message. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            const response = await fetch(`/api/messages/${teamId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete message');
            }
        } catch (err) {
            console.error('Error deleting message:', err);
            toast({
                title: "Error",
                description: "Failed to delete message. Please try again.",
                variant: "destructive",
            });
        }
    };

    // const markMessageAsRead = async (messageId: string) => {
    //     try {
    //         await fetch('/api/messages', {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ messageId, userId: currentUserId }),
    //         });
    //     } catch (err) {
    //         console.error('Error marking message as read:', err);
    //     }
    // };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[400px] border rounded-lg">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => {
                        const userProfile = userProfiles[message.userId];
                        const isCurrentUser = message.userId === currentUserId;
                        const isEditing = editingMessageId === message._id;

                        return (
                            <div
                                key={`${message._id}-${message.updatedAt || message.createdAt}`}
                                className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                            >
                                <Avatar className="w-8 h-8 border-2 border-primary">
                                    <AvatarImage
                                        src={userProfile?.avatarUrl || message.userImageUrl || "/placeholder.svg"}
                                        alt={userProfile?.displayName || message.userName || "User"}
                                    />
                                    <AvatarFallback>
                                        {(userProfile?.displayName || message.userName || "U").charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={`flex flex-col space-y-1 ${isCurrentUser ? 'items-end' : ''}`}>
                                    <p className="text-sm text-muted-foreground">
                                        {userProfile?.displayName || message.userName || "Unknown User"}
                                    </p>
                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={editingContent}
                                                onChange={(e) => setEditingContent(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button size="sm" onClick={() => handleEditMessage(message._id, editingContent)}>
                                                Save
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setEditingMessageId(null)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className={`rounded-lg px-3 py-2 max-w-[80%] ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                }`}
                                        >
                                            {message.isDeleted ? (
                                                <p className="text-sm italic">This message has been deleted</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm">{message.content}</p>
                                                    {message.updatedAt && (
                                                        <p className="text-xs text-muted-foreground mt-1">(edited)</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                    {!message.isDeleted && isCurrentUser && !isEditing && (
                                        <div className="flex gap-2 mt-1">
                                            <Button size="sm" variant="ghost" onClick={() => {
                                                setEditingMessageId(message._id);
                                                setEditingContent(message.content);
                                            }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDeleteMessage(message._id)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        {message.readBy.includes(currentUserId) ? (
                                            <Check className="h-4 w-4 text-blue-500" />
                                        ) : (
                                            <Check className="h-4 w-4 text-gray-500" />
                                        )}
                                        {message.readBy.length === userProfiles.length ? (
                                            <Check className="h-4 w-4 text-blue-500" />
                                        ) : (
                                            <Check className="h-4 w-4 text-gray-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            <form
                onSubmit={handleSendMessage}
                className="border-t p-4 flex items-center gap-2"
            >
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}

