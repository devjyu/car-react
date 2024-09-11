import { useState } from 'react';
import Logo from '../../../images/logo/han_logo.png';
import axios from 'axios';

const QnA: React.FC = () => {

    const [title, setTitle] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const addQaA = async (e) => {
        e.preventDefault();

        if (title === '') {
            alert('제목을 입력해주세요.');
            return;
        }
        if (email === '') {
            alert('이메일을 입력해주세요.');
            return;
        }
        if (content === '') {
            alert('내용을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_SUPPORT_QNA_ENDPOINT, {
                title,
                email,
                content,
            });
            alert('질문 발송이 완료되었습니다.');
            setTitle('');
            setEmail('');
            setContent('');
        } catch (error) {
            alert(error.response.data.detail);
        }
    };

    return (
        <>
            <header>
                <div className='flex flex-col gap-5 items-center py-12'>
                    <div>
                        <img src={Logo} className='h-8' />
                    </div>
                    <h1 className='text-xl text-center'>궁금한 점에 대해 문의 해주시면<br />최대한 빠른 시일 내에 대답해드리겠습니다.</h1>
                </div>
            </header>
            <section>
                <div className='px-10 lg:px-[10rem] 2xl:px-[30rem] pb-12'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        {/* <!-- Input Fields --> */}
                        <div className='flex-row p-4 sm:p-4 dark:border-strokedark dark:shadow-none'>
                            <div className="flex flex-col gap-5.5 p-6.5">
                                {/* <h3 className="font-medium text-black dark:text-white">
                                Input/ Fields
                            </h3> */}
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        제목
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="제목을 입력해주세요"
                                        value={title}
                                        onChange={(e) => { setTitle(e.target.value) }}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        이메일
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="이메일을 입력해주세요"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        내용
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="내용을 입력해주세요"
                                        value={content}
                                        onChange={(e) => { setContent(e.target.value) }}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>
                                <button
                                    className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                    onClick={(e) => { addQaA(e) }}>
                                    제출
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default QnA