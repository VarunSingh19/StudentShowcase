'use client'

import React, { useState, useEffect } from 'react'
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Product, UserProfile } from '@/types/store'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AdminLayout } from '@/components/AdminLayout'
import ProjectPanel from '../project/page'

interface Order {
    id: string;
    userId: string;
    products: { productId: string; quantity: number }[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: any;
    updatedAt: any;
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    userProfile?: UserProfile;
}

export default function AdminStorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: '',
        stock: 0,
    });
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const checkAdminStatus = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push('/admin/auth');
                return;
            }

            const adminDoc = await getDoc(doc(db, 'adminUsers', user.uid));
            if (!adminDoc.exists() || !adminDoc.data().isAdmin) {
                router.push('/admin/auth');
            }
        };

        checkAdminStatus();
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
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
    };

    const fetchOrders = async () => {
        try {
            const q = query(collection(db, 'orders'));
            const querySnapshot = await getDocs(q);
            const ordersData: Order[] = [];
            for (const docSnapshot of querySnapshot.docs) {
                const orderData = { id: docSnapshot.id, ...docSnapshot.data() } as Order;
                const userProfileDoc = await getDoc(doc(db, 'profiles', orderData.userId));
                const userProfile = userProfileDoc.data() as UserProfile;
                ordersData.push({ ...orderData, userProfile });
            }
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast({
                title: "Error",
                description: "Failed to load orders. Please try again.",
                variant: "destructive",
            });
        }
    };

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
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            toast({
                title: "Error",
                description: "Failed to add product. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleUpdateProduct = async (productId: string, updatedData: Partial<Product>) => {
        try {
            await updateDoc(doc(db, 'products', productId), updatedData);
            toast({
                title: "Success",
                description: "Product updated successfully.",
            });
            fetchProducts();
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
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast({
                title: "Error",
                description: "Failed to delete product. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status });
            toast({
                title: "Success",
                description: "Order status updated successfully.",
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast({
                title: "Error",
                description: "Failed to update order status. Please try again.",
                variant: "destructive",
            });
        }
    };

    const [analyticsData, setAnalyticsData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topSellingProducts: [],
    })

    useEffect(() => {
        fetchProducts()
        fetchOrders()
        calculateAnalytics()
    }, [])

    const calculateAnalytics = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
        const totalOrders = orders.length
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        const productSales = {}
        orders.forEach(order => {
            order.products.forEach(product => {
                if (productSales[product.productId]) {
                    productSales[product.productId] += product.quantity
                } else {
                    productSales[product.productId] = product.quantity
                }
            })
        })



        const topSellingProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === productId)
                return { name: product ? product.name : 'Unknown', quantity }
            })

        setAnalyticsData({
            totalRevenue,
            totalOrders,
            averageOrderValue,
            topSellingProducts,
        })
    }

    if (loading) {
        return <AdminLayout><div>Loading...</div></AdminLayout>
    }

    return (
        <AdminLayout>
            <Tabs defaultValue="dashboard" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>

                </TabsList>

                <TabsContent value="dashboard">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${analyticsData.totalRevenue.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analyticsData.totalOrders}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${analyticsData.averageOrderValue.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{products.length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analyticsData.topSellingProducts}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="quantity" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Add New Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <Input
                                    placeholder="Product Name"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                                <Textarea
                                    placeholder="Product Description"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Price"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                />
                                <Input
                                    placeholder="Image URL"
                                    value={newProduct.imageUrl}
                                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                />
                                <Input
                                    placeholder="Category"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Stock"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                                />
                                <Button onClick={handleAddProduct}>Add Product</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <Card key={product.id}>
                                        <CardContent className="p-4">
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
                                            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                            <p className="font-semibold mb-2">Price: ${product.price}</p>
                                            <p className="mb-4">Stock: {product.stock}</p>
                                            <div className="flex justify-between">
                                                <Button onClick={() => handleUpdateProduct(product.id, { stock: product.stock + 1 })} size="sm">
                                                    + Stock
                                                </Button>
                                                <Button onClick={() => handleUpdateProduct(product.id, { stock: Math.max(0, product.stock - 1) })} size="sm">
                                                    - Stock
                                                </Button>
                                                <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" size="sm">
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order.id}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                                    <p className="text-sm text-gray-600">User ID: {order.userId}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">Total: ${order.totalAmount}</p>
                                                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Shipping Address:</h4>
                                                    {order.shippingAddress ? (
                                                        <div className="text-sm">
                                                            <p>{order.shippingAddress.address}</p>
                                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                                            <p>{order.shippingAddress.country}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-600">No shipping address available</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">User Profile:</h4>
                                                    {order.userProfile ? (
                                                        <div className="text-sm">
                                                            <p>Name: {order.userProfile.displayName}</p>
                                                            <p>Phone: {order.userProfile.phoneNumber}</p>
                                                            <p>Email: {order.userProfile.emailAddress}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-600">No user profile available</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end space-x-2">
                                                <Button onClick={() => handleUpdateOrderStatus(order.id, 'processing')} size="sm">Processing</Button>
                                                <Button onClick={() => handleUpdateOrderStatus(order.id, 'shipped')} size="sm">Shipped</Button>
                                                <Button onClick={() => handleUpdateOrderStatus(order.id, 'delivered')} size="sm">Delivered</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value='projects'>
                    <ProjectPanel />

                </TabsContent>
            </Tabs>
        </AdminLayout>
    )
}