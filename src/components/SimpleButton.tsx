'use client';

import React from 'react';

interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label or content */
  children: React.ReactNode;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary';
}

/**
 * A simple, accessible button component styled with Tailwind CSS.
 * Supports dark mode and WCAG AA contrast.
 */
const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  variant = 'primary',
  disabled,
  className = '',
  ...rest
}) => {
  const baseClasses = `
    inline-flex items-center justify-center rounded-md font-medium
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
    transition-colors duration-150 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    px-4 py-2
  `
    .trim()
    .replace(/\s+/g, ' ');

  const variantClasses =
    variant === 'primary'
      ? `
        bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-500
        dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus-visible:outline-blue-300
      `
      : `
        bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:outline-gray-500
        dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus-visible:outline-gray-300
      `;

  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <button
      type="button"
      disabled={disabled}
      className={combinedClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
