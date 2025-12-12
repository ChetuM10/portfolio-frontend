import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../lib/api";

export default function TechMarquee() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skills");
        const visibleSkills = res.data.data.filter(skill => skill.isVisible);
        setSkills(visibleSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  // Don't render if no skills
  if (skills.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800/50 py-8 mt-12">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-gray-900 dark:via-transparent dark:to-gray-900 z-10 pointer-events-none" />
      <motion.div
        className="flex gap-12"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...skills, ...skills, ...skills].map((skill, index) => (
          <div key={`${skill._id}-${index}`} className="flex flex-col items-center gap-2 min-w-[100px]">
            {skill.icon ? (
              <img 
                src={skill.icon} 
                alt={skill.name}
                className="w-12 h-12 object-contain dark:opacity-90"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-lg">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {skill.name[0]}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {skill.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
