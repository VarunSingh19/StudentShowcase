import { Suspense } from 'react';
import OrdersClient from './OrdersClient'; // Adjust the import path as needed

function OrdersLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-600 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                        <h2 className="text-3xl font-bold text-white">
                            Loading your orders...
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<OrdersLoading />}>
            <OrdersClient />
        </Suspense>
    );
}