'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface FriendRequestButtonProps {
    userId: string;
}

export const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({ userId }) => {
    const { user } = useAuth();
    const [friendRequestStatus, setFriendRequestStatus] = useState<'none' | 'pending' | 'friends'>('none');
    const { toast } = useToast();

    useEffect(() => {
        const checkFriendStatus = async () => {
            if (user && userId && user.uid !== userId) {
                const currentUserDoc = await getDoc(doc(db, 'profiles', user.uid));
                const currentUserData = currentUserDoc.data();
                if (currentUserData?.friends?.includes(userId)) {
                    setFriendRequestStatus('friends');
                } else if (currentUserData?.sentFriendRequests?.includes(userId)) {
                    setFriendRequestStatus('pending');
                } else {
                    setFriendRequestStatus('none');
                }
            }
        };
        checkFriendStatus();
    }, [user, userId]);

    const handleFriendRequest = async () => {
        if (!user || !userId) return;
        try {
            if (friendRequestStatus === 'none') {
                await updateDoc(doc(db, 'profiles', user.uid), {
                    sentFriendRequests: arrayUnion(userId)
                });
                await updateDoc(doc(db, 'profiles', userId), {
                    receivedFriendRequests: arrayUnion(user.uid)
                });
                setFriendRequestStatus('pending');
                toast({
                    title: "Friend request sent",
                    description: "Your friend request has been sent successfully.",
                });
            } else if (friendRequestStatus === 'pending') {
                await updateDoc(doc(db, 'profiles', user.uid), {
                    sentFriendRequests: arrayRemove(userId)
                });
                await updateDoc(doc(db, 'profiles', userId), {
                    receivedFriendRequests: arrayRemove(user.uid)
                });
                setFriendRequestStatus('none');
                toast({
                    title: "Friend request cancelled",
                    description: "Your friend request has been cancelled.",
                });
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
            toast({
                title: "Error",
                description: "There was an error processing your request. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            {user && userId && user.uid !== userId && (
                <Button
                    onClick={handleFriendRequest}
                    disabled={friendRequestStatus === 'friends'}
                >
                    {friendRequestStatus === 'none' && 'Add Friend'}
                    {friendRequestStatus === 'pending' && 'Cancel Request'}
                    {friendRequestStatus === 'friends' && 'Friends'}
                </Button>
            )}
        </>
    );
};

