import { Link, NavLink, useNavigate } from 'react-router-dom';
import DropdownMessage from './DropdownMessage';
import Logo from '../../images/logo/han_logo.png';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/logo-icon.svg';
import DarkModeSwitcher from './DarkModeSwitcher';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { AllApartmentParams } from '../../types/apartment';
import Loader from '../../common/Loader';
import { useRecoilState } from 'recoil';
import { headerState } from '../../state/atoms/headerState';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [headerData, setHeaderData] = useRecoilState(headerState);
  const headerUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_ENDPOINT;
  const getHeader = async () => {
    try {
      setLoading(true);
      const response = await axios.get(headerUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: 0,
          size: 1,
          name: "",
          address: ""
        } as AllApartmentParams,
      });

      // console.log(response);

      setHeaderData({
        apartmentId: response.data.content[0].id,
        apartmentName: response.data.content[0].name,
        expireDate: response.data.content[0].expireDate,
        priceType: response.data.content[0].price.type
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getHeader();
  }, []);

  const calculateRemainingDate = (targetDate: Date) => {
    const today: Date = new Date();
    const timeDifference: number = targetDate.getTime() - today.getTime();
    const remainingDays: number = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return remainingDays;
  };

  // 로그아웃
  const [, , removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const navigate = useNavigate();

  const logOut = () => {
    removeCookie('accessToken', { path: '/' });
    removeCookie('refreshToken', { path: '/' });
    navigate("/");
  }

  return (
    <>
      {loading ? (<Loader />) : (
        <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
          <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between">
              {/* <div>오픈</div> */}
              <NavLink to="/main">
                <div className='text-title-lg text-black font-extrabold'>주차 관리 솔루션</div>
                {/* 기존 로고 */}
                {/* <img src={Logo} alt="Logo" className='h-8' /> */}
              </NavLink>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}
            {/* <div className="flex items-center gap-2 sm:gap-4 lg:hidden"> */}
              {/* <!-- Hamburger Toggle BTN --> */}
              {/* <button */}
                {/* aria-controls="sidebar" */}
                {/* onClick={(e) => { */}
                  {/* e.stopPropagation(); */}
                  {/* props.setSidebarOpen(!props.sidebarOpen); */}
                {/* }} */}
                {/* className="z-99999 block rounded-sm border border-stroke bg-black p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden" */}
              {/* > */}
                {/* <span className="relative block h-5.5 w-5.5 cursor-pointer"> */}
                  {/* <span className="du-block absolute right-0 h-full w-full"> */}
                    {/* <span */}
                      {/* className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-300' */}
                        {/* }`} */}
                    {/* ></span> */}
                    {/* <span */}
                      {/* className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && 'delay-400 !w-full' */}
                        {/* }`} */}
                    {/* ></span> */}
                    {/* <span */}
                      {/* className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-500' */}
                        {/* }`} */}
                    {/* ></span> */}
                  {/* </span> */}
                  {/* <span className="absolute right-0 h-full w-full rotate-45"> */}
                    {/* <span */}
                      {/* className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-[0]' */}
                        {/* }`} */}
                    {/* ></span> */}
                    {/* <span */}
                      {/* className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-200' */}
                        {/* }`} */}
                    {/* ></span> */}
                  {/* </span> */}
                {/* </span> */}
              {/* </button> */}
              {/* <!-- Hamburger Toggle BTN --> */}

              {/* <Link className="block flex-shrink-0 lg:hidden" to="/main"> */}
                {/* <img src={LogoIcon} alt="Logo" /> */}
              {/* </Link> */}
            {/* </div> */}

            <div className="hidden sm:block">
              {/*  <form action="https://formbold.com/s/unique_form_id" method="POST">*/}
              {/*    <div className="relative">*/}
              {/*      <button className="absolute left-0 top-1/2 -translate-y-1/2">*/}
              {/*        <svg*/}
              {/*          className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"*/}
              {/*          width="20"*/}
              {/*          height="20"*/}
              {/*          viewBox="0 0 20 20"*/}
              {/*          fill="none"*/}
              {/*          xmlns="http://www.w3.org/2000/svg"*/}
              {/*        >*/}
              {/*          <path*/}
              {/*            fillRule="evenodd"*/}
              {/*            clipRule="evenodd"*/}
              {/*            d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"*/}
              {/*            fill=""*/}
              {/*          />*/}
              {/*          <path*/}
              {/*            fillRule="evenodd"*/}
              {/*            clipRule="evenodd"*/}
              {/*            d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"*/}
              {/*            fill=""*/}
              {/*          />*/}
              {/*        </svg>*/}
              {/*      </button>*/}

              {/*      <input*/}
              {/*        type="text"*/}
              {/*        placeholder="Type to search..."*/}
              {/*        className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125"*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*  </form>*/}
            </div>

            <div className="flex items-center gap-3 2xsm:gap-7">
              <ul className="flex items-center gap-2 2xsm:gap-4">
                {/* <span className='text-xs'>요금제: {headerData.priceType}</span> */}
                {/* <span className='text-xs'>|</span> */}
                {/* <span className='text-xs mr-5'>사용만료일: {headerData.expireDate} (D-{calculateRemainingDate(new Date(headerData.expireDate))})</span> */}
                {/* <!-- Dark Mode Toggler --> */}
                {/* <DarkModeSwitcher /> */}
                {/* <!-- Dark Mode Toggler --> */}

                {/* <!-- Notification Menu Area --> */}
                {/* 알림 부분 */}
                {/* <DropdownNotification /> */}
                {/* <!-- Notification Menu Area --> */}

                {/* <!-- Chat Notification Area --> */}
                {/* <DropdownMessage /> */}
                {/* <!-- Chat Notification Area --> */}
              </ul>

              {/* <!-- User Area --> */}
              {/* <DropdownUser apartmentName={headerData.apartmentName} /> */}
              {/* <!-- User Area --> */}
              <button
                className="flex items-center gap-3.5 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                onClick={logOut}
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                    fill=""
                  />
                  <path
                    d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                    fill=""
                  />
                </svg>
                로그아웃

              </button>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
