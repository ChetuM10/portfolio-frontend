"use client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { FolderOpen, FileText, MessageSquare, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
    skills: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, blogsRes, messagesRes, skillsRes] = await Promise.all([
        api.get("/projects?visible=all"),
        api.get("/blogs"),
        api.get("/contact"),
        api.get("/skills"),
      ]);

      setStats({
        projects: projectsRes.data.data.length,
        blogs: blogsRes.data.data.length,
        messages: messagesRes.data.data.length,
        skills: skillsRes.data.data.length,
      });

      setRecentMessages(messagesRes.data.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Projects", value: stats.projects, icon: FolderOpen, color: "blue", link: "/admin/projects" },
    { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "green", link: "/admin/blogs" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, color: "purple", link: "/admin/messages" },
    { label: "Skills", value: stats.skills, icon: TrendingUp, color: "orange", link: "/admin/skills" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="text-gray-600">Welcome to your portfolio CMS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.link}>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
        </div>
        <div className="p-6">
          {recentMessages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message._id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{message.name}</h3>
                      <span className="text-sm text-gray-500">{message.email}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
