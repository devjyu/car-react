import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'right',
  },
  title: {
    text: '시간별 입출차 내역',
    align: 'left'
  },
  subtitle: {
    text: '금일 24시간 기준',
    align: 'right',
    style: {
      color: '#AAAAAA'
    }
  },
  colors: ['#C44D63', '#FBE3E3'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#FDF0F0',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    // strokeColors: ['#FDF0F0', '#80CAEE'],
    strokeColors: ['#C44D63', '#FBE3E3'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    tickAmount: 5,
    labels: {
      formatter(value) {
        return value.toFixed(0);
      }
    },
    // min: 0,
    // max: 100,
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    // followCursor: true,
    x: {
      show: true,
      formatter: (value, { seriesIndex, dataPointIndex, w }) => {
        // 첫 번째 시리즈(index 0)가 입차, 두 번째 시리즈(index 1)가 출차라고 가정
        const entry = w.globals.series[0][dataPointIndex]; // 입차 데이터
        const exit = w.globals.series[1][dataPointIndex]; // 출차 데이터
        const total = entry + exit;
        return `${value}시(합계: ${total})`;
      },
    },
  },
};

const ChartHour = ({
  chartData
}) => {
  const categories = chartData.map((data) => {
    return data.title.toString();
  });
  const entryData = chartData.map((data) => {
    return data.entry === null ? 0 : data.entry.toString();
  });
  // console.log(entryData, 'dldl')
  const exitData = chartData.map((data) => {
    return data.exit === null ? 0 : data.exit.toString();
  });
  options.xaxis.categories = categories;
  const [state, setState] = useState<ApexOptions>({
    series: [
      {
        name: '입차',
        data: entryData,
      },
      {
        name: '출차',
        data: exitData,
      },
    ],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      {/* <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">입차</p>
              <p className="text-sm font-medium">2024.01.01 - 2024.01.12</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">출차</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
        </div>
      </div> */}
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={370}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartHour;
