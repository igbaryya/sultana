/* eslint-disable */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ border: '1px solid black', background: 'white', padding: '2px' }}>
        <p className="label">{`תאריך: ${formatDate(label)}`}</p>
        <p className="arrived">{`רמת דאגה: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
const formatDate = (value: any) => {
	const originalDate = new Date(value.toString());
	// const year = originalDate.getFullYear();
	const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
	const day = originalDate.getDate().toString().padStart(2, '0');
	const formattedDate = `${day}/${month}`;
	return formattedDate;
}
const LineChartComponent = ({ data }: any) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
		  angle={-45}
          tickFormatter={(value) => {
			return `${formatDate(value)}`;
		  }}
        />
        <YAxis  
			tick={{ dy: 0, dx: -30 }}

			ticks={[0, 1,2,3,4,5,6]}/>
        <Tooltip content={<CustomTooltip />} />
        <Legend payload={[{ value: 'רמת דאגה', type: 'square', id: 'rate', color: '#8884d8' }]} />
        <Line type="monotone" dataKey="rate" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
