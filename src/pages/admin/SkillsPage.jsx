"use client";

import { useState, useEffect } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, X, Award } from "lucide-react";

const categories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "database", label: "Database" },
  { value: "devops", label: "DevOps" },
  { value: "tools", label: "Tools" },
  { value: "other", label: "Other" },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "frontend",
    proficiency: 50,
    icon: "",
    order: 0,
    isVisible: true,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills");
      setSkills(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        icon: skill.icon || "",
        order: skill.order,
        isVisible: skill.isVisible,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: "",
        category: "frontend",
        proficiency: 50,
        icon: "",
        order: 0,
        isVisible: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, formData);
        toast.success("Skill updated!");
      } else {
        await api.post("/skills", formData);
        toast.success("Skill created!");
      }
      fetchSkills();
      closeModal();
    } catch (error) {
      toast.error("Failed to save skill");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success("Skill deleted!");
      fetchSkills();
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Skills
            </span>
          </h1>
          <p className="text-gray-600">Manage your technical skills</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={20} /> Add Skill
        </button>
      </div>

      {/* Skills by Category */}
      {skills.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No skills added yet</p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const categorySkills = groupedSkills[category.value] || [];
            if (categorySkills.length === 0) return null;

            return (
              <div
                key={category.value}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {category.label}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openModal(skill)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {skill.proficiency}%
                        </span>
                        {!skill.isVisible && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSkill ? "Edit Skill" : "Add Skill"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                  placeholder="React.js"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proficiency:{" "}
                  <span className="text-blue-600 font-semibold">
                    {formData.proficiency}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proficiency: Number.parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon URL (optional)
                </label>
                <input
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                  placeholder="https://..."
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) =>
                    setFormData({ ...formData, isVisible: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Visible on portfolio
                </span>
              </label>

              {/* Modal Footer */}
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
                  {editingSkill ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
