import React from 'react';
import { Link } from 'react-router-dom'

const InboxMenuList: React.FC = () => {
  return (
    <ul className="flex flex-col gap-2">
      <li>
        <Link
          to="#"
          className="relative flex items-center gap-2.5 py-2.5 px-5 font-medium duration-300 ease-linear before:absolute before:left-0 before:h-0 before:w-1 before:bg-primary before:duration-300 before:ease-linear hover:bg-primary/5 hover:text-primary hover:before:h-full"
        >
          1동
        </Link>
      </li>

      <li>
        <Link
          to="#"
          className="relative flex items-center gap-2.5 py-2.5 px-5 font-medium duration-300 ease-linear before:absolute before:left-0 before:h-0 before:w-1 before:bg-primary before:duration-300 before:ease-linear hover:bg-primary/5 hover:text-primary hover:before:h-full"
        >
          2동
        </Link>
      </li>

      <li>
        <Link
          to="#"
          className="relative flex items-center gap-2.5 py-2.5 px-5 font-medium duration-300 ease-linear before:absolute before:left-0 before:h-0 before:w-1 before:bg-primary before:duration-300 before:ease-linear hover:bg-primary/5 hover:text-primary hover:before:h-full"
        >
          3동
        </Link>
      </li>

      <li>
        <Link
          to="#"
          className="relative flex items-center gap-2.5 py-2.5 px-5 font-medium duration-300 ease-linear before:absolute before:left-0 before:h-0 before:w-1 before:bg-primary before:duration-300 before:ease-linear hover:bg-primary/5 hover:text-primary hover:before:h-full"
        >
          4동
        </Link>
      </li>

      <li>
        <Link
          to="#"
          className="relative flex items-center gap-2.5 py-2.5 px-5 font-medium duration-300 ease-linear before:absolute before:left-0 before:h-0 before:w-1 before:bg-primary before:duration-300 before:ease-linear hover:bg-primary/5 hover:text-primary hover:before:h-full"
        >
          5동
        </Link>
      </li>
    </ul>
  );
};

export default InboxMenuList;
