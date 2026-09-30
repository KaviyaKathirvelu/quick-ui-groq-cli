'use client';

import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex items-center justify-center min-h-[60vh] bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
        }}
        aria-hidden="true"
      />
      {/* Dark overlay for contrast */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/50"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto text-center px-4 py-12 md:py-20 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Elevate Your Digital Experience
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Craft stunning, responsive interfaces with modern React and Tailwind
          CSS. Fast, accessible, and ready for the future.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <a
            href="#get-started"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-white font-medium rounded-md transition-colors"
          >
            Get Started
          </a>
          <a
            href="#learn-more"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/70 hover:border-white text-white hover:text-white font-medium rounded-md transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
