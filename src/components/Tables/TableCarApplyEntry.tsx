import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ApartmentData } from '../../types/apartment';

interface VehicleRegister {
  unit: {
    aprtment: ApartmentData;
    dong: string;
    ho: string;
  },
  vehicle: {
    status: string;
    vehicleNumber: string;
    phone: string;
  }
  number: string[];
}

const TableCarApplyEntry = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [vehicleData, setVehicleData] = useState<VehicleRegister[]>([]);
  const navigate = useNavigate();
  const pageSize = 0;
  const pageNumber = 3;

  const vehicleRegisterUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_REGISTER_ENDPOINT;

  const getDashboardVelhicleRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.get(vehicleRegisterUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize
        }
      });
      // console.log(response.data);
      // const vehicleDataWithoutDate: VehicleRegister[]  = response.data;
      // const vehicleDataWithDate = vehicleDataWithoutDate.map((vehicle) => {
      //   const registerDate = new Date(vehicle.registerDate);
      //   vehicle.registerYMD = registerDate.getFullYear() + '-' + (registerDate.getMonth()+1) + '-' + registerDate.getDate();
      //   return vehicle;
      // });
      // setVehicleData(vehicleDataWithDate);
      // console.log(vehicleData);
      setVehicleData(response.data);
      // console.log(vehicleData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDashboardVelhicleRegister();
  }, []);
  
  return (
    <div className="text-sm rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 h-64 overflow-auto shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-sm font-semibold text-black dark:text-white">
        세대 차량 승인 대기 목록
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 items-center rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 text-center xl:p-2.5 ">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              동
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-2.5">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              호
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-2.5">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              차량번호
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-2.5">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              전화번호
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-2.5">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              신청일자
            </h5>
          </div>
        </div>

        {vehicleData.map((applyEntry, key) => (
          <div
            className={`grid grid-cols-5 sm:grid-cols-5 hover:bg-slate-200 cursor-pointer ${
              key === vehicleData.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
            onClick={() => {navigate('/car-register');}}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-2.5">
              <p className="text-black dark:text-white">
                {applyEntry.unit.dong}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-2.5">
              <p className="text-black dark:text-white">{applyEntry.unit.ho}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-2.5">
              <p className="text-black dark:text-white">{applyEntry.vehicle.vehicleNumber}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-2.5">
              <p className="text-black dark:text-white">{applyEntry.vehicle.phone}</p>
            </div>
            
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-2.5">
              <p className="text-black dark:text-white"></p>
            </div>

          </div>

        ))}
      </div>

    </div>
  );
};

export default TableCarApplyEntry;
