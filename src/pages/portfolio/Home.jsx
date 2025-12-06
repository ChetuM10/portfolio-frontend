"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../lib/api"
import { ArrowRight, Github, Linkedin, Twitter, Mail } from "lucide-react"

export default function Home() {
  const [about, setAbout] = useState(null)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [aboutRes, projectsRes, skillsRes] = await Promise.all([
        api.get("/about"),
        api.get("/projects?featured=true"),
        api.get("/skills"),
      ])
      setAbout(aboutRes.data.data)
      setProjects(projectsRes.data.data.slice(0, 3))
      setSkills(skillsRes.data.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Hi, I'm <span className="text-blue-600">{about?.title?.replace("About ", "") || "a Developer"}</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6">{about?.subtitle || "Full Stack Developer"}</p>
              <p className="text-gray-500 mt-4 text-lg leading-relaxed line-clamp-4">{about?.description}</p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Projects <ArrowRight size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                >
                  Contact Me
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-8">
                {about?.socialLinks?.github && (
                  <a
                    href={about.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <Github size={24} />
                  </a>
                )}
                {about?.socialLinks?.linkedin && (
                  <a
                    href={about.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {about?.socialLinks?.twitter && (
                  <a
                    href={about.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    <Twitter size={24} />
                  </a>
                )}
                {about?.socialLinks?.email && (
                  <a
                    href={`mailto:${about.socialLinks.email}`}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Mail size={24} />
                  </a>
                )}
              </div>
            </div>

            {about?.image && (
              <div className="relative">
                <div className="relative z-10">
                  <img
                    src={about.image || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  />
                </div>
                <div className="absolute -inset-4 bg-blue-100 rounded-2xl -z-0 transform rotate-3"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {about?.stats && about.stats.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {about.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Skills & Technologies</h2>
              <p className="text-gray-600 mt-2">Technologies I work with</p>
            </div>

            <div className="space-y-8">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-700 capitalize mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
                <p className="text-gray-600 mt-2">Some of my recent work</p>
              </div>
              <Link to="/projects" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project.slug}`}
                  className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {project.thumbnail && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.thumbnail || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">{project.shortDescription || project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Let's Work Together</h2>
          <p className="text-blue-100 mt-4 text-lg">
            Have a project in mind? I'd love to hear about it. Let's discuss how we can collaborate.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get In Touch <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
