import { atom } from "recoil";
import { formatYMD } from "../../js/dateFormat";

const startDate: Date = new Date();
startDate.setDate(new Date().getDate() - 2);

export const startDateState = atom<string>({
    key: "startDateState",
    default: formatYMD(startDate)
})
