"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import toast from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects?visible=all");
      setProjects(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted!");
      fetchProjects();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const toggleVisibility = async (project) => {
    try {
      await api.put(`/projects/${project._id}`, {
        isVisible: !project.isVisible,
      });
      toast.success(project.isVisible ? "Project hidden" : "Project visible");
      fetchProjects();
    } catch (error) {
      toast.error("Failed to update project");
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
              Projects
            </span>
          </h1>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={20} /> Add Project
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No projects yet</p>
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Create your first project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Project
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                    Links
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {project.thumbnail && (
                          <img
                            src={project.thumbnail || "/placeholder.svg"}
                            alt={project.title}
                            className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">
                            {project.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {project.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 text-sm font-medium capitalize bg-gray-100 text-gray-700 rounded-full">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full ${
                          project.isVisible
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {project.isVisible ? (
                          <Eye size={14} />
                        ) : (
                          <EyeOff size={14} />
                        )}
                        {project.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="GitHub"
                          >
                            <Github size={18} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleVisibility(project)}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title={project.isVisible ? "Hide" : "Show"}
                        >
                          {project.isVisible ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                        <Link
                          to={`/admin/projects/edit/${project._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
