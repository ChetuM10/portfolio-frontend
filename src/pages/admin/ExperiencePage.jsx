"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import api from "../../lib/api"
import toast from "react-hot-toast"
import { Plus, Edit2, Trash2, X, Briefcase, GraduationCap, Award } from "lucide-react"

const types = [
  { value: "work", label: "Work", icon: Briefcase },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "certification", label: "Certification", icon: Award },
]

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExp, setEditingExp] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "work",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    isVisible: true,
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const res = await api.get("/experience")
      setExperiences(res.data.data)
    } catch (error) {
      toast.error("Failed to fetch experiences")
    } finally {
      setLoading(false)
    }
  }

  const openModal = (exp = null) => {
    if (exp) {
      setEditingExp(exp)
      setFormData({
        title: exp.title,
        company: exp.company,
        location: exp.location || "",
        type: exp.type,
        startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
        endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
        isCurrent: exp.isCurrent,
        description: exp.description || "",
        isVisible: exp.isVisible,
      })
    } else {
      setEditingExp(null)
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "work",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        isVisible: true,
      })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingExp(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingExp) {
        await api.put(`/experience/${editingExp._id}`, formData)
        toast.success("Experience updated!")
      } else {
        await api.post("/experience", formData)
        toast.success("Experience created!")
      }
      fetchExperiences()
      closeModal()
    } catch (error) {
      toast.error("Failed to save experience")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return
    try {
      await api.delete(`/experience/${id}`)
      toast.success("Experience deleted!")
      fetchExperiences()
    } catch (error) {
      toast.error("Failed to delete experience")
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
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Experience
            </span>
          </h1>
          <p className="text-gray-600">Manage your work and education history</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={20} /> Add Experience
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((exp) => {
          const TypeIcon = types.find((t) => t.value === exp.type)?.icon || Briefcase
          return (
            <div key={exp._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                    <TypeIcon className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-500 mt-1">{exp.location}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                      {exp.isCurrent ? (
                        <span className="text-green-600 font-medium">Present</span>
                      ) : (
                        exp.endDate && format(new Date(exp.endDate), "MMM yyyy")
                      )}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button 
                    onClick={() => openModal(exp)} 
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(exp._id)} 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {experiences.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No experiences added yet</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} /> Add Your First Experience
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingExp ? "Edit Experience" : "Add Experience"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company/Institution</label>
                <input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Company Name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    {types.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={formData.isCurrent}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">I currently work here</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Brief description of your role and achievements..."
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
                >
                  {editingExp ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
