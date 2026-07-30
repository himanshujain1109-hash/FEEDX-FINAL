@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-paper text-ink font-body antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-display;
  }
  :focus-visible {
    outline: 2px solid #F2A93B;
    outline-offset: 2px;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-canopy px-6 py-3 font-display font-medium text-paper transition hover:bg-canopy-700 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 rounded-full border-2 border-canopy px-6 py-3 font-display font-medium text-canopy transition hover:bg-canopy hover:text-paper disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-accent {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-mango px-6 py-3 font-display font-medium text-canopy-700 transition hover:bg-mango-600 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .input-field {
    @apply w-full rounded-lg border border-mint bg-white px-4 py-2.5 text-ink placeholder:text-ink/40 focus:border-canopy focus:outline-none;
  }
  .card {
    @apply rounded-xl2 border border-mint bg-white p-5 shadow-sm;
  }
  .badge {
    @apply inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
