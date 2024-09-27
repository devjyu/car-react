import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Dashboard from './pages/Dashboard';
import Apartment from './pages/Apartment/Apartment.tsx';
import ApartmentUnit from './pages/Apartment/Unit/ApartmentUnit.tsx';
import DeviceErrorLog from './pages/Error/DeviceErrorLog.tsx';
import Device from './pages/Device/Device.tsx';
import Car from './pages/Car/Car.tsx';
import ApartmentUnitCar from './pages/Car/ApartmentUnitCar.tsx';
import CarLog from './pages/Log/CarLog.tsx';
import CarEntryInsert from './pages/Log/CarEntryInsert.tsx';
import ApartmentSetting from './pages/Setting/ApartmentSetting.tsx';

import { RecoilRoot } from 'recoil';
import Member from './pages/Member/Member.tsx';
import MemberRegister from './pages/Member/MemberRegister.tsx';
import VehicleRegister from './pages/Car/VehicleRegister.tsx';
import Notice from './pages/Notice/Notice.tsx';
import Profile from './pages/Profile/Profile.tsx';
import { useCookies } from 'react-cookie';
import Support from './pages/Support/Support.tsx';
import Monitoring from './pages/Monitoring/Monitoring.tsx';
import QnA from './pages/Support/QnA/QnA.tsx';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!cookies.accessToken && location.pathname != '/auth/signin' && location.pathname != '/support' && location.pathname != '/support/qna') {
      alert('로그인이 만료되었습니다. 로그인창으로 이동합니다.');
      navigate('/');
    }
    setLoading(false);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <RecoilRoot>
      <Routes>
        <Route
          path='/'
          element={
            <>
              <PageTitle title="로그인 | Admin - Car Admin Signin" />
              <SignIn />
            </>
          }
        />

        <Route
          index
          path='/main'
          element={
            <>
              <PageTitle title="메인 | Admin - Car Admin Dashboard" />
              <Dashboard />
            </>
          }
        />

        <Route
          path="/admin/apartment"
          element={
            <>
              <PageTitle title="아파트 | Admin - Car Admin Apartment" />
              <Apartment />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="아파트 | Admin - Car Admin Profile" />
              <Profile />
            </>
          }
        />

        <Route
          path="/apartment/unit"
          element={
            <>
              <PageTitle title="세대 | Admin - Car Admin Apartment Unit" />
              <ApartmentUnit />
            </>
          }
        />

        <Route
          path="/l/error"
          element={
            <>
              <PageTitle title="로그 | Admin - Car Admin Device Error Log" />
              <DeviceErrorLog />
            </>
          }
        />

        <Route
          path="/device"
          element={
            <>
              <PageTitle title="장치 | Admin - Car Admin Device" />
              <Device />
            </>
          }
        />

        <Route
          path="/car"
          element={
            <>
              <PageTitle title="비관리 차량 | Admin - Car Admin Car" />
              {/* <PageTitle title="차량 | Admin - Car Admin Car" /> */}
              <Car />
            </>
          }
        />

        <Route
          path="/car-unit"
          element={
            <>
              <PageTitle title="관리 차량 | Admin - Car Admin Apartment Unit Car" />
              {/* <PageTitle title="세대별 차량 | Admin - Car Admin Apartment Unit Car" /> */}
              <ApartmentUnitCar />
            </>
          }
        />

        <Route
          path="/car-register"
          element={
            <>
              <PageTitle title="차량 승인신청 목록 | Admin - Car Admin Car Register" />
              <VehicleRegister />
            </>
          }
        />

        <Route
          path="/c/log"
          element={
            <>
              <PageTitle title="입출차 내역 | Admin - Car Admin Car Log" />
              <CarLog />
            </>
          }
        />

        <Route
          path="/c/insert"
          element={
            <>
              <PageTitle title="입출차 신청 | Admin - Car Admin Car Entry Insert" />
              <CarEntryInsert />
            </>
          }
        />

        <Route
          path="/member-register"
          element={
            <>
              <PageTitle title="승인신청 목록 | Admin - Car Admin Member Register" />
              <MemberRegister />
            </>
          }
        />

        <Route
          path="/member"
          element={
            <>
              <PageTitle title="사용자 관리 | Admin - Car Admin Member Management" />
              <Member />
            </>
          }
        />

        <Route
          path="/setting"
          element={
            <>
              <PageTitle title="설정 | Admin - Car Admin Setting" />
              <ApartmentSetting />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="내정보 | Admin - Car Admin Profile" />
              <Profile />
            </>
          }
        />

        <Route
          path="/notice"
          element={
            <>
              <PageTitle title="공지사항 | Admin - Car Admin Notice" />
              <Notice />
            </>
          }
        />

        <Route
          path="/monitoring"
          element={
            <>
              <PageTitle title="모니터링 | Admin - Car Admin Monitoring" />
              <Monitoring />
            </>
          }
        />

        <Route
          path="/support"
          element={
            <>
              <PageTitle title="고객지원 | Support" />
              <Support />
            </>
          }
        />

        <Route
          path="/support/qna"
          element={
            <>
              <PageTitle title="질의응답 | Support - QnA" />
              <QnA />
            </>
          }
        />

        {/* 모든 경로 처리 - 최 하단에 넣어야 함. */}
        <Route
          path='*'
          element={
            <>
              <PageTitle title="로그인 | Admin - Car Admin Signin" />
              <SignIn />
            </>
          }
        />

      </Routes>
    </RecoilRoot>
  );
}

export default App;
