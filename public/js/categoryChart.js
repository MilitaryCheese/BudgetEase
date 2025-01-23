const categoryCtx = document.getElementById('categoryChartCanvas').getContext('2d');
const categoryChart = new Chart(categoryCtx, {
  type: 'doughnut',
  data: {
    labels: ['Food', 'Transport', 'Entertainment', 'Rent', 'Other'],
    datasets: [{
      label: 'Expenses by Category',
      data: [300, 150, 100, 500, 200],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0'],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'left'
      },
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
        font: {
          weight: 'bold'
        }
      }
    }
  },
  plugins: [ChartDataLabels]
});
