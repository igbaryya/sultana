/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Paper } from '@mui/material';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Legend,
  } from 'chart.js';


  ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Legend
  );
interface ChartComponentProps {
  treatmentList: any; // Replace 'any' with the actual type of treatmentList
}
interface ChartData {
	labels: string[];
	datasets: {
	  label: string;
	  data: number[];
	  borderColor: string;
	  fill: boolean;
	}[];
  }
const ChartComponent: React.FC<ChartComponentProps> = ({ treatmentList }) => {
	const [chartData, setChartData] = useState<ChartData | null>(null);
  
  useEffect(() => {
    if (treatmentList) {
		const treatments: any = [];
	  // Flatten the treatmentList
	  Object.entries(treatmentList).forEach(([groupId, group]: any) => {
		Object.entries(group).forEach(([treatmentId, treatment]: any) => {
		  treatments.push({
			date: treatment.date
			});
		});
	  });
	  const thirtyDaysAgo = new Date();
	  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	  // Sort the treatments by date
	  /*const sortedTreatments = treatments.sort(
		(a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
	  );*/
	  const sortedTreatments = treatments
  .filter((item: any) => new Date(item.date) >= thirtyDaysAgo)
  .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
	  // Create two maps
	  const countByDateMap = new Map<string, number>();
	  const cumulativeCountByDateMap = new Map<string, number>();
	  let cumulativeCount = 0;
  
	  // Iterate through sorted treatments to populate the maps
	  sortedTreatments.forEach(({ date }: any) => {
		const dateKey = format(new Date(date), 'dd/MM/yyyy');
  
		// Count by date map
		countByDateMap.set(dateKey, (countByDateMap.get(dateKey) || 0) + 1);
  
		// Cumulative count by date map
		cumulativeCount += 1;
		cumulativeCountByDateMap.set(dateKey, cumulativeCount);
	  });
  
	  // Now you have countByDateMap and cumulativeCountByDateMap populated
	  // console.log('Count by Date Map:', countByDateMap);
	  // console.log('Cumulative Count by Date Map:', cumulativeCountByDateMap);
  
	  // Now you have countByDateMap and cumulativeCountByDateMap populated
	  // console.log('Count by Date Map:', countByDateMap);
	  // console.log('Cumulative Count by Date Map:', cumulativeCountByDateMap);
      // console.log('cumulativeCounts', cumulativeCountsMap);
	  // console.log('dailyCountsArray', dailyCountsArray);
	  // console.log('dates', dates);
      /*setChartData({
       
      });*/
	  // Convert maps to arrays for Chart.js
      const countByDateData = Array.from(countByDateMap.entries()).map(([date, count]) => ({
        date,
        count,
      }));

      /*const cumulativeCountByDateData = Array.from(cumulativeCountByDateMap.entries()).map(
        ([date, cumulativeCount]) => ({
          date,
          cumulativeCount,
        })
      );*/

      // Create the chart data
      // Create the chart data
      // Create the chart data
      setChartData({
        labels: countByDateData.map((data) => data.date),
        datasets: [
          {
            label: 'פעילות יומית',
            data: countByDateData.map((data) => data.count),
            borderColor: 'blue',
            fill: false,
			
          },
         
        ],
      });
    }
  }, [treatmentList]);
  const options = {
    responsive: true,
	interaction: {
		intersect: false, // Ensure tooltips are not constrained by the mouse position
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
                     ctx.fillText(data, bar.x, bar.y - 2);
                   });
				   
		  });
		
		}
	  },
 
  
  plugins: {
	tooltip: {
		enabled: false, // Set this to false to disable tooltips
		intersect: false
	  },
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'פעילות יומית'
    },
  },
  
  };
  return (
	<Paper sx={{ p: 2 }}>      {chartData && (
        <Line
          data={chartData} options={options}
        />
      )}
    </Paper>
  );
};

export default ChartComponent;
