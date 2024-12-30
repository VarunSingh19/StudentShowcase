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

interface AddressForm {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature?: string;
}

// Updated RazorpayOptions interface to match Razorpay's expected types
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name?: string | undefined;
        email?: string | undefined;
    };
    theme: {
        color: string;
    };
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

        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKeyId) {
            toast.error("Payment configuration error");
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

            const options: RazorpayOptions = {
                key: razorpayKeyId,
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
                    name: user.displayName || undefined,
                    email: user.email || undefined,
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
        return <p>Your cart is empty.</p>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p>${item.product.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                            -
                        </Button>
                        <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                            className="w-16 mx-2 text-center"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                            +
                        </Button>
                    </div>
                </div>
            ))}
            <div className="flex justify-between items-center mt-6">
                <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            </div>

            {showAddressForm && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={addressForm.name} onChange={handleAddressChange} required />
                        </div>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" name="address" value={addressForm.address} onChange={handleAddressChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" value={addressForm.city} onChange={handleAddressChange} required />
                            </div>
                            <div>
                                <Label htmlFor="state">State</Label>
                                <Input id="state" name="state" value={addressForm.state} onChange={handleAddressChange} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="zipCode">ZIP Code</Label>
                                <Input id="zipCode" name="zipCode" value={addressForm.zipCode} onChange={handleAddressChange} required />
                            </div>
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="country" value={addressForm.country} onChange={handleAddressChange} required />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Button onClick={handleCheckout} disabled={isCheckingOut} className="mt-6 w-full">
                {isCheckingOut ? 'Processing...' : (showAddressForm ? 'Place Order' : 'Proceed to Checkout')}
            </Button>
        </div>
    );
}

