import { atom } from "recoil";

export interface DetailsData {
    key: string,
    label: string,
    value: any,
    valueText: string,
    visable: boolean
  }

export const detailsDataState = atom<DetailsData[]>({
    key: "detailsDataState",
    default: [] 
})