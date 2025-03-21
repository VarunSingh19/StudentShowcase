// This is the blog listing page
import BlogListPage from "@/components/blog-list"

export default function BlogPage({ params }: { params: { username: string } }) {
    return <BlogListPage username={params.username} />
}

