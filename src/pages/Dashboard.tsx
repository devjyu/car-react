import React, { useEffect, useState } from 'react';
import CardDataStats from '../components/CardDataStats';
import TableUserApplyEntry from '../components/Tables/TableUserApplyEntry.tsx';
import DefaultLayout from '../layout/DefaultLayout';
import ChartHour from '../components/Charts/ChartHour.tsx';
import ChartDay from '../components/Charts/ChartDay.tsx';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { DashboardData } from '../types/dashboard.ts';
import Loader from '../common/Loader/index.tsx';
import TableCarApplyEntry from '../components/Tables/TableCarApplyEntry.tsx';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [dashboardData, setDashboardDataData] = useState<DashboardData>();

  const dashboardUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_DASHBOARD_ENDPOINT;

  const getDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(dashboardUrl, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      setDashboardDataData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className='grid grid-cols-4 gap-4'>
            {/* <div className="grid-rows-2 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5"> */}
            {/* 기존 색 fill="rgb(38,51,197) */}
            <CardDataStats title="총 세대 / 등록 세대 차량 수" total={`${dashboardData.unitCount.toString()} / ${dashboardData.vehicleCount.toString()}`} rate="">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" fill="#C44D63">
                <path d="M21 22h2v2h-22v-2h2v-22h18v22zm-10-3h-2v4h2v-4zm4 0h-2v4h2v-4zm4-17h-14v20h2v-5h10v5h2v-20zm-12 11h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8-3h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
              </svg>
            </CardDataStats>
            <CardDataStats title="금일 세대외 입차 수 / 출차 수" total={`${dashboardData.visitInCount.toString()} / ${dashboardData.visitOutCount.toString()}`} rate="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#C44D63">
                <path d="M20.5 13c-1.932 0-3.5 1.567-3.5 3.5s1.568 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.568-3.5-3.5-3.5zm1.5 4h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm-13.001-5.9c0 1.692-.766 2.9-1.206 3.9h-1.397c.227-1 1.954-3.415 1.021-4.982-.55-.923-2.272-.924-2.819-.015-.507.841-.24 2.417.712 4.215.518.978.374 1.734.162 2.197-.406.889-1.303 1.317-2.316 1.612-2.01.588-1.825.055-1.825 1.973h-1.329l-.002-.618c0-1.262.099-1.989 1.59-2.333 1.719-.397 3.319-.745 2.545-2.209-2.361-4.457-.627-6.84 1.866-6.84 1.687 0 2.998 1.09 2.998 3.1zm5.691 1.395c.607 1.146.447 2.016.206 2.543-.66 1.445-2.472 1.863-4.39 2.305-1.252.29-1.172.588-1.172 2.657h-1.331l-.003-.825c0-1.681.132-2.652 2.119-3.111 2.293-.53 4.427-.994 3.394-2.946-3.147-5.941-.835-9.118 2.488-9.118 3.164 0 5.337 2.879 3.041 8h-1.483c1.159-2.325 1.428-4.326.708-5.533-.902-1.517-3.617-1.509-4.512-.022-.768 1.273-.426 3.478.935 6.05z" />
              </svg>
            </CardDataStats>
            <CardDataStats title="세대 입차 수 / 출차 수" total={`${dashboardData.inCount} / ${dashboardData.outCount}`} rate="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#C44D63">
                <path d="M19.688 5.176c0 .82-.603 1.109-1.423 1.109h-.509v-2.178h.704c.775 0 1.228.283 1.228 1.069zm4.312-1.884v6.417c0 1.265-1.026 2.291-2.292 2.291h-6.417c-1.265 0-2.291-1.026-2.291-2.292v-6.416c0-1.266 1.026-2.292 2.292-2.292h6.417c1.265 0 2.291 1.026 2.291 2.292zm-2.75 1.829c0-.759-.231-1.33-.691-1.713-.461-.383-1.134-.574-2.019-.574h-2.331v7.333h1.547v-2.609h.664c.905 0 1.603-.209 2.094-.627.49-.418.736-1.021.736-1.81zm-4.25 11.378c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.671-1.5 1.5zm-8.5.501c-.276 0-.5.223-.5.499s.224.5.5.5h7c.276 0 .5-.224.5-.5s-.224-.499-.5-.499h-7zm-4.5-.501c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5-.672-1.5-1.5-1.5-1.5.671-1.5 1.5zm-1.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2zm19.006 4.001h-1.511c.474.89.803 1.655.803 2.972 0 1.673-1.355 3.028-3.026 3.028h-11.948c-1.671 0-3.026-1.355-3.026-3.028 0-1.641.506-2.421 1.184-3.678 1.041.206 3.967.705 7.816.705.877 0 1.728-.029 2.532-.076-1.203-.217-2.227-.933-2.859-1.929-2.895-.023-5.237-.339-6.478-.55.382-.686.779-1.386 1.184-2.061.67-1.117.852-1.149 1.39-1.246 1.011-.181 1.984-.272 3.231-.302v-2.002c-1.382.031-2.451.132-3.585.335-1.381.248-1.965.875-2.751 2.187-.981 1.637-1.913 3.382-2.684 4.812-.687 1.273-.98 2.411-.98 3.805 0 1.318.42 2.415 1 3.817v2.209c0 .553.448 1.002 1 1.002h1.5c.552 0 1-.449 1-1.001v-1h13v1c0 .552.448 1.001 1 1.001h1.5c.552 0 1-.449 1-1.001v-2.209c.58-1.403 1-2.499 1-3.817 0-1.109-.196-2.058-.618-3.041-.221.035-.443.068-.674.068z" />
              </svg>
            </CardDataStats>
            <CardDataStats title="앱 승인된 사용자수" total={dashboardData.userCount.toString()} rate="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#C44D63">
                <path d="M6.02 7.389c.399-.285.85-.417 1.292-.417.944 0 1.852.6 2.15 1.599-.382-.294-.83-.437-1.281-.437-.458 0-.919.147-1.321.434-.799.57-1.153 1.541-.845 2.461-1.242-.89-1.247-2.747.005-3.64zm3.741 12.77c.994.334 4.071 1.186 7.635 3.841l6.604-4.71c-1.713-2.402-1.241-4.082-2.943-6.468-1.162-1.628-1.827-1.654-3.037-1.432l.599.84c.361.507-.405 1.05-.764.544l-.534-.75c-.435-.609-1.279-.229-2.053-.051l.727 1.019c.36.505-.403 1.051-.764.544l-.629-.882c-.446-.626-1.318-.208-2.095-.01l.769 1.078c.363.508-.405 1.049-.764.544l-3.118-4.366c-.968-1.358-3.088.083-2.086 1.489l4.605 6.458c-.494-.183-1.363-.349-1.93-.349-1.754 0-2.429 1.92-.222 2.661zm-3.286-2.159h-4.475v-14h10v6.688l2-.471v-8.217c0-1.104-.895-2-2-2h-10c-1.105 0-2 .896-2 2v18.678c-.001 2.213 3.503 3.322 7.005 3.322 1.812 0 3.619-.299 4.944-.894-2.121-.946-6.378-1.576-5.474-5.106z" />
              </svg>
            </CardDataStats>
            {/* </div> */}
          </div>
          <div className='mt-4 grid grid-cols-2 gap-4 2xl:gap-7.5'>
            <TableUserApplyEntry />
            <TableCarApplyEntry />
          </div>


          <div className="mt-4 grid grid-cols-12 gap-4 h-[28rem]">
            <ChartHour chartData={dashboardData.line} />
            <ChartDay chartData={dashboardData.bar} />
            {/* <ChartTwo /> */}
            {/*<ChartThree />*/}
            {/*<MapOne />*/}
            {/* <div className="col-span-12 xl:col-span-8">
              <TableUserApplyEntry />
            </div> */}
            {/*<ChatCard />*/}
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export default Dashboard;
