/* eslint-disable */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { t } from 'i18next';
import Text from 'components/common-components/Text';
import { Grid } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

type Props = {
	worriesData: Record<string, number>;
};
export default function WorriesTable({ worriesData }: Props) {
	const asKeys = Object.keys(worriesData);
	let total = 0;
	return (
		<Paper sx={{ padding: 2 }}>
			<Text bold translation="statistics.worryLevelsTableTitle" textAlign="center" pb={10} />
			<TableContainer component={Paper}>
				<Table aria-label="customized table">
					<TableBody>
						{asKeys.map((row) => {
							const worryCount = worriesData[row];
							total += Number(worryCount);
							return (
								<StyledTableRow key={row}>
									<StyledTableCell component="th" scope="row" align="right">
										{`${t('statistics.worryLevel')} ${row}`}
									</StyledTableCell>
									<StyledTableCell align="left">{worryCount}</StyledTableCell>
								</StyledTableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<Grid container pt={2}>
				<Grid xs={6}>
					<Text translation="statistics.total" bold fontSize={15} />
				</Grid>
				<Grid item xs={6} pl={2}>
					<Text bold textAlign="left">
						{total}
					</Text>
				</Grid>
			</Grid>
		</Paper>

	);
}
