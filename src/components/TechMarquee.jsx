import { motion } from "framer-motion"
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss, SiJavascript, SiTypescript, SiPython, SiDocker, SiGit } from "react-icons/si"

const technologies = [
  { Icon: SiReact, name: "React", color: "#61DAFB" },
  { Icon: SiNodedotjs, name: "Node.js", color: "#339933" },
  { Icon: SiMongodb, name: "MongoDB", color: "#47A248" },
  { Icon: SiExpress, name: "Express", color: "#000000" },
  { Icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
  { Icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
  { Icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  { Icon: SiPython, name: "Python", color: "#3776AB" },
  { Icon: SiDocker, name: "Docker", color: "#2496ED" },
  { Icon: SiGit, name: "Git", color: "#F05032" },
]

export default function TechMarquee() {
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
        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
          <div key={index} className="flex flex-col items-center gap-2 min-w-[100px]">
            <tech.Icon size={48} style={{ color: tech.color }} className="dark:opacity-90" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
