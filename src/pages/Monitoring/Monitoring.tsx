import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Refresh from '../../images/icon/refresh.png';
import InOutCard from './InOutCard.tsx';
import { CarLogDetails, CarLogType, InOutType } from '../../types/carLog.ts';
import { convertTypeToString } from '../../js/stringConvert.ts';
import { formatYMDHMS } from '../../js/dateFormat.ts';

interface Monitoring {
  dong: string;
  ho: string;
  id: number;
  inOutTime: string;
  inOutType: InOutType;
  type: CarLogType;
  vehicleNumber: string;
}

const Monitoring: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [subLoading, setSubLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [monitoringList, setMonitoringList] = useState<Monitoring>();
  const [carLogDetails, setCarLogDetails] = useState<CarLogDetails>();
  const [refreshTime, setRefreshTime] = useState<string>(formatYMDHMS(new Date()));
  const [latestCarId, setLatestCarid] = useState<number>(0);

  const monitoringUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_MONITORING_ENDPOINT;
  const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;

  const getMonitoringList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(monitoringUrl, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      setMonitoringList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshTime(formatYMDHMS(new Date()));
    }
  }

  useEffect(() => {
    getMonitoringList();
    const intervalId = setInterval(() => {
      getMonitoringList();
    }, 5000);

    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌을 정리
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (monitoringList && latestCarId != monitoringList[0].id) {
      setLatestCarid(monitoringList[0].id);
      getCarLogDetails(monitoringList[0].id);
    }
  }, [monitoringList]);

  const inOutCardClickHandle = (id) => {
    getCarLogDetails(id);
  };

  const getCarLogDetails = async (id) => {
    try {
      setSubLoading(true);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      setCarLogDetails(response.data);
    } catch (error) {
      alert('오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
      console.error('Error fetching data:', error);
    } finally {
      setSubLoading(false);
    }
  };

  // console.log(carLogDetails, "ddd");


  return (
    <DefaultLayout>
      <Breadcrumb pageName="모니터링" rootPage="모니터링" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <div className='flex gap-5 h-[75vh]'>
          <div className='rounded-sm border border-stroke bg-white shadow-default p-8 flex flex-col w-2/3 gap-5 h-fit'>
            {carLogDetails ? (
              <>
                <div className='flex justify-between gap-7 items-center'>
                  <div className='w-80'>
                    <img src={`data:image/jpg;base64,${carLogDetails.files[0].content}`} className='w-full h-20'></img>
                  </div>
                  <div className='flex flex-col gap-3'>
                    {/* <div className='flex flex-row gap-3 font-bold'> */}
                    <div className='text-2xl text-blue-600 font-bold text-right'>{convertTypeToString(carLogDetails.type)}</div>
                    {/* <div className='w-40 text-2xl'>{carLogDetails.vehicleNumber}</div> */}
                    {/* </div> */}
                    {/* <div className='flex flex-row gap-3'> */}
                    {/* <div className='text-2xl text-green-700'>입/출차 시각</div> */}
                    <div className='text-xl'>{carLogDetails.inOutTime}</div>
                    {/* </div> */}
                  </div>
                </div>
                <div>
                  {carLogDetails.files.length > 1 && (
                    <img src={`data:image/jpg;base64,${carLogDetails.files[1].content}`} className='w-full h-130' alt="car log detail" />
                  )}
                </div>
              </>
            ) : null}
          </div>
          <div className='rounded-sm border border-stroke bg-white shadow-default w-1/3 p-8 flex flex-col items-center gap-5 h-fit'>
            <div className='flex justify-between w-full'>
              <div className='text-lg font-bold'>최근 입출차 내역</div>
              <div className='ml-auto flex gap-2'>
                <div>{refreshTime}</div>
                <img src={Refresh} className='h-fit cursor-pointer' onClick={() => { getMonitoringList() }} />
              </div>
            </div>
            <InOutCard monitoringList={monitoringList} onClickHandle={inOutCardClickHandle} />
            {/* <div className='flex gap-2 items-center text-lg w-full cursor-pointer rounded-[10px] border-r-[5px] border-l-[5px] bg-white p-4 shadow-13 border-l-meta-3 border-r-white hover:bg-gray hover:border-r-gray'>
              <div className='text-green-600 w-2/12'>입차</div>
              <div className='w-4/12'>서울12가3456</div>
              <div className='text-stone-400 w-6/12'>2024-04-21 12:01:01</div>
            </div>
            <div className='flex gap-2 items-center text-lg w-full cursor-pointer rounded-[10px] border-r-[5px] border-l-[5px] bg-white p-4 shadow-13 border-r-red border-l-white hover:bg-gray hover:border-l-gray'>
              <div className='text-red w-2/12'>출차</div>
              <div className='w-4/12'>서울12가3456</div>
              <div className='text-stone-400 w-6/12'>2024-04-21 12:01:01</div>
            </div> */}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Monitoring;