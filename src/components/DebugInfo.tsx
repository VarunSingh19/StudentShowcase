import { useAuth } from '@/hooks/useAuth'

interface DebugInfoProps {
    profileUserId: string | undefined;
    isFriend: boolean;
    isPending: boolean;
}

export function DebugInfo({ profileUserId, isFriend, isPending }: DebugInfoProps) {
    const { user } = useAuth();

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>Current User ID: {user?.uid || 'Not logged in'}</p>
            <p>Profile User ID: {profileUserId || 'Undefined'}</p>
            {/* <p>Is Friend: {isFriend.toString()}</p> */}
            {/* <p>Is Pending: {isPending.toString()}</p> */}
            {/* <p>Should Show Button: {(user && profileUserId && user.uid !== profileUserId).toString()}</p> */}
        </div>
    );
}

