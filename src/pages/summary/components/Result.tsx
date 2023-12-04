import { Grid } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { resultSelector } from 'sdk/modules/dashboard/dashboardSelector';
import ResultTable from './ResultTable';
import ResultChart from './ResultChart';

export function FilterResult() {
	const result = useSelector(resultSelector)
	if (!result || !Object.keys(result).length) {
		return <></>
	}
	return (
		<>
			<Grid item xs={12}>
				<ResultTable data={result}/>
			</Grid>
			<Grid xs={12} item>
				<ResultChart data={result} />
			</Grid>
		</>
		
	)
}