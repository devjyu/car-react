import React from 'react';
// import Start from '../Start';

const InboxList: React.FC = () => {
  return (
    <table className="h-full w-full table-auto">
      <thead>
        <tr className="flex border-y border-stroke dark:border-strokedark">
          <th className="w-[65%] py-6 pl-4 pr-4 lg:pl-10 xl:w-1/4">
            <p className="text-left font-medium">호수</p>
          </th>
          <th className="hidden w-3/5 py-6 px-4 xl:block">
            <p className="text-left font-medium">차량번호</p>
          </th>
        </tr>
      </thead>
      <tbody className="block h-full max-h-full overflow-auto py-4">
        <tr className="flex cursor-pointer items-center hover:bg-whiten dark:hover:bg-boxdark-2">
          <td className="w-[65%] py-4 pl-4 pr-4 lg:pl-10 xl:w-1/4">
            <div className="flex items-center">
              Musharof Chowdhury
            </div>
          </td>
          <td className="hidden w-3/5 p-4 xl:block">
            <p>Some note & Lorem Ipsum available alteration in some form.</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default InboxList;
