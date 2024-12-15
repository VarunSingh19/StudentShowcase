'use client'

import { useAuth } from '@/hooks/useAuth'

export function AuthDebug() {
    const { user, loading, authChecked } = useAuth()

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs space-y-1">
            <p>Auth Debug:</p>
            <p>Loading: {loading.toString()}</p>
            <p>Checked: {authChecked.toString()}</p>
            <p>User: {user ? user.uid : 'null'}</p>
        </div>
    )
}

