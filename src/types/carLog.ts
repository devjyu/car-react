import { ApartmentData } from "./apartment";

export enum CarLogType {
  ALL = 'ALL',
  VISIT = 'VISIT',
  MEMBER = 'MEMBER',
  UNKNOWN = 'UNKNOWN',
  UNREGISTER = 'UNREGISTER'
}

export enum InOutType {
  IN = 'IN',
  OUT = 'OUT',
  BOTH = 'BOTH'
}

export interface CarLogInOut {
  id: number;
  apartment: ApartmentData;
  inOutTime: string;
  inOutType: InOutType;
  type: CarLogType;
  vehicleNumber: string;
}

export interface ICarLog {
  in: CarLogInOut;
  originVehicleNumber: string;
  out: CarLogInOut;
  type: CarLogType;
  typeText?: string;
}

export interface CarLogDetails extends CarLogInOut {
  files: any;
}