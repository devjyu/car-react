import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DataTable from '../../components/DataTables/DataTable.tsx';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import axios from 'axios';
import Loader from '../../common/Loader/index.tsx';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pageSizeState } from '../../state/atoms/pageSizeState.ts';
import { pageNumberState } from '../../state/atoms/pageNumberState.ts';
import ModalSave from '../../components/Modals/ModalSave.tsx';
import { Pageable } from '../../types/pageable.ts';
import VehicleRegisterTable from './VehicleRegisterTable.tsx';

interface VehicleRegister {
  id: number;
  userId: string;
  dong: string;
  ho: string;
  registerDate: string;
  registerYMD: string;
  numbers: string[];
  numberCount: number;
}

const VehicleRegister: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [vehicleData, setVehicleData] = useState<VehicleRegister[]>();
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);
  
  const vehicleRegisterUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_REGISTER_ENDPOINT;

  const getAllVehicleRegister = async () => {
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
      const vehicleDataWithoutDate: VehicleRegister[]  = response.data;
      const vehicleDataWithDate = vehicleDataWithoutDate.map((vehicle) => {
        const registerDate = new Date(vehicle.registerDate);
        vehicle.registerYMD = registerDate.getFullYear() + '-' + (registerDate.getMonth()+1) + '-' + registerDate.getDate();
        vehicle.numberCount = vehicle.numbers.length;
        return vehicle;
      });
      setVehicleData(vehicleDataWithDate);
      // console.log(vehicleData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllVehicleRegister();
  }, []);

  const vehicleRegisterColumns = [
    { Header: '동', accessor: 'unit.dong'},
    { Header: '호', accessor: 'unit.ho'},
    { Header: '차량번호', accessor: 'vehicle.vehicleNumber'},
    { Header: '휴대폰번호', accessor: 'vehicle.phone'},
    { Header: '기존 차량 대수', accessor: 'numberCount'}
    // { Header: '신청일', accessor: 'registerYMD'},
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="승인신청 목록" rootPage="차량" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {loading ? (
          <Loader />
        ) : (
          <VehicleRegisterTable tableData={vehicleData} column={vehicleRegisterColumns} completeHandler={getAllVehicleRegister}/>
        )}
      </div>
      {/* <ModalSave/> */}
    </DefaultLayout>
  );
};

export default VehicleRegister;
