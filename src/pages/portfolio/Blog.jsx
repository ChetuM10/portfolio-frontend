"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import api from "../../lib/api";
import SEO from "../../components/SEO";
import OptimizedImage from "../../components/OptimizedImage";
import { SkeletonCard } from "../../components/LoadingSkeleton";
import { Clock, Eye, FileText } from "lucide-react";

// Blog page skeleton
const BlogSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4 text-center animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto" />
      </div>
    </section>
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs?published=true");
      setBlogs(res.data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <BlogSkeleton />;
  }

  return (
    <>
      <SEO
        title="Blog | Chetan N - Full Stack Developer"
        description="Thoughts, tutorials, and insights about web development, JavaScript, React, Node.js, and technology."
        keywords="Blog, Web Development, Tutorials, JavaScript, React, Node.js, Programming"
        url="/blog"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <section className="py-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Blog
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
              Thoughts, tutorials, and insights about web development and
              technology.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                  >
                    {blog.thumbnail ? (
                      <div className="aspect-video overflow-hidden">
                        <OptimizedImage
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          wrapperClassName="h-full"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <FileText className="text-white/50" size={48} />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded capitalize">
                          {blog.category}
                        </span>
                        {blog.publishedAt && (
                          <span>
                            {format(new Date(blog.publishedAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {blog.readTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {blog.views} views
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <FileText
                  className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                  size={64}
                />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No blog posts yet.
                </p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">
                  Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
