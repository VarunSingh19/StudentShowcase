'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin } from 'lucide-react';
import { UserProfile, ShippingAddress } from '@/types/store';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileCard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [address, setAddress] = useState<ShippingAddress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(db, 'profiles', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data() as UserProfile;
                    setProfile(userData);

                    // Fetch the latest shipping address from orders
                    const ordersRef = collection(db, 'orders');
                    const q = query(ordersRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'), limit(1));
                    const orderSnapshot = await getDocs(q);

                    if (!orderSnapshot.empty) {
                        const latestOrder = orderSnapshot.docs[0].data();
                        setAddress(latestOrder.shippingAddress);
                    }
                } else {
                    setError("User profile not found");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) {
        return (
            <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-none shadow-xl">
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !profile) {
        return (
            <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-none shadow-xl">
                <CardContent className="pt-6">
                    <p className="text-red-500">{error || "Failed to load user profile"}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-none shadow-xl">
            <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                        <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{profile.displayName}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2" />
                            {profile.emailAddress}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            {profile.phoneNumber}
                        </div>
                    </div>
                </div>

                {address && (
                    <div className="mt-6 space-y-2">
                        <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Shipping Address</p>
                                <p className="text-sm text-muted-foreground">
                                    {address.name}<br />
                                    {address.address}<br />
                                    {address.city}, {address.state} {address.zipCode}<br />
                                    {address.country}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

