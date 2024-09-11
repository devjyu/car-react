import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { DetailsData, detailsDataState } from '../../state/atoms/detailsDataState';

const ModalDetails: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const detailsData: DetailsData[] = useRecoilValue(detailsDataState);

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

  return (
    <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="text-primary"
      >
        View
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
          {/* <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black text-lg dark:text-white">
              상세
            </h3>
          </div> */}
          <form action="#">
            <div className="p-6.5">

              {detailsData.map((data, index) => {
                // return data.visable ? (
                //   <div className="mb-5" key={index}>
                //     <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                //       {data.label}
                //     </label>
                //     <span
                //       className="pl-3"
                //     >{data.valueText}</span>
                //   </div>
                // ) : null
                return data.visable ? 
                  data.key === 'files' ? (
                    <div className='mb-5 grid grid-cols-3 flex items-center gap-4' key={index}>
                      <label className="block text-sm font-medium text-black dark:text-white col-span-1">첨부파일</label>
                      {data.value ? data.value.map((file, index) => {
                        return (
                          <span
                            className="w-full col-span-2 px-5 py-3"
                            key={index}
                          >
                            <img src={`data:image/jpg;base64,${file.content}`}></img>
                          </span>
                        );
                      }) : <span className="text-left col-span-2 px-5 py-3">첨부파일이 없습니다.</span>}
                    </div>
                  ) : (
                    <div className="mb-5 grid grid-cols-3 flex items-center gap-4" key={index}>
                      <label className="block text-sm font-medium text-black dark:text-white col-span-1">
                        {data.label}
                      </label>
                      <span
                        className="text-left col-span-2 px-5 py-3"
                      >{data.valueText}</span>
                    </div>
                  ) : null
              })}                

              <button
                onClick={() => setModalOpen(false)}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;
