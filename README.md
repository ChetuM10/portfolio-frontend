# Portfolio Frontend

A React-based portfolio website with a custom CMS admin panel.

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Hook Form
- React Hot Toast
- date-fns

## Features

### Public Portfolio
- Home page with hero, skills, and featured projects
- About page with experience timeline
- Projects gallery with filtering
- Blog with markdown support
- Contact form

### Admin CMS Panel
- JWT Authentication
- Dashboard with stats
- CRUD operations for:
  - About section
  - Skills
  - Projects
  - Blog posts
  - Experience/Timeline
  - Testimonials
  - Services
- Contact form submissions management
- Media library with Cloudinary integration

## Setup

1. Clone the repository

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a \`.env\` file:
   \`\`\`env
   VITE_API_URL=http://localhost:5000/api
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/
│   │   └── admin/
│   │       └── ImageUpload.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── PortfolioLayout.jsx
│   ├── lib/
│   │   └── api.js
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── SkillsPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── BlogsPage.jsx
│   │   │   ├── BlogForm.jsx
│   │   │   ├── ExperiencePage.jsx
│   │   │   ├── TestimonialsPage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── MessagesPage.jsx
│   │   │   ├── MediaPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── portfolio/
│   │       ├── Home.jsx
│   │       ├── About.jsx
│   │       ├── Projects.jsx
│   │       ├── ProjectDetail.jsx
│   │       ├── Blog.jsx
│   │       ├── BlogPost.jsx
│   │       └── Contact.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── .env.example
\`\`\`

## Routes

### Public Routes
- \`/\` - Home
- \`/about\` - About page
- \`/projects\` - Projects listing
- \`/projects/:slug\` - Project detail
- \`/blog\` - Blog listing
- \`/blog/:slug\` - Blog post
- \`/contact\` - Contact form

### Admin Routes (Protected)
- \`/admin\` - Dashboard
- \`/admin/login\` - Login
- \`/admin/register\` - Register
- \`/admin/about\` - Edit about section
- \`/admin/skills\` - Manage skills
- \`/admin/projects\` - Manage projects
- \`/admin/projects/new\` - Create project
- \`/admin/projects/edit/:id\` - Edit project
- \`/admin/blogs\` - Manage blogs
- \`/admin/blogs/new\` - Create blog
- \`/admin/blogs/edit/:id\` - Edit blog
- \`/admin/experience\` - Manage experience
- \`/admin/testimonials\` - Manage testimonials
- \`/admin/services\` - Manage services
- \`/admin/messages\` - View messages
- \`/admin/media\` - Media library
- \`/admin/settings\` - Account settings
\`\`\`
