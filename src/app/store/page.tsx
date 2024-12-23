'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/store';
import { ProductList } from '@/components/ProductList';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [likedProducts, setLikedProducts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { user } = useAuth();
    const { cartCount } = useCart();

    const fetchProducts = useCallback(async () => {
        try {
            const q = query(collection(db, 'products'));
            const querySnapshot = await getDocs(q);
            const productsData: Product[] = [];
            querySnapshot.forEach((doc) => {
                productsData.push({ id: doc.id, ...doc.data() } as Product);
            });
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast({
                title: "Error",
                description: "Failed to load products. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const fetchLikedProducts = useCallback(async () => {
        if (!user) return;
        try {
            const userDoc = await getDocs(query(collection(db, 'profiles'), where('userId', '==', user.uid)));
            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                setLikedProducts(userData.likedProducts || []);
            }
        } catch (error) {
            console.error('Error fetching liked products:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchProducts();
        if (user) {
            fetchLikedProducts();
        }
    }, [fetchProducts, fetchLikedProducts, user]);

    const handleLikeToggle = (productId: string) => {
        setLikedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">BuyOurMerch Store</h1>
                <Link href="/store/cart">
                    <Button>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Cart ({cartCount})
                    </Button>
                </Link>
            </div>
            <ProductList
                products={products}
                likedProducts={likedProducts}
                onLikeToggle={handleLikeToggle}
            />
        </div>
    );
}
