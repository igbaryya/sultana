/* eslint-disable */
import React from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, YAxis, Label } from 'recharts';

interface LineChartProps {
  data: { date: string; arrived: boolean }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ border: '1px solid black', background: 'white', padding: '2px' }}>
        <p className="label">{`תאריך: ${label}`}</p>
        <p className="arrived">{`${payload[0].value ? 'נכח' : 'לא נכח'}`}</p>
      </div>
    );
  }

  return null;
};
const yAxisLabelMap = {
  0: 'לא נוכח',
  1: 'נוכח',
};
const BarChartComponent: React.FC<LineChartProps> = ({ data }) => {
  // Convert boolean arrived to 1 for true, 0 for false
  const modifiedData = data.map(item => ({ date: item.date, arrived: item.arrived ? 1 : 0 }));
 const tickFormatter = (tick: any) => (yAxisLabelMap as any)[tick];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={modifiedData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
		  angle={-45}
          tickFormatter={(date) => {
			  const d = date.split('-')
			  return `${d[2]}/${d[1]}`;
		  }}
        />
        <YAxis 
			domain={[-0.5, 0, 1]}
			ticks={[0, 1]}
			tick={{ dy: 0, dx: -50 }}
			label={{  angle: -45, position: 'outsideLeft', offset: 20 }}
			tickFormatter={tickFormatter} />
        <Tooltip content={<CustomTooltip />} />
        <Legend payload={[{ value: 'נוכחות', type: 'square', id: 'arrived', color: '#4caf50' }]} />
        <Line type="linear" dataKey="arrived" stroke="#4caf50" dot={{ r: 5 }}>
          {modifiedData.map((entry, index) => (
            <Label key={index} value={entry.date} position="insideBottom" />
          ))}
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
