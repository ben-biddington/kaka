import { Estimate } from "./estimate";

export type BusStopIdentifier = {
  id: string;
  name: string;
}

export type Departure = {
  stopId: string;
  serviceId: string;
  origin: BusStopIdentifier;
  destination: BusStopIdentifier;
  status?: string;
  arrivalTime?: Estimate;
  departureTime: Estimate;
  vehicleId: string;
}