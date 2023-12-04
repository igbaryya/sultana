import * as React from 'react';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { t } from 'i18next';
import Text from 'components/common-components/Text';
import { Grid } from '@mui/material';

type Props = {
	schoolsResult: Record<string, number>;
};

export default function SchoolStatistics({ schoolsResult }: Props) {
	const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
	const [valueToOrderBy, setValueToOrderBy] = useState('students');

	const handleRequestSort = (property: string) => {
		const isAscending = (valueToOrderBy === property && orderDirection === 'asc');
		setOrderDirection(isAscending ? 'desc' : 'asc');
		setValueToOrderBy(property);
	};

	const sortedSchoolResults = Object.keys(schoolsResult)
		.sort((a, b) => {
			if (valueToOrderBy === 'students') {
				return orderDirection === 'asc'
					? schoolsResult[a] - schoolsResult[b]
					: schoolsResult[b] - schoolsResult[a];
			}
			if (valueToOrderBy === 'school') {
				return orderDirection === 'asc'
					? a[0].localeCompare(b[0], 'he')
					: b[0].localeCompare(a[0], 'he');
			}
			return 0;
		})
		.reduce((sortedResults: any, key) => {
			// eslint-disable-next-line no-param-reassign
			sortedResults[key] = schoolsResult[key];
			return sortedResults;
		}, {});
	let total = 0;
	return (
		<Paper sx={{ overflow: 'hidden', p: 2 }}>
			<Text bold translation="statistics.schoolTableLabel" textAlign="center" pb={10} />
			<TableContainer sx={{ maxHeight: 750 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell align="center">
								<TableSortLabel
									active={valueToOrderBy === 'students'}
									direction={valueToOrderBy === 'students' ? orderDirection : 'asc'}
									onClick={() => handleRequestSort('students')}
								>
									{t('statistics.students')}
								</TableSortLabel>
							</TableCell>
							<TableCell align="center">
								<TableSortLabel
									active={valueToOrderBy === 'school'}
									direction={valueToOrderBy === 'school' ? orderDirection : 'asc'}
									onClick={() => handleRequestSort('school')}
								>
									{t('statistics.school')}
								</TableSortLabel>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(sortedSchoolResults)
							.map((row) => {
								const val = Number(sortedSchoolResults[row]);
								total += val;
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row}>
										<TableCell align="center">
											{val}
										</TableCell>
										<TableCell align="center">
											{row}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<Grid container pt={2}>
				<Grid xs={5}>
					<Text translation="statistics.total" bold />
				</Grid>
				<Grid item xs={4}>
					<Text bold textAlign="left">
						{total}
					</Text>
				</Grid>
			</Grid>
		</Paper>
	);
}
