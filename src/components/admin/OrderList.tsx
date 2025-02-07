"use client";

import React, { useEffect, useState } from "react";
import {
    updateDoc,
    doc,
    Timestamp,
    query,
    collection,
    getDocs,
    getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    ShoppingCart,
    Clock,
    Truck,
    CheckCircle,
    Package,
    MapPin,
    Box,
    Phone,
    Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Product, UserProfile } from "@/types/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeaderImageModal } from "../HeaderImageModal";
import Link from "next/link";
import Image from "next/image";

interface Order {
    id: string;
    userId: string;
    products: { productId: string; quantity: number }[];
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
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

interface OrderListProps {
    orders: Order[];
    onOrderUpdated: () => void;
}

export function OrderList({
    orders: initialOrders,
    onOrderUpdated,
}: OrderListProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [products, setProducts] = useState<Record<string, Product>>({});
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchOrdersWithDetails();
    }, [initialOrders]);

    const fetchOrdersWithDetails = async () => {
        setLoading(true);
        try {
            const productsQuery = query(collection(db, "products"));
            const productsSnapshot = await getDocs(productsQuery);
            const productsMap: Record<string, Product> = {};
            productsSnapshot.forEach((doc) => {
                productsMap[doc.id] = { id: doc.id, ...doc.data() } as Product;
            });
            setProducts(productsMap);

            const ordersWithDetails = await Promise.all(
                initialOrders.map(async (order) => {
                    try {
                        const userProfileDoc = await getDoc(
                            doc(db, "profiles", order.userId)
                        );
                        const userProfile = userProfileDoc.exists()
                            ? (userProfileDoc.data() as UserProfile)
                            : undefined;
                        return { ...order, userProfile };
                    } catch (error) {
                        console.error(
                            `Error fetching details for order ${order.id}:`,
                            error
                        );
                        return order;
                    }
                })
            );
            setOrders(ordersWithDetails);
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast({
                title: "Error",
                description: "Failed to load order details.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (
        orderId: string,
        status: Order["status"]
    ) => {
        try {
            await updateDoc(doc(db, "orders", orderId), {
                status,
                updatedAt: Timestamp.now(),
            });

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                )
            );

            toast({
                title: "Success",
                description: `Order status updated to ${status}`,
            });
            onOrderUpdated();
        } catch (error) {
            console.error("Error updating order status:", error);
            toast({
                title: "Error",
                description: "Failed to update order status.",
                variant: "destructive",
            });
        }
    };

    const getStatusIcon = (status: Order["status"]) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "processing":
                return <Package className="h-4 w-4" />;
            case "shipped":
                return <Truck className="h-4 w-4" />;
            case "delivered":
                return <CheckCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500/10 text-yellow-500";
            case "processing":
                return "bg-blue-500/10 text-blue-500";
            case "shipped":
                return "bg-purple-500/10 text-purple-500";
            case "delivered":
                return "bg-green-500/10 text-green-500";
            default:
                return "bg-gray-500/10 text-gray-500";
        }
    };

    const formatDate = (timestamp: Timestamp | Date) => {
        return new Date(
            timestamp instanceof Timestamp ? timestamp.toDate() : timestamp
        ).toLocaleDateString();
    };

    if (loading) {
        return (
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center h-32">
                        <div className="text-lg font-semibold">Loading orders...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <ShoppingCart className="h-6 w-6" />
                        <span>Order Management Dashboard</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[800px] pr-4">
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Accordion type="single" collapsible key={order.id}>
                                    <AccordionItem value="order-details">
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                                <div className="flex justify-between items-center w-full">
                                                    <div className="flex items-center gap-4">
                                                        <h3 className="text-xl font-bold">
                                                            #{order.id.slice(0, 8)}
                                                        </h3>
                                                        <Badge className={getStatusColor(order.status)}>
                                                            <span className="flex items-center gap-2">
                                                                {getStatusIcon(order.status)}
                                                                {order.status.toUpperCase()}
                                                            </span>
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <HeaderImageModal
                                                            src={
                                                                order.userProfile?.avatarUrl ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={order.userProfile?.displayName || "User"}
                                                        />
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(order.createdAt)}
                                                            </p>
                                                            <p className="font-semibold">
                                                                ₹{order.totalAmount.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <CardContent className="p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* Customer Details */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-4">
                                                                <HeaderImageModal
                                                                    src={
                                                                        order.userProfile?.avatarUrl ||
                                                                        "/placeholder.svg"
                                                                    }
                                                                    alt={order.userProfile?.displayName || "User"}
                                                                />
                                                                <div>
                                                                    <h4 className="font-semibold text-lg">
                                                                        <Link
                                                                            href={`/profile/${order.userId}`}
                                                                            passHref
                                                                        >
                                                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                                                                {order.userProfile?.displayName ||
                                                                                    "Customer"}
                                                                            </span>
                                                                        </Link>
                                                                    </h4>
                                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                        <Mail className="h-4 w-4" />
                                                                        {order.userProfile?.emailAddress}
                                                                    </div>
                                                                    {order.userProfile?.phoneNumber && (
                                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                            <Phone className="h-4 w-4" />
                                                                            {order.userProfile.phoneNumber}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Shipping Address */}
                                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4" />
                                                                    Shipping Address
                                                                </h4>
                                                                {order.shippingAddress ? (
                                                                    <div className="text-sm space-y-1">
                                                                        <p className="font-medium">
                                                                            {order.shippingAddress.name}
                                                                        </p>
                                                                        <p>{order.shippingAddress.address}</p>
                                                                        <p>
                                                                            {order.shippingAddress.city},{" "}
                                                                            {order.shippingAddress.state}{" "}
                                                                            {order.shippingAddress.zipCode}
                                                                        </p>
                                                                        <p>{order.shippingAddress.country}</p>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500 italic">
                                                                        No shipping details available
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Products */}
                                                        <div>
                                                            <h4 className="font-semibold mb-4 flex items-center gap-2">
                                                                <Box className="h-4 w-4" />
                                                                Order Items
                                                            </h4>
                                                            <div className="space-y-4">
                                                                {order.products.map((item) => {
                                                                    const product = products[item.productId];
                                                                    return product ? (
                                                                        <div
                                                                            key={item.productId}
                                                                            className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
                                                                        >
                                                                            <div className="h-16 w-16 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center">
                                                                                {product.imageUrl ? (
                                                                                    <Image
                                                                                        src={product.imageUrl}
                                                                                        alt={product.name}
                                                                                        width={64}
                                                                                        height={64}
                                                                                        className="h-14 w-14 object-cover rounded"
                                                                                    />
                                                                                ) : (
                                                                                    <Box className="h-6 w-6 text-gray-400" />
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <h5 className="font-medium">
                                                                                    {product.name}
                                                                                </h5>
                                                                                <p className="text-sm text-gray-500">
                                                                                    Quantity: {item.quantity}
                                                                                </p>
                                                                                <p className="text-sm font-medium">
                                                                                    ₹
                                                                                    {(
                                                                                        product.price * item.quantity
                                                                                    ).toFixed(2)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ) : null;
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="mt-6 flex justify-end gap-2">
                                                        {order.status !== "processing" && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleUpdateOrderStatus(
                                                                        order.id,
                                                                        "processing"
                                                                    )
                                                                }
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Package className="h-4 w-4" />
                                                                Process
                                                            </Button>
                                                        )}
                                                        {order.status !== "shipped" && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleUpdateOrderStatus(order.id, "shipped")
                                                                }
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Truck className="h-4 w-4" />
                                                                Ship
                                                            </Button>
                                                        )}
                                                        {order.status !== "delivered" && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleUpdateOrderStatus(order.id, "delivered")
                                                                }
                                                                className="flex items-center gap-2"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                                Mark Delivered
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </AccordionContent>
                                        </Card>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

// 'use client'

// import React from 'react';
// import { Order } from '@/types/store';
// import { OrderCard } from './OrderCard';
// import { ShoppingCart } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface OrderListProps {
//     orders: Order[];
//     onOrderUpdated: (orderId: string, status: Order['status']) => Promise<void>;
//     actionLoading: string | null;
// }

// export function OrderList({ orders, onOrderUpdated, actionLoading }: OrderListProps) {
//     return (
//         <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
//             <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                     <ShoppingCart className="h-6 w-6" />
//                     <span>Manage Orders</span>
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="space-y-6">
//                     {orders.map((order) => (
//                         <OrderCard
//                             key={order.id}
//                             order={order}
//                             onUpdateStatus={onOrderUpdated}
//                             actionLoading={actionLoading}
//                         />
//                     ))}
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

