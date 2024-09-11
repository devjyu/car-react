import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DataTable from '../../components/DataTables/DataTable.tsx';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import axios from 'axios';
import Loader from '../../common/Loader/index.tsx';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pageSizeState } from '../../state/atoms/pageSizeState.ts';
import { pageNumberState } from '../../state/atoms/pageNumberState.ts';
import ModalSave from '../../components/Modals/ModalSave.tsx';
import { Pageable } from '../../types/pageable.ts';
import MemberRegisterTable from './MemberRegisterTable.tsx';

interface MemberRegister {
  id: number;
  userId: string;
  dong: string;
  ho: string;
  registerDate: string;
  registerYMD: string;
}

const MemberRegister: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [memberData, setMemberData] = useState<MemberRegister[]>();
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);

  const memberUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_UNIT_REGISTER_ENDPOINT;

  const getAllMember = async () => {
    try {
      setLoading(true);
      const response = await axios.get(memberUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize
        }
      });
      const memberDataWithoutDate: MemberRegister[] = response.data;
      const memberDataWithDate = memberDataWithoutDate.map((member) => {
        const registerDate = new Date(member.registerDate);
        // member.registerYMD = registerDate.getFullYear() + '-' + (registerDate.getMonth()+1) + '-' + registerDate.getDate();
        member.registerYMD = `${registerDate.getFullYear()}-${formatTwoDigitPart(registerDate.getMonth() + 1)}-${formatTwoDigitPart(registerDate.getDate())} ${formatTwoDigitPart(registerDate.getHours())}:${formatTwoDigitPart(registerDate.getMinutes())}:${formatTwoDigitPart(registerDate.getMinutes())}`;
        return member;
      });
      setMemberData(memberDataWithDate);
      // console.log(memberData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatTwoDigitPart = (value) => {
    return String(value).padStart(2, '0');
  };

  useEffect(() => {
    getAllMember();
  }, []);

  const memberRegisterColumns = [
    // { Header: 'ID', accessor: 'id'},
    { Header: '동', accessor: 'dong' },
    { Header: '호', accessor: 'ho' },
    { Header: '계정', accessor: 'userId' },
    { Header: '신청일시', accessor: 'registerYMD' },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="승인대기 목록" rootPage="앱 사용자 관리" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {loading ? (
          <Loader />
        ) : memberData && memberData.length > 0 ? (
          <MemberRegisterTable
            tableData={memberData}
            column={memberRegisterColumns}
            completeHandler={getAllMember}
          />
        ) : null}
      </div>
      {/* <ModalSave/> */}
    </DefaultLayout>
  );
};

export default MemberRegister;