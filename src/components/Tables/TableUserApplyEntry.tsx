import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface MemberRegister {
  id: number;
  userId: string;
  dong: string;
  ho: string;
  registerDate: string;
  registerYMD: string;
}

const TableUserApplyEntry = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [memberData, setMemberData] = useState<MemberRegister[]>([]);
  const navigate = useNavigate();
  const pageSize = 0;
  const pageNumber = 3;

  const memberUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_UNIT_REGISTER_ENDPOINT;

  const getDashboardMember = async () => {
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
      const memberDataWithoutDate: MemberRegister[]  = response.data;
      const memberDataWithDate = memberDataWithoutDate.map((member) => {
        const registerDate = new Date(member.registerDate);
        member.registerYMD = `${registerDate.getFullYear()}-${formatTwoDigitPart(registerDate.getMonth() + 1)}-${formatTwoDigitPart(registerDate.getDate())}`;
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

  useEffect(() => {
    getDashboardMember();
  }, []);

  const formatTwoDigitPart = (value) => {
    return String(value).padStart(2, '0');
  };
  
  return (
    <div className="text-sm rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 h-64 overflow-auto shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-sm font-semibold text-black dark:text-white">
        앱 사용자 승인 대기 목록
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 items-center rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 text-center xl:p-2.5 ">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              동
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-2.5">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              호
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-2.5">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              계정
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-2.5">
            <h5 className="text-sm font-bold uppercase xsm:text-sm">
              신청일자
            </h5>
          </div>
        </div>

        {memberData.map((applyEntry, key) => (
          <div
            className={`grid grid-cols-4 sm:grid-cols-4 hover:bg-slate-200 cursor-pointer ${
              key === memberData.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
            onClick={() => {navigate('/member-register');}}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-2.5">
              <p className="text-black dark:text-white">
                {applyEntry.dong}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-2.5">
              <p className="text-black dark:text-white">{applyEntry.ho}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-2.5">
              <p className="text-black dark:text-white">{applyEntry.userId}</p>
            </div>
            
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-2.5">
              <p className="text-black dark:text-white">{applyEntry.registerYMD}</p>
            </div>

          </div>

        ))}
      </div>

    </div>
  );
};

export default TableUserApplyEntry;
