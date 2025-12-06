"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import api from "../../lib/api"
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react"

export default function BlogPost() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${slug}`)
      setBlog(res.data.data)
    } catch (error) {
      console.error("Error fetching blog:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog post not found</h1>
        <Link to="/blog" className="mt-4 text-blue-600 hover:underline">
          Back to blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Blog
          </Link>

          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">{blog.category}</span>

          <h1 className="text-4xl font-bold text-gray-900 mt-4">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-gray-500">
            {blog.publishedAt && (
              <span className="flex items-center gap-2">
                <Calendar size={18} /> {format(new Date(blog.publishedAt), "MMMM d, yyyy")}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Clock size={18} /> {blog.readTime} min read
            </span>
            <span className="flex items-center gap-2">
              <Eye size={18} /> {blog.views} views
            </span>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.tags.map((tag, i) => (
                <span key={i} className="text-sm text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Thumbnail */}
      {blog.thumbnail && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <img src={blog.thumbnail || "/placeholder.svg"} alt={blog.title} className="w-full rounded-xl shadow-lg" />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-gray max-w-none">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </div>
      </section>

      {/* Author */}
      {blog.author && (
        <section className="py-12 border-t">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {blog.author.avatar ? (
                <img
                  src={blog.author.avatar || "/placeholder.svg"}
                  alt={blog.author.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-2xl font-bold">{blog.author.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{blog.author.name}</p>
                <p className="text-gray-500 text-sm">Author</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
