import React from 'react';
import emptyIllustration from '@/assets/empty-state-illustration.svg';

export interface EmptyStateProps {
  /** Title of the empty state message */
  title?: string;
  /** Detailed description below the title */
  description?: string;
  /** Optional container class overrides */
  className?: string;
}

/**
 * Pixel-perfect empty state component featuring the user's custom SVG illustration (4u0wx01.svg),
 * clean typography with tight tracking headers, and relaxed body copy.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Waiting for Lookup.",
  description = "Ready for verification. Enter the identification number in the field above to begin.",
  className = "",
}) => {
  return (
    <section 
      aria-label="Empty verification state"
      className={`flex flex-col items-center justify-center text-center py-10 px-4 max-w-md mx-auto animate-fade-in ${className}`}
    >
      {/* Central Illustration (from 4u0wx01.svg) */}
      <div className="relative mb-6 flex items-center justify-center">
        <img
          src={emptyIllustration}
          alt="Verification Lookup Illustration"
          className="w-52 h-52 sm:w-64 sm:h-64 object-contain opacity-75 dark:opacity-60 select-none transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h2>

      {/* Subtitle / Description */}
      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs sm:max-w-sm">
        {description}
      </p>
    </section>
  );
};

export default EmptyState;
