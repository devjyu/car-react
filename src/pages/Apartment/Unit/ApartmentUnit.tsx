import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import DataTable from '../../../components/DataTables/DataTable.tsx';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb.tsx';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pageSizeState } from '../../../state/atoms/pageSizeState.ts';
import { pageNumberState } from '../../../state/atoms/pageNumberState.ts';
import { DetailsData, detailsDataState } from '../../../state/atoms/detailsDataState.ts';
import { EditData, editDataState } from '../../../state/atoms/editDataState.ts';
import { AllApartmentUnitParams, ApartmentUnitData } from '../../../types/apartment.ts';
import axios from 'axios';
import { ValueType } from '../../../common/Enum/valueType.tsx';
import Loader from '../../../common/Loader/index.tsx';
import ModalSave from '../../../components/Modals/ModalSave.tsx';

const ApartmentUnit: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [apartmentUnitData, setApartmentUnitData] = useState<ApartmentUnitData[]>([]);
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);
  const [, setDetailsData] = useRecoilState(detailsDataState);
  const [, setEditData] = useRecoilState(editDataState);

  const apartmentUnitUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_UNIT_ENDPOINT;
  

  const getAllApartmentUnit = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apartmentUnitUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize,
          name: "",
          dong: "",
          ho: ""
        } as AllApartmentUnitParams,
      });
      
      setApartmentUnitData(response.data.content.map(c => {
        switch(c.limitType) {
          case 'NONE':
            return { ...c, limitType: '없음' };
          case 'COUNT':
            return { ...c, limitType: '횟수' };
          case 'TIME':
            return { ...c, limitType: '시간' };
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
    getAllApartmentUnit();
  }, []);

  const apartmentUnitColumns = [
    { Header: '동', accessor: 'dong'},
    { Header: '호', accessor: 'ho'}

  ];

  const detailsHandler = async (id) => {
    try {
      const response = await axios.get(apartmentUnitUrl + `/${id}`, {
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
          case 'dong':
            detail.key = k;
            detail.label = '동';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case 'ho':
              detail.key = k;
              detail.label = '호';
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
      const response = await axios.get(apartmentUnitUrl + `/${id}`, {
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
          case "dong":
            editData.key = k;
            editData.label = '동';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case "ho":
              editData.key = k;
              editData.label = '호';
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
    const deleteUrl = apartmentUnitUrl + `/${id}`
    const response = await axios.delete(deleteUrl , {
      headers: {
        Authorization: cookies.accessToken
      }
    });
    // console.log(response);
    getAllApartmentUnit();
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
      <Breadcrumb pageName="세대관리" rootPage="아파트" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {loading ? (
          <Loader />
        ) : (
          <DataTable tableData={apartmentUnitData} column={apartmentUnitColumns} hasDetailsMode={true} detailsHandler={detailsHandler} hasEditMode={true} editHandler={editHandler} hasDeleteMode={true} deleteHandler={deleteHandler} />
        )}
      </div>
    </DefaultLayout>
  );
};
export default ApartmentUnit;
