export interface RouteStep {
  stationName: string;
  line: string;
  isInterchange: boolean;
}

export interface RouteResult {
  totalStations: number;
  interchanges: number;
  route: RouteStep[];
}

export interface StationInfo {
  name: string;
  lines: string[];
  pointsOfInterest: string[];
}
