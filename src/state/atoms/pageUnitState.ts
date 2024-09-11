import { atom } from "recoil";

export const pageUnitState = atom<number>({
    key: "pageUnitState",
    default: 10
})