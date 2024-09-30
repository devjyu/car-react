interface LineData {
    title: number;
    entry: number;
    exit: number;
}

interface BarData {
    title: string;
    entry: number;
    exit: number;
}

export interface DashboardData {
    unitCount: number;
    vehicleCount: number;
    visitInCount: number;
    visitOutCount: number;
    apartmentVehicleCount: number;
    inCount: number;
    outCount: number;
    userCount: number;
    line: LineData[];
    bar: BarData[];
}