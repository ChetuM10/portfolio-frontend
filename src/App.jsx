import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import PortfolioLayout from "./layouts/PortfolioLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AboutPage from "./pages/admin/AboutPage";
import SkillsPage from "./pages/admin/SkillsPage";
import ProjectsPage from "./pages/admin/ProjectsPage";
import ProjectForm from "./pages/admin/ProjectForm";
import BlogsPage from "./pages/admin/BlogsPage";
import BlogForm from "./pages/admin/BlogForm";
import ExperiencePage from "./pages/admin/ExperiencePage";
import TestimonialsPage from "./pages/admin/TestimonialsPage";
import ServicesPage from "./pages/admin/ServicesPage";
import MessagesPage from "./pages/admin/MessagesPage";
import MediaPage from "./pages/admin/MediaPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Portfolio Public Pages
import Home from "./pages/portfolio/Home";
import About from "./pages/portfolio/About";
import Projects from "./pages/portfolio/Projects";
import ProjectDetail from "./pages/portfolio/ProjectDetail";
import Blog from "./pages/portfolio/Blog";
import BlogPost from "./pages/portfolio/BlogPost";
import Contact from "./pages/portfolio/Contact";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        {/* ==================== PUBLIC PORTFOLIO ROUTES ==================== */}
        {/* Anyone can access these without login */}
        <Route path="/" element={<PortfolioLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* ==================== AUTH ROUTES ==================== */}
        {/* Public login/register pages */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        {/* ==================== PROTECTED ADMIN ROUTES ==================== */}
        {/* Only authenticated users can access */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="skills" element={<SkillsPage />} />
          
          {/* Projects Management */}
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/edit/:id" element={<ProjectForm />} />
          
          {/* Blog Management */}
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/new" element={<BlogForm />} />
          <Route path="blogs/edit/:id" element={<BlogForm />} />
          
          {/* Other Admin Pages */}
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ==================== 404 FALLBACK ==================== */}
        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
