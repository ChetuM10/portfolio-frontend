import { useState, useRef, useEffect } from "react";

/**
 * Optimized image component with lazy loading, blur placeholder, and error handling
 */
export default function OptimizedImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  aspectRatio = "auto", // "auto", "1:1", "16:9", "4:3", "3:2"
  objectFit = "cover",
  priority = false, // If true, load immediately
  placeholder = "blur", // "blur", "skeleton", "none"
  fallback = null, // Fallback image URL or component
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Aspect ratio styles
  const aspectRatios = {
    auto: {},
    "1:1": { paddingBottom: "100%" },
    "16:9": { paddingBottom: "56.25%" },
    "4:3": { paddingBottom: "75%" },
    "3:2": { paddingBottom: "66.67%" },
  };

  // Handle intersection observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, src]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // Cloudinary optimization (if using Cloudinary URLs)
  const getOptimizedSrc = (originalSrc, width = 800) => {
    if (!originalSrc) return "";

    // If it's a Cloudinary URL, add transformations
    if (originalSrc.includes("cloudinary.com")) {
      // Insert quality and format auto transformations
      const parts = originalSrc.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/q_auto,f_auto,w_${width}/${parts[1]}`;
      }
    }

    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  if (hasError && fallback) {
    if (typeof fallback === "string") {
      return <img src={fallback} alt={alt} className={className} {...props} />;
    }
    return fallback;
  }

  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={aspectRatio !== "auto" ? { position: "relative" } : {}}
    >
      {/* Aspect ratio spacer */}
      {aspectRatio !== "auto" && <div style={aspectRatios[aspectRatio]} />}

      {/* Loading placeholder */}
      {!isLoaded && placeholder !== "none" && (
        <div
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${
            placeholder === "blur" ? "animate-pulse" : ""
          }`}
        />
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={priority ? optimizedSrc : undefined}
        data-src={!priority ? optimizedSrc : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`
          ${aspectRatio !== "auto" ? "absolute inset-0 w-full h-full" : ""}
          object-${objectFit}
          transition-opacity duration-300
          ${isLoaded ? "opacity-100" : "opacity-0"}
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

// Simplified version for thumbnails
export function Thumbnail({ src, alt, size = "md", className = "", ...props }) {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      aspectRatio="1:1"
      wrapperClassName={`${sizes[size]} ${className}`}
      className="rounded-lg"
      {...props}
    />
  );
}

// Avatar image with fallback
export function AvatarImage({
  src,
  alt,
  size = "md",
  className = "",
  ...props
}) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const initials = alt
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fallbackComponent = (
    <div
      className={`${sizes[size]} rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold ${className}`}
    >
      {initials || "?"}
    </div>
  );

  if (!src) return fallbackComponent;

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      aspectRatio="1:1"
      wrapperClassName={`${sizes[size]} ${className}`}
      className="rounded-full"
      fallback={fallbackComponent}
      {...props}
    />
  );
}
