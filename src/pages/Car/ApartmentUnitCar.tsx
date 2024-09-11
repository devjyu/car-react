import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Loader from '../../common/Loader/index.tsx';
import { Pageable } from '../../types/pageable.ts';
import AddUnitCarModal from './AddUnitCarModal.tsx';
import UnregonizedCarModal from './UnrecognizedCarModal.tsx';
import Refresh from '../../images/icon/refresh.png';
import SelectSaveCarTypeModal from './SelectSaveCarTypeModal.tsx';

interface CarUnit {
  totalCount: number;
  dongList: CarUnitDongSummary[];
}

interface CarUnitDongSummary {
  dong: string;
  count: number;
}

interface CarUnitDong {
  unitId: number;
  ho: string;
  vehicleNumber: Vehicle[];
  count: number;
}

interface Vehicle {
  id: number;
  vehicleNumber: string;
  addition: Addition[];
}

interface Addition {
  id: number;
  number: string;
}

interface AddUnitCar {
  unitId: number;
  vehicleNumber: string;
  phone: string;
}

interface AddUnregonizedCar {
  unitId: number;
  vehicleNumber: string;
}

const ApartmentUnitCar: React.FC = () => {
  const [inboxSidebarToggle, setInboxSidebarToggle] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dongLoading, setDongLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [carUnitData, setCarUnitData] = useState<CarUnit>();
  const [carUnitDongData, setCarUnitDongData] = useState<Pageable<CarUnitDong[]>>();
  const [currentDong, setCurrentDong] = useState();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleSelected, setIsVehicleSelected] = useState(false); // 차량번호가 선택되어 있는지 여부
  // const [vehicleId, setVehicleId] = useState<number | undefined>(undefined);
  // const [vehicleNumber, setVehicleNumber] = useState<string | undefined>(undefined);
  const [additionalVehicleNumbers, setAdditionalVehicleNumbers] = useState<Addition[]>([]); // 매핑 차량 리스트
  // const [additionalVehicleNumbers, setAdditionalVehicleNumbers] = useState<string[]>([]);
  const [searchOption, setSearchOption] = useState({ key: 'number', value: '' });
  const [searchData, setSearchData] = useState<any>();
  // const [selectedDiv, setSelectedDiv] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carUnitUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_UNIT_ENDPOINT;
  const carUnitDongUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_UNIT_DONG_ENDPOINT;
  const delUnitCarUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_REGISTER_DELETE_ENDPOINT;
  const searchUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_UNIT_VEHICLE_SEARCH_ENDPOINT;

  const getCarUnit = async () => {
    try {
      setLoading(true);
      const response = await axios.get(carUnitUrl, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      setCarUnitData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getCarUnitDongData = async (dong) => {
    try {
      setDongLoading(true);
      const response = await axios.get(carUnitDongUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          dong: dong
        }
      });
      setCarUnitDongData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDongLoading(false);
    }
  };

  console.log(carUnitDongData, "유닛동");

  const addUnitCarHandler = async (unitId, vehicleNumber, phone) => {
    // console.log(unitId);
    const addUnitCar: AddUnitCar = {
      unitId,
      vehicleNumber,
      phone
    };

    // console.log(addUnitCar);

    try {
      const response = await axios.post(carUnitDongUrl, addUnitCar, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      // console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      getCarUnitDongData(currentDong);
    }
  };

  const delUnitCarHandler = async ({ unitId, ho, vehicleNumber }) => {
    // console.log(`UnitId:${unitId} / ${currentDong}동 / ${ho}호 / ${vehicleNumber.vehicleNumber}`);

    // if (!selectedVehicle) {
    //   alert('삭제할 차량을 선택해주세요.');
    //   return;
    // }

    if (confirm(`${currentDong}동 ${ho}호 ${vehicleNumber.vehicleNumber}차량을 삭제하시겠습니까?`)) {
      try {
        await axios.put(delUnitCarUrl, {}, {
          headers: {
            Authorization: cookies.accessToken
          },
          params: {
            unitId,
            vehicleId: vehicleNumber.id
          }
        });
        alert('삭제 완료되었습니다.');
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        getCarUnitDongData(currentDong);
      }
    }
  };

  const addUnrecognizedCarHandler = async (unitId, vehicleNumber) => {
    // console.log(unitId);
    const AddUnregonizedCar: AddUnregonizedCar = {
      unitId,
      vehicleNumber,
    };

    // console.log(addUnitCar);

    try {
      const response = await axios.post(carUnitDongUrl, AddUnregonizedCar, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      // console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      getCarUnitDongData(currentDong);
    }
  };

  const dongClickHandle = (dong) => {
    setCurrentDong(dong);
    getCarUnitDongData(dong);
    // setSelectedDiv(true)
  };

  // const selectVehicleHandle = (vehicle: Vehicle) => {
  //   if (selectedVehicle && vehicle.id === selectedVehicle.id) {
  //     setSelectedVehicle(null);
  //     setIsVehicleSelected(false);
  //     setAdditionalVehicleNumbers(null);
  //     // setVehicleId(null);
  //     // setVehicleNumber(null);
  //   } else {
  //     setSelectedVehicle(vehicle);
  //     setIsVehicleSelected(true);
  //     setAdditionalVehicleNumbers(vehicle.addition ? vehicle.addition.map(addition => addition) : []);
  //     // setVehicleId(vehicle.id);
  //     // setVehicleNumber(vehicle.vehicleNumber);
  //   }
  // };

  const selectVehicleHandle = (vehicle: Vehicle) => {
    if (selectedVehicle && vehicle.id === selectedVehicle.id) {
      setSelectedVehicle(null);
      setAdditionalVehicleNumbers([]);
    } else {
      setSelectedVehicle(vehicle);
      setAdditionalVehicleNumbers(vehicle.addition || []);
    }
  };

  useEffect(() => {
    getCarUnit();
    if (selectedVehicle) {
      setAdditionalVehicleNumbers(selectedVehicle.addition || []);
    } else {
      setAdditionalVehicleNumbers([]);
    }
  }, [selectedVehicle]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      setDongLoading(true);
      const response = await axios.get(searchUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          number: searchOption.value
        }
      });
      setSearchData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchInit = () => {
    setSearchOption({ key: 'number', value: '' });
    setSearchData(null);
    setCarUnitDongData(null);
    getCarUnit();
  };

  const fillColorNumber = (vehicleNumber: string) => {
    const highlightNumber = searchOption.value;
    if (vehicleNumber.includes(highlightNumber)) {
      const parts = vehicleNumber.split(highlightNumber);
      const result = [];
      for (let i = 0; i < parts.length; i++) {
        // 검색단어가 아닌 부분은 그대로 추가
        result.push(parts[i]);
        if (i < parts.length - 1) {
          result.push(<span key={i} className='bg-yellow-400'>{highlightNumber}</span>);
        }
      }
      return result;
    } else {
      return vehicleNumber;
    }
  };

  const isIncludesDong = (dong): boolean => {
    return searchData.some(search => search.dong === dong);
  };

  const countVehicleWithSameDongInSearchData = (dong): number => {
    return searchData.reduce((count, search) => {
      return search.dong === dong ? count + 1 : count;
    }, 0);
  }

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setAdditionalVehicleNumbers(vehicle.addition);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="세대별 차량 목록" rootPage="차량" />
      {loading ? (<Loader />) : (
        <div className="sm:h-[calc(100vh-174px)] h-[calc(100vh-186px)] overflow-hidden">
          <div
            className="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark lg:flex">
            <div
              className={`lg:w-1/5 fixed bottom-0 top-22.5 z-999 flex w-[230px] -translate-x-[120%] flex-col rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark lg:static lg:translate-x-0 lg:border-none ${inboxSidebarToggle && '!translate-x-0 duration-300 ease-linear'
                }`}
            >
              <div className="no-scrollbar max-h-full overflow-auto py-6">
                {/* <ul className={`flex flex-col gap-2 ${selectedDiv ? 'bg-primary' : ''}`}> */}
                <ul className={`flex flex-col gap-2`}>
                  {/* <ul className="flex flex-col gap-2 "> */}
                  {carUnitData.dongList.map((dong, index) => {
                    return (
                      <li key={index}>
                        <div
                          onClick={() => { dongClickHandle(dong.dong) }}
                          className={`relative flex items-center gap-2.5 py-2.5 px-5 font-medium duration-300 ease-linear cursor-pointer before:absolute before:left-0 before:h-0 before:w-1 before:bg-primary before:duration-300 before:ease-linear hover:bg-primary/5 hover:text-primary hover:before:h-full
                            ${searchData ? isIncludesDong(dong.dong) ? '' : 'hidden' : ''}
                          `}
                        >
                          <div className='flex justify-between w-full gap-1.5'>
                            <div>{dong.dong}동</div>
                            <div className='text-sm'>{`${searchData ? countVehicleWithSameDongInSearchData(dong.dong) : dong.count}대`}</div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {/* <InboxMenuList /> */}
              </div>
              <div className='p-5 absolute bottom-0 flex justify-between w-full'>
                <div>전체 차량 대수</div>
                <div className='text-sm'>{`${searchData ? searchData.length : carUnitData.totalCount}대`}</div>
              </div>
            </div>
            <div className="lg:w-4/5 flex h-full flex-col border-l border-stroke dark:border-strokedark">
              {/* <!-- ====== Inbox List Start --> */}
              <div className="h-full relative">

                <div className='absolute right-5 top-3 flex gap-2 items-center'>
                  <img src={Refresh} className='h-fit cursor-pointer' onClick={() => { searchInit(); }} />
                  <div className="items-center w-60 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                    <input
                      type="text"
                      value={searchOption.value}
                      onChange={(e) => setSearchOption({ ...searchOption, value: e.target.value })}
                      className="w-full focus:outline-none"
                      placeholder="Search..."
                      onKeyDown={handleKeyPress}
                    />
                    <svg
                      className="fill-[#637381] hover:fill-primary cursor-pointer"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={handleSearch}
                      clipRule="evenodd"
                      fillRule="evenodd"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.9572 11.9572C12.2501 11.6643 12.7249 11.6643 13.0178 11.9572L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L11.9572 13.0178C11.6643 12.7249 11.6643 12.2501 11.9572 11.9572Z"
                        fill=""
                      />
                    </svg>
                  </div>
                </div>

                <table className="h-full w-full table-auto">
                  <thead>
                    <tr className="flex border-y border-stroke dark:border-strokedark">
                      <th className="w-[15%] py-6 pl-4 pr-4 lg:pl-10">
                        <p className="text-left font-medium">호수</p>
                      </th>
                      <th className="w-[85%] hidden py-6 px-4 xl:block">
                        <p className="text-left font-medium">차량번호</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="block h-full max-h-full overflow-auto py-4">
                    {!carUnitDongData || dongLoading ? null : carUnitDongData.content.map((vehicles, index) => {
                      return (
                        <tr className="flex cursor-pointer items-center hover:bg-whiten dark:hover:bg-boxdark-2" key={index}>
                          <td className="w-[15%] py-4 pl-4 pr-4 lg:pl-10">
                            <div className="flex items-center">
                              {vehicles.ho}
                            </div>
                          </td>
                          <td className="flex flex-row justify-between items-center w-[85%] hidden p-4 xl:flex">
                            <div className='flex gap-2'>
                              {vehicles.vehicleNumber ? vehicles.vehicleNumber.map((s, index) => {
                                return (
                                  <div className='flex align-center justify-center w-33' key={index}>
                                    {/* <button
                                      className={`w-full rounded-lg border border-[#d5d5d5] text-sm font-medium hover:opacity-80 dark:text-white py-1
                                  ${selectedVehicle && selectedVehicle.id === s.id && `bg-primary text-white`}
                                `}
                                      onClick={() => { selectVehicleHandle(s) }}
                                      key={index}
                                    >
                                      <p>
                                        {searchData ? fillColorNumber(s.vehicleNumber) : s.vehicleNumber}
                                      </p>

                                    </button> */}
                                    <button
                                      className={`flex items-center py-1.5 w-full rounded-lg border border-[#d5d5d5] text-sm font-medium hover:opacity-80 dark:text-white py-1 px-1`}
                                    // key={index}
                                    >
                                      <div className="flex-1 flex justify-center px-1"
                                        // onClick={(e) => {
                                        //   e.stopPropagation();
                                        //   openModal({ id: s.id, vehicleNumber: s.vehicleNumber });
                                        //   selectVehicleHandle(s);
                                        // }}
                                      >
                                        {searchData ? fillColorNumber(s.vehicleNumber) : s.vehicleNumber}
                                        {/* <span className='text-xs text-slate-400 pt-0.5 pl-1'>({s.addition.length})</span> */}
                                      </div>
                                      <svg
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        strokeLinejoin="round"
                                        strokeMiterlimit="2"
                                        viewBox="0 0 24 24"
                                        width="14"
                                        height="14"
                                        fill='rgb(138,138,138)'
                                        xmlns="http://www.w3.org/2000/svg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          delUnitCarHandler({ unitId: vehicles.unitId, ho: vehicles.ho, vehicleNumber: s });
                                        }}
                                      >
                                        <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
                                      </svg>
                                    </button>
                                  </div>
                                );
                              }) : <div className='flex align-center justify-start w-26'>없음</div>}
                              {/* {isVehicleSelected ?
                                <UnregonizedCarModal
                                  vehicleId={selectedVehicle?.id}
                                  vehicleNumber={selectedVehicle?.vehicleNumber}
                                  additionalVehicleNumbers={additionalVehicleNumbers}
                                />
                                : <AddUnitCarModal
                                  dong={currentDong}
                                  ho={vehicles.ho}
                                  addHandler={(vehicleNumber, phone) => { addUnitCarHandler(vehicles.unitId, vehicleNumber, phone) }}
                                />
                              } */}
                            </div>
                            <div className='mr-10'>
                              <AddUnitCarModal
                                dong={currentDong}
                                ho={vehicles.ho}
                                // vehicle={vehicles}
                                addHandler={(vehicleNumber, phone) => { addUnitCarHandler(vehicles.unitId, vehicleNumber, phone) }}
                              />
                              {/* <button
                                className='inline-flex rounded-lg border border-[#d5d5d5] py-1 px-6 text-sm font-medium hover:opacity-80 dark:text-white'
                                // onClick={() => { delUnitCarHandler(vehicles) }}
                              >
                                <span className='text-[#aaaaaa] font-bold'>삭제</span>
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {isModalOpen && selectedVehicle && (
                  <UnregonizedCarModal
                    vehicleId={selectedVehicle.id}
                    vehicleNumber={selectedVehicle.vehicleNumber}
                    additionalVehicleNumbers={additionalVehicleNumbers || []}
                    closeModal={closeModal}
                  />
                )}
              </div>
              {/* <div
              className="flex items-center justify-between border-t border-stroke p-4 dark:border-strokedark sm:px-6">
              <p className="text-base font-medium text-black dark:text-white md:text-lg">
                1-5 of 29
              </p>
              <div className="flex items-center justify-end space-x-3">
                <LeftArrow/>
                <RightArrow/>
              </div>
            </div> */}
              {/* // <!-- ====== Inbox List End --> */}
            </div>
          </div>
        </div>
      )}

    </DefaultLayout>
  );
};
export default ApartmentUnitCar;
