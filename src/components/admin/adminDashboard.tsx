'use client'

import React from 'react';
import { Product, Order } from '@/types/store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Package2,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

interface AdminDashboardProps {
    products: Product[];
    orders: Order[];
}

export function AdminDashboard({ products, orders }: AdminDashboardProps) {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const orderStatusData = [
        { name: 'Pending', value: orders.filter(o => o.status === 'pending').length },
        { name: 'Processing', value: orders.filter(o => o.status === 'processing').length },
        { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length },
        { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
    ];

    const COLORS = ['#ffd700', '#0088FE', '#9c27b0', '#00C49F'];

    const productStockData = products
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 5)
        .map(product => ({
            name: product.name,
            stock: product.stock
        }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            +12 since last week
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            +8 since yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Order
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{averageOrderValue.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +4.5% from last week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                    <CardHeader>
                        <CardTitle>Order Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {orderStatusData.map((status, index) => (
                                <div key={status.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                    <span className="text-sm">{status.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-none shadow-xl">
                    <CardHeader>
                        <CardTitle>Top Products by Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={productStockData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="stock" fill="hsl(var(--primary))" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}