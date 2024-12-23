import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types/store';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { user } = useAuth();
    const { toast } = useToast();

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        if (user) {
            loadCart();
        }
    }, [user]);

    const loadCart = async () => {
        if (user) {
            try {
                const cartDoc = await getDoc(doc(db, 'carts', user.uid));
                if (cartDoc.exists()) {
                    setCart(cartDoc.data().items);
                }
            } catch (error) {
                console.error('Error loading cart:', error);
                toast({
                    title: "Error",
                    description: "Failed to load your cart. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    const saveCart = async (newCart: CartItem[]) => {
        if (user) {
            try {
                await setDoc(doc(db, 'carts', user.uid), { items: newCart });
            } catch (error) {
                console.error('Error saving cart:', error);
                toast({
                    title: "Error",
                    description: "Failed to save your cart. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.product.id === product.id);
            if (existingItem) {
                const updatedCart = prevCart.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
                saveCart(updatedCart);
                return updatedCart;
            } else {
                const updatedCart = [...prevCart, { product, quantity: 1 }];
                saveCart(updatedCart);
                return updatedCart;
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.product.id !== productId);
            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            );
            saveCart(updatedCart);
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        if (user) {
            saveCart([]);
        }
    };

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

