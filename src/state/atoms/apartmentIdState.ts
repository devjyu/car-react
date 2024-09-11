import { atom } from "recoil";

export const apartmentIdState = atom<Number>({
    key: "apartmentIdState",
    default: 0
})