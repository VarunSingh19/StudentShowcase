'use client'

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/store';

export default function LikedProductsPage() {
    const [likedProducts, setLikedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchLikedProducts = async () => {
            if (!user) return;

            try {
                // Fetch user's liked product IDs
                const userDoc = await getDocs(query(collection(db, 'profiles'), where('userId', '==', user.uid)));
                if (userDoc.empty) {
                    console.log('User profile not found');
                    setLoading(false);
                    return;
                }

                const userData = userDoc.docs[0].data();
                const likedProductIds = userData.likedProducts || [];
                console.log('Liked product IDs:', likedProductIds);

                if (likedProductIds.length === 0) {
                    console.log('No liked products found');
                    setLikedProducts([]);
                    setLoading(false);
                    return;
                }

                // Fetch each product individually using doc() instead of query()
                const productsPromises = likedProductIds.map(async (id: string) => {
                    try {
                        const productDocRef = doc(db, 'products', id);
                        const productSnapshot = await getDoc(productDocRef);

                        if (productSnapshot.exists()) {
                            const productData = productSnapshot.data();
                            return {
                                id: productSnapshot.id,
                                ...productData
                            } as Product;
                        } else {
                            console.log(`Product not found for ID: ${id}`);
                            return null;
                        }
                    } catch (error) {
                        console.error(`Error fetching product ${id}:`, error);
                        return null;
                    }
                });

                const productsData = (await Promise.all(productsPromises)).filter((product): product is Product => product !== null);
                console.log('Fetched liked products:', productsData);
                setLikedProducts(productsData);
            } catch (error) {
                console.error('Error fetching liked products:', error);
                toast({
                    title: "Error",
                    description: "Failed to load liked products. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchLikedProducts();
        }
    }, [user, toast]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Liked Products</h1>
            {likedProducts.length === 0 ? (
                <p>You have not liked any products yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedProducts.map((product) => (
                        <Card key={product.id}>
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={300}
                                    height={200}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                <p className="font-bold mb-4">${product.price.toFixed(2)}</p>
                                <Link href={`/store#${product.id}`}>
                                    <Button>View in Store</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <div className="mt-8">
                <Link href="/profile">
                    <Button variant="outline">Back to Profile</Button>
                </Link>
            </div>
        </div>
    );
}

