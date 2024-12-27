'use client'

import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ShippingAddress } from '@/types/store';

interface OrderMapProps {
    address: ShippingAddress;
}

const containerStyle = {
    width: '100%',
    height: '300px'
};

export function OrderMap({ address }: OrderMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    });

    const center = {
        lat: address.lat,
        lng: address.lng
    };

    if (!isLoaded) return <div className="h-[300px] bg-muted animate-pulse rounded-lg" />;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
        >
            <Marker position={center} />
        </GoogleMap>
    );
}