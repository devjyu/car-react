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
import { useRecoilState } from 'recoil';
import { cameraGateState } from '../../state/atoms/cameraGateState.ts';
import { ApartmentGate, CameraGate } from '../../types/apartment.ts';
import { cameraEntryGateState } from '../../state/atoms/cameraEntryGateState.ts';
import { cameraExitGateState } from '../../state/atoms/cameraExitGateStatus.ts';


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
  const [entryMonitoringList, setEntryMonitoringList] = useState<Monitoring>();
  const [exitMonitoringList, setExitMonitoringList] = useState<Monitoring>();
  const [carLogDetails, setCarLogDetails] = useState<CarLogDetails>();
  const [refreshTime, setRefreshTime] = useState<string>(formatYMDHMS(new Date()));
  const [latestCarId, setLatestCarid] = useState<number>(0);
  const [cameraGateData, setCameraGateData] = useRecoilState(cameraGateState);
  const [cameraEntryData, setCameraEntryData] = useRecoilState(cameraEntryGateState);
  const [cameraExitData, setCameraExitData] = useRecoilState(cameraEntryGateState);


  const monitoringUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_MONITORING_ENDPOINT;
  const cameraInfoUrl = import.meta.env.VITE_BASE_URL + `/device/camera?page=0&size=1&name=`;
  const newMonitoringUrl = import.meta.env.VITE_BASE_URL + `/record/camera/${cameraGateData.id}/latest`;
  // const newMonitoringUrl = `https://api.hmkpk.kr/record/camera/${cameraGateData.id}/latest`;
  // const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;
  const carLogUrl = import.meta.env.VITE_BASE_URL + `record/`;

  // gate 정보만 가져오기
  const getCameraList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:808/device/camera?page=0&size=1&name=`, {
      // const response = await axios.get(cameraInfoUrl, {
        headers: {
          Authorization: cookies.accessToken, // 세 번째 인수로 headers 전달
          // Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnc3N5MDAxIiwic2NvcGUiOiJNRU1CRVJfQVBBUlRNRU5UIiwiaXNzIjoibm9tYWRsYWIiLCJleHAiOjE3Mjc1Nzg3NDQsInR5cGUiOiJBQ0NFU1NfVE9LRU4ifQ.3XwrWUXh5nr_yNF_YI7LXTmwTjYdxPM8CV8mx1h5Nm8`, // 세 번째 인수로 headers 전달
        },
        params: {
          id: 0,
          gateStatus: ''
        } as CameraGate,
      });

      console.log(response.data.content[0], '정보');
      console.log(response.data.content[0].gateStatus, '정보');
      console.log(response.data.content[0].id, '정보');

      const cameras = response.data.content;
      const entryCamera = cameras.find(camera => camera.id === 1);
      const exitCamera = cameras.find(camera => camera.id === 2);


      setCameraEntryData({
        id: entryCamera.id,
        gateStatus: entryCamera.gateStatus
      });
      setCameraExitData({
        id: exitCamera.id,
        gateStatus: exitCamera.gateStatus
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  console.log(cameraExitData.id, '출차 id 이거는?');
  console.log(cameraEntryData.id, '입차 id 이거는?');

  useEffect(() => {
    getEntryMonitoringList();
    getExitMonitoringList();
    if (cameraEntryData.id !== undefined || cameraExitData.id !== undefined ) {
      getEntryMonitoringList(); // Call getMonitoringList only when cameraGateData.id is set
      getExitMonitoringList();
    }
  }, [cameraEntryData, cameraExitData]);
  

  const getEntryMonitoringList = async () => {
    console.log(`https://api.hmkpk.kr/record/camera/${cameraEntryData.id}/latest`, '입차 내역 주소');
    // console.log(cameraGateData.id, '?');
    
    try {
      setLoading(true);
      // const response = await axios.get(newMonitoringUrl, {
      const response = await axios.get(`http://localhost:808/record/camera/${cameraEntryData.id}/latest`, {
        headers: {
          Authorization: cookies.accessToken
          // Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnc3N5MDAxIiwic2NvcGUiOiJNRU1CRVJfQVBBUlRNRU5UIiwiaXNzIjoibm9tYWRsYWIiLCJleHAiOjE3Mjc1Nzg3NDQsInR5cGUiOiJBQ0NFU1NfVE9LRU4ifQ.3XwrWUXh5nr_yNF_YI7LXTmwTjYdxPM8CV8mx1h5Nm8`, // 세 번째 인수로 headers 전달
        }
      });
      console.log(response.data, "입차 데이터");

      setEntryMonitoringList(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshTime(formatYMDHMS(new Date()));
    }
  }

  
  const getExitMonitoringList = async () => {
    console.log(`https://api.hmkpk.kr/record/camera/${cameraExitData.id}/latest`, '출차 내역 주소');
    // console.log(cameraGateData.id, '?');
    
    try {
      setLoading(true);
      // const response = await axios.get(newMonitoringUrl, {
      const res = await axios.get(`http://localhost:808/record/camera/${cameraExitData.id}/latest`, {
        headers: {
          Authorization: cookies.accessToken
          // Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnc3N5MDAxIiwic2NvcGUiOiJNRU1CRVJfQVBBUlRNRU5UIiwiaXNzIjoibm9tYWRsYWIiLCJleHAiOjE3Mjc1Nzg3NDQsInR5cGUiOiJBQ0NFU1NfVE9LRU4ifQ.3XwrWUXh5nr_yNF_YI7LXTmwTjYdxPM8CV8mx1h5Nm8`, // 세 번째 인수로 headers 전달
        }
      });

      console.log(res.data, "출차 데이터");

      setExitMonitoringList(res.data);

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
    const intervalId = setInterval(() => {
      getEntryMonitoringList();
      getExitMonitoringList();
    }, 5000);

    // 컴포넌트가 언마운트될 때 clearInterval로 인터벌을 정리
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (entryMonitoringList && latestCarId != entryMonitoringList[0].id) {
      setLatestCarid(entryMonitoringList[0].id);
      getCarLogDetails(entryMonitoringList[0].id);
    }
    if (exitMonitoringList && latestCarId != exitMonitoringList[0].id) {
      setLatestCarid(entryMonitoringList[0].id);
      getCarLogDetails(exitMonitoringList[0].id);
    }
  }, [entryMonitoringList, exitMonitoringList]);

  const inOutCardClickHandle = (id) => {
    getCarLogDetails(id);
  };

  const getCarLogDetails = async (id) => {
    try {
      setSubLoading(true);
      // const response = await axios.get(carLogUrl, {
      const response = await axios.get(`http://localhost:808/record/${id}`, {
        headers: {
          Authorization: cookies.accessToken
          // Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnc3N5MDAxIiwic2NvcGUiOiJNRU1CRVJfQVBBUlRNRU5UIiwiaXNzIjoibm9tYWRsYWIiLCJleHAiOjE3Mjc1Nzg3NDQsInR5cGUiOiJBQ0NFU1NfVE9LRU4ifQ.3XwrWUXh5nr_yNF_YI7LXTmwTjYdxPM8CV8mx1h5Nm8`, // 세 번째 인수로 headers 전달

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
  const inType = 'IN';
  const outType = 'OUT';
  // console.log(carLogDetails, "사진");
  // console.log(monitoringList, "내역들");


  return (
    <DefaultLayout>
      <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
        <div className='mx-auto max-w-screen-2xl p-5 mb-20'>
          <div className='flex justify-end font-medium mb-3'>최근 입출차 내역</div>
          {/* <Breadcrumb pageName="모니터링" rootPage="모니터링" /> */}
          <div className="flex flex-col gap-5 2xl:gap-5">
            <div className='flex gap-5'>
              {/* <div className='rounded-lg bg-basicWhite shadow-md p-8 flex flex-col w-2/3 gap-5 h-fit'> */}
              <div className='rounded-lg bg-basicWhite shadow-md p-5 flex flex-col w-1/2 gap-3 h-fit'>
                {carLogDetails ? (
                  <>
                    {/* {monitoringList.inOutType == "IN" ? ( */}
                    {carLogDetails.inOutType == "IN" ? (
                      <>
                        <div className='flex justify-between gap-7 items-center'>
                          {/* <div className='flex items-center justify-between gap-3'> */}
                          {/* <div className='flex flex-row gap-3 font-bold'> */}
                          <div className='flex items-center gap-1'>
                            <div className='text-2xl text-basicdark font-bold text-left'>입차</div>
                            <div>
                              <img
                                src={Refresh}
                                className='h-4.5 w-4.5 cursor-pointer hover:scale-105 transition-transform'
                                onClick={getEntryMonitoringList}
                                alt='Refresh'
                              />
                            </div>
                          </div>
                          <div className='text-basicponint text-2xl font-bold'><span className='mr-2 text-sm font-medium text-deactivatetxt'>({carLogDetails.inOutTime})</span>{carLogDetails.vehicleNumber}</div>
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
                          {carLogDetails.files.length > 1 && (
                            <img src={`data:image/jpg;base64,${carLogDetails.files[1].content}`} className='w-[900px] h-[300px]' alt="car log detail" />
                          )}
                        </div>
                      </>
                    ) : <><div>최근 입차 내역이 없습니다.</div></>}
                  </>
                ) : null}
              </div>
              <div className='rounded-lg bg-basicWhite shadow-md p-5 flex flex-col w-1/2 gap-5 h-fit'>
                {carLogDetails ? (
                  <>
                    {carLogDetails.inOutType == "OUT" ? (
                      <>
                        <div className='flex justify-between gap-7 items-center'>
                          <div className='flex flex-col gap-3'>
                            {/* <div className='flex flex-row gap-3 font-bold'> */}
                            <div className='flex items-center gap-1'>
                            <div className='text-2xl text-basicdark font-bold text-left'>출차</div>
                            <div>
                              <img
                                src={Refresh}
                                className='h-4.5 w-4.5 cursor-pointer hover:scale-105 transition-transform'
                                onClick={getExitMonitoringList}
                                alt='Refresh'
                              />
                            </div>
                          </div>
                            <div className='text-basicponint text-2xl font-bold'><span className='mr-2 text-sm font-medium text-deactivatetxt'>({carLogDetails.inOutTime})</span>{carLogDetails.vehicleNumber}</div>
                            {/* <div className='text-2xl text-blue-600 font-bold text-left'>{convertTypeToString(carLogDetails.type)}</div> */}
                            {/* <div className='w-40 text-2xl'>{carLogDetails.vehicleNumber}</div> */}
                            {/* </div> */}
                            {/* <div className='flex flex-row gap-3'> */}
                            {/* <div className='text-2xl text-green-700'>입/출차 시각</div> */}
                            {/* <div className='text-md text-deactivatetxt'>{carLogDetails.inOutTime}</div> */}
                            {/* </div> */}
                          </div>
                          {/* <div className='w-80'>
                      <img src={`data:image/jpg;base64,${carLogDetails.files[0].content}`} className='w-full h-20'></img>
                    </div> */}
                        </div>
                        <div>
                          {carLogDetails.files.length > 1 && (
                            <img src={`data:image/jpg;base64,${carLogDetails.files[1].content}`} className='w-[900px] h-[300px]' alt="car log detail" />
                          )}
                        </div>
                      </>
                    ) : <><div className='text-center'>최근 출차 내역이 없습니다.</div></>}
                  </>
                ) : null}
              </div>
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
                    {/* <div className='flex justify-between items-end w-full'> */}
                    {/* <div className='text-lg font-bold text-basicdark'>최근 입차 내역</div> */}
                    {/* <div className='ml-auto flex items-center gap-2'> */}
                    {/* <div className='text-deactivatetxt text-sm'>{refreshTime}</div> */}
                    {/* <img
                          src={Refresh}
                          className='h-4.5 w-4.5 cursor-pointer hover:scale-105 transition-transform'
                          onClick={getMonitoringList}
                          alt='Refresh'
                        /> */}
                    {/* </div> */}
                    {/* </div> */}
                    <InOutCard monitoringList={entryMonitoringList} onClickHandle={inOutCardClickHandle} />
                  </>
                ) : (<><div>최근 입차 내역이 없습니다.</div></>)}
              </div>

              <div className='rounded-lg bg-basicWhite shadow-md w-1/2 p-5 flex flex-col items-center gap-4 h-fit'>
                {exitMonitoringList ? (
                  <>
                    {/* <div className='flex justify-between items-end w-full'> */}
                    {/* <div className='text-lg font-bold text-basicdark'>최근 출차 내역</div> */}
                    {/* <div className='ml-auto flex items-center gap-2'>
                        <div className='text-deactivatetxt text-sm'>{refreshTime}</div>

                      </div> */}
                    {/* </div> */}
                    <InOutCard monitoringList={exitMonitoringList}  onClickHandle={inOutCardClickHandle} />
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