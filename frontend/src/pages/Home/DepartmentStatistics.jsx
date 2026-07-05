import { useEffect, useState } from "react";
import { API_BASE } from "../../services/adminApi";

function DepartmentStatistics() {
  const BASE_URL = API_BASE;

  const [statistics, setStatistics] = useState([]);

  const animateCounter = (target, callback) => {
    let start = 0;
    const speed = 40;

    const step = () => {
      start += Math.ceil(target / speed);

      if (start < target) {
        callback(start);
        requestAnimationFrame(step);
      } else {
        callback(target);
      }
    };

    step();
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/statistics/`)
      .then((res) => res.json())
      .then((data) => {
        const results = data?.results || data || [];

        // Boshlang'ich qiymatlar
        const initial = results.map((item) => ({
          ...item,
          displayValue: 0,
        }));

        setStatistics(initial);

        // Animatsiya
        results.forEach((item) => {
          animateCounter(Number(item.value) || 0, (value) => {
            setStatistics((prev) =>
              prev.map((stat) =>
                stat.id === item.id ? { ...stat, displayValue: value } : stat,
              ),
            );
          });
        });
      })
      .catch((error) => {
        console.error("Statistics fetch error:", error);
      });
  }, []);

  return (
    <section className="bg-white dark:bg-[#091728] text-[#317873]">
      <div className="container-custom py-6">
        <style>
          {`
            @keyframes lineMove {
              0% {
                transform: translateX(-120%);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              50% {
                opacity: 1;
              }
              100% {
                transform: translateX(220%);
                opacity: 0;
              }
            }

            .moving-stat-line {
              animation: lineMove 1.8s linear infinite;
            }
          `}
        </style>

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-3 dark:text-[#AAF0D1] text-[#091728]">
            Department Statistics
          </h2>

          <div className="relative w-24 h-1 mx-auto overflow-hidden rounded-full bg-[#d8f3ea] dark:bg-[#1f355f]">
            <div className="absolute top-0 left-0 h-full w-10 rounded-full bg-[#317873] moving-stat-line shadow-[0_0_12px_rgba(49,120,115,0.7)]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {statistics.map((item) => (
            <StatCard
              key={item.id}
              title={item.name}
              value={item.displayValue}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-[#1A2644] text-[#091728] dark:text-white rounded-lg shadow-darkblue p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>

      <div className="mt-2 text-sm sm:text-base font-semibold">{title}</div>
    </div>
  );
}

export default DepartmentStatistics;
