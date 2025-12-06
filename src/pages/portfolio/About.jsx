"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../lib/api"
import { format } from "date-fns"
import { Download, Briefcase, GraduationCap, Award, ArrowRight } from "lucide-react"

export default function About() {
  const [about, setAbout] = useState(null)
  const [experience, setExperience] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [aboutRes, expRes, servicesRes] = await Promise.all([
        api.get("/about"),
        api.get("/experience"),
        api.get("/services"),
      ])
      setAbout(aboutRes.data.data)
      setExperience(expRes.data.data)
      setServices(servicesRes.data.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "education":
        return GraduationCap
      case "certification":
        return Award
      default:
        return Briefcase
    }
  }

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
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {about?.image && (
              <div>
                <img
                  src={about.image || "/placeholder.svg"}
                  alt="About"
                  className="w-full max-w-lg rounded-2xl shadow-xl"
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{about?.title || "About Me"}</h1>
              {about?.subtitle && <p className="text-xl text-blue-600 mt-2">{about.subtitle}</p>}
              <p className="text-gray-600 mt-6 text-lg leading-relaxed whitespace-pre-line">{about?.description}</p>

              {about?.resume && (
                <a
                  href={about.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Download size={20} /> Download Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {about?.stats && about.stats.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {about.stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
                  <p className="text-gray-600 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What I Do</h2>
              <p className="text-gray-600 mt-2">Services I offer</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service._id} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 mt-3">{service.description}</p>
                  {service.features && service.features.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {experience.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Experience & Education</h2>
              <p className="text-gray-600 mt-2">My professional journey</p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-8">
                {experience.map((exp) => {
                  const Icon = getTypeIcon(exp.type)
                  return (
                    <div key={exp._id} className="relative flex gap-6">
                      <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="text-blue-600" size={24} />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{exp.title}</h3>
                            <p className="text-blue-600">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                            {exp.isCurrent ? "Present" : exp.endDate && format(new Date(exp.endDate), "MMM yyyy")}
                          </span>
                        </div>
                        {exp.location && <p className="text-sm text-gray-500 mt-1">{exp.location}</p>}
                        {exp.description && <p className="text-gray-600 mt-3">{exp.description}</p>}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {exp.technologies.map((tech, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-white text-gray-600 rounded border">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white">Interested in working together?</h2>
          <p className="text-gray-400 mt-2">Let's discuss your project</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get In Touch <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
