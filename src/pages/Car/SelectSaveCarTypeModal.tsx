import React, { useState, useEffect, useRef } from 'react';
import AddUnitCarModal from './AddUnitCarModal';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const SelectSaveCarTypeModal = ({
    dong,
    ho,
    addHandler
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [cookies] = useCookies(['accessToken', 'refreshToken']);

    const trigger = useRef<any>(null);
    const modal = useRef<any>(null);

    const carUnitDongUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_UNIT_DONG_ENDPOINT;

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
        // console.log(vehicleNumber);
        if (!vehicleNumber) {
            alert('차량번호를 입력해주세요.');
            return false;
        } else {
            return true;
        }
    };

    const closeModal = () => {
        setVehicleNumber('');
        setPhone('');
        setModalOpen(false);
    };

    // const addUnitCarHandler = async (unitId, vehicleNumber, phone) => {
    //     // console.log(unitId);
    //     const addUnitCar: AddUnitCar = {
    //         unitId,
    //         vehicleNumber,
    //         phone
    //     };

    //     // console.log(addUnitCar);

    //     try {
    //         const response = await axios.post(carUnitDongUrl, addUnitCar, {
    //             headers: {
    //                 Authorization: cookies.accessToken
    //             }
    //         });
    //         // console.log(response);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     } finally {
    //         getCarUnitDongData(currentDong);
    //     }
    // };

    return (
        <div>
            <button
                ref={trigger}
                onClick={() => setModalOpen(!modalOpen)}
                className="inline-flex rounded-lg border border-[#d5d5d5] border-dashed py-1 px-6 text-sm font-medium hover:opacity-80 dark:text-white"
            >
                <span className='text-[#aaaaaa] font-bold'>추가</span>
            </button>
            <div
                className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${modalOpen ? 'block' : 'hidden'
                    }`}
            >
                <div
                    ref={modal}
                    onFocus={() => setModalOpen(true)}
                    className="md:px-17.5 w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:py-15"
                >
                    <div className="mb-4 text-center mb-5">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{dong}동 {ho}호</p>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">차량 등록 선택해주세요</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <div>
                            <button className="block w-full rounded bg-gray-200 p-3 text-center font-medium text-black transition hover:bg-primary hover:text-white">
                                차량 추가
                            </button>
                            {/* <AddUnitCarModal dong={dong} ho={ho} addHandler={(vehicleNumber, phone) => { addUnitCarHandler(vehicles.unitId, vehicleNumber, phone) }} /> */}
                        </div>
                        <div>
                            <button className="block w-full rounded bg-gray-200 p-3 text-center font-medium text-black transition hover:bg-primary hover:text-white">
                                미인식 차량 추가
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectSaveCarTypeModal;
