/* eslint-disable */
import React from 'react';
import {
	Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Grid, Paper } from '@mui/material';
import { t } from 'i18next';
import Text from 'components/common-components/Text';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
	worryLevels: Record<string, string>;
};

export function WorryLevelGraph({ worryLevels }: Props) {
	const labels = Object.keys(worryLevels);

	const options = {
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback(value: any) {
						return `${value}%`;
					},
				},
			},
		},
		animation: {
			onComplete: function() {
				
			  const chartInstance = this,
				ctx = (chartInstance as any).ctx;
	
			 
			  ctx.textAlign = "center";
			  ctx.textBaseline = "bottom";
	
			  (chartInstance as any).data.datasets.forEach(function(dataset: any, i: any) {
				const meta = (chartInstance as any) && (chartInstance as any).getDatasetMeta(i);
					  meta && meta.data && meta.data.forEach(function(bar: any, index: any) {
						 const data = dataset.data[index];
						 ctx.font = "bold 14px Arial";
						 ctx.fillStyle = "#000";
						 ctx.fillText(`${data}%`, bar.x, bar.y - 2);
					   });
					   
			  });
			
			}
		  },
		plugins: {
			title: {
				display: true,
				text: t('statistics.worryLevelGraphTitle'),
				font: {
					size: 18
				}
			},
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label(context: any) {
						let label = context.dataset.label || '';
						if (label) {
							label += ': ';
						}
						if (context.parsed.y !== null) {
							label += `${new Intl.NumberFormat().format(context.parsed.y)}%`;
						}
						return label;
					},
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	};
	const data = {
		labels,
		datasets: [
			{
				label: '',
				data: Object.values(worryLevels),
				backgroundColor: '#205471',
			},
		],
	};
	return (
		<Paper sx={{ p: 2 }}>
			<Text pb={18}>{' '}</Text>
			<Grid xs={12} sx={{ minHeight: 300 }} item>
				<Bar options={options} data={data} />
			</Grid>
		</Paper>
	
	);
}
