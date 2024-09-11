import React, { useState } from 'react';
import Logo from '../../images/logo/han_logo.png';
import DeleteAccount from './DeleteAccount';
import Privacy from './Privacy';
import Terms from './Terms';

const Support: React.FC = () => {
  
  const [active, setActive] = useState<number>(0);

  const handleToggle = (index: number) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  const faq = [
    {
      id: 1,
      title: '개인정보방침',
      content: <Privacy />
    },
    {
      id: 2,
      title: '이용약관',
      content: <Terms />
    },
    {
      id: 3,
      title: '회원탈퇴',
      content: <DeleteAccount />
    }
  ];

  return (
    <>
      <header>
        <div className='flex flex-col gap-5 items-center py-12'>
          <div>
            <img src={Logo} className='h-8' />
          </div>
          <h1 className='text-xl'>무엇을 도와드릴까요?</h1> 
        </div>
      </header>
      <section>
        <div className='px-10 lg:px-[10rem] 2xl:px-[30rem]'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='flex-row'>
              {faq.map((e, _) => (
                <div className="border border-stroke p-4 dark:border-strokedark dark:shadow-none sm:p-4">
                  <button
                    className={`flex w-full items-center gap-1.5 sm:gap-3 xl:gap-6 ${
                      active === e.id ? 'active' : ''
                    }`}
                    onClick={() => handleToggle(e.id)}
                  >
                    <div className="flex h-10.5 w-full max-w-10.5 items-center justify-center rounded-md bg-[#F3F5FC] dark:bg-meta-4">
                      <svg
                        className={`fill-primary stroke-primary duration-200 ease-in-out dark:fill-white dark:stroke-white ${
                          active === e.id ? 'rotate-180' : ''
                        }`}
                        width="18"
                        height="10"
                        viewBox="0 0 18 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.28882 8.43257L8.28874 8.43265L8.29692 8.43985C8.62771 8.73124 9.02659 8.86001 9.41667 8.86001C9.83287 8.86001 10.2257 8.69083 10.5364 8.41713L10.5365 8.41721L10.5438 8.41052L16.765 2.70784L16.771 2.70231L16.7769 2.69659C17.1001 2.38028 17.2005 1.80579 16.8001 1.41393C16.4822 1.1028 15.9186 1.00854 15.5268 1.38489L9.41667 7.00806L3.3019 1.38063L3.29346 1.37286L3.28467 1.36548C2.93287 1.07036 2.38665 1.06804 2.03324 1.41393L2.0195 1.42738L2.00683 1.44184C1.69882 1.79355 1.69773 2.34549 2.05646 2.69659L2.06195 2.70196L2.0676 2.70717L8.28882 8.43257Z"
                          fill=""
                          stroke=""
                        />
                      </svg>
                    </div>

                    <div>
                      <h4 className="text-left text-title-xsm font-medium text-black dark:text-white">
                        {e.title}
                      </h4>
                    </div>
                  </button>

                  <div
                    className={`mt-5 pl-1 mr-1 lg:pl-16.5 lg:mr-16.5 duration-200 ease-in-out ${
                      active === e.id ? 'block' : 'hidden'
                    }`}
                  >
                    {e.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Support;