import { atom } from "recoil";

interface CameraData {
    id: number;
    gateStatus: string;
  }

export const cameraGateState = atom<CameraData>({
    key: "gateState",
    default: {
      id: 0,
      gateStatus: ''
    }
})