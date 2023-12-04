import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
				width: '100%',
			}}
		>
			<CircularProgress size={80} thickness={4} />
		</Box>
	);
}
