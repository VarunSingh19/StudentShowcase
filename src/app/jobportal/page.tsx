'use client'
import React, { useState } from 'react';
import {
    Briefcase,
    BookmarkCheck,
    Search,
    GraduationCap,
    Building2,
    Users
} from 'lucide-react';
import IntershalaTab from './InternshalaTab';
import IndeedTab from './IndeedTab';
import SavedJobsTab from './SavedJobsTab';

type TabType = 'internshala' | 'indeed' | 'saved';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface Features {
    internshala: Feature[];
    indeed: Feature[];
    saved: Feature[];
}

const App = () => {
    const [activeTab, setActiveTab] = useState<TabType>('internshala');

    const features: Features = {
        internshala: [
            {
                icon: <GraduationCap size={24} />,
                title: "Student-Focused Opportunities",
                description: "Find internships and entry-level positions perfect for students and fresh graduates"
            },
            {
                icon: <Building2 size={24} />,
                title: "Top Companies",
                description: "Connect with leading startups and established companies looking for young talent"
            },
            {
                icon: <Users size={24} />,
                title: "Skill Development",
                description: "Access training programs and certifications to boost your career"
            }
        ],
        indeed: [
            {
                icon: <Briefcase size={24} />,
                title: "Global Job Market",
                description: "Access millions of job listings from companies worldwide"
            },
            {
                icon: <Search size={24} />,
                title: "Advanced Search",
                description: "Filter by salary, location, and experience level to find your perfect match"
            },
            {
                icon: <Users size={24} />,
                title: "Company Reviews",
                description: "Read authentic employee reviews and salary insights"
            }
        ],
        saved: [
            {
                icon: <BookmarkCheck size={24} />,
                title: "Track Applications",
                description: "Keep track of your job applications and saved positions"
            },
            {
                icon: <Search size={24} />,
                title: "Smart Recommendations",
                description: "Get personalized job recommendations based on your preferences"
            },
            {
                icon: <Users size={24} />,
                title: "Application Stats",
                description: "Monitor your application status and response rates"
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <div className=" from-gray-50 to-gray-100 top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-16">
                        <div className="flex space-x-4 overflow-x-auto sm:space-x-8 p-2">
                            <button
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'internshala'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                onClick={() => setActiveTab('internshala')}
                            >
                                <GraduationCap size={20} />
                                <span className="whitespace-nowrap">Internshala</span>
                            </button>

                            <button
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'indeed'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                onClick={() => setActiveTab('indeed')}
                            >
                                <Briefcase size={20} />
                                <span className="whitespace-nowrap">Indeed</span>
                            </button>

                            <button
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'saved'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                onClick={() => setActiveTab('saved')}
                            >
                                <BookmarkCheck size={20} />
                                <span className="whitespace-nowrap">Saved Jobs</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            {activeTab === 'internshala' && "Find Your Perfect Internship"}
                            {activeTab === 'indeed' && "Discover Your Next Career Move"}
                            {activeTab === 'saved' && "Your Saved Opportunities"}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {activeTab === 'internshala' && "Start your career journey with meaningful internships and entry-level positions"}
                            {activeTab === 'indeed' && "Explore millions of jobs from top companies worldwide"}
                            {activeTab === 'saved' && "Keep track of your favorite opportunities all in one place"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features[activeTab].map((feature, index) => (
                            <div
                                key={feature.title}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="bg-blue-100 rounded-lg p-3 inline-block mb-4">
                                    <div className="text-blue-600">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}


                    </div>
                    {activeTab === 'internshala' && <IntershalaTab />}
                    {activeTab === 'indeed' && <IndeedTab />}
                    {activeTab === 'saved' && <SavedJobsTab />}
                </div>
            </main>
        </div>
    );
};

export default App;