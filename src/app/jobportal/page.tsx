'use client';
import React, { useState } from 'react';
import IntershalaTab from './InternshalaTab';
import IndeedTab from './IndeedTab';

const JobPortal = () => {
    const [activeTab, setActiveTab] = useState<'internshala' | 'indeed'>('internshala');

    const handleTabChange = (tab: 'internshala' | 'indeed') => {
        setActiveTab(tab);
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Job Portal</h1>
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 rounded-l-md ${activeTab === 'internshala'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                    onClick={() => handleTabChange('internshala')}
                >
                    Internshala
                </button>
                <button
                    className={`px-4 py-2 rounded-r-md ${activeTab === 'indeed'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                    onClick={() => handleTabChange('indeed')}
                >
                    Indeed
                </button>
            </div>
            {activeTab === 'internshala' ? (
                <IntershalaTab />
            ) : (
                <IndeedTab />
            )}
        </div>
    );
};

export default JobPortal;
