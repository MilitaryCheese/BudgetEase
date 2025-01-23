const incomeExpenseCtx = document.getElementById('incomeVsExpenseChartCanvas').getContext('2d');
const incomeExpenseChart = new Chart(incomeExpenseCtx, {
  type: 'bar',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Income',
        data: [4000, 4500, 4200, 4600, 4700],
        backgroundColor: '#43a047'
      },
      {
        label: 'Expenses',
        data: [3000, 2800, 3200, 2900, 3100],
        backgroundColor: '#e53935'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
