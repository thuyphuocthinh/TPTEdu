(async function () {
  const data = [
    { month: "1", count: 10 },
    { month: "2", count: 20 },
    { month: "3", count: 15 },
    { month: "4", count: 25 },
    { month: "5", count: 22 },
    { month: "6", count: 30 },
    { month: "7", count: 28 },
  ];

  new Chart(document.getElementById("users"), {
    type: "bar",
    data: {
      labels: data.map((row) => row.month),
      datasets: [
        {
          label: "Số lượng người dùng theo tháng",
          data: data.map((row) => row.count),
        },
      ],
    },
  });
})();

(async function () {
  const data = [
    { month: "1", count: 1000 },
    { month: "2", count: 2000 },
    { month: "3", count: 1500 },
    { month: "4", count: 2500 },
    { month: "5", count: 2200 },
    { month: "6", count: 3000 },
    { month: "7", count: 2800 },
  ];

  new Chart(document.getElementById("revenue"), {
    type: "line",
    data: {
      labels: data.map((row) => row.month),
      datasets: [
        {
          label: "Doanh thu theo tháng",
          data: data.map((row) => row.count),
        },
      ],
    },
  });
})();

(async function () {
  const data = {
    labels: ["ReactJS", "NodeJS", "Machine Learning"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  new Chart(document.getElementById("courses"), {
    type: "pie",
    data: data,
  });
})();
