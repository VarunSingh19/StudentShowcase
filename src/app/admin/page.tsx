// 'use client'

// import React, { useState, useEffect } from 'react';
// import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { Product, Order } from '@/types/store';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from '@/hooks/use-toast';
// import { useRouter } from 'next/navigation';
// import { auth } from '@/lib/firebase';
// import { getDoc } from 'firebase/firestore';

// export default function AdminStorePage() {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [newProduct, setNewProduct] = useState<Partial<Product>>({
//         name: '',
//         description: '',
//         price: 0,
//         imageUrl: '',
//         category: '',
//         stock: 0,
//     });
//     const [loading, setLoading] = useState(true);
//     const { toast } = useToast();
//     const router = useRouter();

//     useEffect(() => {
//         const checkAdminStatus = async () => {
//             const user = auth.currentUser;
//             if (!user) {
//                 router.push('/admin/auth');
//                 return;
//             }

//             const adminDoc = await getDoc(doc(db, 'adminUsers', user.uid));
//             if (!adminDoc.exists() || !adminDoc.data().isAdmin) {
//                 router.push('/admin/auth');
//             }
//         };

//         checkAdminStatus();
//     }, []);

//     useEffect(() => {
//         fetchProducts();
//         fetchOrders();
//     }, []);

//     const fetchProducts = async () => {
//         try {
//             const q = query(collection(db, 'products'));
//             const querySnapshot = await getDocs(q);
//             const productsData: Product[] = [];
//             querySnapshot.forEach((doc) => {
//                 productsData.push({ id: doc.id, ...doc.data() } as Product);
//             });
//             setProducts(productsData);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to load products. Please try again.",
//                 variant: "destructive",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchOrders = async () => {
//         try {
//             const q = query(collection(db, 'orders'));
//             const querySnapshot = await getDocs(q);
//             const ordersData: Order[] = [];
//             querySnapshot.forEach((doc) => {
//                 ordersData.push({ id: doc.id, ...doc.data() } as Order);
//             });
//             setOrders(ordersData);
//         } catch (error) {
//             console.error('Error fetching orders:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to load orders. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleAddProduct = async () => {
//         try {
//             await addDoc(collection(db, 'products'), newProduct);
//             toast({
//                 title: "Success",
//                 description: "Product added successfully.",
//             });
//             setNewProduct({
//                 name: '',
//                 description: '',
//                 price: 0,
//                 imageUrl: '',
//                 category: '',
//                 stock: 0,
//             });
//             fetchProducts();
//         } catch (error) {
//             console.error('Error adding product:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to add product. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleUpdateProduct = async (productId: string, updatedData: Partial<Product>) => {
//         try {
//             await updateDoc(doc(db, 'products', productId), updatedData);
//             toast({
//                 title: "Success",
//                 description: "Product updated successfully.",
//             });
//             fetchProducts();
//         } catch (error) {
//             console.error('Error updating product:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to update product. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleDeleteProduct = async (productId: string) => {
//         try {
//             await deleteDoc(doc(db, 'products', productId));
//             toast({
//                 title: "Success",
//                 description: "Product deleted successfully.",
//             });
//             fetchProducts();
//         } catch (error) {
//             console.error('Error deleting product:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to delete product. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
//         try {
//             await updateDoc(doc(db, 'orders', orderId), { status });
//             toast({
//                 title: "Success",
//                 description: "Order status updated successfully.",
//             });
//             fetchOrders();
//         } catch (error) {
//             console.error('Error updating order status:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to update order status. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

// 'use client'

// import React, { useState, useEffect, useCallback } from 'react';
// import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
// import { db, auth } from '@/lib/firebase';
// import { Product, Order } from '@/types/store';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from '@/hooks/use-toast';
// import { useRouter } from 'next/navigation';

// export default function AdminStorePage() {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [newProduct, setNewProduct] = useState<Partial<Product>>({
//         name: '',
//         description: '',
//         price: 0,
//         imageUrl: '',
//         category: '',
//         stock: 0,
//     });
//     const [loading, setLoading] = useState(true);
//     const { toast } = useToast();
//     const router = useRouter();

//     const fetchProducts = useCallback(async () => {
//         try {
//             const q = query(collection(db, 'products'));
//             const querySnapshot = await getDocs(q);
//             const productsData: Product[] = [];
//             querySnapshot.forEach((doc) => {
//                 productsData.push({ id: doc.id, ...doc.data() } as Product);
//             });
//             setProducts(productsData);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to load products. Please try again.",
//                 variant: "destructive",
//             });
//         } finally {
//             setLoading(false);
//         }
//     }, [toast]);

//     const fetchOrders = useCallback(async () => {
//         try {
//             const q = query(collection(db, 'orders'));
//             const querySnapshot = await getDocs(q);
//             const ordersData: Order[] = [];
//             querySnapshot.forEach((doc) => {
//                 ordersData.push({ id: doc.id, ...doc.data() } as Order);
//             });
//             setOrders(ordersData);
//         } catch (error) {
//             console.error('Error fetching orders:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to load orders. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     }, [toast]);

//     const checkAdminStatus = useCallback(async () => {
//         const user = auth.currentUser;
//         if (!user) {
//             router.push('/admin/auth');
//             return;
//         }

