"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-sm',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.99 }}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
