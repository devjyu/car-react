/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_DASHBOARD_ENDPOINT: string;
    readonly VITE_APARTMENT_ENDPOINT: string;
    readonly VITE_APARTMENT_UNIT_ENDPOINT: string;
    readonly VITE_APARTMENT_UNIT_VEHICLE_SEARCH_ENDPOINT: string;
    readonly VITE_UNIT_REGISTER_ENDPOINT: string;
    readonly VITE_UNIT_REGISTER_APPLY_ENDPOINT: string;
    readonly VITE_UNIT_REGISTER_DENY_ENDPOINT: string;
    readonly VITE_DEVICE_ENDPOINT: string;
    readonly VITE_CAR_LOG_ENDPOINT: string;
    readonly VITE_CAR_ENDPOINT: string;
    readonly VITE_CAR_UNIT_ENDPOINT: string;
    readonly VITE_CAR_UNIT_DONG_ENDPOINT: string;
    readonly VITE_APARTMENT_UNIT_ENDPOINT: string;
    readonly VITE_CAR_REGISTER_ENDPOINT: string;
    readonly VITE_CAR_REGISTER_APPLY_ENDPOINT: string;
    readonly VITE_CAR_REGISTER_DENY_ENDPOINT: string;
    readonly VITE_CAR_REGISTER_DELETE_ENDPOINT: string;
    readonly VITE_MEMBER_ENDPOINT: string;
    readonly VITE_NOTICE_ENDPOINT: string;
    readonly VITE_SIGNIN_ENDPOINT: string;
    readonly VITE_LOGIN_ENDPOINT: string;
    readonly VITE_MONITORING_ENDPOINT: string;
   
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }