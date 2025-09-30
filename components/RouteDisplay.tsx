import React from 'react';
import { RouteResult } from '../types';

interface RouteDisplayProps {
  routeResult: RouteResult;
}

// Updated color mapping to be more structured and use standard Tailwind colors
const lineColors: { [key: string]: { bg: string; border: string } } = {
  'Red Line': { bg: 'bg-red-500', border: 'border-red-400' },
  'Yellow Line': { bg: 'bg-yellow-500', border: 'border-yellow-400' },
  'Blue Line': { bg: 'bg-blue-500', border: 'border-blue-400' },
  'Green Line': { bg: 'bg-green-500', border: 'border-green-400' },
  'Violet Line': { bg: 'bg-violet-500', border: 'border-violet-400' },
  'Pink Line': { bg: 'bg-pink-500', border: 'border-pink-400' },
  'Magenta Line': { bg: 'bg-fuchsia-500', border: 'border-fuchsia-400' }, // Changed to fuchsia for CDN compatibility
  'Grey Line': { bg: 'bg-gray-500', border: 'border-gray-400' },
  'Orange Line': { bg: 'bg-orange-500', border: 'border-orange-400' },
  'Aqua Line': { bg: 'bg-cyan-500', border: 'border-cyan-400' },
};
const defaultColor = { bg: 'bg-gray-600', border: 'border-gray-500' };

// Updated function to return a color class object
const getLineColorClasses = (line: string): { bg: string, border: string } => {
  if (!line) return defaultColor;
  const key = Object.keys(lineColors).find(colorKey => line.toLowerCase().includes(colorKey.split(' ')[0].toLowerCase()));
  return key ? lineColors[key] : defaultColor;
};


const RouteDisplay: React.FC<RouteDisplayProps> = ({ routeResult }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">Your Route</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8 text-center">
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-3xl font-bold text-white">{routeResult.totalStations}</p>
          <p className="text-sm text-gray-400">Total Stations</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-3xl font-bold text-white">{routeResult.interchanges}</p>
          <p className="text-sm text-gray-400">Interchanges</p>
        </div>
      </div>

      <div className="relative">
        <ul className="space-y-4">
          {routeResult.route.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === routeResult.route.length - 1;
            
            const currentLineInfo = getLineColorClasses(step.line);
            
            // The segment connecting this station (i) to the next (i+1)
            // is part of the journey described by the next step's line.
            const nextStep = routeResult.route[index + 1];
            const segmentLineInfo = nextStep ? getLineColorClasses(nextStep.line) : currentLineInfo;

            return (
              <li key={index} className="flex items-center gap-4 relative">
                {/* The vertical line segment connecting to the NEXT station */}
                {!isLast && (
                  <div 
                    className={`absolute left-1/2 -translate-x-1/2 top-1/2 h-[calc(100%_+_1rem)] w-1.5 ${segmentLineInfo.bg}`}
                    aria-hidden="true"
                  ></div>
                )}
              
                <div className="flex-1 text-right">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${currentLineInfo.bg} border ${currentLineInfo.border}`}>
                    {step.line}
                  </span>
                </div>
                
                <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 ${step.isInterchange ? 'bg-cyan-400 border-cyan-200' : `${currentLineInfo.bg} ${currentLineInfo.border}`}`}>
                  {isFirst || isLast ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                  ) : step.isInterchange ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h4m0 0v4m0-4l7 7m-1-7h4m0 0v4m0-4l-7 7" />
                      </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1">
                  <p className={`font-bold text-lg ${step.isInterchange ? 'text-cyan-300' : 'text-white'}`}>{step.stationName}</p>
                  {step.isInterchange && !isLast && (
                    <p className="text-xs text-yellow-400">Change to {routeResult.route[index + 1]?.line}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RouteDisplay;