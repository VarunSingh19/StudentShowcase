'use client'

import React from 'react';
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/store';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import {
    Plus,
    Minus,
    Trash2,
    Package,
    Archive,
    AlertCircle
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';

interface ProductListProps {
    products: Product[];
    onProductUpdated: () => void;
    onProductDeleted: () => void;
}

export function ProductList({ products, onProductUpdated, onProductDeleted }: ProductListProps) {
    const { toast } = useToast();

    const handleUpdateProduct = async (productId: string, updatedData: Partial<Product>) => {
        try {
            await updateDoc(doc(db, 'products', productId), updatedData);
            toast({
                title: "Success",
                description: "Product updated successfully.",
            });
            onProductUpdated();
        } catch (error) {
            console.error('Error updating product:', error);
            toast({
                title: "Error",
                description: "Failed to update product. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        try {
            await deleteDoc(doc(db, 'products', productId));
            toast({
                title: "Success",
                description: "Product deleted successfully.",
            });
            onProductDeleted();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast({
                title: "Error",
                description: "Failed to delete product. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Package className="h-6 w-6" />
                    <span>Manage Products</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-200">
                            <div className="aspect-video relative">
                                <Image
                                    src={product.imageUrl || 'https://via.placeholder.com/400x300'}
                                    alt={product.name}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <span className="h-4 w-4 text-muted-foreground" >₹</span>
                                        <span className="font-semibold">{product.price}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Archive className="h-4 w-4 text-muted-foreground mr-1" />
                                        <span className="font-semibold">{product.stock}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleUpdateProduct(product.id, { stock: product.stock + 1 })}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleUpdateProduct(product.id, {
                                                stock: Math.max(0, product.stock - 1)
                                            })}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="flex items-center gap-2">
                                                    <AlertCircle className="h-5 w-5" />
                                                    Delete Product
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this product? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}