'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Calendar, Box,
    Clock, Truck, CheckCircle, ChevronDown, MapPin,
    Receipt
} from 'lucide-react';
import OrderTimeline from '@/components/OrderTimeline';

interface OrderProduct {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface Order {
    id: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    totalAmount: number;
    createdAt: Timestamp;
    products: OrderProduct[];
    shippingAddress?: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
}


export default function OrdersClient() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const { user } = useAuth();



    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const ordersData: Order[] = [];

            for (const docSnapshot of querySnapshot.docs) {
                const orderData = docSnapshot.data() as Order;
                orderData.id = docSnapshot.id;

                const productsWithDetails = await Promise.all(
                    orderData.products.map(async (product) => {
                        const productDoc = await getDoc(doc(db, 'products', product.productId));
                        const productData = productDoc.data();
                        return {
                            ...product,
                            name: productData?.name || 'Unknown Product',
                            price: productData?.price || 0,
                            imageUrl: productData?.imageUrl || '/placeholder.svg',
                        };
                    })
                );

                orderData.products = productsWithDetails;
                ordersData.push(orderData);
            }

            setOrders(ordersData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user, fetchOrders]);

    const getStatusDetails = (status: Order['status']) => {
        const statusConfig = {
            pending: {
                color: 'bg-yellow-500',
                icon: Clock,
                message: 'Order Received',
                progress: 25
            },
            processing: {
                color: 'bg-blue-500',
                icon: Box,
                message: 'Processing Order',
                progress: 50
            },
            shipped: {
                color: 'bg-purple-500',
                icon: Truck,
                message: 'On the Way',
                progress: 75
            },
            delivered: {
                color: 'bg-green-500',
                icon: CheckCircle,
                message: 'Delivered',
                progress: 100
            }
        };
        return statusConfig[status];
    };


    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center h-64"
                    >
                        <div className="text-center">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 1, repeat: Infinity }
                                }}
                            >
                                <Package className="w-16 h-16 mb-4 mx-auto" />
                            </motion.div>
                            {/* Remove the motion.p wrapper and use h2 directly */}
                            <motion.h2
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                            >
                                Loading your orders...
                            </motion.h2>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-600 p-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                        <Package className="w-10 h-10" />
                        Your Orders
                    </h1>
                    <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 text-white">
                        <span className="font-medium">{orders.length}</span> orders
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {orders.map((order, orderIndex) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: orderIndex * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-none">
                                <CardContent className="p-0">
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Order ID</span>
                                                    <span className="font-medium text-gray-900">{order.id.slice(0, 8)}...</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Date</span>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium text-gray-900">
                                                            {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Total Amount</span>
                                                    <div className="flex items-center gap-2">

                                                        <span className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge
                                                className={`${getStatusDetails(order.status).color} text-white px-4 py-2`}
                                            >
                                                <motion.div
                                                    className="flex items-center gap-2"
                                                    animate={{ opacity: [0.8, 1, 0.8] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    {React.createElement(getStatusDetails(order.status).icon, { className: "w-4 h-4" })}
                                                    {getStatusDetails(order.status).message}
                                                </motion.div>
                                            </Badge>
                                        </div>

                                        <OrderTimeline status={order.status} />

                                        <Button
                                            variant="ghost"
                                            className="w-full mt-4 text-gray-600 hover:text-gray-900"
                                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        >
                                            <motion.div
                                                animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span>{expandedOrder === order.id ? 'Hide Details' : 'Show Details'}</span>
                                                <ChevronDown className="w-4 h-4" />
                                            </motion.div>
                                        </Button>
                                    </div>

                                    <AnimatePresence>
                                        {expandedOrder === order.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 bg-white">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        <div>
                                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                                <Receipt className="w-5 h-5 text-purple-500" />
                                                                Order Details
                                                            </h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {order.products.map((product, index) => (
                                                                    <motion.div
                                                                        key={index}
                                                                        initial={{ opacity: 0, x: -20 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: index * 0.1 }}
                                                                        className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                                    >
                                                                        <div className="flex gap-4">
                                                                            <div className="relative w-20 h-20 flex-shrink-0">
                                                                                <Image
                                                                                    src={product.imageUrl}
                                                                                    alt={product.name}
                                                                                    fill
                                                                                    className="rounded-lg object-cover"
                                                                                />
                                                                            </div>
                                                                            <div className="flex flex-col justify-between">
                                                                                <h4 className="text-md font-medium text-gray-800">
                                                                                    {product.name}
                                                                                </h4>
                                                                                <p className="text-sm text-gray-600">
                                                                                    Quantity: {product.quantity}
                                                                                </p>
                                                                                <p className="text-sm font-semibold text-gray-900">
                                                                                    ₹{(product.price * product.quantity).toFixed(2)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                                <MapPin className="w-5 h-5 text-pink-500" />
                                                                Shipping Address
                                                            </h3>
                                                            {order.shippingAddress ? (
                                                                <div className="text-gray-700 space-y-2">
                                                                    <p>{order.shippingAddress.address}</p>
                                                                    <p>
                                                                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-500 italic">
                                                                    No shipping address provided.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
