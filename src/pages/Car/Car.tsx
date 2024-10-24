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
import ModalSave from '../../components/Modals/ModalSave';
import { AllCarParams, CarData } from '../../types/car';
import CarDataTable from './CarDataTable';
import { SearchOption } from '../../types/searchOption';
import { Pageable } from '../../types/pageable';

const Car: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [carData, setCarData] = useState<CarData[]>([]);
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);
  const [, setDetailsData] = useRecoilState(detailsDataState);
  const [, setEditData] = useRecoilState(editDataState);

  const carUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_ENDPOINT;
  const getAllCar = async () => {
    try {
      setLoading(true);
      const response = await axios.get(carUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize,
          type: 'ALL',
          number: '',
          sort: 'createDate,desc',
          expire: 'true'
        } as AllCarParams,
      });
      // console.log(response);

      setCarData(response.data.content.map(c => {
        switch (c.type) {
          case 'ALLOW':
            return { ...c, type: '허용' };
          case 'DENY':
            return { ...c, type: '금지' };
          default:
            return c;
        }
      }));
      // console.log(carData, 'ㄱㄱ');
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllCar();
  }, []);

  const deviceCameraColumns = [
    // { Header: 'ID', accessor: 'id'},
    // { Header: '아파트명', accessor: 'apartment.name'},
    { Header: '차량번호', accessor: 'vehicleNumber' },
    { Header: '전화번호', accessor: 'phone' },
    { Header: '시작일자', accessor: 'startDate' },
    { Header: '종료일자', accessor: 'endDate' },
    { Header: '메모', accessor: 'purpose' },
    { Header: '허용여부', accessor: 'type' }

  ];

  const detailsHandler = async (id) => {
    try {
      const response = await axios.get(carUrl + `/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });

      // console.log(response);

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
          case 'apartmentId':
            detail.key = k;
            detail.label = 'id';
            detail.value = response.data[k]['id'];
            detail.valueText = (response.data[k]['id']);
            detail.visable = false;
            break;
          case 'apartment':
            detail.key = k;
            detail.label = '아파트명';
            detail.value = response.data[k]['name'];
            detail.valueText = convertValueToText(response.data[k]['name']);
            detail.visable = true;
            break;
          case 'vehicleNumber':
            detail.key = k;
            detail.label = '차량번호';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'phone':
            detail.key = k;
            detail.label = '전화번호';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'purpose':
            detail.key = k;
            detail.label = '메모';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'startDate':
            detail.key = k;
            detail.label = '시작일자';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'endDate':
            detail.key = k;
            detail.label = '종료일자';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'type':
            detail.key = k;
            detail.label = '허용여부';
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
      const response = await axios.get(carUrl + `/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });

      const carEditData = [];

      Object.keys(response.data).forEach((k) => {
        let editData: EditData = {
          key: '',
          label: '',
          value: '',
          editable: false,
          visable: false,
          valueType: ValueType.SelectGroup
        };
        switch (k) {
          case 'apartmentId':
            editData.key = k;
            editData.label = 'apartmentid';
            editData.value = response.data[k]['id'];
            editData.editable = false;
            editData.visable = false;
            editData.valueType = ValueType.Number;
            break;
          case 'apartment':
            editData.key = k;
            editData.label = '아파트명';
            editData.value = response.data[k]['name'];
            editData.editable = false;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'vehicleNumber':
            editData.key = k;
            editData.label = '차량번호';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'phone':
            editData.key = k;
            editData.label = '전화번호';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'purpose':
            editData.key = k;
            editData.label = '목적';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case 'startDate':
            editData.key = k;
            editData.label = '시작일자';
            editData.value = response.data[k];
            // editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Date;
            break;
          case 'endDate':
            editData.key = k;
            editData.label = '종료일자';
            editData.value = response.data[k];
            // editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Date;
            break;
          case 'type':
            editData.key = k;
            editData.label = '허용여부';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.SelectGroup;
            editData.selectGroupValues = [
              {
                label: "허용",
                value: "ALLOW"
              },
              {
                label: "금지",
                value: "DENY"
              }
            ];
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
        carEditData.push(editData);
      });
      setEditData(carEditData);
    } catch (error) {

    }
  };

  const getCarLog = async (searchOptions: SearchOption[]) => {
    // console.log(searchOptions);
    const params = {
      page: pageNumber,
      size: pageSize,
      sort: 'createDate,desc'
    };

    searchOptions.forEach((option) => {
      params[option.key] = option.value;
    });

    // console.log(params);

    try {
      // setLoading(true);
      const response = await axios.get(carUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params
      });

      const repsonseCar = response.data.content.map(c => {
        switch (c.type) {
          case 'ALLOW':
            return { ...c, type: '허용' };
          case 'DENY':
            return { ...c, type: '금지' };
          default:
            return c;
        }
      });
      // console.log(repsonseCar);
      setCarData(repsonseCar);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    // console.log(id, 'id값');
    const deleteUrl = carUrl + `/${id}`;
    const response = await axios.delete(deleteUrl, {
      headers: {
        Authorization: cookies.accessToken
      }
    });
    getAllCar();
  };

  const convertValueToText = (value) => {
    switch (value) {
      case 'ALLOw':
        return '허용';
      case 'DENY':
        return '금지';
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
      <div className='mb-24'>
        <Breadcrumb pageName="차량 관리" rootPage="차량 관리" />
        <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
          {loading ? (
            <Loader />
          ) : (
            <CarDataTable tableData={carData} column={deviceCameraColumns} onSearch={getCarLog} editHandler={editHandler} deleteHandler={deleteHandler} />
          )}
        </div>
        <ModalSave />
      </div>
    </DefaultLayout>
  );
};
export default Car;
