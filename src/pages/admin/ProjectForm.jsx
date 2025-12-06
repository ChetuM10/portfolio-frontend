"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import api from "../../lib/api"
import toast from "react-hot-toast"
import ImageUpload from "../../components/admin/ImageUpload"
import { X, Plus, ArrowLeft } from "lucide-react"

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [technologies, setTechnologies] = useState([])
  const [images, setImages] = useState([])
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      category: "web",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      isVisible: true,
      thumbnail: "",
    },
  })

  useEffect(() => {
    if (id) fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/id/${id}`)
      const data = res.data.data
      Object.keys(data).forEach((key) => {
        if (key !== "technologies" && key !== "images") {
          setValue(key, data[key])
        }
      })
      setTechnologies(data.technologies || [])
      setImages(data.images || [])
    } catch (error) {
      toast.error("Failed to fetch project")
      navigate("/admin/projects")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, technologies, images }
      if (id) {
        await api.put(`/projects/${id}`, payload)
        toast.success("Project updated!")
      } else {
        await api.post("/projects", payload)
        toast.success("Project created!")
      }
      navigate("/admin/projects")
    } catch (error) {
      toast.error("Failed to save project")
    } finally {
      setSaving(false)
    }
  }

  const addTechnology = (tech) => {
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech])
    }
  }

  const removeTechnology = (index) => {
    setTechnologies(technologies.filter((_, i) => i !== index))
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
          onClick={() => navigate("/admin/projects")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} /> Back to Projects
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{id ? "Edit Project" : "New Project"}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                {...register("title", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Project Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <input
                {...register("shortDescription")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Brief description for cards"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
              <textarea
                {...register("description", { required: true })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Detailed project description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  {...register("category")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="api">API/Backend</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                <ImageUpload value={watch("thumbnail")} onChange={(url) => setValue("thumbnail", url)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                <input
                  {...register("liveUrl")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  {...register("githubUrl")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Technologies</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tech}
                <button type="button" onClick={() => removeTechnology(index)} className="hover:text-blue-900">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="techInput"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Add technology (e.g., React)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTechnology(e.target.value.trim())
                  e.target.value = ""
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById("techInput")
                addTechnology(input.value.trim())
                input.value = ""
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" {...register("featured")} className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Featured project (shown on homepage)</span>
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" {...register("isVisible")} className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Visible on portfolio</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : id ? "Update Project" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  )
}
