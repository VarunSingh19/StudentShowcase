// import type { Metadata } from "next"
// import { notFound } from "next/navigation"
// import { db } from "@/lib/firebase"
// import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
// import { PortfolioView } from "@/components/portfolio/PortfolioView"

// type Props = {
//     params: { username: string }
// }

// // Generate metadata for the portfolio page
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//     const { username } = params

//     try {
//         // Find the user ID from the username
//         const usernameDoc = await getDoc(doc(db, "portfolioUsernames", username))

//         if (!usernameDoc.exists()) {
//             return {
//                 title: "Portfolio Not Found",
//             }
//         }

//         const userId = usernameDoc.data().userId
//         const profileDoc = await getDoc(doc(db, "profiles", userId))

//         if (!profileDoc.exists()) {
//             return {
//                 title: "Portfolio Not Found",
//             }
//         }

//         const profile = profileDoc.data()

//         return {
//             title: `${profile.displayName || username}'s Portfolio`,
//             description: profile.bio || `Professional portfolio of ${profile.displayName || username}`,
//         }
//     } catch (error) {
//         console.error("Error generating metadata:", error)
//         return {
//             title: "Portfolio",
//         }
//     }
// }

// export default async function PortfolioPage({ params }: Props) {
//     const { username } = params

//     try {
//         // Find the user ID from the username
//         let userId = null
//         let usernameDoc = null

//         try {
//             usernameDoc = await getDoc(doc(db, "portfolioUsernames", username))
//             if (usernameDoc.exists()) {
//                 userId = usernameDoc.data().userId
//             }
//         } catch (error) {
//             console.error("Error fetching username document:", error)
//         }

//         // If no username document exists, try to find by display name
//         if (!userId) {
//             try {
//                 // Try to find by display name (converted to URL format)
//                 const profilesQuery = query(collection(db, "profiles"), where("displayName", "==", username.replace(/-/g, " ")))
//                 const profilesSnapshot = await getDocs(profilesQuery)

//                 if (!profilesSnapshot.empty) {
//                     userId = profilesSnapshot.docs[0].id
//                 }
//             } catch (error) {
//                 console.error("Error querying by display name:", error)
//             }
//         }

//         // If still no user found, try to find by user ID directly
//         if (!userId) {
//             try {
//                 const profileDoc = await getDoc(doc(db, "profiles", username))
//                 if (profileDoc.exists()) {
//                     userId = username
//                 } else {
//                     return notFound()
//                 }
//             } catch (error) {
//                 console.error("Error fetching profile by ID:", error)
//                 return notFound()
//             }
//         }

//         // Get the user profile
//         let profile = null
//         try {
//             const profileDoc = await getDoc(doc(db, "profiles", userId))

//             if (!profileDoc.exists()) {
//                 return notFound()
//             }

//             profile = profileDoc.data()

//             // Check if portfolio is public
//             if (profile.portfolioSettings?.isPublic === false) {
//                 return (
//                     <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
//                         <h1 className="text-3xl font-bold mb-4">Portfolio Not Available</h1>
//                         <p className="text-muted-foreground">This portfolio is currently set to private by the owner.</p>
//                     </div>
//                 )
//             }
//         } catch (error) {
//             console.error("Error fetching profile:", error)
//             return notFound()
//         }

//         // Get user projects with error handling
//         let projects = []
//         try {
//             const projectsQuery = query(collection(db, "projects"), where("userId", "==", userId))
//             const projectsSnapshot = await getDocs(projectsQuery)
//             projects = projectsSnapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }))
//         } catch (error) {
//             console.error("Error fetching projects:", error)
//             // Continue with empty projects array
//         }

//         return <PortfolioView profile={profile} projects={projects} userId={userId} />
//     } catch (error) {
//         console.error("Error loading portfolio:", error)
//         return (
//             <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
//                 <h1 className="text-3xl font-bold mb-4">Error Loading Portfolio</h1>
//                 <p className="text-muted-foreground">There was a problem loading this portfolio. Please try again later.</p>
//             </div>
//         )
//     }
// }




"use client"
import PortfolioPage from '@/components/PortfolioPage'
import { useParams } from 'next/navigation'

export default function DynamicPortfolioPage() {
    const { username } = useParams() as { username?: string }

    if (!username) return null

    return <PortfolioPage username={username} />
}
