import React, { useState, useCallback, useMemo } from 'react';
import { DELHI_METRO_STATIONS } from './constants';
import { RouteResult, StationInfo } from './types';
import { findShortestRoute } from './services/geminiService';
import { POINTS_OF_INTEREST } from './poiData';
import { METRO_LINES } from './metroMapData';
import StationSelector from './components/StationSelector';
import RouteDisplay from './components/RouteDisplay';
import Loader from './components/Loader';
import MetroMap from './components/MetroMap';
import StationInfoModal from './components/StationInfoModal';
import { TrainIcon } from './components/icons/TrainIcon';

const App: React.FC = () => {
  const [startStation, setStartStation] = useState<string>('');
  const [endStation, setEndStation] = useState<string>('');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<StationInfo | null>(null);

  const stationToLinesMap = useMemo(() => {
    const map: { [station: string]: string[] } = {};
    METRO_LINES.forEach(line => {
        const allStationsOnLine = (line.subPaths || [line.path]).flat();
        const uniqueStations = new Set(allStationsOnLine);
        uniqueStations.forEach(station => {
            if (!map[station]) {
                map[station] = [];
            }
            map[station].push(line.name);
        });
    });
    return map;
  }, []);

  const handleStationSelect = (stationName: string) => {
    const lines = stationToLinesMap[stationName] || [];
    const pointsOfInterest = POINTS_OF_INTEREST[stationName] || ['No notable points of interest listed.'];
    setSelectedStation({
        name: stationName,
        lines,
        pointsOfInterest,
    });
  };

  const handleFindRoute = useCallback(async () => {
    if (!startStation || !endStation) {
      setError('Please select both a start and an end station.');
      return;
    }
    if (startStation === endStation) {
      setError('Start and end stations cannot be the same.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRoute(null);

    try {
      const result = await findShortestRoute(startStation, endStation);
      setRoute(result);
    } catch (err) {
      console.error(err);
      setError('Failed to find a route. Please ensure the stations are connected and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [startStation, endStation]);

  const swapStations = () => {
    const temp = startStation;
    setStartStation(endStation);
    setEndStation(temp);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-2">
            <TrainIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Delhi Metro Route Finder
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Your lightning-fast guide to the shortest metro journey.</p>
        </header>

        <main>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
              <StationSelector
                label="Start Station"
                value={startStation}
                onChange={(e) => setStartStation(e.target.value)}
                stations={DELHI_METRO_STATIONS}
                disabled={isLoading}
              />
              <button
                onClick={swapStations}
                disabled={isLoading}
                className="p-2 bg-gray-700 rounded-full text-gray-300 hover:bg-cyan-500 hover:text-white transition-all duration-300 transform md:rotate-90 mx-auto"
                aria-label="Swap stations"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h4m0 0v4m0-4l-7 7m14-7h-4m0 0v4m0-4l7 7" />
                </svg>
              </button>
              <StationSelector
                label="End Station"
                value={endStation}
                onChange={(e) => setEndStation(e.target.value)}
                stations={DELHI_METRO_STATIONS}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleFindRoute}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span>Calculating...</span>
                </>
              ) : (
                'Find Shortest Route'
              )}
            </button>
          </div>

          <div className="mt-8">
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">{error}</div>}
            
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Loader />
              </div>
            )}

            {!isLoading && !error && (
              <div className="space-y-8">
                <MetroMap routeResult={route} onStationSelect={handleStationSelect} />
                {route && <RouteDisplay routeResult={route} />}
                {!route && (
                  <div className="text-center text-gray-500 pt-4">
                    <p>Select start and end stations to find a route, or click any station on the map to explore.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      {selectedStation && (
        <StationInfoModal 
          station={selectedStation} 
          onClose={() => setSelectedStation(null)} 
        />
      )}
    </div>
  );
};

export default App;
