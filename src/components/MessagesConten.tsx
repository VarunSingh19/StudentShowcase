"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
    collection,
    query,
    where,
    orderBy,
    updateDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type Message = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    recipientId: string;
    createdAt: Date;
};

export function MessagesContent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        // Set up realtime listener for messages
        const q = query(
            collection(db, "messages"),
            where("recipientId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Message[];

            setMessages(messagesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (messageId: string) => {
        try {
            await updateDoc(doc(db, "messages", messageId), {
                read: true,
            });
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };

    const handleMessageClick = (message: Message) => {
        setSelectedMessage(message);
        if (!message.read) {
            markAsRead(message.id);
        }
    };

    const unreadCount = messages.filter((m) => !m.read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Messages</h2>
                {unreadCount > 0 && (
                    <Badge variant="destructive">
                        {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
                    </Badge>
                )}
            </div>

            {messages.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center">
                        <p className="text-muted-foreground">
                            You do not have any messages yet.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        {messages.map((message) => (
                            <Card
                                key={message.id}
                                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedMessage?.id === message.id ? "border-primary" : ""
                                    } ${!message.read ? "bg-primary/5" : ""}`}
                                onClick={() => handleMessageClick(message)}
                            >
                                <CardHeader className="py-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-sm font-medium">
                                            {message.name}
                                        </CardTitle>
                                        {!message.read && (
                                            <Badge variant="default" className="text-xs">
                                                New
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="truncate">
                                        {message.subject}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="py-2 text-xs text-muted-foreground">
                                    {message.createdAt && (
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {format(message.createdAt, "MMM d, yyyy")}
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="md:col-span-2">
                        {selectedMessage ? (
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{selectedMessage.subject}</CardTitle>
                                            <CardDescription className="mt-1">
                                                From: {selectedMessage.name} ({selectedMessage.email})
                                            </CardDescription>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {selectedMessage.createdAt &&
                                                format(
                                                    selectedMessage.createdAt,
                                                    "MMMM d, yyyy h:mm a"
                                                )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`mailto:${selectedMessage.email}`}>
                                            <Mail className="h-4 w-4 mr-1" /> Reply
                                        </a>
                                    </Button>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setSelectedMessage(null)}
                                        >
                                            <X className="h-4 w-4 mr-1" /> Close
                                        </Button>
                                        {!selectedMessage.read && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => markAsRead(selectedMessage.id)}
                                            >
                                                <Check className="h-4 w-4 mr-1" /> Mark as Read
                                            </Button>
                                        )}
                                    </div>
                                </CardFooter>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="py-10 text-center">
                                    <p className="text-muted-foreground">
                                        Select a message to view its contents
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
