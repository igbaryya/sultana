/* eslint-disable */
import React from 'react';
import {
  Box, Paper
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DashboardFilterResult } from 'sdk/modules/dashboard/dashboardInterface';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const prepareChartData = (data: DashboardFilterResult) => {
  const labels = Object.values(data)[0].map(item => item.displayValue);
  const datasets = Object.keys(data).map((category, index) => ({
    label: category,
    data: data[category].map(item => item.total),
    backgroundColor: `rgba(${index * 30 % 255}, ${(index * 60) % 255}, ${(index * 90) % 255}, 0.5)`,
    borderColor: `rgba(${index * 30 % 255}, ${(index * 60) % 255}, ${(index * 90) % 255}, 1)`,
    borderWidth: 1,
	hidden: index < 2 ? false : true,
  }));

  return {
    labels,
    datasets,
  };
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: '',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: '',
      },
    },
    y: {
      title: {
        display: true,
        text: '',
      },
      beginAtZero: true,
    },
  },
};

const ResultChart: React.FC<{ data: DashboardFilterResult }> = ({ data }) => {
  const chartData = prepareChartData(data);

  return (
    <Box sx={{ pt: 2 }}>
 	 <Paper elevation={3} sx={{ p: 2}}>
        <Bar data={chartData} options={options} />
      </Paper>
    </Box>
  );
};

export default ResultChart;