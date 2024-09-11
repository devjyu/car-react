import { atom } from "recoil";

export const selectedApartmentNameState = atom<string>({
    key: "selectedApartmentNameState",
    default: ""
})