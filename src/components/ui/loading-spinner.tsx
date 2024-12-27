'use client'

import React from 'react';

export function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary font-semibold">
                    Loading...
                </div>
            </div>
        </div>
    );
}