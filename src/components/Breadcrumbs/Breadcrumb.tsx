import { Link } from 'react-router-dom';
import Refresh from '../../images/icon/refresh.png';
interface BreadcrumbProps {
  pageName: string;
  rootPage?: string;
  refreshHandle?: () => void;
}
const Breadcrumb = ({ pageName, rootPage = 'Dashboard', refreshHandle }: BreadcrumbProps) => {
  return (
    // <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    // <div className="my-2.5 flex items-center">
    //   <div className='flex items-center gap-1'>
    //     <h2 className="text-title-md2 font-semibold text-basicdark dark:text-white">
    //       {pageName}
    //     </h2>
    //     {refreshHandle ? (<img src={Refresh} className='h-fit cursor-pointer' onClick={refreshHandle} />) : null}

    //   </div>

    //   <nav>
    //     <ol className="flex items-center gap-2">
    //       <li>
    //         <Link className="font-medium" to="#">
    //           {rootPage} /
    //         </Link>
    //       </li>
    //       <li className="font-medium text-basicponint">{pageName}</li>
    //     </ol>
    //   </nav>
    // </div>
    <div className='flex justify-end items-center mb-2.5'>
      {refreshHandle ? (<img src={Refresh} className='h-fit cursor-pointer mr-1.5' onClick={refreshHandle} />) : null}
      <nav>
        <ol className='flex'>
          <li className="font-medium text-basicdark">
            <Link to="#">
              {rootPage} /
            </Link>
          </li>
          <li className="font-medium text-basicponint">
            &nbsp;{pageName}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
