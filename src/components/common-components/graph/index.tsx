/* eslint-disable react/prop-types */
import React from 'react';
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Paper, Typography } from '@mui/material';

interface ChartData {
	date: string;
	present: number;
}

interface GraphComponentProps {
	data: ChartData[];
}

const GraphComponent: React.FC<GraphComponentProps> = ({ data }) => {
	return (
		<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
			<Typography variant="h6" gutterBottom>
				Present graph
			</Typography>
			<ResponsiveContainer width="100%" height={400}>
				<LineChart
					data={data}
					margin={{
						top: 20, right: 30, left: 20, bottom: 10
					}}
				>
					<XAxis dataKey="date" />
					<YAxis />
					<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="present" stroke="blue" dot={{ r: 5 }} />
				</LineChart>
			</ResponsiveContainer>
		</Paper>
	);
};

export default GraphComponent;
