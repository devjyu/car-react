import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DataTable from '../../components/DataTables/DataTable.tsx';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import axios from 'axios';
import Loader from '../../common/Loader/index.tsx';
import { useCookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { pageSizeState } from '../../state/atoms/pageSizeState.ts';
import { pageNumberState } from '../../state/atoms/pageNumberState.ts';
import ModalSave from '../../components/Modals/ModalSave.tsx';
import { Pageable } from '../../types/pageable.ts';
import MemberDataTable from './MemberDataTable.tsx';

interface Member {
  id: number;
  userId: string;
  dong: string;
  ho: string;
  registerDate: string;
  registerDateYMD: string;
  applyDate: string;
  applyDateYMD: string;
  memberNotificationEntity: MemberNotificationEntity;
}

interface MemberNotificationEntity {
  error: boolean;
  notice: boolean;
  car: boolean;
  apartment: boolean;
  etc: boolean;
}

const Member: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [memberData, setMemberData] = useState<Pageable<Member[]>>();
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);

  const memberUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_MEMBER_ENDPOINT;
  const deleteMemberUrl = import.meta.env.VITE_BASE_URL + '/api/v1/member'; 

  const getAllMember = async () => {
    try {
      setLoading(true);
      const response = await axios.get(memberUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize,
          regStartDate: '2020-01-01',
          regEndDate: '2100-12-31',
          applyStartDate: '',
          applyEndDate: ''

        }
      });
      const memberDataWithoutDate: Member[] = response.data.content;
      const memberDateWithDate = memberDataWithoutDate.map((member) => {
        const applyDate = new Date(member.applyDate);
        member.applyDateYMD = `${applyDate.getFullYear()}-${formatTwoDigitPart(applyDate.getMonth() + 1)}-${formatTwoDigitPart(applyDate.getDate())} ${formatTwoDigitPart(applyDate.getHours())}:${formatTwoDigitPart(applyDate.getMinutes())}:${formatTwoDigitPart(applyDate.getMinutes())}`;

        const registerDate = new Date(member.registerDate);
        member.registerDateYMD = `${registerDate.getFullYear()}-${formatTwoDigitPart(registerDate.getMonth() + 1)}-${formatTwoDigitPart(registerDate.getDate())} ${formatTwoDigitPart(registerDate.getHours())}:${formatTwoDigitPart(registerDate.getMinutes())}:${formatTwoDigitPart(registerDate.getMinutes())}`;

        return member;
      });
      const memberData: Pageable<Member[]> = response.data;
      memberData.content = memberDateWithDate;
      setMemberData(memberData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllMember();
  }, []);

  const formatTwoDigitPart = (value) => {
    return String(value).padStart(2, '0');
  };

  const deleteHandler = async (id) => {
    const deleteUrl = deleteMemberUrl + `/${id}`
    const response = await axios.delete(deleteUrl , {
      headers: {
        Authorization: cookies.accessToken
      }
    });
    getAllMember();
  };

  const apartmentColumns = [
    // { Header: 'ID', accessor: 'id'},

    { Header: '동', accessor: 'dong' },
    { Header: '호', accessor: 'ho' },
    { Header: '계정', accessor: 'userId' },
    { Header: '신청일시', accessor: 'registerDateYMD' },
    { Header: '승인일시', accessor: 'applyDateYMD' },
    { Header: '에러 수신 여부', accessor: 'memberNotificationEntity.error' },
    { Header: '공지사항 수신 여부', accessor: 'memberNotificationEntity.notice' },
    { Header: '차량 정보 수신 여부', accessor: 'memberNotificationEntity.car' },
    { Header: '세대 승인 수신 여부', accessor: 'memberNotificationEntity.apartment' },
    // { Header: '기타 수신 여부', accessor: 'memberNotificationEntity.etc'},
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="앱 사용자 관리" rootPage="사용자" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {loading ? (
          <Loader />
        ) : memberData && memberData.content.length > 0 ? (
          <MemberDataTable tableData={memberData.content} column={apartmentColumns} deleteHandler={deleteHandler} onSearch={() => { }} />
        ) : null}
      </div>
    </DefaultLayout>
  );
};

export default Member;