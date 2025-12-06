"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../lib/api"
import toast from "react-hot-toast"
import { Plus, Edit2, Trash2, Eye, Clock } from "lucide-react"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs")
      setBlogs(res.data.data)
    } catch (error) {
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return
    try {
      await api.delete(`/blogs/${id}`)
      toast.success("Blog deleted!")
      fetchBlogs()
    } catch (error) {
      toast.error("Failed to delete blog")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">Manage your blog content</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {blog.thumbnail && (
              <img src={blog.thumbnail || "/placeholder.svg"} alt={blog.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    blog.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {blog.isPublished ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-gray-500 capitalize">{blog.category}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{blog.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {blog.readTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {blog.views}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/blogs/edit/${blog._id}`} className="p-2 text-gray-400 hover:text-blue-600">
                    <Edit2 size={18} />
                  </Link>
                  <button onClick={() => handleDelete(blog._id)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No blog posts yet</p>
          <Link to="/admin/blogs/new" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:underline">
            <Plus size={16} /> Create your first post
          </Link>
        </div>
      )}
    </div>
  )
}
