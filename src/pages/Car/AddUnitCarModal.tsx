import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface UnrecognizedCarProps {
  vehicleId: number;
  vehicleNumber: string;
  additionalVehicleNumbers: Addition[];
  closeModal: any;
}

interface Addition {
  id: number;
  number: string;
}

interface AddUnrecognizedCar {
  vehicleId: number;
  vehicleNumber: string;
}

const AddUnitCarModal = ({
  dong,
  ho,
  vehicle,
  addHandler,
  // addUnrecognizedHandler
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [unrecognizedVehicleNumber, setUnrecognizedVehicleNumber] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('차량 추가');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [cookies] = useCookies(['accessToken', 'refreshToken']);

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  // 미인식 차량 번호 api
  const unrecognizedCarAddUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_UNIT_UNRECOGNIZED_CAR_ADD_ENDPOINT;

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modal.current) return;
      if (
        !modalOpen ||
        modal.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      closeModal();
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      closeModal();
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const addUnitCar = () => {
    if (checkValid()) {
      if (confirm(`${dong}동 ${ho}호에 ${vehicleNumber}을 등록하시겠습니까?`)) {
        addHandler(vehicleNumber, phone);
      }
    }
  };

  const checkValid = () => {
    if (!vehicleNumber) {
      alert('차량번호를 입력해주세요.');
      return false;
    } else {
      return true;
    }
  };

  const addUnrecognizedCarHandler = async () => {
    if (checkValidUnrecognized()) {
      const unrecognizedCarData = {
        vehicleId: selectedVehicleId,
        vehicleNumber: unrecognizedVehicleNumber,
      };
      try {
        const response = await axios.post(unrecognizedCarAddUrl, unrecognizedCarData, {
          headers: {
            Authorization: cookies.accessToken
          }
        });
        if (response.status === 200) {
          alert('미인식 차량번호가 성공적으로 등록되었습니다.');
          closeModal();
          window.location.reload();
        }
      } catch (error) {
        alert('Error fetching data:' + error);
      }
    }
  };
  // const addUnrecognizedCarHandler = async () => {
  //   const AddUnrecognizedCar: AddUnrecognizedCar = {
  //     vehicleId: selectedVehicleId,
  //     vehicleNumber: unrecognizedVehicleNumber,
  //   };

  //   try {
  //     const response = await axios.post(unrecognizedCarAddUrl, AddUnrecognizedCar, {
  //       headers: {
  //         Authorization: cookies.accessToken
  //       }
  //     });
  //     if (response.status === 200) {
  //       setAdditionalVehicles(prevState => [...prevState, { id: response.data.id, number: unrecognizedVehicleNumber }]);
  //       alert('미인식 차량이 성공적으로 등록되었습니다.');
  //       setUnrecognizedVehicleNumber('');
  //     }
  //   } catch (error) {
  //     alert('Error fetching data:' + error);
  //   }
  // };

  const checkValidUnrecognized = () => {
    if (!selectedVehicleId) {
      alert('미인식 차량번호를 등록할 차량번호를 선택해주세요.');
      return false;
    }
    if (!unrecognizedVehicleNumber) {
      alert('미인식 차량번호를 입력해주세요.');
      return false;
    }
    return true;
  };

  const closeModal = () => {
    setVehicleNumber('');
    setUnrecognizedVehicleNumber('');
    setPhone('');
    setSelectedVehicleId('');
    setModalOpen(false);
  };

  return (
    <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="inline-flex rounded-lg py-1 px-6 text-sm font-semibold bg-basicponint text-basicWhite hover:bg-basicdarkponint dark:text-white"
      >
        추가
      </button>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${modalOpen ? 'block' : 'hidden'
          }`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          className="md:px-17.5 w-full max-w-142.5 rounded-lg bg-basicWhite px-8 py-12 text-center dark:bg-boxdark md:py-15"
        >
          <div className="mb-4 text-center mb-5">
            <p className="text-sm text-basicdark dark:text-gray-400">{dong}동 {ho}호</p>
            <h2 className="text-xl font-bold text-basicdark dark:text-white">차량 등록</h2>
          </div>
          <div className="grid grid-cols-2 mb-4">
            <button
              className={`px-4 py-2 ${activeTab === '차량 추가' ? 'bg-basicponint text-basicWhite' : 'border-b-2 border-basicponint text-basicponint hover:text-basicdarkponint'}`}
              onClick={() => setActiveTab('차량 추가')}
            >
              차량 추가
            </button>
            <button
              className={`px-4 py-2 ${activeTab === '미인식 차량 추가' ? 'bg-basicponint text-white' : 'border-b-2 border-basicponint text-basicponint hover:text-basicdarkponint'}`}
              onClick={() => setActiveTab('미인식 차량 추가')}
            >
              미인식 차량 추가
            </button>
          </div>
          <div className="text-left">
            {/* <div className='p-4'>
              <div className="w-full mb-5 grid grid-cols-3 flex items-center gap-4">
                <label className="block text-sm font-medium text-black dark:text-white col-span-1">
                  차량번호 <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={vehicleNumber}
                  onChange={(e) => { setVehicleNumber(e.target.value.replace(/(\s*)/g, "")) }}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                />
              </div>
              <div className="w-full mb-5 grid grid-cols-3 flex items-center gap-4">
                <label className="block text-sm font-medium text-black dark:text-white col-span-1">
                  전화번호
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/(\s*)/g, "")) }}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                />
              </div>
            </div> */}
            {activeTab === '차량 추가' ? (
              <>
                <div className='p-4'>
                  <div className="w-full mb-5 grid grid-cols-3 flex items-center gap-4">
                    <label className="block text-sm font-medium text-basicdark dark:text-white col-span-1">
                      차량번호 <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={vehicleNumber}
                      onChange={(e) => { setVehicleNumber(e.target.value.replace(/(\s*)/g, "")) }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-basicdark outline-none transition focus:border-basicponint active:border-basicponint disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                    />
                  </div>
                  <div className="w-full mb-5 grid grid-cols-3 flex items-center gap-4">
                    <label className="block text-sm font-medium text-basicdark dark:text-white col-span-1">
                      전화번호
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/(\s*)/g, "")) }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-basicdark outline-none transition focus:border-basicponint active:border-basicponint disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='p-4'>
                  <div className="w-full mb-5 grid grid-cols-3 flex items-center gap-4">
                    {vehicle.vehicleNumber.map((v) => (
                      <div key={v.id} className='col-span-1'>
                        <input
                          type="radio"
                          id={`unrecognized-${v.id}`}
                          name="unrecognizedVehicle"
                          value={v.id}
                          onChange={(e) => setSelectedVehicleId(e.target.value)}
                          // onChange={(e) => setUnrecognizedVehicleNumber(e.target.value)}
                          className="mr-2"
                        />
                        <label htmlFor={`unrecognized-${v.id}`} className="text-basicdark dark:text-white">
                          {v.vehicleNumber}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="w-full mb-5 grid grid-cols-3 flex items-center gap-4">
                    <label className="block text-sm font-medium text-black dark:text-white col-span-1">
                      미인식 차량번호 <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={unrecognizedVehicleNumber}
                      onChange={(e) => { setUnrecognizedVehicleNumber(e.target.value.replace(/(\s*)/g, "")) }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-basicdark outline-none transition focus:border-basicponint active:border-basicponint disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="2xsm:w-1/2 w-full px-3">
              {/* <button
                className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                onClick={addUnitCar}
              >
                등록
              </button> */}
              {activeTab === '차량 추가' ? (
                <button
                  className="block w-full rounded bg-basicponint p-3 text-center font-medium text-white transition hover:bg-basicdarkponint"
                  onClick={addUnitCar}
                >
                  등록
                </button>
              ) : (
                <button
                  className="block w-full rounded bg-basicponint p-3 text-center font-medium text-white transition hover:bg-basicdarkponint"
                  onClick={addUnrecognizedCarHandler}
                >
                  등록
                </button>)}
            </div>
            <div className="2xsm:w-1/2 w-full px-3">
              <button
                onClick={() => closeModal()}
                className="block w-full rounded bg-deactivate p-3 text-center font-medium text-deactivatetxt transition hover:bg-basicdarkponint hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUnitCarModal;
