import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { useCookies } from 'react-cookie';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as XLSX from 'xlsx-js-style';
import SearchLoader from '../../common/Loader/searchLoader';
import DropdownSearch from '../../components/Dropdowns/DropdownSearch';
import SortIcon from '../../components/Sort/SortIcon';
import ExcelLogo from '../../images/icon/excel_logo.png';
import { formatYMD } from '../../js/dateFormat';
import { endDateState } from '../../state/atoms/endDSateState';
import { pageUnitState } from '../../state/atoms/pageUnitState';
import { startDateState } from '../../state/atoms/startDateState';
import { CarLogInDetails, CarLogOutDetails } from '../../types/carLog';

const CarLogTable = ({
  column,
  tableData,
  onSearch
}) => {

  const columns = useMemo(() => column, []);
  const data = useMemo(() => tableData, [tableData]);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [loading, setLoading] = useState<boolean>(false);
  const [carLogInDetails, setCarLogInDetails] = useState<CarLogInDetails>();
  const [carLogOutDetails, setCarLogOutDetails] = useState<CarLogOutDetails>();
  const [searchOption, setSearchOption] = useState({ key: 'number', value: '' });
  const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);
  const [dateType, setDateType] = useState('in');
  const [carType, setCarType] = useState({ key: 'type', value: 'ALL' });
  const pageUnit = useRecoilValue(pageUnitState);
  const [pages, setPages] = useState<number[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // 선택된 행의 인덱스
  const [showDetails, setShowDetails] = useState(false); // 행의 세부 정보 표시 여부

  // 리액트 캘린더 대신 사용한 상태관리 및 함수
  // const [startDate, setStartDate] = useRecoilState(dateType === 'in' ? startDateState : endDateState);

  // const [inputStartDate, setInputStartDate] = useState(formatYMD(startDate)); // 시작일 상태 설정
  // const [inputEndDate, setInputEndDate] = useState(formatYMD(new Date())); // 종료일 상태 설정
  const [selectedStartDate, setSelectedStartDate] = useState(startDate); // 선택한 날짜를 관리하기 위한 상태 추가
  const [selectedEndDate, setSelectedEndDate] = useState(endDate); // 선택한 날짜를 관리하기 위한 상태 추가

  const handleChange = (event, setDate) => {
    const selectedValue = event.target.value;
    // setDate(selectedValue);
    setDate(selectedValue); // 선택한 날짜 업데이트
  };

  // 현재 날짜를 yyyy-mm-dd 형식으로 가져오는 함수
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줌
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 여기까지

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'in.inOutTime',
            desc: true,
          },
        ],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    gotoPage,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  // state.pageSize = 10;


  const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;

  const getCarLogInDetails = async (id) => {
    // console.log(id, '입차');

    if (id === null) {
      setCarLogInDetails(null); // Clear the details if the ID is null
      setCarLogOutDetails(null); // Ensure out details are also cleared
      return; // Exit the function early
    }

    try {
      setLoading(true);
      setCarLogOutDetails(null);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: {
          Authorization: cookies.accessToken,
        },
      });
      console.log('response.data :: ', response.data);
      setCarLogInDetails(response.data); // Set the fetched details
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const getCarLogOutDetails = async (id) => {
    // console.log(id, '출차');

    if (id == null) {
      setCarLogOutDetails(null);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      setCarLogOutDetails(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }

  };
  // console.log(carLogInDetails, '상세');
  // console.log(carLogOutDetails, '상세');

  const excelDownload = () => {
    // console.log(data);
    const wb = XLSX.utils.book_new();
    let rows = [
      // ['차량구분', '차량번호', '입차일시', '출차일시']
      [
        { v: '차량구분', t: 's', s: { alignment: { horizontal: 'center' } } },
        { v: '차량번호', t: 's', s: { alignment: { horizontal: 'center' } } },
        // { v: '동', t: 's', s: { alignment: { horizontal: 'center' } } },
        // { v: '호수', t: 's', s: { alignment: { horizontal: 'center' } } },
        { v: '입차일시', t: 's', s: { alignment: { horizontal: 'center' } } },
        { v: '출차일시', t: 's', s: { alignment: { horizontal: 'center' } } }
      ]
    ];
    data.forEach((e) => {
      rows.push([
        e.typeText, e.originVehicleNumber ? e.originVehicleNumber : e.in.vehicleNumber, e.in.inOutTime, e.out ? e.out.inOutTime : ''
        // e.typeText, e.originVehicleNumber ? e.originVehicleNumber : e.in.vehicleNumber, e.dong, e.ho, e.in.inOutTime, e.out ? e.out.inOutTime : ''
      ]);
    });
    // console.log(rows);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      { wpx: 150 },
      { wpx: 150 },
      // { wpx: 150 },
      // { wpx: 150 },
      { wpx: 150 },
      { wpx: 150 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "입출차 내역");

    XLSX.writeFile(wb, "입출차 내역.xlsx");
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // const handleSearch = () => {
  //   const searchParams = [];
  //   searchParams.push({ key: 'startDate', value: selectedStartDate });
  //   searchParams.push({ key: 'endDate', value: selectedEndDate });
  //   // if (dateType === 'in') {
  //   //   searchParams.push({ key: 'inStartDate', value: selectedStartDate });
  //   //   searchParams.push({ key: 'inEndDate', value: selectedEndDate });
  //   //   searchParams.push({ key: 'outStartDate', value: '' });
  //   //   searchParams.push({ key: 'outEndDate', value: '' });
  //   // } else if (dateType === 'out') {
  //   //   searchParams.push({ key: 'outStartDate', value: selectedStartDate });
  //   //   searchParams.push({ key: 'outEndDate', value: selectedEndDate });
  //   //   searchParams.push({ key: 'inStartDate', value: '' });
  //   //   searchParams.push({ key: 'inEndDate', value: '' });
  //   // }
  //   searchParams.push({ key: carType.key, value: carType.value });
  //   searchParams.push({ key: searchOption.key, value: searchOption.value });
  //   // console.log(searchParams);
  //   onSearch(searchParams);
  // };


  const handleSearch = async () => {
    const searchParams = [];
    // Check if searchParams is empty
    try {
      setLoading(true); // Set loading state to true when search is initiated
      searchParams.push({ key: 'startDate', value: selectedStartDate });
      searchParams.push({ key: 'endDate', value: selectedEndDate });
      searchParams.push({ key: carType.key, value: carType.value });
      searchParams.push({ key: searchOption.key, value: searchOption.value });
      await onSearch(searchParams); // Await the search operation
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setLoading(false); // Set loading state to false when search is completed
    }
  };

  const searchOptions = [
    {
      label: '차량번호',
      value: 'number'
    }
  ];

  const dateOptions = [
    {
      label: '입차일시',
      value: 'in'
    },
    {
      label: '출차일시',
      value: 'out'
    }
  ];

  const carTypeOption = [
    {
      label: '전체',
      value: 'ALL'
    },
    {
      label: '관리',
      value: 'MEMBER'
    },
    {
      label: '비관리',
      value: 'VISIT'
    },
    {
      label: '미인식',
      value: 'UNKNOWN'
    },
    {
      label: '미등록',
      value: 'UNREGISTER'
    },
  ];

  const calculateStartPage = () => {
    return (Math.floor(pageIndex / pageUnit) * pageUnit) + 1;
  };

  const handlStartDateChange = (date) => {
    setStartDate(formatYMD(date));
    setShowCalendar(false);
  };

  const handlEndDateChange = (date) => {
    setEndDate(formatYMD(date));
    setShowCalendar(false);
  };

  // 미인식차량 스크롤 해제 css
  const detailsClass = (carLogInDetails && carLogInDetails.type === 'UNKNOWN') || (carLogOutDetails && carLogOutDetails.type === 'UNKNOWN') ? '' : 'fixed';

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef]);

  // const goToPageHandle = (page) => {
  //   // setCurrentPage(page);
  //   gotoPage(page);

  // };

  // useEffect(() => {
  //   console.log(`현재 페이지 : ${pageIndex + 1}`);
  //   const startPage = calculateStartPage();
  //   if (pages[0]) {

  //   }
  //   const maxPage = startPage + pageUnit - 1 > pageOptions.length + 1 ? pageOptions.length : startPage + pageUnit - 1;
  //   console.log(`${startPage + pageUnit - 1} / ${ pageOptions.length}`);
  //   for (let i = startPage; i <= maxPage; i++) {
  //     pages.push(i);
  //   }
  // }, [pageIndex]);

  // console.log(carLogInDetails.type, 'type');

  return (
    <div className='flex gap-5 relative'>
      <div className="flex flex-col gap-3 md:gap-7 2xl:gap-10 basis-3/5">
        <section className="data-table-common data-table-two rounded-lg bg-basicWhite py-4 shadow-md text-xs dark:border-strokedark  dark:bg-boxdark">
          <div className='flex flex-col gap-3 px-8 mb-3'>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex text-xl font-semibold'>
                  <div >검색기준</div>
                  <div>
                    &nbsp;&#40;총 <span className='text-basicponint'>{data.length}</span>건&#41;
                  </div>
                </div>
                <div className="flex items-center font-medium">
                  <div
                    className='cursor-pointer mr-2'
                    onClick={excelDownload}
                  >
                    <img src={ExcelLogo} />
                  </div>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-transparent pl-2"
                  >
                    {[5, 10, 20, 50].map((page) => (
                      <option key={page} value={page}>
                        {page}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='flex items-center justify-center py-2.5'>
                <div className='flex gap-4 w-full items-center justify-start'>
                  {/* <div className='my-auto font-semibold text-sm text-blue-800'>
                    차량현황
                  </div> */}
                  <div>
                    <DropdownSearch
                      options={carTypeOption}
                      onSelect={({ label, value }) => { setCarType({ ...carType, value: value }) }}
                    />
                  </div>
                  {/* <div>
                  <DropdownSearch
                    options={dateOptions}
                    onSelect={({ label, value }) => { setDateType(value) }}
                  />
                </div> */}
                  <div className='flex gap-2 items-center'>
                    <div className="relative w-40 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-basicponint dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                      {/* <input
                      type="text"
                      value={startDate}
                      onClick={() => { setShowCalendar(!showCalendar) }}
                      // onChange={(e) => setStartDate(e.target.value)}
                      className="w-full focus:outline-none"
                      placeholder=""
                    /> */}
                      <input
                        type="date"
                        value={selectedStartDate} // startDate 대신에 selectedDate를 사용
                        onChange={(event) => { handleChange(event, setSelectedStartDate) }}
                        className="w-full focus:outline-none"
                        placeholder="yyyy-mm-dd"
                        max={getCurrentDate()}
                      />
                      {/* {showCalendar && (
                      <div className='absolute z-50 top-full left-0 mt-1' ref={calendarRef}>
                        <Calendar onChange={handlStartDateChange} value={startDate} formatDay={(locale, date) => date.getDate().toString()} />
                      </div>
                    )} */}
                    </div>
                    <div>~</div>
                    <div className="w-40 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-basicponint dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                      {/* <input
                      type="text"
                      value={endDate}
                      onClick={() => { setShowCalendar(!showCalendar) }}
                      // onChange={(e) => setEndDate(e.target.value)}
                      className="w-full focus:outline-none"
                      placeholder=""
                    /> */}
                      <input
                        type="date"
                        value={selectedEndDate} // startDate 대신에 selectedDate를 사용
                        onChange={(event) => { handleChange(event, setSelectedEndDate) }}
                        className="w-full focus:outline-none"
                        placeholder="yyyy-mm-dd"
                        max={getCurrentDate()}
                      />
                      {/* {showCalendar && (
                      <div className='absolute z-50 top-full left-0 mt-1' ref={calendarRef}>
                        <Calendar onChange={handlEndDateChange} value={endDate} formatDay={(locale, date) => date.getDate().toString()} />
                      </div>
                    )} */}
                    </div>
                  </div>
                  {/* <div className='my-auto'>
                  차량번호
                </div> */}
                  <div className='flex'>
                    <div className='mr-4'>
                      <div className="w-35 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-basicponint dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                        <input
                          type="text"
                          value={searchOption.value}
                          onChange={(e) => setSearchOption({ ...searchOption, value: e.target.value })}
                          className="w-full focus:outline-none"
                          placeholder="차량번호..."
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type='button'
                        onClick={handleSearch}
                        className="inline-flex items-center justify-center rounded-md bg-basicponint w-full h-full px-8 text-center font-medium text-basicWhite hover:bg-basicdarkponint lg:px"
                      >검색</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          {loading ?
            <div className='w-full flex items-center justify-center py-20'>
              <SearchLoader />
            </div>
            :
            <>
              <table
                {...getTableProps()}
                className="text-center datatable-table border-b-tborder w-full table-auto border-collapse overflow-hidden break-words px-4 /*md:table-fixed*/ md:overflow-auto md:px-8"
              >
                <thead className='bg-thead'>
                  {headerGroups.map((headerGroup, key) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={key}>
                      {headerGroup.headers.map((column, key) => (
                        <th
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          key={key}
                        >
                          <div className="flex items-center justify-center">
                            <span className='mr-2 font-semibold text-sm'> {column.render('Header')}</span>
                            <SortIcon />
                          </div>
                        </th>
                      ))}
                      {/* <th >
                    <div className="flex items-center justify-center">
                      사진
                    </div>
                  </th> */}
                    </tr>
                  ))}
                </thead>


                <tbody {...getTableBodyProps()}>
                  {page.map((row, key) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={key}
                        onClick={() => {
                          setSelectedRowIndex(key); // 선택된 행의 인덱스 업데이트
                          // if (row.original['in']) {
                          //   getCarLogInDetails(row.original['in'].id); // 입차 정보가 있는 경우 해당 정보의 ID를 전달하여 함수 실행
                          // }
                          row.original['in'] ?
                            getCarLogInDetails(row.original['in'].id) // 입차 정보가 있는 경우 해당 정보의 ID를 전달하여 함수 실행
                            : null
                          // if (row.original['out']) {
                          //   getCarLogOutDetails(row.original['out'].id); // 출차 정보가 있는 경우 해당 정보의 ID를 전달하여 함수 실행
                          // }
                          row.original['out'] ? getCarLogOutDetails(row.original['out'].id) : null

                          // getCarLogInDetails(null);
                          // setCarLogOutDetails(null);
                        }}
                        className={selectedRowIndex === key ? 'bg-basicponint text-basicWhite hover:text-basicdark' : ''}
                      >
                        {row.cells.map((cell, key) => {
                          return (
                            <td
                              {...cell.getCellProps()} key={key}
                              className='cursor-pointer'
                            >
                              {cell.render('Cell')}
                            </td>
                          );
                        })}
                        {/* <td className='flex gap-3'>
                    {row.original['in'] ? (
                      // <CarLogDetailsModal buttonText={'입차'} id={row.original['in'].id} />
                      <button
                        className='text-primary'
                        onClick={() => { getCarLogInDetails(row.original['in'].id) }}
                      >
                        입차
                      </button>
                    ) : null}
                    {row.original['out'] ? (
                      // <CarLogDetailsModal buttonText={'출차'} id={row.original['out'].id}/>
                      <button
                        className='text-primary'
                        onClick={() => { getCarLogInDetails(row.original['out'].id) }}
                      >
                        출차
                      </button>
                    ) : null}
                  </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-between items-center border-t border-tborder px-8 pt-5 dark:border-strokedark">
                <p className="font-medium text-lg font-semibold">
                  총 <span className='text-basicponint'>{data.length}</span>건
                </p>
                <div className='flex items-center'>
                  <p className="font-medium mr-2">
                    {pageIndex + 1} / {pageOptions.length} 페이지
                  </p>
                  <div className="flex">
                    <button
                      className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-basicponint hover:text-white"
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z"
                          fill=""
                        />
                      </svg>
                    </button>

                    {/* {pageOptions.map((_page, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      gotoPage(index);
                    }}
                    className={`${
                      pageIndex === index && 'bg-primary text-white'
                    } mx-1 flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:bg-primary hover:text-white`}
                  >
                    {index + 1}
                  </button>
                ))} */}

                    <button
                      className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-basicponint hover:text-white"
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          }
        </section>
      </div>
      <div className={`basis-2/5 h-full`}>
        <div className={`flex flex-col gap-3 2xl:gap-3`}>
          {loading ? (
            null
          ) : carLogInDetails && carLogInDetails.files ? (
            <>
              <div className="rounded-lg p-4 bg-basicWhite shadow-md dark:border-strokedark dark:bg-boxdark">
                {/* <div className="text-lg font-semibold mb-2">입차 이미지</div> */}
                <div className="flex justify-between gap-2.5">
                  {/* <div className='flex w-full justify-between items-center'> */}
                  <div className="flex flex-col w-1/3 justify-start md:gap-1">
                    <div className="flex flex-col">
                      {/* <div className='text-indigo-500 font-semibold text-lg'>
                        {carLogInDetails && carLogInDetails.type === 'MEMBER' ? '세대' :
                          carLogInDetails.type === 'VISIT' ? '방문' :
                            carLogInDetails.type === 'UNKNOWN' ? '미인식' :
                              carLogInDetails.type === 'UNREGISTER' ? '미등록' : ''}
                      </div> */}
                      <div className="text-title-lg font-bold mb-1 text-gateopen">입차 이미지</div>
                      <div className='text-lg mb-3'>
                        {carLogInDetails.inOutTime}
                      </div>
                      <img
                        src={`data:image/jpg;base64,${carLogInDetails.files[0].content}`}
                        alt={`입차 이미지 1`}
                        className='w-[330px]'
                      />
                    </div>
                  </div>
                  <div className='w-2/3'>
                    <img
                      src={`data:image/jpg;base64,${carLogInDetails.files[1].content}`}
                      alt={`입차 이미지 2`}
                      className=''
                    // className='w-full obj/ect-cover'
                    // style={{ maxWidth: '100%', height: '' }}
                    />
                  </div>
                </div>
              </div>
            </>
            // carLogInDetails.files.map((file, index) => (
            //   // <span className="w-1/2 md:w-1/3" key={index}>
            //   <span className="" key={index}>
            //     <img src={`data:image/jpg;base64,${file.content}`} alt={`입차 이미지 ${index}`} />
            //   </span>
            // ))
          ) : null}
          {loading ? (
            null
          ) : carLogOutDetails && carLogOutDetails.files ? (
            <>
              <div className="rounded-lg p-4 bg-basicWhite shadow-md dark:border-strokedark dark:bg-boxdark">
                {/* <div className="text-lg font-semibold mb-2">출차 이미지</div> */}
                <div className="flex justify-between gap-2.5">
                  {/* <div className='flex w-full justify-between items-center'> */}
                  <div className="flex flex-col w-1/3 justify-between">
                    <div className="flex flex-col">
                      {/* <div className='text-indigo-500 font-semibold text-lg'>
                        {carLogOutDetails.type === 'MEMBER' ? '세대' :
                          carLogOutDetails.type === 'VISIT' ? '방문' :
                            carLogOutDetails.type === 'UNKNOWN' ? '미인식' :
                              carLogOutDetails.type === 'UNREGISTER' ? '미등록' : ''}
                      </div> */}
                      <div className="text-title-lg font-bold mb-1 text-gateclose">출차 이미지</div>
                      <div className='text-lg mb-3'>
                        {carLogOutDetails.inOutTime}
                      </div>
                      <img
                        src={`data:image/jpg;base64,${carLogOutDetails.files[0].content}`}
                        alt={`출차 이미지 1`}
                        className='w-full h-15'
                      />
                    </div>
                  </div>
                  <div className='w-2/3'>
                    <img
                      src={`data:image/jpg;base64,${carLogOutDetails.files[1].content}`}
                      alt={`출차 이미지 2`}
                      className='w-[330px]'
                    />
                  </div>
                </div>
              </div>
            </>
            // carLogOutDetails.files.map((file, index) => (
            //   <span className="" key={index}>
            //     <img src={`data:image/jpg;base64,${file.content}`} alt={`출차 이미지 ${index}`} />
            //   </span>
            // ))
          ) : (
            null
          )}
        </div>
      </div>
    </div >
  );
};

export default CarLogTable;