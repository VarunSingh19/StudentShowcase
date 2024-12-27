'use client'

import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Plus, Image, DollarSign, Package, Tags, Archive } from 'lucide-react';

interface ProductFormProps {
    onProductAdded: () => void;
}

export function ProductForm({ onProductAdded }: ProductFormProps) {
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        stock: 0,
    });
    const { toast } = useToast();

    const handleAddProduct = async () => {
        try {
            await addDoc(collection(db, 'products'), newProduct);
            toast({
                title: "Success",
                description: "Product added successfully.",
            });
            setNewProduct({
                name: '',
                description: '',
                price: 0,
                imageUrl: '',
                category: '',
                stock: 0,
            });
            onProductAdded();
        } catch (error) {
            console.error('Error adding product:', error);
            toast({
                title: "Error",
                description: "Failed to add product. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-6 w-6" />
                    <span>Add New Product</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Product Name"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="bg-white/80 dark:bg-gray-800/80"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Tags className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Category"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="bg-white/80 dark:bg-gray-800/80"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder="Product Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="bg-white/80 dark:bg-gray-800/80 min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                placeholder="Price"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                className="bg-white/80 dark:bg-gray-800/80"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Archive className="h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                placeholder="Stock"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                                className="bg-white/80 dark:bg-gray-800/80"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Image className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Image URL"
                                value={newProduct.imageUrl}
                                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                className="bg-white/80 dark:bg-gray-800/80"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleAddProduct}
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}