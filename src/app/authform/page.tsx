'use client'
import { useState } from 'react';
import AuthForm from '@/components/AuthForm';

export default function AuthFormPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Add your auth logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        } catch (err) {
            setError('Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="">
                <AuthForm />
            </div>
        </div>
    );
}