"use client";

import { useState, useEffect } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, X, Star, MessageSquare } from "lucide-react";
import ImageUpload from "../../components/admin/ImageUpload";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    avatar: "",
    rating: 5,
    isVisible: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials");
      setTestimonials(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        role: item.role || "",
        company: item.company || "",
        content: item.content,
        avatar: item.avatar || "",
        rating: item.rating,
        isVisible: item.isVisible,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        role: "",
        company: "",
        content: "",
        avatar: "",
        rating: 5,
        isVisible: true,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/testimonials/${editingItem._id}`, formData);
        toast.success("Testimonial updated!");
      } else {
        await api.post("/testimonials", formData);
        toast.success("Testimonial created!");
      }
      fetchTestimonials();
      closeModal();
    } catch (error) {
      toast.error("Failed to save testimonial");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success("Testimonial deleted!");
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

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
              Testimonials
            </span>
          </h1>
          <p className="text-gray-600">Manage client testimonials</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={20} /> Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No testimonials yet</p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Add Your First Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  {item.avatar ? (
                    <img
                      src={item.avatar || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {item.role}
                      {item.company && ` at ${item.company}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed mb-4">
                "{item.content}"
              </p>
              <div className="flex items-center gap-1 pt-4 border-t border-gray-100">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < item.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto flex-1"
            >
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
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                    placeholder="CEO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                    placeholder="Company Inc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-900 bg-white"
                  placeholder="What they said about your work..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar
                </label>
                <ImageUpload
                  value={formData.avatar}
                  onChange={(url) => setFormData({ ...formData, avatar: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={28}
                        className={
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

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
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
