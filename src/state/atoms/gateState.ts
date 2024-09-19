import { atom } from "recoil";

interface HeaderData {
    id: number;
    gateStatus: string;
  }

export const gateState = atom<HeaderData>({
    key: "gateState",
    default: {
      id: 0,
      gateStatus: ''
    }
})