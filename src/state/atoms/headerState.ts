import { atom } from "recoil";

interface HeaderData {
    apartmentId: number;
    apartmentName: string;
    expireDate: string;
    priceType: string;
  }

export const headerState = atom<HeaderData>({
    key: "headerState",
    default: {
      apartmentId: 0,
      apartmentName: '',
      expireDate: '',
      priceType: ''
    }
})