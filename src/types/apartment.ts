export interface ApartmentData {
    id: number;
    name: string;
    region1DepthName: string;
    region2DepthName: string;
    region3DepthName: string;
    roadName: string;
    address: string;
    zoneNo: string;
    limitType: string;
    limitTime: number;
    limitCount: number;
    networkCheckSecond: number;
    officetel: boolean;
    villa: boolean;
    qna: boolean;
    notice: boolean;
    faq: boolean;
}

export interface AllApartmentParams {
    page: number;
    size: number;
    name: string;
    address: string;
}

export interface AllApartmentUnitParams {
    page: number;
    size: number;
    name: string;
    dong: string;
    ho: string;
}

export interface ApartmentUnitData {
    id: number;
    apartment: ApartmentData;
    dong: string;
    ho: string;
}

export interface ApartmentGate {
    id: number;
    gateStatus: string;
}