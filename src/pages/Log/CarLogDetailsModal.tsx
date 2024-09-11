import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { CarLogDetails } from '../../types/carLog';
import Loader from '../../common/Loader';

const CarLogDetailsModal = ({
  buttonText,
  id
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [carLogDetails, setCarLogDetails] = useState<CarLogDetails>();

  const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;
  const getCarLogDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      setCarLogDetails(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

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
      setModalOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    if (modalOpen) {
      getCarLogDetails(id);
    }
  }, [modalOpen]);

  return (
    <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="inline-flex rounded border border-[#3BA2B8] py-1 px-2 text-sm font-medium text-[#3BA2B8] hover:opacity-80 cursor-pointer"
      >
        {buttonText}
      </button>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          modalOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          className="w-100 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          {loading? <Loader /> : 
            (
              <div className="p-6.5">

                <div className="mb-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    차량번호
                  </label>
                  <span
                    className="pl-3"
                  >
                    {carLogDetails.vehicleNumber}
                  </span>
                </div>

                <div className="mb-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {buttonText}일자
                  </label>
                  <span
                    className="pl-3"
                  >
                    {carLogDetails.inOutTime}
                  </span>
                </div>

                <div className="mb-5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    사진
                  </label>
                  {carLogDetails.files ? carLogDetails.files.map((file, index) => {
                    return (
                      <span
                        className="pl-3"
                        key={index}
                      >
                        <img src={`data:image/jpg;base64,${file.content}`}></img>
                      </span>
                    );
                  }) : null}
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Close
                </button>
              </div>
              )
            }
        </div>
      </div>
    </div>
  );
};

export default CarLogDetailsModal;
