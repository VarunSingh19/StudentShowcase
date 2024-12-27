'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { Order } from '@/types/store';
import { UserProfileCard } from './UserProfileCard';

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (orderId: string, status: Order['status']) => Promise<void>;
    actionLoading: string | null;
}

export function OrderCard({ order, onUpdateStatus, actionLoading }: OrderCardProps) {
    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'processing':
                return <Package className="h-4 w-4" />;
            case 'shipped':
                return <Truck className="h-4 w-4" />;
            case 'delivered':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'processing':
                return 'bg-blue-500/10 text-blue-500';
            case 'shipped':
                return 'bg-purple-500/10 text-purple-500';
            case 'delivered':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <Card className="overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-none shadow-xl">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                        </span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <UserProfileCard
                    profile={order.userProfile}
                    address={order.shippingAddress}
                />

                <div className="space-y-4">
                    <h4 className="font-semibold">Order Details</h4>
                    <div className="bg-background/50 p-4 rounded-lg">
                        <div className="space-y-2">
                            {order.products.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm">Product ID: {item.productId}</span>
                                    <span className="text-sm">
                                        {item.quantity} × ${item.quantity}
                                    </span>
                                </div>
                            ))}
                            <div className="pt-2 border-t">
                                <div className="flex justify-between items-center font-semibold">
                                    <span>Total</span>
                                    <span>${order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onUpdateStatus(order.id, 'processing')}
                        disabled={actionLoading === order.id}
                        className="flex-1"
                    >
                        {actionLoading === order.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        <Package className="h-4 w-4 mr-2" />
                        Processing
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onUpdateStatus(order.id, 'shipped')}
                        disabled={actionLoading === order.id}
                        className="flex-1"
                    >
                        {actionLoading === order.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        <Truck className="h-4 w-4 mr-2" />
                        Shipped
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onUpdateStatus(order.id, 'delivered')}
                        disabled={actionLoading === order.id}
                        className="flex-1"
                    >
                        {actionLoading === order.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Delivered
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}