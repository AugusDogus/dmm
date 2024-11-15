interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`grid bg-white rounded-lg shadow cursor-pointer dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b border-gray-200 dark:border-gray-700">{children}</div>;
}

export function CardTitle({ children, className = '' }: CardProps) {
  return <h3 className={`font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
} 