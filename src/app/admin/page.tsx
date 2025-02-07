'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Product, Order } from '@/types/store';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductList } from '@/components/admin/ProductList';
import { OrderList } from '@/components/admin/OrderList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package2, ShoppingCart, LayoutDashboard, MapIcon } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/adminDashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ProjectPanel from './project/page';

export default function AdminStorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

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

    const fetchOrders = useCallback(async () => {
        try {
            const q = query(collection(db, 'orders'));
            const querySnapshot = await getDocs(q);
            const ordersData: Order[] = [];
            querySnapshot.forEach((doc) => {
                ordersData.push({ id: doc.id, ...doc.data() } as Order);
            });
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast({
                title: "Error",
                description: "Failed to load orders. Please try again.",
                variant: "destructive",
            });
        }
    }, [toast]);

    const checkAdminStatus = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) {
            router.push('/admin/auth');
            return;
        }

        const adminDoc = await getDoc(doc(db, 'adminUsers', user.uid));
        if (!adminDoc.exists() || !adminDoc.data().isAdmin) {
            router.push('/admin/auth');
        }
    }, [router]);

    useEffect(() => {
        checkAdminStatus();
    }, [checkAdminStatus]);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, [fetchProducts, fetchOrders]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Store Administration
                </h1> */}

                <Tabs defaultValue="dashboard" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-4 h-14 rounded-xl">
                        <TabsTrigger value="dashboard" className="space-x-2">
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                        </TabsTrigger>
                        <TabsTrigger value="products" className="space-x-2">
                            <Package2 className="h-5 w-5" />
                            <span>Products</span>
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="space-x-2">
                            <ShoppingCart className="h-5 w-5" />
                            <span>Orders</span>
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="space-x-2">
                            <MapIcon className="h-5 w-5" />
                            <span>Project</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-8">
                        <AdminDashboard products={products} orders={orders} />
                    </TabsContent>

                    <TabsContent value="products" className="space-y-8">
                        <ProductForm onProductAdded={fetchProducts} />
                        <ProductList
                            products={products}
                            onProductUpdated={fetchProducts}
                            onProductDeleted={fetchProducts}
                        />
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-8">
                        <OrderList
                            orders={orders}
                            onOrderUpdated={fetchOrders}
                        />
                    </TabsContent>
                    <TabsContent value='projects'>
                        <ProjectPanel />

                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}