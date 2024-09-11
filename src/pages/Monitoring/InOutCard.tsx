import { useState } from "react";
import { CarLogDetails } from "../../types/carLog";
import { convertTypeToString } from "../../js/stringConvert";

const InOutCard = ({
  monitoringList,
  onClickHandle
}) => {
  return monitoringList && monitoringList.length > 0 ? (
    monitoringList.map((m, i) => (
      <div
        key={i}
        className={`flex justify-between gap-2 items-center text-lg w-full cursor-pointer rounded-[10px] border-r-[5px] border-l-[5px] bg-white p-4 shadow-13 ${m.inOutType === 'IN' ? 'border-l-meta-3 border-r-white' : 'border-r-red border-l-white'} hover:bg-gray hover:border-r-gray`}
        onClick={() => { onClickHandle(m.id) }}
      >
        <div className="flex justify-between items-center w-full">
          <div className='text-green-600 w-1/12 font-bold'>{m.inOutType}</div>
          <div className='text-blue-600 w-3/12 font-bold text-center'>{convertTypeToString(m.type)}</div>
          <div className='w-4/12 font-bold text-center'>{m.vehicleNumber}</div>
          <div className='text-stone-400 w-4/12 text-right text-sm'>{m.inOutTime}</div>
        </div>
      </div>
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