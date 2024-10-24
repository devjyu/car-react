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

  const [initialCarLogInDetails, setInitialCarLogInDetails] = useState<CarLogInDetails | null>(null);
  const [initialCarLogOutDetails, setInitialCarLogOutDetails] = useState<CarLogOutDetails | null>(null);

  const [refreshTime, setRefreshTime] = useState<string>(formatYMDHMS(new Date()));
  const [latestCarId, setLatestCarid] = useState<number>(0);
  const [loadingInDetails, setLoadingInDetails] = useState(false);
  const [loadingOutDetails, setLoadingOutDetails] = useState(false);
  const [manualInDetail, setManualInDetail] = useState(false);
  const [manualOutDetail, setManualOutDetail] = useState(false);
  const [selectedInLogId, setSelectedInLogId] = useState(null);
  const [selectedOutLogId, setSelectedOutLogId] = useState(null);


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
    try {
      setLoading(true);
      const response = await axios.get(inUrl, {
        headers: {
          Authorization: cookies.accessToken,
        },
      });
      // console.log(response.data, "입차 데이터");
      setEntryMonitoringList(response.data);

      // Only update the inDetail if the user has not manually clicked an entry
      if (!selectedInLogId) {
        const latestEntryId = response.data[0]?.id;
        if (latestEntryId) {
          getCarLogInDetails(latestEntryId); // Automatically fetch latest if no manual click
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshTime(formatYMDHMS(new Date()));
    }
  };

  const getExitMonitoringList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(outUrl, {
        headers: {
          Authorization: cookies.accessToken,
        },
      });
      // console.log(response.data, "출차 데이터");
      setExitMonitoringList(response.data);

      // Only update the outDetail if the user has not manually clicked an exit log
      if (!selectedOutLogId) {
        const latestExitId = response.data[0]?.id;
        if (latestExitId) {
          getCarLogOutDetails(latestExitId); // Automatically fetch the latest if no manual click
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshTime(formatYMDHMS(new Date()));
    }
  };
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
    const intervalId = setInterval(() => {
      if (!manualInDetail) {
        getEntryMonitoringList(); // Fetch 'in' data automatically
      }
      if (!manualOutDetail) {
        getExitMonitoringList(); // Fetch 'out' data automatically
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [manualInDetail, manualOutDetail]); // Depend on both states

  // useEffect(() => {
  //   if (entryMonitoringList && exitMonitoringList) {
  //     const latestEntryId = entryMonitoringList[0]?.id;
  //     const latestExitId = exitMonitoringList[0]?.id;

  //     if (latestEntryId && latestExitId && latestCarId !== latestEntryId && latestCarId !== latestExitId) {
  //       setLatestCarid(latestEntryId); // latestEntryId 또는 latestExitId로 설정
  //       getCarLogs(latestEntryId, latestExitId); // 두 개의 로그를 동시에 가져오는 함수 호출
  //     }
  //   }
  // }, [entryMonitoringList, exitMonitoringList]);

  // const getCarLogs = async (entryId: number, exitId: number) => {
  //   try {
  //     setLoading(true);
  //     const [entryResponse, exitResponse] = await Promise.all([
  //       axios.get(`${carLogUrl}/${entryId}`, {
  //         headers: { Authorization: cookies.accessToken },
  //       }),
  //       axios.get(`${carLogUrl}/${exitId}`, {
  //         headers: { Authorization: cookies.accessToken },
  //       }),
  //     ]);

  //     setCarLogInDetails(entryResponse.data); // Set the fetched entry details
  //     setCarLogOutDetails(exitResponse.data); // Set the fetched exit details
  //     // console.log('entryResponse.data :: ', entryResponse.data);
  //     // console.log('exitResponse.data :: ', exitResponse.data);
  //   } catch (error) {
  //     console.error('Error fetching car logs:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (entryMonitoringList) {
      const latestEntryId = entryMonitoringList[0]?.id;

      // Check if we have a new entry car ID and only update when it's different
      if (latestEntryId && latestCarId !== latestEntryId) {
        setLatestCarid(latestEntryId);
        getCarLogInDetails(latestEntryId); // Fetch entry data
      }

      // Immediately set the image when the entryMonitoringList is fetched
      getCarLogInDetails(latestEntryId);
    }

    if (exitMonitoringList) {
      const latestExitId = exitMonitoringList[0]?.id;

      // Check if we have a new exit car ID and only update when it's different
      if (latestExitId && latestCarId !== latestExitId) {
        setLatestCarid(latestExitId);
        getCarLogOutDetails(latestExitId); // Fetch exit data
      }
      getCarLogOutDetails(latestExitId);
    }
  }, [entryMonitoringList, exitMonitoringList]);

  // useEffect(() => {
  //   if (entryMonitoringList) {
  //     const latestEntryId = entryMonitoringList[0]?.id;

  //     if (latestEntryId && latestCarId !== latestEntryId) {
  //       setLatestCarid(latestEntryId);
  //       getCarLogInDetails(latestEntryId); // 입차 데이터 요청
  //     }
  //   }

  //   if (exitMonitoringList) {
  //     const latestExitId = exitMonitoringList[0]?.id;

  //     if (latestExitId && latestCarId !== latestExitId) {
  //       setLatestCarid(latestExitId);
  //       getCarLogOutDetails(latestExitId); // 출차 데이터 요청
  //     }
  //   }
  // }, [entryMonitoringList, exitMonitoringList]);

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

  // useEffect(() => {
  //   if (entryMonitoringList && latestCarId !== entryMonitoringList[0].id && !loadingInDetails) {
  //     setLoadingInDetails(true); // 비동기 요청 시작
  //     setLatestCarid(entryMonitoringList[0].id);
  //     getCarLogInDetails(entryMonitoringList[0].id).finally(() => {
  //       setLoadingInDetails(false); // 비동기 요청 완료
  //     });
  //   }

  //   if (exitMonitoringList && latestCarId !== exitMonitoringList[0].id && !loadingOutDetails) {
  //     setLoadingOutDetails(true); // 비동기 요청 시작
  //     setLatestCarid(exitMonitoringList[0].id);
  //     getCarLogOutDetails(exitMonitoringList[0].id).finally(() => {
  //       setLoadingOutDetails(false); // 비동기 요청 완료
  //     });
  //   }
  // }, [entryMonitoringList, exitMonitoringList, latestCarId]);
  const inCardClickHandle = (id) => {
    setSelectedInLogId(id); // Track the manually selected entry log
    getCarLogInDetails(id); // Fetch the clicked entry details
  };

  const outCardClickHandle = (id) => {
    setSelectedOutLogId(id); // Track the manually selected exit log
    getCarLogOutDetails(id); // Fetch the clicked exit details
  };

  // const inCardClickHandle = (entryId: number, exitId: number) => {
  //   getCarLogs(entryId, exitId);
  // };

  // const outCardClickHandle = (id: number) => {
  //   getCarLogs(id);
  // };

  // const getCarLogInDetails = async (id) => {
  //   console.log(id, '입차');

  //   try {
  //     setLoading(true);
  //     setCarLogOutDetails(null);
  //     const response = await axios.get(`${carLogUrl}/${id}`, {
  //       headers: {
  //         Authorization: cookies.accessToken,
  //       },
  //     });
  //     console.log('response.data.in :: ', response.data);
  //     setCarLogInDetails(response.data); // Set the fetched details
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const getCarLogOutDetails = async (id) => {
  //   console.log(id, '출차');
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(`${carLogUrl}/${id}`, {
  //       headers: {
  //         Authorization: cookies.accessToken
  //       }
  //     });
  //     console.log('response.data.out :: ', response.data);
  //     setCarLogOutDetails(response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }

  // };

  useEffect(() => {
    if (selectedInLogId) {
      const timeoutId = setTimeout(() => setSelectedInLogId(null), 30000); // Reset after 30 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [selectedInLogId]);

  useEffect(() => {
    if (selectedOutLogId) {
      const timeoutId = setTimeout(() => setSelectedOutLogId(null), 30000); // Reset after 30 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [selectedOutLogId]);

  // Option 2: Add a button to reset manually for 'out'
  const resetManualOutDetail = () => setManualOutDetail(false);

  const getCarLogInDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: { Authorization: cookies.accessToken },
      });
      // console.log('response.data.in :: ', response.data);

      if (!initialCarLogInDetails || response.data.id !== carLogInDetails?.id) {
        setCarLogInDetails(response.data); // Update if details differ
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCarLogOutDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: { Authorization: cookies.accessToken },
      });
      // console.log('response.data.out :: ', response.data);

      if (!initialCarLogOutDetails || response.data.id !== carLogOutDetails?.id) {
        setCarLogOutDetails(response.data); // Update if details differ
      }
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
        <div className='mx-auto max-w-screen-2xxl mb-20'>
          {/* <div className='flex justify-end font-medium mb-3'>최근 입출차 내역</div> */}
          {/* <Breadcrumb pageName="모니터링" rootPage="모니터링" /> */}
          <div className="flex flex-col gap-5 2xl:gap-5">
            <div className='flex gap-5'>
              {/* <div className='rounded-lg bg-basicWhite shadow-md p-8 flex flex-col w-2/3 gap-5 h-fit'> */}
              {carLogInDetails ? (
                <div className='rounded-lg bg-basicWhite shadow-md p-5 flex flex-col w-1/2 gap-3 h-fit'>
                  <div className='flex justify-between gap-7 items-center'>
                    <div className='text-3xl text-basicdark font-bold text-left'>입차</div>
                    <div className='text-basicponint text-3xl font-bold'>
                      <span className='mr-2 text-lg font-medium text-deactivatetxt'>({carLogInDetails.inOutTime})</span>
                      {carLogInDetails.vehicleNumber}
                    </div>
                  </div>
                  <div>
                    {carLogInDetails.files.length > 0 && (
                      <img src={`data:image/jpg;base64,${carLogInDetails.files[1].content}`} className='w-full h-fit' alt="car log detail" />
                    )}
                  </div>
                </div>
              ) : null}
              {carLogOutDetails ? (
                <div className='rounded-lg bg-basicWhite shadow-md p-5 flex flex-col w-1/2 gap-3 h-fit'>
                  <div className='flex justify-between gap-7 items-center'>
                    <div className='text-3xl text-basicdark font-bold text-left'>출차</div>
                    <div className='text-basicponint text-3xl font-bold'>
                      <span className='mr-2 text-lg font-medium text-deactivatetxt'>({carLogOutDetails.inOutTime})</span>
                      {carLogOutDetails.vehicleNumber}
                    </div>
                  </div>
                  {carLogOutDetails.files.length > 0 && (
                    <img src={`data:image/jpg;base64,${carLogOutDetails.files[1].content}`} className='w-full h-fit' alt="car log detail" />
                  )}
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
                      <div className='text-lg font-bold text-basicdark'>최근 입차 내역<span  className='text-deactivatetxt text-xs'>(최근 입차 차량 5초마다 새로고침 됩니다.)</span></div>
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
                    {/* <InOutCard monitoringList={entryMonitoringList} onClickHandle={inCardClickHandle} /> */}
                  </>
                ) : null}
              </div>

              <div className='rounded-lg bg-basicWhite shadow-md w-1/2 p-5 flex flex-col items-center gap-4 h-fit'>
                {exitMonitoringList ? (
                  <>
                    <div className='flex justify-between items-end w-full'>
                      <div className='text-lg font-bold text-basicdark'>최근 출차 내역<span  className='text-deactivatetxt text-xs'>(최근 출차 차량 5초마다 새로고침 됩니다.)</span></div>
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
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Monitoring;