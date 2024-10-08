import { useState } from "react";
// import { CarLogDetails } from "../../types/carLog";
import { convertTypeToString } from "../../js/stringConvert";

const InOutCard = ({
  monitoringList,
  onClickHandle,
}) => {
  return monitoringList && monitoringList.length > 0 ? (
    monitoringList.map((m, i) => (
      <div
        key={i}
        className={`flex justify-between items-center w-full cursor-pointer border border-tborder border-b border-t-0 border-r-0 border-l-0 bg-basicWhite px-2 py-1
         transition-all duration-200 hover:bg-gray-100 hover:shadow-lg`}
        onClick={() => onClickHandle(m.id)}
      >
        <div className="flex justify-between items-center w-full">
          <div className='w-4/12 font-bold text-center text-basicdark'>{m.vehicleNumber}</div>
          <div className='text-basicdark w-8/12 text-center text-sm'>{m.inOutTime}</div>
        </div>
        {/* {
          type == 'IN' && m.inOutType == 'IN' ?
            <div className="flex justify-between items-center w-full">
              <div className='w-4/12 font-semibold text-center text-basicdark text-base'>{m.vehicleNumber}</div>
              <div className='text-basicdark w-8/12 text-right text-xs'>{m.inOutTime}</div>
            </div>
            :
            null
        }

        {
          type == 'OUT' && m.inOutType == 'OUT' ?
            <div className="flex justify-between items-center w-full">
              <div className='w-4/12 font-semibold text-center text-basicdark text-base'>{m.vehicleNumber}</div>
              <div className='text-basicdark w-8/12 text-right text-xs'>{m.inOutTime}</div>
            </div>
            :
            null
        } */}
      </div>
      //   <div
      //   key={i}
      //   className={`flex justify-between gap-2 items-center text-lg w-full cursor-pointer rounded-lg bg-white p-4 shadow-md transition-all duration-200 ${
      //     m.inOutType === 'IN' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-red-500'
      //   } hover:bg-gray-100 hover:shadow-lg`}
      //   onClick={() => onClickHandle(m.id)}
      // >
      //   <div className="flex justify-between items-center w-full">
      //     <div className='w-4/12 font-bold text-center text-gray-800'>{m.vehicleNumber}</div>
      //     <div className='text-gray-500 w-4/12 text-right text-sm'>{m.inOutTime}</div>
      //   </div>
      // </div>
    ))
  ) : null;
  // const [carLogDetails, setCarLogDetails] = useState<CarLogDetails>();

  // return monitoringList ? monitoringList.map((m, i) => (
  //   <div
  //     key={i}
  //     className={`flex justify-between gap-2 items-center text-lg w-full cursor-pointer rounded-[10px] border-r-[5px] border-l-[5px] bg-white p-4 shadow-13 ${m.inOutType === 'IN' ? 'border-l-meta-3 border-r-white' : 'border-r-red border-l-white'} hover:bg-gray hover:border-r-gray`}
  //     onClick={() => { onClickHandle(m.id) }}
  //   >
  //     <div className="flex justify-between items-center w-full">
  //       <div className='text-green-600 w-1/12 font-bold'>{m.inOutType}</div>
  //       <div className='text-blue-600 w-3/12 font-bold text-center'>{convertTypeToString(m.type)}</div>
  //       <div className='w-4/12 font-bold text-center'>{m.vehicleNumber}</div>
  //       <div className='text-stone-400 w-4/12 text-right text-sm'>{m.inOutTime}</div>
  //     </div>
  //   </div>
  // )) : <div>데이터 없음</div>;
}

export default InOutCard;