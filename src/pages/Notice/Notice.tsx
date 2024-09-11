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
import ModalSave from '../../components/Modals/ModalSave.tsx';
import { Pageable } from '../../types/pageable.ts';

interface NoticeData {
  title: string;
  content: string;
  createDate: string;
  updateDate: string;
  files: any;
}

const Notice: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [noticeData, setNoticeData] = useState<Pageable<NoticeData[]>>();
  const pageSize = useRecoilValue(pageSizeState);
  const pageNumber = useRecoilValue(pageNumberState);
  const [, setDetailsData] = useRecoilState(detailsDataState);
  const [, setEditData] = useRecoilState(editDataState);

  const noticeUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_NOTICE_ENDPOINT;

  const getAllNotice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(noticeUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          page: pageNumber,
          size: pageSize,
        },
      });

      setNoticeData(response.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllNotice();
  }, [pageNumber, pageSize]);

  const noticeColumns = [
    { Header: 'ID', accessor: 'id' },
    { Header: '제목', accessor: 'title' },
    { Header: '작성일', accessor: 'createDate' }
  ];

  const detailsHandler = async (id) => {
    try {
      const response = await axios.get(`${noticeUrl}/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });

      const noticeDetailsData = [];

      Object.keys(response.data).forEach((k) => {
        let detail: DetailsData = {
          key: '',
          label: '',
          value: '',
          valueText: '',
          visable: false
        };
        switch (k) {
          case 'title':
            detail.key = k;
            detail.label = '제목';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "content":
            detail.key = k;
            detail.label = '내용';
            detail.value = response.data[k];
            detail.valueText = convertValueToText(response.data[k]);
            detail.visable = true;
            break;
          case "files":
            detail.key = k;
            detail.label = '첨부파일';
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
        noticeDetailsData.push(detail);
      });

      setDetailsData(noticeDetailsData);
    } catch (error) {
      console.error('Error fetching notice details:', error);
    }
  };

  const editHandler = async (id) => {
    try {
      const response = await axios.get(`${noticeUrl}/${id}`, {
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
          case 'title':
            editData.key = k;
            editData.label = '제목';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Text;
            break;
          case "content":
            editData.key = k;
            editData.label = '내용';
            editData.value = response.data[k];
            editData.editable = true;
            editData.visable = true;
            editData.valueType = ValueType.Content;
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
      console.log(apartmentEditData, 'edit data');
    } catch (error) {
      console.error("Error fetching notice details for edit:", error);
    }
  };

  const deleteHandler = async (id) => {
    const deleteUrl = `${noticeUrl}/${id}`;
    try {
      await axios.delete(deleteUrl, {
        headers: {
          Authorization: cookies.accessToken
        }
      });

      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  const convertValueToText = (value) => {
    switch (value) {
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
      <Breadcrumb pageName="공지사항" rootPage="공지사항" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {loading ? (
          <Loader />
        ) : (
          <DataTable tableData={noticeData} column={noticeColumns} hasDetailsMode={true} detailsHandler={detailsHandler} hasEditMode={true} editHandler={editHandler} hasDeleteMode={true} deleteHandler={deleteHandler} />
        )}
      </div>
      <ModalSave />
    </DefaultLayout>
  );
};

export default Notice;
