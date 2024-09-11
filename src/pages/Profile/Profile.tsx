import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DataTable from '../../components/DataTables/DataTable.tsx';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import axios from 'axios';
import Loader from '../../common/Loader/index.tsx';
import { useCookies } from 'react-cookie';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pageSizeState } from '../../state/atoms/pageSizeState.ts';
import { pageNumberState } from '../../state/atoms/pageNumberState.ts';
import { DetailsData, detailsDataState } from '../../state/atoms/detailsDataState.ts';
import { EditData, editDataState } from '../../state/atoms/editDataState.ts';
import { ValueType } from '../../common/Enum/valueType.tsx';
import { AllApartmentParams, ApartmentData } from '../../types/apartment.ts';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [apartmentData, setApartmentData] = useState<ApartmentData[]>([]);
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);
  const [, setDetailsData] = useRecoilState(detailsDataState);
  const [, setEditData] = useRecoilState(editDataState);
  

  const getAllApartment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_ENDPOINT, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize,
          name: "",
          address: ""
        } as AllApartmentParams,
      });

      setApartmentData(response.data.content.map(c => {
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
    getAllApartment();
  }, []);

  const apartmentColumns = [
    // { Header: 'ID', accessor: 'id'},
    { Header: '이름', accessor: 'name'},
    { Header: '주소', accessor: 'address'},
    { Header: '제한 타입', accessor: 'limitType'},
    { Header: '제한 시간(분 단위)', accessor: 'limitTime'},
    { Header: '제한 횟수', accessor: 'limitCount'},
    { Header: '거주 구분', accessor: 'type'},
    { Header: '만료일', accessor: 'expireDate'},
    // { Header: '요금제', accessor: 'expireDate'},
  ];

  const detailsHandler = async (id) => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_ENDPOINT + `/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });

      const apartmentDetailsData = [];
      
      Object.keys(response.data).forEach((k) => {
        let detail: DetailsData = {
          key: '',
          label: '',
          value: '',
          valueText: '',
          visable: false
        };
        switch (k) {
          case 'name':
            detail.key = k;
            detail.label = '이름';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "address":
            detail.key = k;
            detail.label = '주소';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "zoneNo":
            detail.key = k;
            detail.label = '우편번호';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "limitType":
            detail.key = k;
            detail.label = '제한 타입';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "limitTime":
            detail.key = k;
            detail.label = '제한 시간(분 단위)';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "limitCount":
            detail.key = k;
            detail.label = '제한 횟수';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "networkCheckSecond":
            detail.key = k;
            detail.label = '네트워크 체크 시간(초 단위)';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "type":
            detail.key = k;
            detail.label = '거주 구분';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "qna":
            detail.key = k;
            detail.label = 'QnA 사용 여부';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "faq":
            detail.key = k;
            detail.label = 'FAQ 사용 여부';
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
        apartmentDetailsData.push(detail);
      });
      
      setDetailsData(apartmentDetailsData);
    } catch (error) {
      
    }
  };

  const editHandler = async (id) => {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_ENDPOINT + `/${id}`, {
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
          case 'name':
            editData.key = k;
            editData.label = '이름';
            editData.value = response.data[k];
            editData.editable = false;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case "address":
            editData.key = k;
            editData.label = '주소';
            editData.value = response.data[k];
            editData.editable = false;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case "zoneNo":
            editData.key = k;
            editData.label = '우편번호';
            editData.value = response.data[k];
            editData.editable = false;
            editData.visable = false;
            editData.valueType = ValueType.Text;
            break;
          case "limitType":
            editData.key = k;
            editData.label = '제한 타입';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.SelectGroup;
            editData.selectGroupValues = [
              {
                label: "횟수",
                value: "COUNT"
              },
              {
                label: "시간",
                value: "TIME"
              },
              {
                label: "없음",
                value: "NONE"
              }
            ]
            break;
          case "limitTime":
            editData.key = k;
            editData.label = '제한 시간(분 단위)';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Number;
            break;
          case "limitCount":
            editData.key = k;
            editData.label = '제한 횟수';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Number;
            break;
          case "networkCheckSecond":
            editData.key = k;
            editData.label = '네트워크 체크 시간(초 단위)';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Number;
            break;
          case "type":
            editData.key = k;
            editData.label = '거주 구분';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.SelectGroup;
            editData.selectGroupValues = [
              {
                label: "아파트",
                value: "APARTMENT"
              },
              {
                label: "오피스텔",
                value: "OPFFICETEL"
              },
              {
                label: "빌라(연립주택)",
                value: "VILLA"
              },
              {
                label: "기타",
                value: "ETC"
              }
            ]
            break;
          case "qna":
            editData.key = k;
            editData.label = 'QnA 사용 여부';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Boolean;
            break;
          case "faq":
            editData.key = k;
            editData.label = 'FAQ 사용 여부';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Boolean;
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
    const deleteUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_APARTMENT_ENDPOINT + `/${id}`;
    const response = await axios.delete(deleteUrl , {
      headers: {
        Authorization: cookies.accessToken
      }
    });
    getAllApartment();
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
      <Breadcrumb pageName="아파트 정보" rootPage="아파트" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {loading ? (
          <Loader />
        ) : (
          <DataTable tableData={apartmentData} column={apartmentColumns} hasDetailsMode={true} detailsHandler={detailsHandler}/>
        )}
      </div>
      {/* <ModalSave/> */}
    </DefaultLayout>
  );
};

export default Profile;