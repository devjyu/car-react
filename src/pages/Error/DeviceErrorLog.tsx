import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DataTable from '../../components/DataTables/DataTable.tsx';
import SampleData from '../../common/sampleData.tsx';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';

const DeviceErrorLog: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="장치 오류 로그" rootPage="로그" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <DataTable tableData={SampleData.emplayeeData} column={SampleData.emplayeeColumn} />
      </div>
    </DefaultLayout>
  );
};
export default DeviceErrorLog;
