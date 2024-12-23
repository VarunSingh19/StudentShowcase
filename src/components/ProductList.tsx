import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from '@/types/store';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Heart } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ProductListProps {
    products: Product[];
    likedProducts: string[];
    onLikeToggle: (productId: string) => void;
}

export function ProductList({ products, likedProducts, onLikeToggle }: ProductListProps) {
    const { addToCart } = useCart();
    const { user } = useAuth();

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        toast.success(`${product.name} has been added to your cart.`);
    };

    const handleLikeToggle = async (productId: string) => {
        if (!user) {
            toast.error("You must be logged in to like products.");
            return;
        }

        try {
            const userRef = doc(db, 'profiles', user.uid);
            if (likedProducts.includes(productId)) {
                await updateDoc(userRef, {
                    likedProducts: arrayRemove(productId)
                });
            } else {
                await updateDoc(userRef, {
                    likedProducts: arrayUnion(productId)
                });
            }
            onLikeToggle(productId);
        } catch (error) {
            console.error('Error updating liked products:', error);
            toast.error("Failed to update liked products. Please try again.");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <Card
                    key={product.id}
                    id={product.id}
                    className="flex flex-col hover:shadow-lg transition-shadow duration-200"
                >
                    <CardHeader className="p-0">
                        <div className="relative w-full h-[200px]">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={400}
                                height={200}
                                className="object-cover rounded-t-lg"
                                style={{
                                    width: '100%',
                                    height: '200px',
                                }}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow pt-4">
                        <CardTitle className="mb-2 line-clamp-1">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <p className="font-bold">₹{product.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                        <Button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1"
                        >
                            Add to Cart
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleLikeToggle(product.id)}
                            className={`${likedProducts.includes(product.id) ? 'text-red-500 hover:text-red-600' : ''} transition-colors duration-200`}
                        >
                            <Heart
                                className={`h-4 w-4 mr-2 ${likedProducts.includes(product.id) ? 'fill-current' : ''
                                    } transition-all duration-200`}
                            />
                            {likedProducts.includes(product.id) ? 'Liked' : 'Like'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}