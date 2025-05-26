// app/profile/liked-products/LikedProductsClient.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/store'

export default function LikedProductsClient() {
    const [likedProducts, setLikedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const params = useSearchParams()
    const { toast } = useToast()

    useEffect(() => {
        const fetchLiked = async () => {
            if (!user) return
            setLoading(true)
            try {
                // Optional filter from query string
                const filter = params.get('filter')

                // Fetch user profile to get liked IDs
                const profileQ = query(
                    collection(db, 'profiles'),
                    where('userId', '==', user.uid)
                )
                const profileSnap = await getDocs(profileQ)
                if (profileSnap.empty) {
                    setLikedProducts([])
                    setLoading(false)
                    return
                }
                const profileData = profileSnap.docs[0].data()
                const likedIds: string[] = profileData.likedProducts || []
                if (likedIds.length === 0) {
                    setLikedProducts([])
                    setLoading(false)
                    return
                }

                // Fetch each product
                const proms = likedIds.map(async productId => {
                    const docRef = doc(db, 'products', productId)
                    const docSnap = await getDoc(docRef)
                    if (!docSnap.exists()) return null
                    const data = docSnap.data() as Product;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id, ...rest } = data;
                    return { id: docSnap.id, ...rest }
                })
                let prods = (await Promise.all(proms)).filter((p): p is Product => p !== null)
                // apply optional filter
                if (filter) prods = prods.filter(p => p.category === filter)

                setLikedProducts(prods)
            } catch (err) {
                console.error(err)
                toast({
                    title: 'Error',
                    description: 'Could not load liked products',
                    variant: 'destructive'
                })
            } finally {
                setLoading(false)
            }
        }
        fetchLiked()
    }, [user, params, toast])

    if (loading) {
        return <div className="p-8 text-center">Loading liked products…</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Liked Products</h1>
            {likedProducts.length === 0 ? (
                <p>You have not liked any products yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedProducts.map(product => (
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
                                <p className="font-bold mb-4">₹{product.price.toFixed(2)}</p>
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
    )
}
