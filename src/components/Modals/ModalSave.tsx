import React, { useState, useEffect, useRef } from 'react';
import { ValueType } from '../../common/Enum/valueType';
import SelectGroup from '../Forms/SelectGroup/SelectGroup';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import AddressInput from '../Address/AddressInput';
import { useRecoilValue } from 'recoil';
import { headerState } from '../../state/atoms/headerState';


interface SaveData {
  key: string,
  label: string,
  value: any,
  visable: boolean,
  selectGroupValues?: any,
  valueType: ValueType,
  optional: boolean
}

const ModalSave: React.FC = () => {
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveData, setSaveData] = useState<SaveData[]>([]);
  const headerData = useRecoilValue(headerState);

  const location = useLocation();
  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  // close on click outside
  // useEffect(() => {
  //   const clickHandler = ({ target }: MouseEvent) => {
  //     if (!modal.current) return;
  //     if (
  //       !modalOpen ||
  //       modal.current.contains(target) ||
  //       trigger.current.contains(target)
  //     )
  //       return;
  //     closeModal();
  //   };
  //   document.addEventListener('click', clickHandler);
  //   return () => document.removeEventListener('click', clickHandler);
  // });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      closeModal();
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    initSaveData();
  }, []);

  const initSaveData = () => {
    const pathname = location.pathname;
    const initialData: SaveData[] = [];
    switch (pathname) {
      case '/admin/apartment':
        initialData.push({ key: 'name', label: '이름', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'region1DepthName', label: '고객사 지역명 1', value: '', valueType: ValueType.Text, visable: false, optional: false });
        initialData.push({ key: 'region2DepthName', label: '고객사 지역명 2', value: '', valueType: ValueType.Text, visable: false, optional: false });
        initialData.push({ key: 'region3DepthName', label: '고객사 지역명 3', value: '', valueType: ValueType.Text, visable: false, optional: false });
        initialData.push({ key: 'roadName', label: '도로명', value: '', valueType: ValueType.Text, visable: false, optional: false });
        initialData.push({ key: 'address', label: '주소', value: '', valueType: ValueType.Address, visable: true, optional: false });
        initialData.push({ key: 'zoneNo', label: '우편번호', value: '', valueType: ValueType.Text, visable: false, optional: false });
        initialData.push({
          key: 'limitType', label: '제한 타입', value: 'COUNT', valueType: ValueType.SelectGroup, visable: true, optional: false, selectGroupValues: [
            {
              label: "횟수",
              value: "COUNT"
            },
            {
              label: "시간",
              value: "TIME"
            },
            {
              label: "없음",
              value: "NONE"
            }
          ]
        });
        initialData.push({ key: 'limitTime', label: '제한 시간(분 단위)', value: '', valueType: ValueType.Number, visable: true, optional: false });
        initialData.push({ key: 'limitCount', label: '제한 횟수', value: '', valueType: ValueType.Number, visable: true, optional: false });
        initialData.push({ key: 'networkCheckSecond', label: '네트워크 체크 시간(초 단위)', value: '', valueType: ValueType.Number, visable: true, optional: false });
        initialData.push({ key: 'qna', label: 'QnA 사용 여부', value: '', valueType: ValueType.Boolean, visable: true, optional: false });
        initialData.push({ key: 'faq', label: 'FAQ 사용 여부', value: '', valueType: ValueType.Boolean, visable: true, optional: false });
        break;
      case '/apartment/unit':
        initialData.push({ key: 'dong', label: '동', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'ho', label: '호', value: '', valueType: ValueType.Text, visable: true, optional: false });
        break;
      case '/device':
        initialData.push({ key: 'apartmentId', label: '아파트ID', value: '', valueType: ValueType.Number, visable: false, optional: false });
        initialData.push({ key: 'apartmentName', label: '아파트명', value: '', valueType: ValueType.Apartment, visable: true, optional: false });
        initialData.push({ key: 'serialNumber', label: '시리얼 번호', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'macAddress', label: 'MAC 주소', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'modelName', label: '모델명', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'internalIp', label: '내부 IP', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'internalPort', label: '내부 포트', value: '', valueType: ValueType.Number, visable: true, optional: false });
        initialData.push({ key: 'externalIp', label: '외부 IP', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'externalPort', label: '외부 포트', value: '', valueType: ValueType.Number, visable: true, optional: false });
        initialData.push({
          key: 'inOutType', label: '카메라 타입', value: '', valueType: ValueType.SelectGroup, visable: true, optional: false, selectGroupValues: [
            {
              label: "입차",
              value: "IN"
            },
            {
              label: "출차",
              value: "OUT"
            },
            {
              label: "입출차",
              value: "BOTH"
            }
          ]
        });
        initialData.push({ key: 'adminId', label: '어드민 ID', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'adminPassword', label: '어드민 PW', value: '', valueType: ValueType.Text, visable: true, optional: false });
        break;
      case '/car':
        initialData.push({ key: 'apartmentId', label: '아파트ID', value: headerData.apartmentId, valueType: ValueType.Number, visable: false, optional: true });
        initialData.push({ key: 'apartmentName', label: '아파트명', value: headerData.apartmentName, valueType: ValueType.Apartment, visable: false, optional: true });
        initialData.push({ key: 'number', label: '차량번호', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'phone', label: '전화번호', value: '', valueType: ValueType.Text, visable: true, optional: true });
        initialData.push({ key: 'purpose', label: '메모', value: '', valueType: ValueType.Text, visable: true, optional: true });
        initialData.push({ key: 'startDate', label: '시작일자', value: '', valueType: ValueType.Date, visable: true, optional: false });
        initialData.push({ key: 'endDate', label: '종료일자', value: '', valueType: ValueType.Date, visable: true, optional: false });
        initialData.push({
          key: 'type', label: '허용여부', value: 'ALLOW', valueType: ValueType.SelectGroup, visable: true, optional: false, selectGroupValues: [
            {
              label: "허용",
              value: "ALLOW"
            },
            {
              label: "금지",
              value: "DENY"
            }
          ]
        });
        break;
      case '/notice':
        initialData.push({ key: 'title', label: '제목', value: '', valueType: ValueType.Text, visable: true, optional: false });
        initialData.push({ key: 'content', label: '내용', value: '', valueType: ValueType.Content, visable: true, optional: false });
        initialData.push({ key: 'startDate', label: '시작일자', value: '', valueType: ValueType.Date, visable: true, optional: true });
        initialData.push({ key: 'endDate', label: '종료일자', value: '', valueType: ValueType.Date, visable: true, optional: true });
        initialData.push({ key: 'files', label: '첨부파일', value: null, valueType: ValueType.Files, visable: true, optional: true });
        break;
      default:
        break;
    }
    setSaveData(initialData);
  };

  const handleChange = (index, value, type) => {
    const tempSaveEditData = [...saveData];
    let convertedValue;
    if (type === 'number') {
      convertedValue = parseInt(value);
    } else if (type === 'radio') {
      convertedValue = value === 'true' ? true : value === 'false' ? false : value;
    } else {
      convertedValue = value;
    }

    tempSaveEditData[index] = { ...tempSaveEditData[index], value: convertedValue };
    setSaveData(tempSaveEditData);
  };

  const closeModal = () => {
    // setIsSetInitialEditData(false);
    initSaveData();
    setModalOpen(false);
  };

  const saveHandler = async () => {
    const pathname = location.pathname;
    let willSaveData;
    let headers = {
      Authorization: cookies.accessToken
    };
    let saveUrl = import.meta.env.VITE_BASE_URL;
    
    switch (pathname) {
      case '/admin/apartment':
        saveUrl = saveUrl + import.meta.env.VITE_APARTMENT_ENDPOINT;
        willSaveData = {};
        saveData.forEach((data) => {
          willSaveData[data.key] = data.value;
        });
        break;
      case '/device':
        saveUrl = saveUrl + import.meta.env.VITE_DEVICE_ENDPOINT;
        willSaveData = {};
        saveData.forEach((data) => {
          willSaveData[data.key] = data.value;
        });
        break;
      case '/car':
        saveUrl = saveUrl + import.meta.env.VITE_CAR_ENDPOINT;
        willSaveData = {};
        saveData.forEach((data) => {
          if (!data.optional && !data.value) {
            alert(`${data.label}는/은 필수값입니다.`);
            return;
          }
          willSaveData[data.key] = data.value;
        });
        break;
      case '/notice':
        saveUrl = saveUrl + import.meta.env.VITE_NOTICE_ENDPOINT;
        const tempSaveData = {};
        willSaveData = {};
        const formData = new FormData();
        saveData.forEach((data) => {
          if (data.key === 'files' && data.value) {
            Array.from(data.value).forEach((el: any) => {
              formData.append('files', el);
            });
          } else if (data.key !== 'files') {
            tempSaveData[data.key] = data.value;
          }
        });
        formData.append('request', new Blob([JSON.stringify(tempSaveData)], { type: "application/json" }));
        willSaveData = formData;
        break;
      default:
        break;
    }
  
    try {
      const response = await axios.post(saveUrl, willSaveData, {
        headers: headers
      });
  
      if (response.status === 200) {
        // 저장이 성공적으로 완료되면 페이지 새로고침
        alert("성공");
        window.location.reload();
      } else {
        console.error('저장 실패:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch 에러:', error);
    } finally {
      closeModal();
    }
  };
  const handleDateChange = (index, value) => {
    const inputDate = value;
    const tempSaveEditData = [...saveData];
    const previousInputDate = tempSaveEditData[index].value;
    //  console.log(`{current: ${inputDate}, previous: ${previousInputDate}}`);

    let formattedDate = inputDate.replace(/\D/g, ''); // 숫자가 아닌 문자 제거
    // 연도에 대해 '-' 추가
    if (inputDate.length > previousInputDate.length) {
      if (formattedDate.length > 3) {
        formattedDate = formattedDate.slice(0, 4) + '-' + formattedDate.slice(4);
      }
      // 월에 대해 '-' 추가
      if (formattedDate.length > 6) {
        formattedDate = formattedDate.slice(0, 7) + '-' + formattedDate.slice(7);
      } if (formattedDate.length > 10) {
        return;
      }
    } else {
      formattedDate = value;
    }

    tempSaveEditData[index] = { ...tempSaveEditData[index], value: formattedDate };
    setSaveData(tempSaveEditData);
  };


  return (
    <div className='text-xs'>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="float-right mt-3 inline-flex items-center justify-center rounded-md bg-basicponint py-3 px-5 text-center font-medium text-basicWhite hover:bg-basicdarkponint"
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
          className="max-h-full overflow-auto w-100 rounded-sm border border-stroke bg-basicWhite shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          {/* <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black text-lg dark:text-white">
              상세
            </h3>
          </div> */}
          <form action="#">
            <div className="p-6.5">

              {saveData.map((data, index) => {
                return data.visable ? (
                  <div className="mb-5 grid grid-cols-3 flex items-center gap-4" key={index}>
                    <label className="block text-sm font-medium text-basicdark dark:text-white col-span-1">
                      {data.label} {data.optional ? null : (<span className="text-meta-1">*</span>)}
                    </label>
                    {data.valueType === ValueType.Text && (
                      <input
                        type="text"
                        placeholder=""
                        value={data.value}
                        onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-basicdark outline-none transition focus:border-basicponint active:border-pribasicponintmary disabled:cursor-default disabled:bg-deactivate dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                      />
                    )}
                    {data.valueType === ValueType.Content && (
                      <textarea
                        rows={6}
                        placeholder=""
                        onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-basicdark outline-none transition focus:border-basicponint active:border-basicponint disabled:cursor-default disabled:bg-deactivate dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                        defaultValue={data.value}
                      ></textarea>
                    )}
                    {data.valueType === ValueType.Number && (
                      <input
                        type="text"
                        placeholder="2024-01-01"
                        value={data.value ? data.value : ''}
                        onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-basicdark outline-none transition focus:border-basicponint active:border-basicponint disabled:cursor-default disabled:bg-deactivate dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                      />
                    )}
                    {data.valueType === ValueType.SelectGroup && (
                      <SelectGroup selectGroupValues={data.selectGroupValues} saveData={saveData} setSaveData={setSaveData} saveKey={data.key} />
                    )}
                    {data.valueType === ValueType.Date && (
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="2024-01-01"
                          value={data.value ? data.value : ''}
                          onChange={(e) => handleDateChange(index, e.target.value)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-basicdark outline-none transition focus:border-basicponint active:border-basicponint disabled:cursor-default disabled:bg-deactivate dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
                        />
                        {data.key === 'endDate' && location.pathname === '/notice' && (
                          <div className="text-xs font-medium mt-1.5 px-2 text-[#CD5D5D]">
                            * 미입력시 종료날짜는 무기한입니다.
                          </div>
                        )}
                      </div>
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
                    {data.valueType === ValueType.Address && (
                      <AddressInput saveData={saveData} addressData={data.value} setSaveData={setSaveData} />
                    )}
                    {/* {data.valueType === ValueType.Apartment && (
                      <ModalApartment saveData={saveData} setSaveData={setSaveData}/>
                    )} */}
                    {data.valueType === ValueType.Files && (
                      <input
                        type='file'
                        multiple={true}
                        onChange={(e) => { handleChange(index, e.target.files, e.target.type) }}
                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary col-span-2"
                      >
                      </input>
                    )}
                  </div>
                ) : null
              })}
              <div className="-mx-3 flex flex-wrap gap-y-4">
                <div className="2xsm:w-1/2 w-full px-3">
                  <div
                    onClick={() => closeModal()}
                    className="cursor-pointer block w-full rounded bg-deactivate p-3 text-center font-medium text-deactivatetxt transition hover:bg-basicdarkponint hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  >
                    취소
                  </div>
                </div>
                <div className="2xsm:w-1/2 w-full px-3">
                  <div
                    onClick={saveHandler}
                    className="cursor-pointer block w-full rounded bg-basicponint p-3 text-center font-medium text-white transition hover:bg-basicdarkponint"
                  >
                    저장
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalSave;
