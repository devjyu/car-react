import { CarLogType } from "../types/carLog";

export const convertTypeToString = (type: CarLogType) => {
  switch (type) {
    case CarLogType.ALL:
      return '전체';
    case CarLogType.MEMBER:
      return '세대';
    case CarLogType.UNREGISTER:
      return '미등록';
    case CarLogType.VISIT:
      return '방문';
    case CarLogType.UNKNOWN:
      return '미확인'
    default:
      return '';
  }
};