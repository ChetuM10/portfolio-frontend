"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { format } from "date-fns";
import SEO from "../../components/SEO";
import OptimizedImage from "../../components/OptimizedImage";
import {
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
} from "../../components/LoadingSkeleton";
import {
  Download,
  Briefcase,
  GraduationCap,
  Award,
  ArrowRight,
} from "lucide-react";

// About page skeleton
const AboutSkeleton = () => (
  <div className="bg-white dark:bg-gray-900">
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="space-y-2 mt-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            </div>
            <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg mt-8" />
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default function About() {
  const [about, setAbout] = useState(null);
  const [experience, setExperience] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aboutRes, expRes, servicesRes] = await Promise.all([
        api.get("/about"),
        api.get("/experience"),
        api.get("/services"),
      ]);
      setAbout(aboutRes.data.data);
      setExperience(expRes.data.data);
      setServices(servicesRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "education":
        return GraduationCap;
      case "certification":
        return Award;
      default:
        return Briefcase;
    }
  };

  if (loading) {
    return <AboutSkeleton />;
  }

  return (
    <>
      <SEO
        title="About | Chetan N - Full Stack Developer"
        description={
          about?.description?.slice(0, 160) ||
          "Learn more about my background, experience, and the services I offer as a Full Stack Developer."
        }
        keywords="About, Developer, Experience, Services, Skills, Full Stack Developer"
        url="/about"
      />

      <div className="bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {about?.image && (
                <div>
                  <OptimizedImage
                    src={about.image}
                    alt="About"
                    className="w-full max-w-lg rounded-2xl shadow-xl"
                    wrapperClassName="max-w-lg mx-auto lg:mx-0"
                    priority
                  />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {about?.title || "About Me"}
                </h1>
                {about?.subtitle && (
                  <p className="text-xl text-blue-600 dark:text-blue-400 mt-2">
                    {about.subtitle}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg leading-relaxed whitespace-pre-line">
                  {about?.description}
                </p>

                {about?.resume && (
                  <a
                    href={about.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
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
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {about.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 md:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {stat.value}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Services */}
        {services.length > 0 && (
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  What I Do
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Services I offer
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">
                      {service.description}
                    </p>
                    {service.features && service.features.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {service.features.map((feature, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0"></span>
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
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Experience & Education
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  My professional journey
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                <div className="space-y-6 md:space-y-8">
                  {experience.map((exp) => {
                    const Icon = getTypeIcon(exp.type);
                    return (
                      <div
                        key={exp._id}
                        className="relative flex gap-4 md:gap-6"
                      >
                        <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Icon
                            className="text-blue-600 dark:text-blue-400"
                            size={24}
                          />
                        </div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-100 dark:border-gray-700">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                {exp.title}
                              </h3>
                              <p className="text-blue-600 dark:text-blue-400">
                                {exp.company}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {exp.startDate &&
                                format(
                                  new Date(exp.startDate),
                                  "MMM yyyy"
                                )}{" "}
                              -{" "}
                              {exp.isCurrent
                                ? "Present"
                                : exp.endDate &&
                                  format(new Date(exp.endDate), "MMM yyyy")}
                            </span>
                          </div>
                          {exp.location && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {exp.location}
                            </p>
                          )}
                          {exp.description && (
                            <p className="text-gray-600 dark:text-gray-300 mt-3">
                              {exp.description}
                            </p>
                          )}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {exp.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white">
              Interested in working together?
            </h2>
            <p className="text-white/80 mt-2">Let's discuss your project</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get In Touch <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
