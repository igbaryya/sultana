import { Button, Drawer, Grid } from '@mui/material';
import React, { useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Filter from './Filter';
import { FilterResult } from './Result';
import { useTranslation } from 'react-i18next';

import RiskTypeToggleButton from './RiskTypeToggleButton';

export function MainView() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	return (
		<Grid container m={2}>
			<Button variant='text' color='info' onClick={() => setOpen(true)}>
				<FilterAltIcon color='info'/>
				<span>{t('summary.filter')}</span>
			</Button>
			<Drawer
				anchor="right"
				open={open}
				onClose={() => setOpen(false)}
			>
				<Grid container>
					<Button
						onClick={() => setOpen(false)}
						style={{
							position: 'absolute',
							left: 10,
							top: 10
						}}
					>
						<CloseIcon />
					</Button>
					<Grid item xs={11} m={2}>
						<RiskTypeToggleButton />
					</Grid>
					<Filter />
				</Grid>
			</Drawer>
			<Grid item xs={12} sm={12} mt={2}>
				<FilterResult />
			</Grid>
		</Grid>
	)
}