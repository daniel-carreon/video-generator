/**
 * Card Component
 * Generic card wrapper component
 */

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
}
