import {useDaumPostcodePopup} from 'react-daum-postcode';

const AddressInput = ({
    saveData,
    setSaveData,
    addressData
}) => {
    const open = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');
    const handleComplete = (jusoData) => {
        const tempSaveData = saveData.map((data) => {
            switch (data.key) {
                case 'region1DepthName':
                    data.value = jusoData.sido
                    break;
                case 'region2DepthName':
                    data.value = jusoData.sigungu
                    break;
                case 'region3DepthName':
                    data.value = jusoData.bname
                    break;
                case 'roadName':
                    data.value = jusoData.roadname
                    break;
                case 'address':
                    data.value = jusoData.address
                    break;
                case 'zoneNo':
                    data.value = jusoData.zonecode
                    break;
                default:
                    break;
            }
            return data;
        });
        setSaveData(tempSaveData);
        // let fullAddress = data.address;
        // let extraAddress = '';

        // if (data.addressType === 'R') {
        //     if (data.bname !== '') {
        //     extraAddress += data.bname;
        //     }
        //     if (data.buildingName !== '') {
        //     extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
        //     }
        //     fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        // }

        // console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'

        // console.log(jusoData.sido); // region1DepthName
        // console.log(jusoData.sigungu); // region2DepthName
        // console.log(jusoData.bname); // region3DepthName
        // console.log(jusoData.roadname); //roadName
        // console.log(jusoData.address); //address
        // console.log(jusoData.zonecode); //zoneNo
        
    };
    
    const handleClick = () => {
      open({ onComplete: handleComplete });
    };

    return (
        <input
            onClick={handleClick}
            readOnly={true}
            value={addressData}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
    );
};

export default AddressInput;