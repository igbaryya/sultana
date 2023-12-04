/* eslint-disable */ 
import { Grid, Paper, Typography } from '@mui/material';
import Text from 'components/common-components/Text';
import AppColors from 'consts/colors';
import React from 'react';
import FaMale from '@mui/icons-material/Man';
import FaFemale from '@mui/icons-material/Woman';

type Props = {
	total: number;
	male: any;
	female: any;
};
export default function TotalYouths({  male, female, total }: Props) {
	return (
		<Paper style={{ padding: 20 }}>
			<Grid container xs={12}>
			<Grid item xs={12}>
				<Text textAlign="center" fontSize={40} color={AppColors.gray30}>{total}</Text>
			</Grid>
			<Grid xs={12}>
				<Text bold textAlign="center" translation="statistics.totalYouths" />
			</Grid>
			</Grid>
			<Grid container xs={12} style={{marginTop:'5px'}}>
				<Grid item xs={12} md={4} textAlign="center">
					<Typography variant="h6" color="text.secondary" gutterBottom>
						<FaMale style={{ color: '#4ADEDE', marginRight: '8px' }}/> {male}% 
					</Typography>
				</Grid>
				<Grid item xs={12} md={4} textAlign="center">
					
				</Grid>
				<Grid item xs={12} md={4} textAlign="center">
					<Typography variant="h6" color="text.secondary" gutterBottom>
					<FaFemale style={{ color: 'pink', marginRight: '8px' }}/>  {female}%
					</Typography>
				</Grid>
			</Grid>

			
		</Paper>
	);
}
