import React from 'react';

export const MenuIcons = {
  '🛍️': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" fill="#f97316" />
      <path d="M3 6h18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 10a4 4 0 01-8 0" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  '🔥': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" fill="#ea580c" />
      <path d="M15 11a3 3 0 11-6 0c0-1.657 1-3 3-5 2 2 3 3.343 3 5z" fill="#facc15" />
    </svg>
  ),
  '✨': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3l1.912 3.874L18 7.5l-3 2.924.708 4.076L12 12.583 8.292 14.5l.708-4.076-3-2.924 4.088-.626L12 3z" fill="#eab308" />
      <path d="M5 16l.956 1.937L8 18.25l-1.5 1.462.354 2.038L5 20.792 3.146 21.75l.354-2.038-1.5-1.462 2.044-.313L5 16z" fill="#facc15" />
      <path d="M19 4l.637 1.291 1.363.208-1 1.055.236 1.359-1.236-.65-.1.052L19 4z" fill="#facc15" />
    </svg>
  ),
  '🏷️': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.586 2.586A2 2 0 0011.172 2H4a2 2 0 00-2 2v7.172c0 .53.21 1.04.586 1.414l10 10a2 2 0 002.828 0l7.172-7.172a2 2 0 000-2.828l-10-10zM7 8a1 1 0 11-2 0 1 1 0 012 0z" fill="#ef4444" />
      <circle cx="6" cy="7" r="1.5" fill="#ffffff" />
    </svg>
  ),
  '📱': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="3" fill="#3b82f6" />
      <rect x="7" y="4" width="10" height="13" rx="1" fill="#eff6ff" />
      <circle cx="12" cy="19" r="1" fill="#ffffff" />
    </svg>
  ),
  '👗': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2l-3 4-1 6h8l-1-6-3-4z" fill="#ec4899" />
      <path d="M8 12l-3 9h14l-3-9H8z" fill="#f472b6" />
      <path d="M12 12a2 2 0 100-4 2 2 0 000 4z" fill="#fdf2f8" />
    </svg>
  ),
  '💄': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="8" y="10" width="8" height="11" rx="1" fill="#1e293b" />
      <rect x="9.5" y="12" width="5" height="4" fill="#fbbf24" />
      <path d="M10 10h4V5.5L10 7.5V10z" fill="#ef4444" />
    </svg>
  ),
  '☕': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 8h12v7a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" fill="#78350f" />
      <path d="M16 10h1.5a2.5 2.5 0 010 5H16v-5z" stroke="#78350f" strokeWidth="3" />
      <path d="M6 3c0 1.5 1 1.5 1 3M10 3c0 1.5 1 1.5 1 3M14 3c0 1.5 1 1.5 1 3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  '⭐': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#eab308" />
    </svg>
  ),
  '🏢': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="1" fill="#64748b" />
      <rect x="7" y="5" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="11" y="5" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="15" y="5" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="7" y="10" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="11" y="10" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="15" y="10" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="7" y="15" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="11" y="15" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="15" y="15" width="2" height="2" rx="0.5" fill="#f8fafc" />
      <rect x="10" y="18" width="4" height="4" fill="#0f172a" />
    </svg>
  ),
  '📖': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20v3H6.5a2.5 2.5 0 01-2.5-2.5z" fill="#0284c7" />
      <path d="M6 2h14v15H6.5C5.12 17 4 18.12 4 19.5V5C4 3.34 5.34 2 7 2h19" fill="#38bdf8" />
      <path d="M8 5h8M8 9h8M8 13h5" stroke="#f0f9ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  '💼': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="6" width="18" height="14" rx="2" fill="#a16207" />
      <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" stroke="#a16207" strokeWidth="2" fill="none" />
      <rect x="3" y="9" width="18" height="2" fill="#854d0e" />
      <rect x="11" y="10" width="2" height="2" rx="0.5" fill="#fbbf24" />
    </svg>
  ),
  '📰': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#e2e8f0" />
      <path d="M7 6h10M7 10h10M7 14h5M7 18h5" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      <rect x="14" y="13" width="3" height="5" fill="#94a3b8" />
    </svg>
  ),
  '👤': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="8" r="5" fill="#6366f1" />
      <path d="M20 21a8 8 0 00-16 0h16z" fill="#818cf8" />
    </svg>
  ),
  '❓': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" fill="#06b6d4" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="1.25" fill="#ffffff" />
    </svg>
  ),
  '🚚': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="5" width="13" height="11" rx="1" fill="#22c55e" />
      <path d="M15 8h4l3 3v5h-7V8z" fill="#4ade80" />
      <circle cx="7" cy="18" r="2" fill="#1e293b" />
      <circle cx="17" cy="18" r="2" fill="#1e293b" />
    </svg>
  ),
  '↩️': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#3b82f6" />
      <path d="M9 14l-4-4 4-4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10h11a4 4 0 014 4v2" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  '💬': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" fill="#10b981" />
    </svg>
  ),
  '📦': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#d97706" />
      <path d="M2 17l10 5V12L2 7v10z" fill="#b45309" />
      <path d="M22 17l-10 5V12l10-5v10z" fill="#92400e" />
    </svg>
  )
};

export const MenuIcon = ({ icon, className = "w-5 h-5 flex-shrink-0" }) => {
  const IconComponent = MenuIcons[icon];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <span className={`${className} flex items-center justify-center`}>{icon}</span>;
};
