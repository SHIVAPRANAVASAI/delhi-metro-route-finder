import React from 'react';
import { RouteResult, RouteStep } from '../types';
import { STATION_COORDINATES, METRO_LINES } from '../metroMapData';

interface MetroMapProps {
  routeResult: RouteResult | null;
  onStationSelect: (stationName: string) => void;
}

const interchangeStations = new Set<string>();
const stationLineCount: { [key:string]: number } = {};
METRO_LINES.forEach(line => {
    const allStationsOnLine = (line.subPaths || [line.path]).flat();
    const uniqueStations = new Set(allStationsOnLine);
    uniqueStations.forEach(station => {
        stationLineCount[station] = (stationLineCount[station] || 0) + 1;
    });
});
Object.entries(stationLineCount).forEach(([station, count]) => {
    if (count > 1) {
        interchangeStations.add(station);
    }
});


const MetroMap: React.FC<MetroMapProps> = ({ routeResult, onStationSelect }) => {
  const viewBox = "0 10 1100 1100";

  const getStationCoords = (stationName: string) => {
    return STATION_COORDINATES[stationName] || { x: 0, y: 0 };
  };

  return (
    <div className="bg-[#fdf3e6] rounded-xl p-4 shadow-inner border-4 border-double border-[#6b4c35] animate-fade-in">
       <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Times New Roman', serif" }}>DELHI METRO MAP</h2>
          <p className="text-sm text-gray-600" style={{ fontFamily: "'Times New Roman', serif" }}>Phase-I & II</p>
       </div>
      <svg viewBox={viewBox} className="w-full h-auto font-sans">
        {/* 1. All Metro Lines */}
        {METRO_LINES.map(line => {
           const paths = line.subPaths || [line.path];
           return paths.map((path, pIndex) => (
             <path
              key={`${line.name}-${pIndex}`}
              d={path.map((stationName, index) => {
                  const coords = getStationCoords(stationName);
                  return `${index === 0 ? 'M' : 'L'} ${coords.x} ${coords.y}`;
              }).join(' ')}
              fill="none"
              stroke={line.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
           ))
        })}
        
        {/* 2. All Station Markers (base style, clickable) */}
        {Object.entries(STATION_COORDINATES).map(([name, { x, y }]) => {
          const isInterchange = interchangeStations.has(name);
          let marker;
          if (isInterchange) {
            marker = (
              <>
                <circle cx={x} cy={y} r="7" fill="white" stroke="black" strokeWidth="1" />
                <circle cx={x} cy={y} r="5" fill="white" stroke="black" strokeWidth="1" />
              </>
            );
          } else {
            marker = <circle cx={x} cy={y} r="4" fill="white" stroke="black" strokeWidth="1" />;
          }
          return (
             <g key={`${name}-base`} onClick={() => onStationSelect(name)} className="cursor-pointer">
              {marker}
            </g>
          );
        })}
        
        {/* 3. Route-specific overlays (if route exists) */}
        {routeResult && (
          <>
            {/* 3a. Highlighted Path */}
            {routeResult.route.slice(0, -1).map((step, index) => {
              const nextStep = routeResult.route[index + 1];
              const startCoords = getStationCoords(step.stationName);
              const endCoords = getStationCoords(nextStep.stationName);

              const segmentLineName = nextStep.line;
              const lineData = METRO_LINES.find(line => {
                const colorNameMatch = line.name.match(/\(([^)]+)\)/);
                if (!colorNameMatch) return false;
                const colorName = colorNameMatch[1].toLowerCase();
                return segmentLineName.toLowerCase().startsWith(colorName);
              });
              
              const segmentColor = lineData ? lineData.color : '#888888';

              return (
                <path
                  key={`route-segment-${index}`}
                  d={`M ${startCoords.x} ${startCoords.y} L ${endCoords.x} ${endCoords.y}`}
                  fill="none"
                  stroke={segmentColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="route-path-animation"
                />
              );
            })}

            {/* 3b. Special Route Station Markers (drawn on top) */}
            {routeResult.route.map((station) => {
                const { x, y } = getStationCoords(station.stationName);
                const isStart = station.stationName === routeResult.route[0].stationName;
                const isEnd = station.stationName === routeResult.route[routeResult.route.length - 1].stationName;

                let marker;
                if (isStart || isEnd) {
                  marker = (
                    <g>
                      <circle cx={x} cy={y} r="12" fill={isStart ? '#4ade80' : '#f87171'} stroke="#000000" strokeWidth="2" />
                      <circle cx={x} cy={y} r="6" fill="white" />
                    </g>
                  );
                } else if (station.isInterchange) {
                   marker = (
                     <g>
                       <circle cx={x} cy={y} r="10" fill="white" stroke="#22d3ee" strokeWidth="3" />
                       <circle cx={x} cy={y} r="7" fill="white" stroke="#22d3ee" strokeWidth="3" />
                     </g>
                   );
                } else {
                    marker = <circle cx={x} cy={y} r="6" fill="#22d3ee" stroke="white" strokeWidth="2" />;
                }
                return <g key={`${station.stationName}-route-marker`} onClick={() => onStationSelect(station.stationName)} className="cursor-pointer">{marker}</g>
            })}

            {/* 3c. Route Station Labels */}
            {routeResult.route.map(station => {
              const { x, y } = getStationCoords(station.stationName);
              return (
                <text 
                  key={`${station.stationName}-label`}
                  x={x}
                  y={y-15}
                  fill="#2e1065"
                  fontSize="12"
                  textAnchor="middle"
                  className="font-bold"
                  style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '3px', strokeLinecap: 'butt', strokeLinejoin: 'miter' }}
                >
                  {station.stationName}
                </text>
              )
            })}
          </>
        )}
      </svg>
      <div className="mt-4 p-2 border border-black bg-white/50 text-sm text-black">
        <h4 className="font-bold text-center mb-2">LEGEND</h4>
        <div className="flex justify-between">
            <div className="space-y-1">
                {METRO_LINES.map(line => (
                    <div key={line.name} className="flex items-center gap-2">
                        <div className="w-10 h-1.5" style={{ backgroundColor: line.color }}></div>
                        <span>{line.name}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center space-y-2">
                 <div>
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-white border-2 border-black flex items-center justify-center">
                         <div className="w-3 h-3 rounded-full border border-black"></div>
                       </div>
                       <span>Interchange Stations</span>
                    </div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-white border-2 border-black"></div>
                       <span>Operational Network</span>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MetroMap;