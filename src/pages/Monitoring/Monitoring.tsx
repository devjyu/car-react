import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRecoilState } from 'recoil';
import Refresh from '../../images/icon/refresh.png';
import { formatYMDHMS } from '../../js/dateFormat.ts';
import DefaultLayout from '../../layout/DefaultLayout';
import { cameraGateState } from '../../state/atoms/cameraGateState.ts';
import { CarLogInDetails, CarLogOutDetails, CarLogType, InOutType } from '../../types/carLog.ts';
import InOutCard from './InOutCard.tsx';

interface InMonitoring {
  dong: string;
  ho: string;
  id: number;
  inOutTime: string;
  inOutType: InOutType;
  type: CarLogType;
  vehicleNumber: string;
}

interface OutMonitoring {
  dong: string;
  ho: string;
  id: number;
  inOutTime: string;
  inOutType: InOutType;
  type: CarLogType;
  vehicleNumber: string;
}

interface InCamera {
  id: number;
}

interface OutCamera {
  id: number;
}

const Monitoring: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [subLoading, setSubLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [entryMonitoringList, setEntryMonitoringList] = useState<InMonitoring>();
  const [exitMonitoringList, setExitMonitoringList] = useState<OutMonitoring>();
  const [carLogInDetails, setCarLogInDetails] = useState<CarLogInDetails>();
  const [carLogOutDetails, setCarLogOutDetails] = useState<CarLogOutDetails>();
  // 카메라 id
  const [incameraId, setInCameraId] = useState<InCamera>()
  const [outcameraId, setOutCameraId] = useState<OutCamera>()

  const [refreshTime, setRefreshTime] = useState<string>(formatYMDHMS(new Date()));
  const [latestCarId, setLatestCarid] = useState<number>(0);
  const [loadingInDetails, setLoadingInDetails] = useState(false);
  const [loadingOutDetails, setLoadingOutDetails] = useState(false);


  // const monitoringUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_MONITORING_ENDPOINT;
  // const cameraInfoUrl = import.meta.env.VITE_BASE_URL + `/device/camera?page=0&size=1&name=`;
  // const newMonitoringUrl = import.meta.env.VITE_BASE_URL + `/record/camera/${cameraGateData.id}/latest`;
  // const newMonitoringUrl = `https://api.hmkpk.kr/record/camera/${cameraGateData.id}/latest`;
  // const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;
  // const carLogUrl = import.meta.env.VITE_BASE_URL + `record/`;s
  const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;
  const inUrl = `http://localhost:808/record/camera/2/latest`;
  const outUrl = `http://localhost:808/record/camera/1/latest`;


  // gate 정보만 가져오기

  const getCameraList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:808/device/camera?page=0&size=2&name=`, {
        headers: {
          Authorization: cookies.accessToken,
        },
        // params: {
        //   id: 0,
        //   gateStatus: ''
        // }
      });

      // const cameras = response.data.content;

      // console.log(cameras, 'Camera List');

      const outCamera = response.data.content[0];
      const inCamera = response.data.content[1];

      setOutCameraId(outCamera.id)
      setInCameraId(inCamera.id);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(outcameraId, '출차 카메라 id');
  // console.log(incameraId, '입차 카메라 id');

  const getEntryMonitoringList = async () => {
    // const aa = 1
    // console.log(`http://localhost:808/record/camera/${aa}/latest`, '입차 내역 주소');

    try {
      setLoading(true);
      const response = await axios.get(inUrl, {
        // const response = await axios.get(`http://localhost:808/record/camera/${incameraId}/latest`, {
        headers: {
          Authorization: cookies.accessToken
          // Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnc3N5MDAxIiwic2NvcGUiOiJNRU1CRVJfQVBBUlRNRU5UIiwiaXNzIjoibm9tYWRsYWIiLCJleHAiOjE3Mjc1Nzg3NDQsInR5cGUiOiJBQ0NFU1NfVE9LRU4ifQ.3XwrWUXh5nr_yNF_YI7LXTmwTjYdxPM8CV8mx1h5Nm8`, // 세 번째 인수로 headers 전달
        }
      });
      // console.log(response.data, "입차 데이터");

      setEntryMonitoringList(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshTime(formatYMDHMS(new Date()));
    }
  }

  const getExitMonitoringList = async () => {
    // console.log(`http://localhost:808/record/camera/${outcameraId}/latest`, '출차 내역 주소');

    try {
      setLoading(true);
      const response = await axios.get(outUrl, {
        // const res = await axios.get(`http://localhost:808/record/camera/${outcameraId}/latest`, {
        headers: {
          Authorization: cookies.accessToken
          // Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnc3N5MDAxIiwic2NvcGUiOiJNRU1CRVJfQVBBUlRNRU5UIiwiaXNzIjoibm9tYWRsYWIiLCJleHAiOjE3Mjc1Nzg3NDQsInR5cGUiOiJBQ0NFU1NfVE9LRU4ifQ.3XwrWUXh5nr_yNF_YI7LXTmwTjYdxPM8CV8mx1h5Nm8`, // 세 번째 인수로 headers 전달
        }
      });

      // console.log(response.data, "출차 데이터");

      setExitMonitoringList(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshTime(formatYMDHMS(new Date()));
    }
  }

  // 기존 입출차내역(5개)
  // const getMonitoringList = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(monitoringUrl, {
  //       headers: {
  //         Authorization: cookies.accessToken
  //       }
  //     });
  //     // console.log(response.data[0].inOutType, "데이터");

  //     setMonitoringList(response.data);

  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //     setRefreshTime(formatYMDHMS(new Date()));
  //   }
  // }

  useEffect(() => {
    getCameraList();
    getEntryMonitoringList();
    getExitMonitoringList();

    const intervalId = setInterval(() => {
      getEntryMonitoringList();
      getExitMonitoringList();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   if (entryMonitoringList && latestCarId != entryMonitoringList[0].id) {
  //     setLatestCarid(entryMonitoringList[0].id);
  //     getCarLogInDetails(entryMonitoringList[0].id);
  //   }

  //   if (exitMonitoringList && latestCarId != exitMonitoringList[0].id) {
  //     setLatestCarid(exitMonitoringList[0].id);
  //     getCarLogOutDetails(exitMonitoringList[0].id);
  //   }
  // }, [entryMonitoringList, exitMonitoringList]);

  useEffect(() => {
    if (entryMonitoringList && latestCarId !== entryMonitoringList[0].id && !loadingInDetails) {
      setLoadingInDetails(true); // 비동기 요청 시작
      setLatestCarid(entryMonitoringList[0].id);
      getCarLogInDetails(entryMonitoringList[0].id).finally(() => {
        setLoadingInDetails(false); // 비동기 요청 완료
      });
    }

    if (exitMonitoringList && latestCarId !== exitMonitoringList[0].id && !loadingOutDetails) {
      setLoadingOutDetails(true); // 비동기 요청 시작
      setLatestCarid(exitMonitoringList[0].id);
      getCarLogOutDetails(exitMonitoringList[0].id).finally(() => {
        setLoadingOutDetails(false); // 비동기 요청 완료
      });
    }
  }, [entryMonitoringList, exitMonitoringList, latestCarId]);

  const inCardClickHandle = (id) => {
    getCarLogInDetails(id);
  };

  const outCardClickHandle = (id) => {
    getCarLogOutDetails(id);
  };

  const getCarLogInDetails = async (id) => {
    console.log(id, '입차');

    try {
      setLoading(true);
      setCarLogOutDetails(null);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: {
          Authorization: cookies.accessToken,
        },
      });
      console.log('response.data.in :: ', response.data);
      setCarLogInDetails(response.data); // Set the fetched details
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const getCarLogOutDetails = async (id) => {
    console.log(id, '출차');
    try {
      setLoading(true);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      console.log('response.data.in :: ', response.data);
      setCarLogOutDetails(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }

  };

  // useEffect(() => {
  //   getEntryMonitoringList();
  //   getExitMonitoringList();
  //   getCameraList();
  //   const intervalId = setInterval(() => {
  //     getEntryMonitoringList();
  //     getExitMonitoringList();
  //   }, 5000);

  //   // 컴포넌트가 언마운트될 때 clearInterval로 인터벌을 정리
  //   return () => clearInterval(intervalId);
  // }, []);

  // useEffect(() => {
  //   if (entryMonitoringList && latestCarId != entryMonitoringList[0].id) {
  //     setLatestCarid(entryMonitoringList[0].id);
  //     getCarLogInDetails(entryMonitoringList[0].id);
  //   }
  //   if (exitMonitoringList && latestCarId != exitMonitoringList[0].id) {
  //     setLatestCarid(exitMonitoringList[0].id);
  //     getCarLogOutDetails(exitMonitoringList[0].id);
  //   }
  // }, [entryMonitoringList, exitMonitoringList]);


  // const getCarLogDetails = async (id) => {
  //   try {
  //     setSubLoading(true);
  //     // const response = await axios.get(carLogUrl, {
  //     const response = await axios.get(`http://localhost:808/record/${id}`, {
  //       headers: {
  //         Authorization: cookies.accessToken
  //         // Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnc3N5MDAxIiwic2NvcGUiOiJNRU1CRVJfQVBBUlRNRU5UIiwiaXNzIjoibm9tYWRsYWIiLCJleHAiOjE3Mjc1Nzg3NDQsInR5cGUiOiJBQ0NFU1NfVE9LRU4ifQ.3XwrWUXh5nr_yNF_YI7LXTmwTjYdxPM8CV8mx1h5Nm8`, // 세 번째 인수로 headers 전달

  //       }
  //     });
  //     setCarLogInDetails(response.data);
  //   } catch (error) {
  //     alert('오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setSubLoading(false);
  //   }
  // };

  return (
    <DefaultLayout>
      <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
        <div className='mx-auto max-w-screen-2xl p-5 mb-20'>
          {/* <div className='flex justify-end font-medium mb-3'>최근 입출차 내역</div> */}
          {/* <Breadcrumb pageName="모니터링" rootPage="모니터링" /> */}
          <div className="flex flex-col gap-5 2xl:gap-5">
            <div className='flex gap-5'>
              {/* <div className='rounded-lg bg-basicWhite shadow-md p-8 flex flex-col w-2/3 gap-5 h-fit'> */}
              {carLogInDetails ? (
                <div className='rounded-lg bg-basicWhite shadow-md p-5 flex flex-col w-1/2 gap-3 h-fit'>
                  <>
                    {/* {monitoringList.inOutType == "IN" ? ( */}
                    <div className='flex justify-between gap-7 items-center'>
                      {/* <div className='flex items-center justify-between gap-3'> */}
                      {/* <div className='flex flex-row gap-3 font-bold'> */}
                      <div className='flex items-center gap-1'>
                        <div className='text-3xl text-basicdark font-bold text-left'>입차</div>
                        <div>
                          <img
                            src={Refresh}
                            className='h-5 w-5 cursor-pointer hover:scale-105 transition-transform'
                            onClick={getEntryMonitoringList}
                            alt='Refresh'
                          />
                        </div>
                      </div>
                      <div className='text-basicponint text-3xl font-bold'><span className='mr-2 text-lg font-medium text-deactivatetxt'>({carLogInDetails.inOutTime})</span>{carLogInDetails.vehicleNumber}</div>
                      {/* <div className='text-2xl text-blue-600 font-bold text-left'>{convertTypeToString(carLogDetails.type)}</div> */}
                      {/* <div className='w-40 text-2xl'>{carLogDetails.vehicleNumber}</div> */}
                      {/* </div> */}
                      {/* <div className='flex flex-row gap-3'> */}
                      {/* <div className='text-2xl text-green-700'>입/출차 시각</div> */}
                      {/* <div className='text-md text-deactivatetxt'>{carLogDetails.inOutTime}</div> */}
                      {/* </div> */}
                      {/* </div> */}
                      {/* <div className='w-80'>
                      <img src={`data:image/jpg;base64,${carLogDetails.files[0].content}`} className='w-full h-20'></img>
                    </div> */}
                    </div>
                    <div>
                      {carLogInDetails.files.length > 0 && (
                        <img src={`data:image/jpg;base64,${carLogInDetails.files[1].content}`} className='w-full h-[414px]' alt="car log detail" />
                      )}
                    </div>
                  </>
                </div>
              ) : null}
              {carLogOutDetails ? (
                <div className='rounded-lg bg-basicWhite shadow-md p-5 flex flex-col w-1/2 gap-3 h-fit'>
                  <>
                    <div className='flex justify-between gap-7 items-center'>
                      {/* <div className='flex flex-col gap-3'> */}
                      {/* <div className='flex flex-row gap-3 font-bold'> */}
                      <div className='flex items-center gap-1'>
                        <div className='text-3xl text-basicdark font-bold text-left'>출차</div>
                        <div>
                          <img
                            src={Refresh}
                            className='h-5 w-5 cursor-pointer hover:scale-105 transition-transform'
                            onClick={getExitMonitoringList}
                            alt='Refresh'
                          />
                        </div>
                      </div>
                      <div className='text-basicponint text-3xl font-bold'><span className='mr-2 text-lg font-medium text-deactivatetxt'>({carLogOutDetails.inOutTime})</span>{carLogOutDetails.vehicleNumber}</div>
                      {/* <div className='text-2xl text-blue-600 font-bold text-left'>{convertTypeToString(carLogDetails.type)}</div> */}
                      {/* <div className='w-40 text-2xl'>{carLogDetails.vehicleNumber}</div> */}
                      {/* </div> */}
                      {/* <div className='flex flex-row gap-3'> */}
                      {/* <div className='text-2xl text-green-700'>입/출차 시각</div> */}
                      {/* <div className='text-md text-deactivatetxt'>{carLogDetails.inOutTime}</div> */}
                      {/* </div> */}
                      {/* </div> */}
                      {/* <div className='w-80'>
                      <img src={`data:image/jpg;base64,${carLogDetails.files[0].content}`} className='w-full h-20'></img>
                    </div> */}
                    </div>
                    <div>
                      {carLogOutDetails.files.length > 0 && (
                        <img src={`data:image/jpg;base64,${carLogOutDetails.files[1].content}`} className='w-full h-[414px]' alt="car log detail" />
                      )}
                    </div>
                  </>
                </div>
              ) : null}
              {/* <div className='rounded-sm border border-stroke bg-white shadow-default w-1/3 p-8 flex flex-col items-center gap-5 h-fit'> */}
              {/* <div className='flex justify-between w-full'>
                <div className='text-lg font-bold'>최근 입출차 내역</div>
                <div className='ml-auto flex gap-2'>
                  <div>{refreshTime}</div>
                  <img src={Refresh} className='h-fit cursor-pointer' onClick={() => { getMonitoringList() }} />
                </div>
              </div> */}
              {/* <InOutCard monitoringList={monitoringList} onClickHandle={inOutCardClickHandle} /> */}
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
              {/* </div> */}
            </div>
            <div className='flex gap-5'>
              <div className='rounded-lg bg-basicWhite shadow-md w-1/2 p-5 flex flex-col items-center gap-4 h-fit'>
                {entryMonitoringList ? (
                  <>
                    <div className='flex justify-start items-end w-full'>
                      <div className='text-lg font-bold text-basicdark'>최근 입차 내역</div>
                      <div className='ml-auto flex items-center gap-2'>
                        <div className='text-deactivatetxt text-sm'>{refreshTime}</div>
                        <img
                          src={Refresh}
                          className='h-4.5 w-4.5 cursor-pointer hover:scale-105 transition-transform'
                          onClick={getEntryMonitoringList}
                          alt='Refresh'
                        />
                      </div>
                    </div>
                    <InOutCard monitoringList={entryMonitoringList} onClickHandle={inCardClickHandle} />
                  </>
                ) : (<><div>최근 입차 내역이 없습니다.</div></>)}
              </div>

              <div className='rounded-lg bg-basicWhite shadow-md w-1/2 p-5 flex flex-col items-center gap-4 h-fit'>
                {exitMonitoringList ? (
                  <>
                    <div className='flex justify-between items-end w-full'>
                      <div className='text-lg font-bold text-basicdark'>최근 출차 내역</div>
                      <div className='ml-auto flex items-center gap-2'>
                        <div className='text-deactivatetxt text-sm'>{refreshTime}</div>
                        <img
                          src={Refresh}
                          className='h-4.5 w-4.5 cursor-pointer hover:scale-105 transition-transform'
                          onClick={getEntryMonitoringList}
                          alt='Refresh'
                        />
                      </div>
                    </div>
                    <InOutCard monitoringList={exitMonitoringList} onClickHandle={outCardClickHandle} />
                  </>
                ) : (<><div>최근 출차 내역이 없습니다.</div></>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Monitoring;