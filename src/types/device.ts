import { ApartmentData } from "./apartment";

export interface DeviceCameraData {
    id: number;
    apartment: ApartmentData;
    serialNumber: string;
    macAddress: string;
    modelName: string;
    internalIp: string;
    internalPort: number;
    externalIp: string;
    externalPort: number;
    inOutType: string;
    adminId: string;
    adminPassword: string;
}

export interface AllDeviceCameraParams {
    page: number;
    size: number;
    name: string;
    sort: string;
}