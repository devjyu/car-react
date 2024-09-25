import { atom } from "recoil";

interface GateData {
    id: number;
    gateStatus: string;
  }

export const gateState = atom<GateData>({
    key: "gateState",
    default: {
      id: 0,
      gateStatus: ''
    }
})