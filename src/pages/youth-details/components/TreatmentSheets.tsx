/* eslint-disable prefer-destructuring */
/* eslint-disable */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { t } from 'i18next';
import {Worry, Treatment} from 'interfaces/Treatments';
import DeleteConfirmationModal from './ConfirmationModal';
import DeleteIcon from '@mui/icons-material/Delete';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';

import {
	Button, Checkbox, FormControlLabel, Grid
} from '@mui/material';
import BottomAddButton from 'components/common-components/BottomAddButton';
import Modal from 'components/Modal';
import TreatmentForm from './TreatmentForm';
import { getInstance } from 'sdk';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { treatmentsSelector } from 'sdk/modules/youth/youthSelector';
import { toast } from 'react-toastify';
import { EMPTY_STRING, WorryMap, RateMap } from 'consts';
import Loading from 'components/Loading';
import { YouthDetails } from 'interfaces/YouthObject';

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
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));
const {
	youthApi: {
		updateTreatment, addTreatment, registerTreatments, prepareRateTextMap, deleteTreatment
	}
} = getInstance();
const MAX_LENGTH_TO_SHOW = 50;
function truncateText(text: string, maxLength = MAX_LENGTH_TO_SHOW) {
	if (text.length > maxLength) {
		return `${text.substring(0, maxLength)}...`;
	}
	return text;
}
type Props = {
	setYouthDetails: React.Dispatch<React.SetStateAction<YouthDetails>>;
	youthDetails: YouthDetails;
	updateYouth: any;
	youthId: any;
	refrehYouthDetails: any;

};
// eslint-disable-next-line max-lines-per-function
export default function TreatmentSheets({ setYouthDetails, youthDetails, updateYouth, youthId, refrehYouthDetails }: Props) {
	const currentUser = useSelector(currentUserSelector);

	const [isModalOpened, setOpenModal] = React.useState(false);
	const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
	const [deleteTreatmentId, setDeleteTreatmentId] = React.useState(null);

	const [loading, setLoading] = React.useState(false);
	const [valid, setValid] = React.useState(false);
	const [viewOnlySummary, setViewOnlySummary] = React.useState(false);
	const [selectedTreatment, selectTreatment] = React.useState<Treatment>({});
	const treatmentResults = useSelector(treatmentsSelector) as Record<string, Treatment> | null;
	const [isFilterByStreet, setFilterByStreet] = React.useState(true);
	const [isFilterByUpdatedData, setFilterByUpdatedData] = React.useState(true);
	const [isFilterByPhoneCall, setFilterByPhoneCall] = React.useState(true);
	const [isFilterByHotelVisit, setFilterByHotelVisit] = React.useState(true);
	const [isFilterByHomelVisit, setFilterByHomeVisit] = React.useState(true);
	const [isFilterBySultana, setFilterBySultana] = React.useState(true);

	React.useEffect(() => {
		const unsubA = registerTreatments();
		const unsubB = prepareRateTextMap();
		return () => {
			unsubA();
			unsubB();
		};
	}, []);
	if (!treatmentResults) {
		return (
			<Loading />
		);
	}
	let sortedKeys = Object.keys(treatmentResults);
	if (sortedKeys.length) {
		sortedKeys = Object.keys(treatmentResults).sort((key1: any, key2: any) => {
			const date1 = new Date((treatmentResults)[key1]?.date || new Date()).getTime();
			const date2 = new Date((treatmentResults)[key2]?.date || new Date()).getTime();
			// Sort in descending order
			return date2 - date1;
		});
	}

	const rows = sortedKeys.map((treatmentId: any) => {
		const treatment = treatmentResults[treatmentId];
		return { treatmentId, ...treatment };
	});

	const handleNewTreatment = () => {
		selectTreatment({});
		setViewOnlySummary(false);
		setOpenModal(true);
	};
	const handleDeleteConfirmation = (treatmentId: any) => {
		setDeleteTreatmentId(treatmentId);
		setDeleteModalOpen(true);
	  };
	  
	  const handleDeleteTreatment = async () => {
		// Call your API to delete the treatment using deleteTreatmentId
		// Example: const result = await deleteTreatmentApi(deleteTreatmentId);
		if (deleteTreatmentId) {
			await deleteTreatment(deleteTreatmentId);
		}
		// Handle success or failure
		// Example: if (result.success) { /* handle success */ } else { /* handle failure */ }
	  
		// Close the delete confirmation modal
		setDeleteModalOpen(false);
	  };
	const handleAddOrUpdateTreatment = async () => {
		if (!selectedTreatment || isEmpty(selectedTreatment)) {
			return;
		}
		if (selectedTreatment.date) {
			const currentDate = new Date();
			const selectedDate = new Date(selectedTreatment?.date);
			if (selectedDate > currentDate) {
				toast(t('youthDetails.youSelectedFutureDateMessage'), { type: 'error', position: toast.POSITION.TOP_LEFT });
				return;
			}
		}
		setLoading(true);
		let result: number;
		let isUpdate = false;
		await updateYouth(youthId, youthDetails);
		if (selectedTreatment?.treatmentId) {
			isUpdate = true;
			result = await updateTreatment(selectedTreatment.treatmentId, selectedTreatment);
		} else {
			if (!selectedTreatment.date || selectedTreatment.date === 'Invalid Date') {
				selectedTreatment.date = new Date().toString();
			}
			if (!selectedTreatment.worry) {
				selectedTreatment.worry = (youthDetails?.lastWorry as Worry) || WorryMap[0];
			}
			if (!selectedTreatment.rate) {
				selectedTreatment.rate = RateMap[0];
			}
			result = await addTreatment(selectedTreatment);
		}
		if (result !== 1) {
			toast(t(`youthDetails.failedTo${isUpdate ? 'Update' : 'Add'}`), { type: 'error', position: toast.POSITION.TOP_LEFT });
		} else {
			toast(t(`youthDetails.treatment${isUpdate ? 'Update' : 'Added'}`), {
				position: toast.POSITION.TOP_LEFT,
				type: 'success'
			});
			if(refrehYouthDetails) {
				refrehYouthDetails();
			}
		}
		setOpenModal(false);
		setLoading(false);
	};
	const getLoginDate = (d?: string) => {
		const date = new Date(d || new Date());
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};
	return (
		<>
			<Modal
				title={t(`youthDetails.${selectedTreatment?.treatmentId ? 'updateTreatment' : 'addTreatment'}`)}
				isOpened={isModalOpened}
				closeModal={() => setOpenModal(false)}
				primaryButton={{
					validateFields: valid,
					text: !isEmpty(selectedTreatment) ? t('youthDetails.update') : t('youthDetails.add'),
					onClick: () => handleAddOrUpdateTreatment(),
					loading
				}}
			>
				<TreatmentForm
					setYouthDetails={setYouthDetails}
					youthDetails={youthDetails}
					viewOnlySummary={viewOnlySummary}
					selectedTreatment={selectedTreatment || {}}
					updateFormTreatment={selectTreatment}
					validateFields={(flag: boolean) => {
						setValid(flag);
						return flag;
					}}
				/>
			</Modal>
			<Grid container p={2}>
				<Grid item xs={12}>
					<FormControlLabel
						style={{ margin: 0 }}
						control={(
							<Checkbox
								value={t('youthDetails.streetMeeting')}
								checked={isFilterByStreet}
								onChange={() => setFilterByStreet(!isFilterByStreet)}
							/>
						)}
						label={t('youthDetails.streetMeeting')}
					/>
					<FormControlLabel
						style={{ margin: 0 }}
						control={(
							<Checkbox
								value={t('youthDetails.hotelVisit')}
								checked={isFilterByHotelVisit}
								onChange={() => setFilterByHotelVisit(!isFilterByHotelVisit)}
							/>
						)}
						label={t('youthDetails.hotelVisit')}
					/>
					<FormControlLabel
						style={{ margin: 0 }}
						control={(
							<Checkbox
								value={t('youthDetails.homeVisit')}
								checked={isFilterByHomelVisit}
								onChange={() => setFilterByHomeVisit(!isFilterByHotelVisit)}
							/>
						)}
						label={t('youthDetails.homeVisit')}
					/>
					<FormControlLabel
						style={{ margin: 0 }}
						control={(
							<Checkbox
								value={t('youthDetails.sultana')}
								checked={isFilterBySultana}
								onChange={() => setFilterBySultana(!isFilterBySultana)}
							/>
						)}
						label={t('youthDetails.sultana')}
					/>
					<FormControlLabel
						style={{ margin: 0 }}
						control={(
							<Checkbox
								value={t('youthDetails.updateBelow')}
								checked={isFilterByUpdatedData}
								onChange={() => setFilterByUpdatedData(!isFilterByUpdatedData)}
							/>
						)}
						label={t('youthDetails.updateBelow')}
					/>
					<FormControlLabel
						style={{ margin: 0 }}
						control={(
							<Checkbox
								value={t('youthDetails.phoneCall')}
								checked={isFilterByPhoneCall}
								onChange={() => setFilterByPhoneCall(!isFilterByPhoneCall)}
							/>
						)}
						label={t('youthDetails.phoneCall')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<StyledTableCell align="center">{t('youthDetails.date')}</StyledTableCell>
									<StyledTableCell align="center">{t('youthDetails.rowType')}</StyledTableCell>
									<StyledTableCell align="center">{t('youthDetails.contactPerson')}</StyledTableCell>
									<StyledTableCell align="center">{t('youthDetails.details')}</StyledTableCell>
									{/* <StyledTableCell align="center">{t('youthDetails.suggestedSolutions')}</StyledTableCell> */}
									<StyledTableCell align="center">{t('youthDetails.rate')}</StyledTableCell>
									<StyledTableCell align="center">{t('youthDetails.worry')}</StyledTableCell>
									<StyledTableCell align="center">{t('youthDetails.treatmentContinuous')}</StyledTableCell>
									{currentUser?.isAdmin || currentUser?.isGuide ? (
										<StyledTableCell align="center">{t('youthDetails.deleteTreatment')}</StyledTableCell>
									): null}
									
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.filter((row) => {
									if (isFilterByStreet && isFilterByUpdatedData && isFilterByPhoneCall && isFilterByHotelVisit && isFilterBySultana && isFilterByHomelVisit) {
										return row;
									}
									if (isFilterByStreet && row.rowType === t('youthDetails.streetMeeting')) {
										return row;
									}
									if (isFilterByPhoneCall && row.rowType === t('youthDetails.phoneCall')) {
										return row;
									}
									if (isFilterByHotelVisit && row.rowType === t('youthDetails.hotelVisit')) {
										return row;
									}
									if (isFilterBySultana && row.rowType === t('youthDetails.sultana')) {
										return row;
									}
									if (isFilterByUpdatedData && row.rowType === t('youthDetails.updateBelow')) {
										return row;
									}
									if (isFilterByHomelVisit && row.rowType === t('youthDetails.homeVisit')) {
										return row;
									}
									return false;
								}).map((row) => (
						
									<StyledTableRow key={row.treatmentId}>
										
										<StyledTableCell align="center">
											<Button
												style={{
													color: '#007aff'
												}}
												type="button"
												variant="text"
												onClick={() => {
													setViewOnlySummary(false);
													setOpenModal(true);
													selectTreatment(row);
												}}
											>
												{
													getLoginDate(row.date)
												}
											</Button>
										</StyledTableCell>
										<StyledTableCell align="center">{row.rowType}</StyledTableCell>
										<StyledTableCell align="center">{row.contactPerson}</StyledTableCell>
										<StyledTableCell align="center">
											{truncateText(row.summary || EMPTY_STRING)}
											{
												((row.summary?.length || 1) > MAX_LENGTH_TO_SHOW) && (
													<Button
														style={{
															color: '#007aff',
															fontSize: 12
														}}
														type="button"
														variant="text"
														onClick={() => {
															setViewOnlySummary(true);
															setOpenModal(true);
															selectTreatment(row);
														}}
													>
														{t('youthDetails.showMore')}
													</Button>
												)
											}
								
										</StyledTableCell>
										{/* <StyledTableCell align="center">{row.suggestedSolutions}</StyledTableCell> */}
										<StyledTableCell align="center">{row.rate}</StyledTableCell>
										<StyledTableCell align="center">{row.worry || 1}</StyledTableCell>
										<StyledTableCell align="center">{row.treatmentContinuous}</StyledTableCell>
										{currentUser?.isAdmin || currentUser?.isGuide ? (
										<StyledTableCell align="center">
										<IconButton
												style={{
												color: 'black'  // Choose your desired color for the delete icon
												}}
												onClick={() => handleDeleteConfirmation(row.treatmentId)}
											>
												<DeleteIcon />
											</IconButton>
										</StyledTableCell>
										): null}
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			
			</Grid>
			<BottomAddButton onClick={handleNewTreatment} />
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDeleteTreatment}
				confirmLabel={t('youthDetails.deleteTreatmentConfirm')}
			/>
		</>
	);
}
