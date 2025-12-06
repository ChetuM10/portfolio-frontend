"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import api from "../../lib/api"
import toast from "react-hot-toast"
import ImageUpload from "../../components/admin/ImageUpload"
import { ArrowLeft, X, Plus } from "lucide-react"

export default function BlogForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [tags, setTags] = useState([])
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "general",
      thumbnail: "",
      isPublished: false,
    },
  })

  useEffect(() => {
    if (id) fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/id/${id}`)
      const data = res.data.data
      Object.keys(data).forEach((key) => {
        if (key !== "tags") setValue(key, data[key])
      })
      setTags(data.tags || [])
    } catch (error) {
      toast.error("Failed to fetch blog")
      navigate("/admin/blogs")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, tags }
      if (id) {
        await api.put(`/blogs/${id}`, payload)
        toast.success("Blog updated!")
      } else {
        await api.post("/blogs", payload)
        toast.success("Blog created!")
      }
      navigate("/admin/blogs")
    } catch (error) {
      toast.error("Failed to save blog")
    } finally {
      setSaving(false)
    }
  }

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
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
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/blogs")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} /> Back to Blogs
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{id ? "Edit Blog Post" : "New Blog Post"}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Post Details</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                {...register("title", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Blog post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                {...register("excerpt")}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Brief summary for preview cards"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                {...register("content", { required: true })}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                placeholder="Write your blog content here... (Markdown supported)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  {...register("category")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="general">General</option>
                  <option value="technology">Technology</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="news">News</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                <ImageUpload value={watch("thumbnail")} onChange={(url) => setValue("thumbnail", url)} />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
                <button type="button" onClick={() => removeTag(index)} className="hover:text-gray-900">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="tagInput"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Add tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag(e.target.value.trim())
                  e.target.value = ""
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById("tagInput")
                addTag(input.value.trim())
                input.value = ""
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Publishing */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h2>

          <label className="flex items-center gap-3">
            <input type="checkbox" {...register("isPublished")} className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Publish this post (visible to visitors)</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : id ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  )
}
