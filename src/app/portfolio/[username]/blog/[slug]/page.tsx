import BlogPostPage from "@/components/blog-post";

// app/portfolio/[username]/[slug]/page.tsx
export default function Page({ params }: { params: { username: string; slug: string } }) {
    return <BlogPostPage username={params.username} slug={params.slug} />
}
