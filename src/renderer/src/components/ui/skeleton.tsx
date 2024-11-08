interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`bg-gray-200 rounded animate-pulse dark:bg-gray-700 ${className}`}
    />
  );
} 