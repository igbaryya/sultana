/* eslint-disable */
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AreaChartProps {
  data: any;
}

const ArrivalAreaChart: React.FC<AreaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="stepAfter" dataKey="arrived" stackId="1" fill="#4caf50" stroke="#4caf50" /> {/* Green area for arrived */}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ArrivalAreaChart;
