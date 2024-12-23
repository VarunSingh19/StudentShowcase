'use client'

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from 'react-hot-toast';
import { loadRazorpay } from '@/lib/razorpay';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Minus, Plus, Trash2, Box, CreditCard } from 'lucide-react';
import { Card } from "@/components/ui/card";
import Image from 'next/image';


interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature?: string;
}

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });
    const { user } = useAuth();

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity > 0) {
            updateQuantity(productId, newQuantity);
        } else {
            removeFromCart(productId);
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (!user) {
            toast.error("You must be logged in to checkout.");
            return;
        }

        if (!showAddressForm) {
            setShowAddressForm(true);
            return;
        }

        if (Object.values(addressForm).some(value => !value)) {
            toast.error("Please fill in all address fields.");
            return;
        }

        setIsCheckingOut(true);
        try {
            const razorpay = await loadRazorpay();
            if (!razorpay) throw new Error('Razorpay SDK failed to load');

            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total * 100 }),
            });

            if (!response.ok) throw new Error('Failed to create order');

            const order = await response.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "StudentShowcase",
                description: "Purchase from StudentShowcase",
                order_id: order.id,
                handler: async function (response: RazorpayResponse) {
                    const orderData = {
                        userId: user.uid,
                        products: cart.map(item => ({
                            productId: item.product.id,
                            quantity: item.quantity,
                            imageURL: item.product.imageUrl,
                            price: item.product.price
                        })),
                        totalAmount: total,
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        status: 'paid',
                        createdAt: new Date(),
                        shippingAddress: addressForm,
                    };

                    await setDoc(doc(db, 'orders', response.razorpay_order_id), orderData);
                    clearCart();
                    toast.success("Your order has been placed successfully!");
                },
                prefill: {
                    name: user.displayName,
                    email: user.email,
                },
                theme: {
                    color: "#a855f7",
                },
            };

            const paymentObject = new razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Error during checkout:', error);
            toast.error("There was an error processing your payment. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-600 text-center max-w-md">
                    Explore our collection and add some amazing items to your cart!
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items Section */}
                <div className="flex-grow space-y-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Shopping Cart</h1>
                        <span className="text-sm text-gray-600">{cart.length} items</span>
                    </div>

                    <div className="space-y-4">
                        {cart.map((item) => (
                            <Card key={item.product.id} className="overflow-hidden">
                                <div className="p-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Image Container */}
                                        <div className="relative w-full sm:w-48 h-48 sm:h-32">
                                            <Image
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                width={300}
                                                height={300}
                                                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-medium text-lg">{item.product.name}</h3>
                                                <p className="text-purple-600 font-semibold mt-1">
                                                    ₹{item.product.price.toFixed(2)} Each
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                                <div className="flex items-center bg-gray-50 rounded-lg">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="w-12 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                        className="h-8 w-8"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="lg:w-96">
                    <Card className="sticky top-4">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="pt-3 border-t">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span className="text-lg">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {showAddressForm && (
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={addressForm.name}
                                            onChange={handleAddressChange}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            name="address"
                                            value={addressForm.address}
                                            onChange={handleAddressChange}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={addressForm.city}
                                                onChange={handleAddressChange}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                value={addressForm.state}
                                                onChange={handleAddressChange}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="zipCode">ZIP Code</Label>
                                            <Input
                                                id="zipCode"
                                                name="zipCode"
                                                value={addressForm.zipCode}
                                                onChange={handleAddressChange}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                name="country"
                                                value={addressForm.country}
                                                onChange={handleAddressChange}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                {isCheckingOut ? (
                                    <Box className="w-4 h-4 mr-2 animate-spin" />
                                ) : showAddressForm ? (
                                    <>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Pay Now
                                    </>
                                ) : (
                                    'Proceed to Checkout'
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}