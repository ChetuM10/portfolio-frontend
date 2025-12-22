/**
 * Loading skeleton components for better UX during data fetching
 */

// Basic skeleton pulse animation wrapper
const Pulse = ({ children, className = "" }) => (
  <div className={`animate-pulse ${className}`}>{children}</div>
);

// Text skeleton
export const SkeletonText = ({ lines = 1, className = "" }) => (
  <Pulse className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
          i === lines - 1 ? "w-3/4" : "w-full"
        } ${i > 0 ? "mt-2" : ""}`}
      />
    ))}
  </Pulse>
);

// Heading skeleton
export const SkeletonHeading = ({ className = "" }) => (
  <Pulse className={className}>
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
  </Pulse>
);

// Card skeleton
export const SkeletonCard = ({ hasImage = true, className = "" }) => (
  <Pulse
    className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg ${className}`}
  >
    {hasImage && <div className="h-48 bg-gray-200 dark:bg-gray-700" />}
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  </Pulse>
);

// Avatar skeleton
export const SkeletonAvatar = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  return (
    <Pulse className={className}>
      <div
        className={`${sizes[size]} bg-gray-200 dark:bg-gray-700 rounded-full`}
      />
    </Pulse>
  );
};

// Page loading spinner
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-2",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-blue-600 border-t-transparent border-l-transparent border-r-transparent ${sizes[size]}`}
      />
    </div>
  );
};

// Full page loading
export const PageLoader = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
  </div>
);

// Grid skeleton (for project/blog grids)
export const SkeletonGrid = ({ count = 6, columns = 3, hasImage = true }) => (
  <div
    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} hasImage={hasImage} />
    ))}
  </div>
);

// Inline loading
export const InlineLoader = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <LoadingSpinner size="sm" />
    <span className="text-gray-600 dark:text-gray-400">Loading...</span>
  </span>
);

export default {
  SkeletonText,
  SkeletonHeading,
  SkeletonCard,
  SkeletonAvatar,
  LoadingSpinner,
  PageLoader,
  SkeletonGrid,
  InlineLoader,
};
