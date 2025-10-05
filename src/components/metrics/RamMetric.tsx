import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

type PropsType = {
  percent: number,
  totalRam: number,
  usedRam: number,
  freeRam: number,
  loading: boolean
}

export default function RamMetric({ percent, totalRam, usedRam, freeRam, loading }: PropsType) {
  const series = [percent];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div>
        <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                RAM Usage
              </h3>
            </div>
          </div>
          <div className="relative ">
            <div className="max-h-[330px]" id="chartDarkStyle">
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={330}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Total RAM
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              {loading ? "" : `${totalRam} Mb`}
            </p>
          </div>

          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Used RAM
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              {loading ? "" : `${usedRam} Mb`}
            </p>
          </div>

          <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

          <div>
            <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
              Free RAM
            </p>
            <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              {loading ? "" : `${freeRam} Mb`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}