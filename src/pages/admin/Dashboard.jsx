"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../lib/api"
import { FolderOpen, FileText, MessageSquare, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    skills: 0,
  })
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, blogsRes, messagesRes, skillsRes] = await Promise.all([
        api.get("/projects?visible=all"),
        api.get("/blogs"),
        api.get("/contact"),
        api.get("/skills"),
      ])

      setStats({
        projects: projectsRes.data.data.length,
        blogs: blogsRes.data.data.length,
        messages: messagesRes.data.data.length,
        skills: skillsRes.data.data.length,
      })

      setRecentMessages(messagesRes.data.data.slice(0, 5))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: "Projects", value: stats.projects, icon: FolderOpen, color: "blue", link: "/admin/projects" },
    { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "green", link: "/admin/blogs" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, color: "purple", link: "/admin/messages" },
    { label: "Skills", value: stats.skills, icon: TrendingUp, color: "orange", link: "/admin/skills" },
  ]

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your portfolio CMS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
          <Link to="/admin/messages" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y">
          {recentMessages.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-500">No messages yet</p>
          ) : (
            recentMessages.map((message) => (
              <div key={message._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{message.name}</p>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{message.message}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      message.isRead ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {message.isRead ? "Read" : "New"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
