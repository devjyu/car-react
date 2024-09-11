import React, { useState, useEffect, useRef } from 'react'
import ApartmentSearchDataTable from '../DataTables/ApartmentSearchDataTable';
import { AllApartmentParams, ApartmentData } from '../../types/apartment';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pageSizeState } from '../../state/atoms/pageSizeState';
import { pageNumberState } from '../../state/atoms/pageNumberState';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Loader from '../../common/Loader';
import { selectedApartmentNameState } from '../../state/atoms/selectedApartmentNameState';
import { apartmentIdState } from '../../state/atoms/apartmentIdState';

const ModalApartment= ({
  saveData,
  setSaveData
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [apartmentData, setApartmentData] = useState<ApartmentData[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<ApartmentData>();
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);
  const [selectedApartmentName, setSelectedApartmentName] = useRecoilState(selectedApartmentNameState);
  const [apartmentId, setApartmentId] = useRecoilState(apartmentIdState);
  const [modalOpen, setModalOpen] = useState(false);
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

  const setApartmentModal = () => {
    setModalOpen(!modalOpen);
    getAllApartment();
    
  };

  const setApartmentIdToSaveData = (apartmentId) => {
    const tempSaveData = saveData.map((data) => {
      switch (data.key) {
          case 'apartmentId':
              data.value = apartmentId;
              break;
          default:
              break;
      }
      return data;
   });
    setSaveData(tempSaveData);
  };

  const apartemntClickHandler = (apartmentId, apartmentName) => {
    setApartmentIdToSaveData(apartmentId);
    setSelectedApartmentName(apartmentName);
    setModalOpen(false);
  };

  const getAllApartment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_ENDPOINT, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize,
          name: "",
          address: ""
        } as AllApartmentParams,
      });
      setApartmentData(response.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const apartmentColumns = [
    { Header: '이름', accessor: 'name'},
    { Header: '주소', accessor: 'address'},
  ];

  return (
    <div>
      <input
        ref={trigger}
        readOnly={true}
        value={selectedApartmentName}
        onClick={setApartmentModal}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          modalOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          className="md:px-17.5 w-full max-w-142.5 rounded-lg bg-white px-8 py-12 dark:bg-boxdark md:py-15"
        >
          {loading ? (
            <Loader/>
          ) : (
            <ApartmentSearchDataTable tableData={apartmentData} column={apartmentColumns} apartemntClickHandler={apartemntClickHandler}/>
          )}
          <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="w-full px-3">
              <button
                onClick={() => setModalOpen(false)}
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalApartment
