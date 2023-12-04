/* eslint-disable react/prop-types */
import React from 'react';
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Paper, Typography } from '@mui/material';

interface ChartData {
	date: string;
	present: number;
}

interface ChartComponentProps {
	data: ChartData[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
	return (
		<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
			<Typography variant="h6" gutterBottom>
				Present Chart
			</Typography>
			<ResponsiveContainer width="100%" height={200}>
				<LineChart
					data={data}
					margin={{
						top: 20, right: 30, left: 20, bottom: 30
					}}
				>
					<XAxis dataKey="date" />
					<YAxis domain={[0, 1]} />
					<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
					<Tooltip />
					<Line type="linear" dataKey="present" stroke="blue" dot={{ r: 5 }} />
				</LineChart>
			</ResponsiveContainer>
		</Paper>
	);
};

export default ChartComponent;
