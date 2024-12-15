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
            <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

            <TaskListPage />


        </div>
    );
}

