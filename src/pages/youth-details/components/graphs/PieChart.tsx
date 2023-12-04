/* eslint-disable */
import React from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface PieChartProps {
  data: { date: string; arrived: boolean }[];
}

const PieChartComponent: React.FC<PieChartProps> = ({ data }) => {
  // Calculate total meetings and number of times the youth arrived
  const totalMeetings = data.length;
  const totalArrived = data.filter(item => item.arrived).length;

  // Prepare data for the PieChart
  const pieChartData = [
    { name: 'הגיע', value: totalArrived },
    { name: 'לא הגיע', value: totalMeetings - totalArrived },
  ];

  // Colors for the pie sections
  const colors = ['#4caf50', '#f44336'];

  return (
    <>
       <h3>סיכום נוכחות מתוך כלל ימי הלימודים ב-30 הימים האחרונים</h3>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={pieChartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          payload={[
            { value: `סהכ ימי לימודים: ${totalMeetings}`, type: 'square', color: '#50acde' },
            { value: `הגיע: (${((totalArrived / totalMeetings) * 100).toFixed(2)}%)`, type: 'circle', color: '#4caf50' },
            { value: `לא הגיע: (${(((totalMeetings - totalArrived) / totalMeetings) * 100).toFixed(2)}%)`, type: 'circle', color: '#f44336' },
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
    </>
  );
};

export default PieChartComponent;
