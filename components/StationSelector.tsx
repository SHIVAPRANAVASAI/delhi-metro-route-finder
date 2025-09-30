
import React from 'react';

interface StationSelectorProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  stations: string[];
  disabled: boolean;
}

const StationSelector: React.FC<StationSelectorProps> = ({ label, value, onChange, stations, disabled }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={label} className="text-sm font-medium text-gray-300">{label}</label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 disabled:opacity-50"
      >
        <option value="" disabled>Select a station</option>
        {stations.map((station) => (
          <option key={station} value={station}>{station}</option>
        ))}
      </select>
    </div>
  );
};

export default StationSelector;
