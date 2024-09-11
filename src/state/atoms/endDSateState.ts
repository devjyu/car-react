import { atom } from "recoil";
import { formatYMD } from "../../js/dateFormat";

export const endDateState = atom<string>({
    key: "endDateState",
    default: formatYMD(new Date())
})