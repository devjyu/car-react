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
    text: '최근 입출차 내역',
    align: 'left'
  },
  subtitle: {
    text: '최근 1주일 기준',
    align: 'right',
    style: {
      color: '#AAAAAA'
    }
  },
  // colors: ['#3C50E0', '#80CAEE'],
  colors: ['#C44D63', '#FBE3E3'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA',
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
    }
    // min: 0,
    // max: 100,
  },
  tooltip: {
    x: {
      formatter: function (value, { seriesIndex, dataPointIndex, w }) {
        const exit = w.globals.series[0][dataPointIndex];
        const entry = w.globals.series[1][dataPointIndex];
        const total = exit + entry;
        return `${value}요일(합: ${total})`
      }
    },
    y: {
      formatter: function (val) {
        return `${val}`
      }
    }
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartDay = ({
  chartData
}) => {
  const categories = chartData.map((data) => {
    switch (data.title) {
      case 'MONDAY':
        return '월';
      case 'TUESDAY':
        return '화';
      case 'WEDNESDAY':
        return '수';
      case 'THURSDAY':
        return '목';
      case 'FRIDAY':
        return '금';
      case 'SATURDAY':
        return '토';
      case 'SUNDAY':
        return '일';
      default:
        return '';
    }
  });
  const entryData = chartData.map((data) => {
    return data.entry === null ? 0 : data.entry.toString();
  });
  const exitData = chartData.map((data) => {
    return data.exit === null ? 0 : data.exit.toString();
  });
  options.xaxis.categories = categories;
  const [state, setState] = useState<ChartOneState>({
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
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={370}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartDay;
