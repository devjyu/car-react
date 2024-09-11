import { atom } from "recoil";

export const pageNumberState = atom<number>({
    key: "pageNumberState",
    default: 0
})