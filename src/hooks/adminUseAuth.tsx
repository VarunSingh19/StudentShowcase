// import { useState, useEffect } from 'react';
// import { auth, db } from "@/lib/firebase";
// import { onAuthStateChanged, User } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';

// export function useAuth() {
//     const [user, setUser] = useState<User | null>(null);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             setUser(user);
//             if (user) {
//                 const adminDoc = await getDoc(doc(db, 'adminUsers', user.uid));
//                 setIsAdmin(adminDoc.exists() && adminDoc.data()?.isAdmin);
//             } else {
//                 setIsAdmin(false);
//             }
//             setLoading(false);
//         });

//         return () => unsubscribe();
//     }, []);

//     return { user, isAdmin, loading };
// }

import { useState, useEffect } from 'react';
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                try {
                    console.log('User UID:', user.uid);
                    const adminRef = doc(db, 'adminUsers', user.uid);
                    const adminDoc = await getDoc(adminRef);
                    if (adminDoc.exists()) {
                        const data = adminDoc.data();
                        console.log('Admin Document Data:', data);
                        // Ensure that isAdmin is a boolean (it must be exactly true)
                        setIsAdmin(!!data?.isAdmin);
                    } else {
                        console.log('Admin document does not exist for this user.');
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error('Error fetching admin document:', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, isAdmin, loading };
}
