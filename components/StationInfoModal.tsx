import React from 'react';
import { StationInfo } from '../types';

interface StationInfoModalProps {
  station: StationInfo;
  onClose: () => void;
}

const lineColors: { [key: string]: { bg: string; text: string } } = {
  'Red': { bg: 'bg-red-500', text: 'text-white' },
  'Yellow': { bg: 'bg-yellow-400', text: 'text-black' },
  'Blue': { bg: 'bg-blue-500', text: 'text-white' },
  'Green': { bg: 'bg-green-500', text: 'text-white' },
  'Violet': { bg: 'bg-violet-500', text: 'text-white' },
  'Orange': { bg: 'bg-orange-500', text: 'text-white' },
};
const defaultColor = { bg: 'bg-gray-500', text: 'text-white' };

const getLineColor = (lineName: string) => {
    const key = Object.keys(lineColors).find(colorKey => lineName.toLowerCase().includes(colorKey.toLowerCase()));
    return key ? lineColors[key] : defaultColor;
}

const StationInfoModal: React.FC<StationInfoModalProps> = ({ station, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="station-info-title"
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md text-white p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Close station details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="station-info-title" className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 pr-8">
          {station.name}
        </h2>

        <div className="mb-5">
          <h3 className="font-semibold text-lg text-gray-300 mb-2">Lines Served</h3>
          <div className="flex flex-wrap gap-2">
            {station.lines.length > 0 ? station.lines.map(line => {
                const color = getLineColor(line);
                return (
                    <span key={line} className={`px-3 py-1 text-sm font-bold rounded-full ${color.bg} ${color.text}`}>
                        {line}
                    </span>
                )
            }) : <p className="text-gray-400">No line information available.</p>}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-gray-300 mb-2">Points of Interest</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {station.pointsOfInterest.map(poi => (
              <li key={poi}>{poi}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StationInfoModal;
