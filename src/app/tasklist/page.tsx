'use client'

import { useAuth } from '@/hooks/useAuth';
import TaskListPage from './TaskListPage';


export default function TaskList() {
    const { user, loading } = useAuth(); // eslint-disable-line @typescript-eslint/no-unused-vars

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">

            <TaskListPage />


        </div>
    );
}

