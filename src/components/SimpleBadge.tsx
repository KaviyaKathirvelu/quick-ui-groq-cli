'use client';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
type Size = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style of the badge */
  variant?: Variant;
  /** Size of the badge */
  size?: Size;
  /** Content of the badge */
  children: React.ReactNode;
}

/** Tailwind classes for each variant – ensures WCAG AA contrast in both light & dark modes */
const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
};

/** Tailwind classes for each size */
const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
};

/**
 * Simple Badge component – a small, accessible label.
 *
 * Example:
 *   <Badge variant="success" size="sm">New</Badge>
 */
const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...rest
}) => {
  const classes = [
    'inline-flex items-center rounded-full font-medium',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};

export default Badge;
