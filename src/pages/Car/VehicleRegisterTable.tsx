import { useMemo } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination
} from 'react-table';
import SortIcon from '../../components/Sort/SortIcon';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const VehicleRegisterTable = ({
  column,
  tableData,
  completeHandler
 }) => {

  const columns = useMemo(() => column, []);
  const data = useMemo(() => tableData, [tableData]);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'unit.dong',
            desc: false,
          },
          {
            id: 'unit.ho',
            desc: false,
          },
          {
            id: 'vehicle.vehicleNumber',
            desc: false,
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
    page ,
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
  
  const applyUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_REGISTER_APPLY_ENDPOINT;
  const denyUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_REGISTER_DENY_ENDPOINT;

  const applyHandler = async (id) => {
    try {
      const response = await axios.put(`${applyUrl}/${id}`, {}, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      
      alert('승인되었습니다.');
      completeHandler();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      
    }
  };

  const denyHandler = async (id) => {
    try {
      const response = await axios.put(`${denyUrl}/${id}`, {}, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      // console.log(response);
      alert('거부되었습니다.');
      completeHandler();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <section className="text-center data-table-common data-table-two rounded-sm border border-stroke bg-white py-4 shadow-default text-xs dark:border-strokedark  dark:bg-boxdark">
      <div className="flex justify-end border-b border-stroke px-8 pb-4 dark:border-strokedark">

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

      <table
        {...getTableProps()}
        className="datatable-table w-full table-auto border-collapse overflow-hidden break-words px-4 /*md:table-fixed*/ md:overflow-auto md:px-8"
      >
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={key}>
              {headerGroup.headers.map((column, key) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={key}
                >
                  <div className="flex items-center justify-center">
                    <span className='mr-2'> {column.render('Header')}</span>
                    <SortIcon/>
                  </div>
                </th>
              ))}
              <th></th>
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
                    <td {...cell.getCellProps()} key={key}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
                <td className='flex gap-3'>
                  <div
                    className='inline-flex items-center justify-center bg-primary py-2 px-5 text-center font-medium text-white cursor-pointer'
                    onClick={() => {
                      if (confirm('승인하시겠습니까?')) {
                        applyHandler(row.original['vehicle'].id);
                      }
                    }}
                  >
                    승인
                  </div>
                  <div
                    className='inline-flex items-center justify-center bg-red py-2 px-5 text-center font-medium text-white cursor-pointer'
                    onClick={() => {
                      if (confirm('승인을 거부하시겠습니까?')) {
                        denyHandler(row.original['vehicle'].id);
                      }
                    }}
                  >
                    거부
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between border-t border-stroke px-8 pt-5 dark:border-strokedark">
        <p className="font-medium">
          {pageIndex + 1} / {pageOptions.length} 페이지
        </p>
        <div className="flex">
          <button
            className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-white"
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

          {pageOptions.map((_page, index) => (
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
          ))}

          <button
            className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-white"
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

export default VehicleRegisterTable;
