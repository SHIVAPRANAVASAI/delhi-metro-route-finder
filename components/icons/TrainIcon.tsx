
import React from 'react';

export const TrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <line x1="10" y1="15" x2="10.01" y2="15" />
    <line x1="14" y1="15" x2="14.01" y2="15" />
    <path d="M8 21h8" />
    <path d="M5 11h14" />
  </svg>
);
