/* eslint-disable no-new */
/* eslint-disable no-undef */
require('chart.js');
window.onload = function () {
  const chartToken = document.getElementById('chartToken');
  if (chartToken) {
    const ctx = chartToken.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      options: {
        responsive: true,
        legend: {
          display: false
        }
      },
      data: {
        datasets: [{
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 5,
          weight: 4,
          data: [
            50,
            20,
            10,
            10,
            10
          ],
          backgroundColor: [
            'rgb(126, 113, 193)',
            'rgb(255, 183, 77)',
            'rgb(76, 210, 177)',
            'rgb(0, 188, 212)',
            'rgb(255, 63, 24)'
          ]
        }],
        labels: [
          'Presale',
          'JustSwap',
          'Staking Fund*',
          'Team',
          'Promotion'
        ]
      }
    });
  }
  const chartDistribution = document.getElementById('chartDistribution');
  if (chartDistribution) {
    const ctx2 = chartDistribution.getContext('2d');
    new Chart(ctx2, {
      type: 'doughnut',
      options: {
        responsive: true,
        legend: {
          display: false
        }
      },
      data: {
        datasets: [{
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: 5,
          weight: 4,
          data: [
            40,
            45,
            15
          ],
          backgroundColor: [
            'rgb(255, 183, 77)',
            'rgb(76, 210, 177)',
            'rgb(255, 63, 24)'
          ]
        }],
        labels: [
          'JustSwap',
          'Team',
          'Promotion'
        ]
      }
    });
  }
};
