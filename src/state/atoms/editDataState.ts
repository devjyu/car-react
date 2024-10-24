import { atom } from "recoil";
import { ValueType } from "../../common/Enum/valueType";

export interface EditData {
    key: string,
    label: string,
    value: any,
    editable: boolean,
    visable: boolean,
    selectGroupValues?: { label: string, value: any }[];
    valueType: ValueType
  }

export const editDataState = atom<EditData[]>({
    key: "editDataState",
    default: []
})