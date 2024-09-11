import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import Loader from '../../../common/Loader';
import { CarLogDetails } from '../../../types/carLog';

const CarLogDetail = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [cookies] = useCookies(['accessToken', 'refreshToken']);
    const [carLogInDetails, setCarLogInDetails] = useState<CarLogDetails>();
    const [carLogOutDetails, setCarLogOutDetails] = useState<CarLogDetails>();

    const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;

    const getCarLogInDetails = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${carLogUrl}/${id}`, {
                headers: {
                    Authorization: cookies.accessToken
                }
            });
            setCarLogInDetails(response.data);
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
                headers: {
                    Authorization: cookies.accessToken
                }
            });
            setCarLogOutDetails(response.data);
            setCarLogInDetails(null)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    // console.log(carLogInDetails, '상세');

    return (
        <div className='basis-1/4 relative h-full'>
            <div className="fixed flex flex-col gap-5 md:gap-7 2xl:gap-3">
                <div className="border border-stroke rounded-md p-4 bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="text-lg font-semibold mb-2">입차 이미지</div>
                    <div className="flex flex-wrap gap-4">
                        {loading ? (
                            <Loader />
                        ) : carLogInDetails && carLogInDetails.files ? (
                            <>
                                <div className='flex w-full justify-between items-center'>
                                    <div>
                                        <img
                                            src={`data:image/jpg;base64,${carLogInDetails.files[0].content}`}
                                            alt={`입차 이미지 1`}
                                        />
                                    </div>
                                    <div className='text-right'>
                                        <div className='text-indigo-500 font-semibold text-lg'>차량구분</div>
                                        <div>
                                            {carLogInDetails.inOutTime}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img
                                        src={`data:image/jpg;base64,${carLogInDetails.files[1].content}`}
                                        alt={`입차 이미지 2`}
                                    />
                                </div>
                            </>
                            // carLogInDetails.files.map((file, index) => (
                            //   // <span className="w-1/2 md:w-1/3" key={index}>
                            //   <span className="" key={index}>
                            //     <img src={`data:image/jpg;base64,${file.content}`} alt={`입차 이미지 ${index}`} />
                            //   </span>
                            // ))
                        ) : null}
                    </div>
                </div>
                <div className="border border-stroke rounded-md p-4 bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="text-lg font-semibold mb-2">출차 이미지</div>
                    <div className="flex flex-wrap gap-4">
                        {loading ? (
                            <Loader />
                        ) : carLogOutDetails && carLogOutDetails.files ? (
                            <>
                                <div className='flex w-full justify-between items-center'>
                                    <div>
                                        <img
                                            src={`data:image/jpg;base64,${carLogOutDetails.files[0].content}`}
                                            alt={`출차 이미지 1`}
                                        />
                                    </div>
                                    <div className='text-right'>
                                        <div className='text-indigo-500 font-semibold text-lg'>차량구분</div>
                                        <div>
                                            {carLogOutDetails.inOutTime}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img
                                        src={`data:image/jpg;base64,${carLogOutDetails.files[1].content}`}
                                        alt={`출차 이미지 2`}
                                    />
                                </div>
                            </>
                            // carLogOutDetails.files.map((file, index) => (
                            //   <span className="" key={index}>
                            //     <img src={`data:image/jpg;base64,${file.content}`} alt={`출차 이미지 ${index}`} />
                            //   </span>
                            // ))
                        ) : (
                            null
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarLogDetail;