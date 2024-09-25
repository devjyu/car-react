import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import axios from 'axios';
import Loader from '../../common/Loader/index.tsx';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pageSizeState } from '../../state/atoms/pageSizeState.ts';
import { pageNumberState } from '../../state/atoms/pageNumberState.ts';
import { Pageable } from '../../types/pageable.ts';
import CarLogTable from './CarLogTable.tsx';
import { CarLogType, ICarLog } from '../../types/carLog.ts';
import { SearchOption } from '../../types/searchOption.ts';
import { CommonPageParam } from '../../types/commonPageParam.ts';
import { startDateState } from '../../state/atoms/startDateState.ts';
import { endDateState } from '../../state/atoms/endDSateState.ts';

interface CarLogParam extends CommonPageParam {
  number: string;
  type: CarLogType;
  startDate?: string;
  endDate?: string;
  inStartDate?: string;
  inEndDate?: string;
  outStartDate?: string;
  outEndDate?: string;
}

const CarLog: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [carLog, setCarLog] = useState<Pageable<ICarLog[]>>();
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);
  const startDate = useRecoilValue(startDateState);
  const endDate = useRecoilValue(endDateState);

  const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;

  const getAllCarLog = async () => {
    try {
      setLoading(true);

      const response = await axios.get(carLogUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: 9999,
          number: '',
          type: CarLogType.ALL,
          startDate: startDate,
          endDate: endDate,
          // inStartDate: startDate,
          // inEndDate: endDate,
          // outEndDate: '',
          // outStartDate: '',
          sort: 'createDate,desc'
        } as CarLogParam
      });

      // const repsonseCarLog: Pageable<ICarLog[]> = response.data;
      // console.log(repsonseCarLog.content, '얼안ㅁㄹ');


      // repsonseCarLog.content = repsonseCarLog.content.map(c => {
      //   switch (c.type) {
      //     case CarLogType.MEMBER:
      //       return { ...c, typeText: '세대차량' };
      //     case CarLogType.VISIT:
      //       return { ...c, typeText: '방문차량' };
      //     case CarLogType.UNKNOWN:
      //       return { ...c, typeText: '미인식차량' };
      //     case CarLogType.UNREGISTER:
      //       return { ...c, typeText: '미등록차량' };
      //     default:
      //       return c;
      //   }
      // });

      // setCarLog(repsonseCarLog);
      const repsonseCarLog: ICarLog[] = response.data;

      repsonseCarLog.forEach(c => {
        switch (c.type) {
          case CarLogType.MEMBER:
            c.typeText = '관리차량';
            break;
          case CarLogType.VISIT:
            c.typeText = '비관리차량';
            break;
          case CarLogType.UNKNOWN:
            c.typeText = '미인식차량';
            break;
          case CarLogType.UNREGISTER:
            c.typeText = '미등록차량';
            break;
          default:
            break;
        }
      });

      // setCarLog(repsonseCarLog);
      setCarLog(prevState => ({
        ...prevState,
        content: repsonseCarLog
      }));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }

  }

  const getCarLog = async (searchOptions: SearchOption[]) => {
    const params = {
      page: pageNumber,
      size: pageSize,
      sort: 'createDate,desc'
    };
    // params[searchOption.key] = searchOption.value;
    searchOptions.forEach((option) => {
      params[option.key] = option.value;
    });
    // console.log(params);

    try {
      // setLoading(true);
      const response = await axios.get(carLogUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params
      });

      // const repsonseCarLog: Pageable<ICarLog[]> = response.data;
      // console.log(repsonseCarLog, '로그3');
      // repsonseCarLog.content = repsonseCarLog.content.map(c => {
      //   switch (c.type) {
      //     case CarLogType.MEMBER:
      //       return { ...c, typeText: '세대차량' };
      //     case CarLogType.VISIT:
      //       return { ...c, typeText: '방문차량' };
      //     case CarLogType.UNKNOWN:
      //       return { ...c, typeText: '미인식차량' };
      //     case CarLogType.UNREGISTER:
      //       return { ...c, typeText: '미등록차량' };
      //     default:
      //       return c;
      //   }
      // });

      // setCarLog(repsonseCarLog);
      const repsonseCarLog: ICarLog[] = response.data;

      repsonseCarLog.forEach(c => {
        switch (c.type) {
          case CarLogType.MEMBER:
            c.typeText = '관리차량';
            break;
          case CarLogType.VISIT:
            c.typeText = '비관리차량';
            break;
          case CarLogType.UNKNOWN:
            c.typeText = '미인식차량';
            break;
          case CarLogType.UNREGISTER:
            c.typeText = '미등록차량';
            break;
          default:
            break;
        }
      });

      // setCarLog(repsonseCarLog);
      setCarLog(prevState => ({
        ...prevState,
        content: repsonseCarLog
      }));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getAllCarLog();
  }, []);

  // console.log(carLog, '데이터');

  const apartmentColumns = [
    { Header: '차량구분', accessor: 'typeText' },
    {
      Header: '차량번호',
      accessor: (row) => row.originVehicleNumber ? row.originVehicleNumber : row.in.vehicleNumber
    },
    {
      Header: '동/호수',
      accessor: (row) => (row.dong && row.ho) ? `${row.dong}동 ${row.ho}호` : '-'
    },
    { Header: '입차일시', accessor: 'in.inOutTime' },
    { Header: '출차일시', accessor: 'out.inOutTime' },
    // { Header: '출차 차량번호', accessor: 'out.vehicleNumber'},
  ];

  return (
    <DefaultLayout>
      <div className='mb-20'>
        <Breadcrumb pageName="입출차 내역" rootPage="입출차" refreshHandle={getAllCarLog} />
        {loading ? (
          <Loader />
        ) : (
          <CarLogTable tableData={carLog.content} column={apartmentColumns} onSearch={getCarLog} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default CarLog;