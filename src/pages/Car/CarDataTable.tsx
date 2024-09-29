import { useMemo, useState } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination
} from 'react-table';
import ModalDetails from '../../components/Modals/ModalDetails';
import ModalEdit from '../../components/Modals/ModalEdit';
import ModalDelete from '../../components/Modals/ModalDelete';
import DropdownSearch from '../../components/Dropdowns/DropdownSearch';

const CarDataTable = ({
  column,
  tableData,
  onSearch,
  editHandler,
  deleteHandler
  // detailsHandler
}) => {

  const columns = useMemo(() => column, []);
  const data = useMemo(() => tableData, [tableData]);

  const [searchOptions, setSearchOptions] = useState([]);
  const [searchOption, setSearchOption] = useState({ key: 'number', value: '' });
  const [dateOption, setDateOption] = useState({ key: 'start', startValue: '', endValue: '' });
  const [allowDenyOption, setAllowDenyOption] = useState({ key: 'type', value: 'ALL' });
  const [expiredOption, setExpiredOption] = useState({ key: 'expire', value: 'true' });

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        // sortBy: [
        //   {
        //     id: 'id',
        //     desc: true ,
        //   },
        // ],
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

  // const detailsHandler = (id) => {};
  // const editHandler = (id) => {};
  // const deleteHandler = (id) => {};

  const dropDownSearchOptions = [
    {
      label: '차량번호',
      value: 'number'
    }
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
      // setSearchOptions(searchParams);
      // setSearchOptions(prevOptions => {
      //   const updatedOptions = [...prevOptions, ...searchParams];
      //   console.log(updatedOptions); // 이곳에서 출력
      //   return updatedOptions;
      // });
      // console.log(searchOptions);

    }
  };

  const handleSearch = () => {
    // console.log(dateOption);
    // console.log(allowDenyOption);
    // console.log(searchOption);
    // console.log('searchOptions param 생성 시작');
    const searchParams = [];
    searchParams.push({ key: allowDenyOption.key, value: allowDenyOption.value });
    searchParams.push({ key: searchOption.key, value: searchOption.value });
    searchParams.push({ key: expiredOption.key, value: expiredOption.value });
    // console.log(searchParams);
    onSearch(searchParams);
  };

  const allowDenyOptions = [
    {
      label: '전체',
      value: 'ALL'
    },
    {
      label: '허용',
      value: 'ALLOW'
    },
    {
      label: '금지',
      value: 'DENY'
    },
  ];

  const expiredOptions = [
    {
      label: '제외',
      value: 'true'
    },
    {
      label: '포함',
      value: 'false'
    }
  ];

  // const dateOptions = [
  //   {
  //     label: '시작일자',
  //     value: 'start'
  //   },
  //   {
  //     label: '종료일자',
  //     value: 'end'
  //   }
  // ];

  function isExpired(inputDate: string): boolean {
    const today: Date = new Date();
    const inputDateObj: Date = new Date(inputDate);

    // 현재 날짜와 입력된 날짜를 yyyy-MM-dd 형식으로 비교
    const todayFormatted: string = today.toISOString().slice(0, 10);
    const inputDateFormatted: string = inputDateObj.toISOString().slice(0, 10);

    // 오늘 날짜가 입력된 날짜보다 더 이후인 경우 false 반환
    return todayFormatted > inputDateFormatted;
  }

  return (
    <section className="data-table-common data-table-two rounded-lg bg-white py-4 shadow-md text-l dark:border-strokedark dark:bg-boxdark">
      <div className='flex flex-col gap-3'>
        <div className='px-8 mb-3.5'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-4'>
              {/* <div>
              <DropdownSearch
                options={dateOptions}
                onSelect={({label, value}) => {setDateOption({...dateOption, key:value})}}
              />
            </div>
            <div className='flex gap-2 items-center'>
              <div className="w-30 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                <input
                  type="text"
                  value={dateOption.startValue}
                  onChange={(e) => setDateOption({...dateOption, startValue: e.target.value})}
                  className="w-full focus:outline-none"
                  placeholder=""
                />
              </div>
              <div>~</div>
              <div className="w-30 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                <input
                  type="text"
                  value={dateOption.endValue}
                  onChange={(e) => setDateOption({...dateOption, endValue: e.target.value})}
                  className="w-full focus:outline-none"
                  placeholder=""
                />
              </div>
            </div> */}
              <div className='my-auto'>
                허용여부
              </div>
              <div className='mr-4'>
                <DropdownSearch
                  options={allowDenyOptions}
                  onSelect={({ label, value }) => { setAllowDenyOption({ ...allowDenyOption, value: value }) }}
                />
              </div>
              <div className='my-auto'>
                기간만료차량
              </div>
              <div className='mr-4'>
                <DropdownSearch
                  options={expiredOptions}
                  onSelect={({ label, value }) => { setExpiredOption({ ...expiredOption, value: value }) }}
                />
              </div>
              <div className='mr-4'>
                <DropdownSearch
                  options={dropDownSearchOptions}
                  onSelect={({ label, value }) => { setSearchOption({ ...searchOption, key: value }) }}
                />
              </div>
              <div className="w-60 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                <input
                  type="text"
                  value={searchOption.value}
                  onChange={(e) => setSearchOption({ ...searchOption, value: e.target.value })}
                  className="w-full focus:outline-none"
                  placeholder="Search..."
                  onKeyDown={handleKeyPress}
                />
                <svg
                  className="fill-basicponint hover:fill-basicdarkponint cursor-pointer"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={handleSearch}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.9572 11.9572C12.2501 11.6643 12.7249 11.6643 13.0178 11.9572L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L11.9572 13.0178C11.6643 12.7249 11.6643 12.2501 11.9572 11.9572Z"
                    fill=""
                  />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center font-medium">
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
          </div>
        </div>
        {/* <div className="flex justify-between px-8 border-b border-stroke pb-4 dark:border-strokedark">
          <div className='flex'>
          </div>
        </div> */}
      </div>

      <table
        {...getTableProps()}
        className="text-center datatable-table w-full table-auto border-b-tborder border-collapse overflow-hidden break-words px-4 /*md:table-fixed*/ md:overflow-auto md:px-8"
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
                    <span> {column.render('Header')}</span>

                    <div className="ml-2 inline-flex flex-col space-y-[2px]">
                      <span className="inline-block">
                        <svg
                          className="fill-current"
                          width="10"
                          height="5"
                          viewBox="0 0 10 5"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 0L0 5H10L5 0Z" fill="" />
                        </svg>
                      </span>
                      <span className="inline-block">
                        <svg
                          className="fill-current"
                          width="10"
                          height="5"
                          viewBox="0 0 10 5"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z"
                            fill=""
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </th>
              ))}
              {/* <th className='text-center' colSpan={1} role='columnheader' key={headerGroup.headers.length}>
                  <div className="flex items-center justify-center" >
                    <span>상세</span>
                  </div>
                </th>
                 */}

              <th colSpan={1} role='columnheader' key={headerGroup.headers.length + 1}>
                <div className="flex items-center justify-center" >
                  <span>수정</span>
                </div>
              </th>

              <th colSpan={1} role='columnheader' key={headerGroup.headers.length + 2}>
                <div className="flex items-center justify-center" >
                  <span>삭제</span>
                </div>
              </th>

            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={key}>
                {row.cells.map((cell, key) => {
                  return (
                    <td {...cell.getCellProps()} key={key} className={cell.column.id === 'endDate' && isExpired(cell.value) ? 'text-basicponint' : ''}>
                      {typeof cell.value === 'boolean' ?
                        cell.value ? '예' : '아니오'
                        : cell.value}
                      {cell.column.id === 'endDate' && isExpired(cell.value) ? (' (만료)') : null}
                    </td>
                  );
                })}

                {/* <td role='row' key={page.length} onClick={() => detailsHandler(row.original['id'])}>
                  <ModalDetails/>
                </td> */}

                <td role='row' key={page.length + 1} onClick={() => editHandler(row.original['id'])}>
                  <ModalEdit />
                </td>

                <td role='row' key={page.length + 2}>
                  <ModalDelete deleteHandler={deleteHandler} deleteData={row.cells} deleteId={row.original['id']} />
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between border-t border-stroke px-8 pt-5 dark:border-strokedark">
        <p className="font-medium">
          총 {data.length}건
          {/* {pageIndex + 1} / {pageOptions.length} 페이지 */}
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
                fill="#333"
              />
            </svg>
          </button>

          {pageOptions.map((_page, index) => (
            <button
              key={index}
              onClick={() => {
                gotoPage(index);
              }}
              className={`${pageIndex === index && 'bg-basicponint text-white'
                } mx-1 flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:bg-basicdarkponint hover:text-white`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-basicdarkponint hover:text-white"
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
    </section>
  );
};

export default CarDataTable;
