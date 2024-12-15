'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { pusherClient } from '@/lib/pusher';

interface Message {
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
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
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const channel = pusherClient.subscribe(`team-${teamId}`);
        channel.bind('new-message', (data: Message) => {
            setMessages((prevMessages) => {
                // Avoid adding duplicate messages
                if (prevMessages.some((msg) => msg.userId === data.userId && msg.createdAt === data.createdAt)) {
                    return prevMessages;
                }
                return [...prevMessages, data];
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

        const message = {
            userId: currentUserId,
            userName: currentUserName,
            content: newMessage.trim(),
            createdAt: new Date().toISOString(),
            userImageUrl: currentUserImageUrl,
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
        }
    };

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
                    {messages.map((message) => (
                        <div
                            key={`${message.userId}-${message.createdAt}`}
                            className={`flex items-start gap-3 ${message.userId === currentUserId ? 'flex-row-reverse' : ''}`}
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={message.userImageUrl || `https://avatar.vercel.sh/${message.userId}`}
                                    alt={message.userName}
                                />
                                <AvatarFallback>
                                    {message.userName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className={`flex flex-col space-y-1 ${message.userId === currentUserId ? 'items-end' : ''}`}
                            >
                                <p className="text-sm text-muted-foreground">{message.userName}</p>
                                <div
                                    className={`rounded-lg px-3 py-2 max-w-[80%] ${message.userId === currentUserId
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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