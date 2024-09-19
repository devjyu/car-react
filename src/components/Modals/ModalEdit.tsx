import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { EditData, editDataState } from '../../state/atoms/editDataState';
import { ValueType } from '../../common/Enum/valueType';
import SelectGroup from '../Forms/SelectGroup/SelectGroup';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ModalEdit: React.FC = () => {
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [modalOpen, setModalOpen] = useState(false);
  const initialEditData: EditData[] = useRecoilValue(editDataState);
  const [editableEditData, setEditableEditData] = useState<EditData[]>([]);
  const [isSetInitialEditData, setIsSetInitialEditData] = useState(false);
  const location = useLocation();
  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  useEffect(() => {
    if (modalOpen && initialEditData.length > 0 && !isSetInitialEditData) {
      setEditableEditData([...initialEditData]);
      setIsSetInitialEditData(true);
    }
  }, [initialEditData, modalOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      closeModal();
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleChange = (index, value, type) => {
    const tempUpdatedEditData = [...editableEditData];

    let convertedValue;
    if (type === 'number') {
      convertedValue = parseInt(value);
    } else if (type === 'radio') {
      convertedValue = value === 'true' ? true : value === 'false' ? false : value;
    } else {
      convertedValue = value;
    }

    tempUpdatedEditData[index] = { ...tempUpdatedEditData[index], value: convertedValue };
    setEditableEditData(tempUpdatedEditData);
  };

  const closeModal = () => {
    setIsSetInitialEditData(false);
    setModalOpen(false);
  };

  const updateHandler = async () => {
    const pathname = location.pathname;
    let willUpdateData = {}; // Initialize willUpdateData here
    let headers = {
      Authorization: cookies.accessToken
    };
    let updateUrl = import.meta.env.VITE_BASE_URL;
    switch (pathname) {
      case '/admin/apartment':
        updateUrl = updateUrl + import.meta.env.VITE_APARTMENT_ENDPOINT;
        break;
      case '/apartment/unit':
        updateUrl = updateUrl + import.meta.env.VITE_APARTMENT_UNIT_ENDPOINT;
        break;
      case '/device':
        updateUrl = updateUrl + import.meta.env.VITE_DEVICE_ENDPOINT;
        break;
      case '/car':
        updateUrl = updateUrl + import.meta.env.VITE_CAR_ENDPOINT;
        // console.log(editableEditData, '뭐임?');
        
        editableEditData.forEach((data) => {
          if (['vehicleNumber', 'purpose', 'phone', 'startDate', 'endDate', 'type'].includes(data.key)) {
            // 시간이 없어서 임의로 급하게 넣은 것 => 보시면 제대로 수정바람
            // 데이터의 key는 vehicleNumber인데 postman에서 보면 통신을 할때 number로 보내야 함.
            if (data.key == 'vehicleNumber') {
              willUpdateData['number'] = data.value;
            } else {
              willUpdateData[data.key] = data.value;
            }
          }
        });
        break;
      case '/notice':
        updateUrl = updateUrl + import.meta.env.VITE_NOTICE_ENDPOINT;
        // Extract only the required fields
        editableEditData.forEach((data) => {
          if (['title', 'content'].includes(data.key)) {
            willUpdateData[data.key] = data.value;
          }
        });
        break;
      default:
        // Populate willUpdateData with all fields for other cases
        editableEditData.forEach((data) => {
          willUpdateData[data.key] = data.value;
        });
        break;
    }

    try {
      // console.log(willUpdateData, '전송할 데이터');
      const id = initialEditData.find(data => data.key === 'id').value;
      const response = await axios.put(`${updateUrl}/${id}`, willUpdateData, {
        headers: headers
      });
      if (response.status === 200) {
        // alert('성공');
        // 업데이트된 데이터를 상태에 반영
        const updatedData = response.data;
        setEditableEditData(prevState =>
          prevState.map(data => {
            if (data.key in updatedData) {
              return { ...data, value: updatedData[data.key] };
            }
            return data;
          })
        );
        window.location.reload();
      } else {
        // alert('실패');
        console.error('저장 실패:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch 에러:', error);
    } finally {
      closeModal();
    }
  };

  return (
    <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="text-primary"
      >
        Edit
      </button>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${modalOpen ? 'block' : 'hidden'}`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          className="max-h-full overflow-auto w-100 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <form action="#">
            <div className="p-6.5">
              {editableEditData.map((data, index) => {
                return data.visable ? (
                  <div className="mb-5 grid grid-cols-3 flex items-center gap-4" key={index}>
                    <label className="block text-sm font-medium text-black dark:text-white col-span-1">
                      {data.label}
                    </label>
                    {data.editable ? (
                      <>
                        {data.valueType === ValueType.Text && (
                          <input
                            type="text"
                            placeholder=""
                            value={data.value}
                            onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                          />
                        )}
                        {data.valueType === ValueType.Content && (
                          <textarea
                            rows={6}
                            placeholder=""
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                            value={data.value}
                            onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                          ></textarea>
                        )}
                        {data.valueType === ValueType.Number && (
                          <input
                            type="number"
                            placeholder=""
                            value={data.value ? data.value : 0}
                            onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                          />
                        )}
                        {data.valueType === ValueType.SelectGroup && (
                          <SelectGroup selectGroupValues={data.selectGroupValues} saveData={editableEditData} setSaveData={setEditableEditData} saveKey={data.key} />
                        )}
                        {data.valueType === ValueType.Boolean && (
                          <div>
                            <label className="inline-block mr-3">
                              <input
                                type="radio"
                                value="true"
                                checked={data.value === true}
                                onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                                className="mr-1"
                              />
                              예
                            </label>
                            <label className="inline-block">
                              <input
                                type="radio"
                                value="false"
                                checked={data.value === false}
                                onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                                className="mr-1"
                              />
                              아니오
                            </label>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-left col-span-2 px-5 py-3">{data.value}</span>
                    )}
                  </div>
                ) : null;
              })}
              <div className="-mx-3 flex flex-wrap gap-y-4">
                <div className="2xsm:w-1/2 w-full px-3">
                  <button
                    onClick={() => closeModal()}
                    className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  >
                    취소
                  </button>
                </div>
                <div className="2xsm:w-1/2 w-full px-3">
                  <button
                    onClick={updateHandler}
                    className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;
