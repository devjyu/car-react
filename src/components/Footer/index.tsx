import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useCookies } from 'react-cookie';
import { gateState } from '../../state/atoms/gateState.ts';
import { ApartmentGate } from '../../types/apartment.ts';

const Footer = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [cookies] = useCookies(['accessToken', 'refreshToken']);
    const [gateData, setGateData] = useRecoilState(gateState);
    
    const apartmentUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_ENDPOINT;
    const gateUrl = `${import.meta.env.VITE_BASE_URL}/api/vi/apartment/${gateData.id}${import.meta.env.VITE_GATE_ENDPOINT}`;

    // 열기/닫기 상태에 따라 버튼 활성화 여부 결정
    const isClosed = gateData.gateStatus === 'CLOSE';

    const handleOpen = () => {
        if (gateData.id !== null) {
            updateGateStatus('OPEN'); // 열기 버튼 클릭 시 'OPEN' 상태로 업데이트
        }
    };

    const handleClose = () => {
        if (gateData.id !== null) {
            updateGateStatus('CLOSE'); // 닫기 버튼 클릭 시 'CLOSE' 상태로 업데이트
        }
    };

    // gate 정보만 가져오기
    const getGateStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.get(apartmentUrl, {
                headers: {
                    Authorization: cookies.accessToken
                },
                params: {
                    id: 0,
                    gateStatus: ''
                } as ApartmentGate,
            });


            setGateData({
                id: response.data.content[0].id,
                gateStatus: response.data.content[0].gateStatus
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getGateStatus();
    }, []);

    // 버튼 상태 업데이트
    const updateGateStatus = async (status) => {
        try {
            const response = await axios.put(
                gateUrl, // gateUrl은 이미 동적으로 생성됨
                { gateStatus: status }, // 두 번째 인수로 body에 gateStatus 포함
                {
                    headers: {
                        Authorization: cookies.accessToken, // 세 번째 인수로 headers 전달
                    },
                }
            );

            // 성공적으로 업데이트되면 Recoil 상태 갱신
            setGateData((prevData) => ({
                ...prevData,
                gateStatus: status, // 새로운 상태 반영
            }));
            alert(response.data);
            // console.log('Gate status updated:', response.data);
        } catch (error) {
            console.error('Error updating gate status:', error);
        }
    };

    return (
        <footer className="flex items-center bg-basicdark text-basicWhite px-2.5 py-4 mt-5 fixed bottom-0 w-full z-10">
            <div className="px-6 font-semibold text-m">차단기 수동 제어</div>
            <div className="flex space-x-4">
                <button
                    onClick={handleOpen}
                    className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-title-xsm shadow-md transition-all duration-300 ease-in-out ${isClosed
                        ? 'bg-deactivate text-deactivatetxt hover:bg-gateopenhover hover:text-white' // 'CLOSE' 상태일 때 회색으로 표시
                        : 'bg-gateopen text-white' // 'OPEN' 상태일 때 기본 'bg-primary'
                        }`}
                    disabled={!isClosed} // 'OPEN' 상태면 비활성화
                >
                    <img src="/open.png" alt="" className='w-8 mr-2'/>
                    OPEN
                </button>
                <button
                    onClick={handleClose}
                    className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 font-semibold text-title-xsm shadow-md transition-all duration-300 ease-in-out ${isClosed
                        ? 'bg-gateclose text-white hover:bg-red-600' // 'CLOSE' 상태면 기본 활성화
                        : 'bg-deactivate text-deactivatetxt hover:bg-gateclosehover hover:text-white' // 'OPEN' 상태면 비활성화
                        }`}
                    disabled={isClosed} // 'CLOSE' 상태면 비활성화
                >
                    <img src="/close.png" alt="" className='w-8 mr-2' />
                    CLOSE
                </button>
            </div>
        </footer>
    );
};

export default Footer;