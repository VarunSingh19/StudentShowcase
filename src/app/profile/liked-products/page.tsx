import React, { Suspense } from 'react';
import LikedProductsClient from './LikedClient';

export default function LikedProducts() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading your orders...</div>}>
            <LikedProductsClient />
        </Suspense>
    );
}
