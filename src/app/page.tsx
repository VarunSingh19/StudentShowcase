'use client'

import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { TaskList } from '@/components/TaskList';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      {user ? (
        <>
          <Button onClick={() => auth.signOut()} className="mb-4">Log Out</Button>
          <TaskList />
        </>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

