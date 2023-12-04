/* eslint-disable */
import React from 'react';
import {
	Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { t } from 'i18next';
import { Grid, Paper } from '@mui/material';
import Text from 'components/common-components/Text';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
	attendance: Record<string, number>;
};

export function AttendanceGraph({ attendance }: Props) {
	const labels = Object.keys(attendance);
	const options = {
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
						 ctx.fillText(data, bar.x, bar.y - 2);
					   });
					   
			  });
			
			}
		  },
		plugins: {
			title: {
				display: true,
				text: t('statistics.contactedGraphTitle'),
				font: {
					size: 18
				}
			},
			legend: {
				display: false,
			},
			tooltip: {
				bodyFont: {
					size: 14
				}
			},
			datalabels: {
				display: true,
				align: 'end',
				anchor: 'end',
				color: '#555',
				formatter: (value: any) => {
					return `${value}`;
				}
			},
		},
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				ticks: {
					color: '#000',
					font: {
						size: 14
					}
				},
				grid: {
					display: false
				},
				barThickness: 70,
			},
			y: {
				
				ticks: {
					
					color: '#000',
					font: {
						size: 14
					}
				},
				grid: {
					display: true,
					color: '#e0e0e0'
				}
			}
		}
	};

	const data = {
		labels,
		datasets: [
			{
				label: '',
				data: Object.values(attendance),
				backgroundColor: '#205471',
				stack: 'Stack 0',
			},
		],
	};
	console.info(Object.values(attendance));
	return (
		<Paper sx={{ p: 2 }}>
			<Text translation="statistics.requestedTreatment" />
			<Grid xs={12} sx={{ minHeight: 300 }} item>
				<Bar options={options} data={data} />
			</Grid>
			
		</Paper>
	
	);
}
