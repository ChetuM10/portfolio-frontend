import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../lib/api";
import TechMarquee from "../../components/TechMarquee";
import SEO from "../../components/SEO";
import OptimizedImage from "../../components/OptimizedImage";
import {
  SkeletonCard,
  SkeletonText,
  SkeletonHeading,
} from "../../components/LoadingSkeleton";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

// Home page skeleton loader
const HomeSkeleton = () => (
  <div className="dark:bg-gray-900">
    {/* Hero skeleton */}
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto" />
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center mt-8">
            <div className="h-14 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-14 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
    {/* Projects skeleton */}
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <SkeletonHeading className="mx-auto mb-16" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default function Home() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aboutRes, projectsRes] = await Promise.all([
        api.get("/about"),
        api.get("/projects?featured=true"),
      ]);
      setAbout(aboutRes.data.data);
      setProjects(projectsRes.data.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <SEO
        title="Chetan N - Full Stack Developer | Portfolio"
        description={
          about?.description?.slice(0, 160) ||
          "Full Stack Developer specializing in React, Node.js, and Cloud Solutions."
        }
        keywords="Full Stack Developer, React, Node.js, JavaScript, Portfolio, MERN Stack, Web Developer"
        url="/"
      />

      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Full Stack Developer
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                {about?.subtitle || "Building Scalable Web Applications"}
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                {about?.description?.slice(0, 200)}...
              </p>

              {/* Stats */}
              {about?.stats && about.stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-12">
                  {about.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                    >
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/projects"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg font-semibold shadow-lg shadow-blue-600/25"
                >
                  View My Work <ArrowRight size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all text-lg font-semibold"
                >
                  Let's Talk
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex gap-6 justify-center mt-8">
                {about?.socialLinks?.github && (
                  <a
                    href={about.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    aria-label="GitHub"
                  >
                    <Github size={24} />
                  </a>
                )}
                {about?.socialLinks?.linkedin && (
                  <a
                    href={about.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {about?.socialLinks?.email && (
                  <a
                    href={`mailto:${about.socialLinks.email}`}
                    className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    aria-label="Email"
                  >
                    <Mail size={24} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tech Stack Marquee */}
        <TechMarquee />

        {/* Featured Projects Section */}
        {projects.length > 0 && (
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Featured Projects
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Some of my recent work
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      className="group block h-full"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700">
                        {project.thumbnail && (
                          <div className="relative h-48 overflow-hidden">
                            <OptimizedImage
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              wrapperClassName="h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">
                            {project.shortDescription ||
                              project.description?.slice(0, 120)}
                            ...
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies
                              ?.slice(0, 3)
                              .map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all font-semibold"
                >
                  View All Projects <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Have a project in mind?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can collaborate to bring your ideas to life
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all text-lg font-semibold shadow-lg"
            >
              Get In Touch <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
