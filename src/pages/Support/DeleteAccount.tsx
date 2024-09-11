import axios from "axios";
import { useState } from "react";

const DeleteAccount = () => {
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const deleteAccount = async (e) => {
        e.preventDefault();

        if (userId === '') {
            alert('계정명을 입력해주세요.');
            return;
        }
        if (password === '') {
            alert('패스워드를 입력해주세요.');
            return;
        }
        
        try {
        const response = await axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_LOGIN_ENDPOINT, {
            userId,
            password,
        });
        alert('계정 삭제가 완료되었습니다.');
        setUserId('');
        setPassword('');
        } catch (error) {
        alert(error.response.data.detail);
        }   
    };

    return (
        <div className="text-xs lg:text-sm">
            <h1 className="text-lg font-bold mb-2">탈퇴 안내</h1>
            <div className="mb-10">회원탈퇴를 신청하기 전 아래 안내 사항을 확인해주세요.</div>
            <ul>
                <li className="mb-10">
                    <div className="font-bold mb-2">1. 탈퇴 아이디는 재사용 및 복구가 불가능합니다.</div>
                    <div className=""><span className="text-danger">탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가</span>하오니 신중하게 선택하시기 바랍니다.</div>
                </li>
                <li className="mb-10">
                    <div className="font-bold mb-2">2. 탈퇴 후 회원정보 및 이용기록은 아래와 같이 처립됩니다.</div>
                    <div>삭제 데이터와 보관 데이터로 아래와 같이 분류됩니다.</div>
                    <div>삭제되는 내용을 확인하시고 필요한 데이터는 미리 백업을 해주세요.</div>
                    <div className="flex flex-col border-t border-solid mt-2">
                        <div className="flex flex-row items-center border-b">
                            <div className="border-r text-right py-3 pl-3 pr-1 lg:pr-5">보관 데이터</div>
                            <div className="pl-1 lg:pl-5">회원 세대차량번호, 세대차량 입/출차 내역, 차량 식별 이미지</div>
                        </div>
                        <div className="flex flex-row items-center border-b">
                            <div className="border-r text-right py-3 pl-3 pr-1 lg:pr-5">삭제 데이터</div>
                            <div className="pl-1 lg:pl-5">회원 알림 내역, 회원 App 토큰, 회원Q&A 내역, 등록 방문차량 입/출차 내역, 알림 수신 설정 내역</div>
                        </div>
                    </div>
                </li>
            </ul>
            {/* <div className="flex items-center justify-center mt-10 mb-10">
                <input type="checkbox" className="mr-2" />안내 사항을 모두 확인하였으며, 이에 동의합니다.
            </div> */}
            <div className="flex flex-col justify-center items-center gap-2 mt-10">
                <div className="flex items-center w-4/5 lg:w-1/2">
                    <div className="w-1/3 text-right pr-3">계정</div>
                    <input
                        type="text"
                        placeholder=""
                        value={userId}
                        onChange={(e) => {setUserId(e.target.value)}}
                        className="rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="flex items-center w-4/5 lg:w-1/2">
                    <div className="w-1/3 text-right pr-3">비밀번호</div>
                    <input
                        type="password"
                        placeholder=""
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        className="rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
            </div>
            <div className="flex justify-center mt-5">
                <button
                    onClick={(e) => {deleteAccount(e)}}
                    className="mt-3 items-center justify-center rounded-md bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90"
                >
                    삭제
                </button>
            </div>
            
        </div>
        
    );
}

export default DeleteAccount;