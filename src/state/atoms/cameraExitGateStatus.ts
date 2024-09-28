import { atom } from "recoil";

interface CameraData {
    id: number;
    gateStatus: string;
  }

export const cameraExitGateState = atom<CameraData>({
    key: "gateState",
    default: {
      id: 0,
      gateStatus: ''
    }
})