//         const adminDoc = await getDoc(doc(db, 'adminUsers', user.uid));
//         if (!adminDoc.exists() || !adminDoc.data().isAdmin) {
//             router.push('/admin/auth');
//         }
//     }, [router]);

//     useEffect(() => {
//         checkAdminStatus();
//     }, [checkAdminStatus]);

//     useEffect(() => {
//         fetchProducts();
//         fetchOrders();
//     }, [fetchProducts, fetchOrders]);

//     const handleAddProduct = async () => {
//         try {
//             await addDoc(collection(db, 'products'), newProduct);
//             toast({
//                 title: "Success",
//                 description: "Product added successfully.",
//             });
//             setNewProduct({
//                 name: '',
//                 description: '',
//                 price: 0,
//                 imageUrl: '',
//                 category: '',
//                 stock: 0,
//             });
//             fetchProducts();
//         } catch (error) {
//             console.error('Error adding product:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to add product. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleUpdateProduct = async (productId: string, updatedData: Partial<Product>) => {
//         try {
//             await updateDoc(doc(db, 'products', productId), updatedData);
//             toast({
//                 title: "Success",
//                 description: "Product updated successfully.",
//             });
//             fetchProducts();
//         } catch (error) {
//             console.error('Error updating product:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to update product. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleDeleteProduct = async (productId: string) => {
//         try {
//             await deleteDoc(doc(db, 'products', productId));
//             toast({
//                 title: "Success",
//                 description: "Product deleted successfully.",
//             });
//             fetchProducts();
//         } catch (error) {
//             console.error('Error deleting product:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to delete product. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
//         try {
//             await updateDoc(doc(db, 'orders', orderId), { status });
//             toast({
//                 title: "Success",
//                 description: "Order status updated successfully.",
//             });
//             fetchOrders();
//         } catch (error) {
//             console.error('Error updating order status:', error);
//             toast({
//                 title: "Error",
//                 description: "Failed to update order status. Please try again.",
//                 variant: "destructive",
//             });
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }


//     return (
//         <div className="container mx-auto px-4 py-8">

//             <Card className="mb-8">
//                 <CardHeader>
//                     <CardTitle>Add New Product</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="grid gap-4">
//                         <Input
//                             placeholder="Product Name"
//                             value={newProduct.name}
//                             onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                         />
//                         <Textarea
//                             placeholder="Product Description"
//                             value={newProduct.description}
//                             onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//                         />
//                         <Input
//                             type="number"
//                             placeholder="Price"
//                             value={newProduct.price}
//                             onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
//                         />
//                         <Input
//                             placeholder="Image URL"
//                             value={newProduct.imageUrl}
//                             onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
//                         />
//                         <Input
//                             placeholder="Category"
//                             value={newProduct.category}
//                             onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//                         />
//                         <Input
//                             type="number"
//                             placeholder="Stock"
//                             value={newProduct.stock}
//                             onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
//                         />
//                         <Button onClick={handleAddProduct}>Add Product</Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             <Card className="mb-8">
//                 <CardHeader>
//                     <CardTitle>Manage Products</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {products.map((product) => (
//                         <div key={product.id} className="mb-4 p-4 border rounded">
//                             <h3 className="font-bold">{product.name}</h3>
//                             <p>{product.description}</p>
//                             <p>Price: ${product.price}</p>
//                             <p>Stock: {product.stock}</p>
//                             <div className="mt-2">
//                                 <Button onClick={() => handleUpdateProduct(product.id, { stock: product.stock + 1 })}>
//                                     Increase Stock
//                                 </Button>
//                                 <Button onClick={() => handleUpdateProduct(product.id, { stock: Math.max(0, product.stock - 1) })} className="ml-2">
//                                     Decrease Stock
//                                 </Button>
//                                 <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" className="ml-2">
//                                     Delete Product
//                                 </Button>
//                             </div>
//                         </div>
//                     ))}
//                 </CardContent>
//             </Card>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Manage Orders</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {orders.map((order) => (
//                         <div key={order.id} className="mb-4 p-4 border rounded">
//                             <h3 className="font-bold">Order #{order.id}</h3>
//                             <p>User ID: {order.userId}</p>
//                             <p>Total Amount: ${order.totalAmount}</p>
//                             <p>Status: {order.status}</p>
//                             <div className="mt-2">
//                                 <Button onClick={() => handleUpdateOrderStatus(order.id, 'processing')}>Mark as Processing</Button>
//                                 <Button onClick={() => handleUpdateOrderStatus(order.id, 'shipped')} className="ml-2">Mark as Shipped</Button>
//                                 <Button onClick={() => handleUpdateOrderStatus(order.id, 'delivered')} className="ml-2">Mark as Delivered</Button>
//                             </div>
//                         </div>
//                     ))}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }



'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Product, Order } from '@/types/store';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductList } from '@/components/admin/ProductList';
import { OrderList } from '@/components/admin/OrderList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package2, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/adminDashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Store Administration
                </h1>

                <Tabs defaultValue="dashboard" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 h-14 rounded-xl">
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
                </Tabs>
            </div>
        </div>
    );
}