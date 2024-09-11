import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import { pageSizeState } from '../../state/atoms/pageSizeState';
import { pageNumberState } from '../../state/atoms/pageNumberState';
import { DetailsData, detailsDataState } from '../../state/atoms/detailsDataState';
import { EditData, editDataState } from '../../state/atoms/editDataState';
import { ValueType } from '../../common/Enum/valueType';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';
import DataTable from '../../components/DataTables/DataTable';
import { AllDeviceCameraParams, DeviceCameraData } from '../../types/device';
import ModalSave from '../../components/Modals/ModalSave';

const Device: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [deviceCameraData, setDeviceCameraData] = useState<DeviceCameraData[]>([]);
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);
  const [, setDetailsData] = useRecoilState(detailsDataState);
  const [, setEditData] = useRecoilState(editDataState);

  const deviceCameraUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_DEVICE_ENDPOINT;
  const getAllDeviceCamera = async () => {
    try {
      setLoading(true);
      const response = await axios.get(deviceCameraUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize,
          name: ""
        } as AllDeviceCameraParams,
      });
      
      setDeviceCameraData(response.data.content.map(c => {
        switch(c.inOutType) {
          case 'IN':
            return { ...c, inOutType: '입차' };
          case 'OUT':
            return { ...c, inOutType: '출차' };
          case 'BOTH':
            return { ...c, inOutType: '입출차' };
          default:
            return c;
        }
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllDeviceCamera();
  }, []);

  const deviceCameraColumns = [
    { Header: 'ID', accessor: 'id'},
    { Header: '아파트명', accessor: 'apartment.name'},
    // { Header: '시리얼 번호', accessor: 'serialNumber'},
    // { Header: 'MAC 주소', accessor: 'macAddress'},
    { Header: '모델명', accessor: 'modelName'},
    { Header: '내부IP', accessor: 'internalIp'},
    { Header: '내부포트', accessor: 'internalPort'},
    { Header: '외부IP', accessor: 'externalIp'},
    { Header: '외부포트', accessor: 'externalPort'},
    { Header: '카메라타입', accessor: 'inOutType'},
    // { Header: '어드민 ID', accessor: 'adminId'},
    // { Header: '어드민 PW', accessor: 'adminPassword'}

  ];

  const detailsHandler = async (id) => {
    try {
      const response = await axios.get(deviceCameraUrl + `/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });

      const apartmentUnitDetailsData = [];
      
      Object.keys(response.data).forEach((k) => {
        let detail: DetailsData = {
          key: '',
          label: '',
          value: '',
          valueText: '',
          visable: false
        };
        switch (k) {
          case 'apartment':
            detail.key = k;
            detail.label = '아파트명';
            detail.value = response.data[k]['name'];
            detail.valueText = convertValueToText(response.data[k]['name']);
            detail.visable = true;
            break;
          case 'serialNumber':
            detail.key = k;
            detail.label = '시리얼 번호';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'macAddress':
            detail.key = k;
            detail.label = 'MAC 주소';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'modelName':
            detail.key = k;
            detail.label = '모델명';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'internalIp':
            detail.key = k;
            detail.label = '내부 IP';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'internalPort':
            detail.key = k;
            detail.label = '내부 포트';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'externalIp':
            detail.key = k;
            detail.label = '외부 IP';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'externalPort':
            detail.key = k;
            detail.label = '외부 포트';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'inOutType':
            detail.key = k;
            detail.label = '카메라 타입';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'adminId':
            detail.key = k;
            detail.label = '어드민 ID';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'adminPassword':
            detail.key = k;
            detail.label = '어드민 PW';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          default:
            detail.key = k;
            detail.label = '';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = false;
            break;
        }
        apartmentUnitDetailsData.push(detail);
      });
      
      setDetailsData(apartmentUnitDetailsData);
    } catch (error) {
      
    }
  };

  const editHandler = async (id) => {
    try {
      const response = await axios.get(deviceCameraUrl + `/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });

      const apartmentEditData = [];
      
      Object.keys(response.data).forEach((k) => {
        let editData: EditData = {
          key: '',
          label: '',
          value: '',
          editable: false,
          visable: false,
          valueType: ValueType.Text
        };
        switch (k) {
          case 'apartment':
            editData.key = k;
            editData.label = '아파트명';
            editData.value = response.data[k]['name'];
            editData.editable = false;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'serialNumber':
            editData.key = k;
            editData.label = '시리얼 번호';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'macAddress':
            editData.key = k;
            editData.label = 'MAC 주소';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'modelName':
            editData.key = k;
            editData.label = '모델명';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'internalIp':
            editData.key = k;
            editData.label = '내부 IP';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'internalPort':
            editData.key = k;
            editData.label = '내부 포트';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Number;
            break;
          case 'externalIp':
            editData.key = k;
            editData.label = '외부 IP';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'externalPort':
            editData.key = k;
            editData.label = '외부 포트';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Number;
            break;
          case 'inOutType':
            editData.key = k;
            editData.label = '카메라 타입';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.SelectGroup;
            editData.selectGroupValues = [
              {
                label: "입차",
                value: "IN"
              },
              {
                label: "출차",
                value: "OUT"
              },
              {
                label: "입출차",
                value: "BOTH"
              },
            ];
            break;
          case 'adminId':
            editData.key = k;
            editData.label = '어드민 ID';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'adminPassword':
            editData.key = k;
            editData.label = '어드민 PW';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          default:
            editData.key = k;
            editData.label = '';
            editData.value = response.data[k];
            editData.editable = false;
            editData.visable = false;
            editData.valueType = ValueType.Text;
            break;
        }
        apartmentEditData.push(editData);
      });
      setEditData(apartmentEditData);
    } catch (error) {
      
    }
  };

  const deleteHandler = async (id) => {
    const deleteUrl = deviceCameraUrl + `/${id}`
    const response = await axios.delete(deleteUrl , {
      headers: {
        Authorization: cookies.accessToken
      }
    });
    getAllDeviceCamera();
  };

  const convertValueToText = (value) => {
    switch(value) {
      case 'COUNT':
        return '횟수';
      case 'TIME':
        return '시간';
      case 'NONE':
        return '없음';
      case true:
        return '예'
      case false:
        return '아니오'
      default:
        return value;
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="장치 목록" rootPage="장치" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {loading ? (
          <Loader />
        ) : (
          <DataTable tableData={deviceCameraData} column={deviceCameraColumns} hasDetailsMode={true} detailsHandler={detailsHandler} hasEditMode={true} editHandler={editHandler} hasDeleteMode={true} deleteHandler={deleteHandler} />
        )}
      </div>
      <ModalSave/>
    </DefaultLayout>
  );
};
export default Device;
