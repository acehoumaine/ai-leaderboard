"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface CardProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
  children: React.ReactNode;
}

const cardVariants = {
  default: 'bg-white shadow-sm',
  elevated: 'bg-white shadow-lg',
  outlined: 'bg-white border border-gray-200'
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const motionProps = hover
      ? { whileHover: { y: -2 }, transition: { duration: 0.2 } }
      : {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-xl overflow-hidden transition-all duration-200',
          cardVariants[variant],
          hover && 'hover:shadow-xl cursor-pointer',
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4 border-b border-gray-200', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
