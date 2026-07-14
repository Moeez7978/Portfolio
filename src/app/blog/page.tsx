import { getAllPosts } from "@/lib/blog";
import BlogList from "./BlogList";

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogList posts={posts} />;
}
