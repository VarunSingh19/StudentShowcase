import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  likes: number;
}

export interface Order {
  id: string;
  userId: string;
  products: { productId: string; quantity: number }[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
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

export interface CartItem {
  product: Product;
  quantity: number;
}
export interface UserProfile {
  id: string;
  userId: string;
  avatarUrl?: string;
  displayName: string;
  bio: string;
  location: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  hobbiesAndInterests: string[];
  languages: string[];
  emailAddress?: string;
  phoneNumber: string;
  points: number;
  orderHistory: string[]; // Array of order IDs
  likedProducts: string[]; // Array of product IDs
}
