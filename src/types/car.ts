import { ApartmentData } from "./apartment";

export interface CarData {
    id: number;
    apartment: ApartmentData;
    vehicleNumber: string;
    phone: string;
    purpose: string;
    startDate: string;
    endDate: string;
    type: string;
}

export interface AllCarParams {
    page: number;
    size: number;
    type: string;
    number?: string;
}