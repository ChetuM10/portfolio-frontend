import { Helmet } from "react-helmet-async";

/**
 * SEO component for setting meta tags dynamically
 */
export default function SEO({
  title = "Chetan N - Full Stack Developer",
  description = "Full Stack Developer specializing in React, Node.js, and Cloud Solutions. View my portfolio, projects, and get in touch.",
  keywords = "Full Stack Developer, React, Node.js, JavaScript, Portfolio, Web Developer",
  image = "/og-image.png",
  url = "",
  type = "website",
  author = "Chetan N",
}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://chetan.dev";
  const fullUrl = `${siteUrl}${url}`;
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Chetan N Portfolio" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
    </Helmet>
  );
}
