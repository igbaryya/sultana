/* eslint-disable max-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-tabs */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable padded-blocks */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react';
import {
	Button,
	Checkbox,
	FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography
} from '@mui/material';
import { t } from 'i18next';
import { Rate, Treatment, Worry } from 'interfaces/Treatments';
import { RateMap, WorryMap } from 'consts';
import { useSelector } from 'react-redux';
import { rateTextSelector } from 'sdk/modules/youth/youthSelector';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import { isEmpty } from 'lodash';
import { getInstance } from 'sdk';
import { YouthDetails } from 'interfaces/YouthObject';
import { format } from 'date-fns';


type Props = {
	setYouthDetails: React.Dispatch<React.SetStateAction<YouthDetails>>;
	youthDetails: YouthDetails;
	selectedTreatment: Treatment;
	viewOnlySummary?: boolean;
	updateFormTreatment: (updatedTreatment: Treatment) => void;
	validateFields: (flag: boolean) => boolean;

};
// eslint-disable-next-line max-lines-per-function
export default function TreatmentForm({
	 setYouthDetails, youthDetails, selectedTreatment, updateFormTreatment: parentUpdate, viewOnlySummary, validateFields,
}: Props) {
	const { youthApi: { getUsers } } = getInstance();
	const rateMapText = useSelector(rateTextSelector);
	const currentUser = useSelector(currentUserSelector);
	const [userList, setUserList] = useState([]);
	const [isCheckboxChecked, setIsCheckboxChecked] = useState(!!selectedTreatment.diffContact);
	const [isCheckboxCheckedHosen, setIsCheckboxCheckedHosen] = useState(!!youthDetails?.continueTreatmentHosen);
	const [isCheckboxCheckedShapach, setIsCheckboxCheckedShapach] = useState(!!youthDetails?.continueTreatmentShapach);
	const [isCheckboxCheckedEmotionalTherapy, setIsCheckboxCheckedEmotionalTherapy] = useState(!!youthDetails.continueTreatmentEmotionalTherapy);

	const [summaryOnly, setSummaryOnly] = useState(viewOnlySummary);
	const isValid = (treatment: Treatment) => {
		if ((isEmpty(treatment.contactPerson)) || (isEmpty(treatment.summary))) {
			return validateFields(false);
		}
		return validateFields(true);
	};
	const updateFormTreatment = (treatment: Treatment) => {
		isValid(treatment);
		
		if (!treatment.rate) {
			// eslint-disable-next-line
			treatment.rate = '1';
		}
		if (!treatment.rowType) {
			// eslint-disable-next-line
			treatment.rowType = t('youthDetails.streetMeeting');
		}
		if (!treatment.contactPerson) {
			// eslint-disable-next-line
			treatment.contactPerson = currentUser?.name;
		}
		
		parentUpdate(treatment);
	};
	React.useEffect(() => {
		getUsers().then((data) => {
			setUserList(Object.values(data));
		});
  	}, []);
	React.useEffect(() => {
		// updateYouth(id, youthDetails);

  	}, [isCheckboxCheckedShapach, isCheckboxCheckedHosen]);
	
	const to2Digis = (str: string) => (str?.length === 1 ? `0${str}` : str);
	const selectedDate = new Date(selectedTreatment.date || new Date());
	const dd = to2Digis(selectedDate.getDate().toString());
	const MM = to2Digis((selectedDate.getMonth() + 1).toString()); // Note: Months are zero-based, so we add 1
	const yyyy = selectedDate.getFullYear().toString();
	const [hh, mm] = selectedDate.toTimeString().split(':');
	const now = new Date();
	const dateText = `${dd}/${MM}/${yyyy}`;
	const timeText = `${to2Digis(hh)}:${to2Digis(mm)}:00`;
	const HandleNanTime= timeText ==="Invalid Date:undefined:00" ? format(now, 'HH:mm:ss') : timeText;

	/* function convertDateFormat(dateString: string, targetFormat: string) {
		const [day, month, year] = dateString.split(/\D+/);
		if (targetFormat === 'dd/mm/yyyy') {
			return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
		} if (targetFormat === 'yyyy-mm-dd') {
			return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		}
		return dateString;
	} */
	// console.log(convertDateFormat);
	if (summaryOnly) {
		return (
			<Grid container mb={2}>
				<Grid item xs={12} mt={2}>
					
					<TextField
						multiline
						placeholder={t('youthDetails.summary')}
						label={t('youthDetails.summary')}
						fullWidth
						value={selectedTreatment?.summary}
						rows={20}
						onChange={({ target: { value } }) => {
							updateFormTreatment({
								...selectedTreatment,
								summary: value
							});
						}}
					/>
				</Grid>
				<Button
					style={{
						color: '#007aff',
						fontSize: 13
					}}
					type="button"
					variant="text"
					onClick={() => {
						setSummaryOnly(false);
					}}
				>
					{t('youthDetails.updateAll')}
				</Button>
			</Grid>
		);
	}
	// date
	let formattedTreamentDate = selectedTreatment.date || new Date();
	if (!selectedTreatment.date) {
		selectedTreatment.date = formattedTreamentDate.toString();
	}
	if (selectedTreatment.date) {
		const originalDate = new Date(selectedTreatment.date.toString());
		const year = originalDate.getFullYear();
		const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
		const day = originalDate.getDate().toString().padStart(2, '0');
		formattedTreamentDate = `${year}-${month}-${day}`;
	}
	
	return (
		<Grid container mb={2}>
			<Grid item xs={12}>
				<Grid item xs={12} mt={2}>
					<InputLabel sx={{ right: 0 }} id="dateField">{t('youthDetails.date')}</InputLabel>
					<TextField
						fullWidth
						defaultValue={formattedTreamentDate}
						id="dateField"
						type="date"
						size="small"
						className="date-field"
						onBlur={({ target: { value } }) => {
							// let newDateValue = value;
							// 2023-12-05
							// console.log(value, 'date');
							/*	if (!newDateValue) {
								newDateValue = dateText;
							}

							updateFormTreatment({
								...selectedTreatment,
								date: new Date(`${convertDateFormat(newDateValue, 'dd/mm/yyyy')} ${timeText}`).toString(),
							});	*/
							
							updateFormTreatment({
								...selectedTreatment,
								date: new Date(`${value} ${HandleNanTime}`).toString(),
							});
						}}
					/>
					<Typography variant="subtitle2" sx={{ color: 'red' }}>{t('youthDetails.mustField')}</Typography>
				</Grid>
				<Grid item xs={12} mt={2}>
					
					<InputLabel sx={{ right: 0 }} id="timeField">{t('youthDetails.time')}</InputLabel>
					<TextField
						fullWidth
						size="small"
						type="time"
						defaultValue={HandleNanTime}
						id="timeField"
						className="date-field"
						onBlur={({ target: { value } }) => {
							let newTimeValue = value;
							if (!newTimeValue) {
								newTimeValue = HandleNanTime;
							}
							updateFormTreatment({
								...selectedTreatment,
								date: new Date(`${dateText} ${newTimeValue}`).toString()
							});
						}}
					/>
				</Grid>
				
				<Grid item xs={12} mt={2}>
					<FormControl fullWidth>
						<InputLabel id="rowTypeDropDown">{t('youthDetails.rowType')}</InputLabel>
						<Select
							labelId="rateDropDown"
							size="small"
							id="rowTypeDropDown_dropdown"
							label={t('youthDetails.rowType')}
							value={selectedTreatment?.rowType || t('youthDetails.streetMeeting')}
							onChange={({ target: { value } }) => {
								updateFormTreatment({
									...selectedTreatment,
									rowType: value
								});
							}}
						>
							{
								['streetMeeting', 'updateBelow', 'phoneCall', 'hotelVisit', 'sultana', 'homeVisit'].map((type) => {
									const typeText = t(`youthDetails.${type}`);
									return (
										<MenuItem value={typeText} key={`${type}_rate_item`}>
											{typeText}
										</MenuItem>
									);
								})
							}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} mt={2}>
					<FormControl fullWidth>
						<InputLabel id="rowTypeDropDown">{t('youthDetails.contactPerson')}</InputLabel>
						<Select
							labelId="rateDropDown"
							size="small"
							id="rowTypeDropDown_dropdown"
							label={t('youthDetails.contactPerson')}
							value={selectedTreatment.contactPerson || currentUser?.name}
							onChange={({ target: { value } }) => {
								updateFormTreatment({
									...selectedTreatment,
									contactPerson: value
								});
							}}
						>
							{
								userList && userList.length > 0 && userList.map((u: any) => {
									return (
										<MenuItem value={u.name} key={`${u.name}_rate_item`}>
											{u.name}
										</MenuItem>
									);
								})
							}
						</Select>
						<Typography variant="subtitle2" sx={{ color: 'red' }}>{t('youthDetails.mustField')}</Typography>
					</FormControl>
				</Grid>
				<Grid item xs={12} mt={2}>
					<FormControlLabel
						control={(
							<Checkbox
								checked={isCheckboxChecked}
								onChange={(event) => setIsCheckboxChecked(event.target.checked)}
								color="primary"
							/>
						)}
						label={t('youthDetails.contactWithElse')}
					/>
				</Grid>
				<Grid item xs={12} mt={2}>
					<TextField
						label={t('youthDetails.contactWithElseName')}
						fullWidth
						size="small"
						value={selectedTreatment?.diffContact}
						disabled={!isCheckboxChecked}
						onChange={({ target: { value } }) => {
							updateFormTreatment({
								...selectedTreatment,
								diffContact: value
							});
						}}
					/>
				</Grid>
				<Grid item xs={12} mt={2}>
					{t('youthDetails.askForContinue')}
					<FormControlLabel
						control={(
							<Checkbox
								checked={isCheckboxCheckedShapach}
								onChange={(event) => {
									setIsCheckboxCheckedShapach(event.target.checked);
									setYouthDetails({
										...youthDetails,
										continueTreatmentShapach: event.target.checked
									});
									updateFormTreatment({
										...selectedTreatment,
									});
								}}
								color="primary"
							/>
						)}
						label={t('youthDetails.shapach')}
					/>
					<FormControlLabel
						control={(
							<Checkbox
								checked={isCheckboxCheckedHosen}
								onChange={(event) => {
									setIsCheckboxCheckedHosen(event.target.checked);
									setYouthDetails({
										...youthDetails,
										continueTreatmentHosen: event.target.checked
									});
									updateFormTreatment({
										...selectedTreatment,
									});
								}}
								color="primary"
							/>
						)}
						label={t('youthDetails.hosen')}
					/>
					<FormControlLabel
						control={(
							<Checkbox
								checked={youthDetails.continueTreatmentEmotionalTherapy || isCheckboxCheckedEmotionalTherapy}
								onChange={(event) => {
									setIsCheckboxCheckedEmotionalTherapy(event.target.checked);
									setYouthDetails({
										...youthDetails,
										continueTreatmentEmotionalTherapy: event.target.checked
									});
									updateFormTreatment({
										...selectedTreatment,
									});
								}}
								color="primary"
							/>
						)}
						label={t('youthDetails.emotionalTherapy')}
					/>
				</Grid>
	
				<Grid item xs={12} mt={2}>
					
					<TextField
						multiline
						placeholder={t('youthDetails.details')}
						label={t('youthDetails.details')}
						fullWidth
						value={selectedTreatment?.summary}
						rows={2}
						onChange={({ target: { value } }) => {
							updateFormTreatment({
								...selectedTreatment,
								summary: value
							});
						}}
					/>
					<Typography variant="subtitle2" sx={{ color: 'red' }}>{t('youthDetails.mustField')}</Typography>
					<Button
						style={{
							color: '#007aff',
							fontSize: 13
						}}
						type="button"
						variant="text"
						onClick={() => {
							setSummaryOnly(true);
						}}
					>
						{t('youthDetails.expand')}
					</Button>
				</Grid>
				{/* <Grid item xs={12} mt={2}>
					<TextField
						multiline
						placeholder={t('youthDetails.suggestedSolutions')}
						label={t('youthDetails.suggestedSolutions')}
						fullWidth
						value={selectedTreatment?.suggestedSolutions}
						rows={2}
						onChange={({ target: { value } }) => {
							updateFormTreatment({
								...selectedTreatment,
								suggestedSolutions: value
							});
						}}
					/>
				</Grid> */}
				<Grid item xs={12} mt={2}>
					<FormControl fullWidth>
						<InputLabel id="rateDropDown">{t('youthDetails.rate')}</InputLabel>
						<Select
							labelId="rateDropDown"
							size="small"
							id="rateDropDown_select"
							label={t('youthDetails.rate')}
							value={selectedTreatment?.rate || 1}
							onChange={({ target: { value } }) => {
								updateFormTreatment({
									...selectedTreatment,
									rate: value as Rate
								});
							}}
						>
							{
								RateMap.map((rate) => {
									const rateText = rateMapText[rate] || rate;
									return (
										<MenuItem value={rate} key={`${rate}_rate_item`}>
											{rateText}
										</MenuItem>
									);
								})
							}
						</Select>
					</FormControl>
					<Grid item xs={12} mt={2}>
						<FormControl fullWidth>
							<InputLabel id="rateDropDown">{t('youthDetails.worry')}</InputLabel>
							<Select
								labelId="rateDropDown"
								size="small"
								id="rateDropDown_select"
								label={t('youthDetails.worry')}
								value={selectedTreatment?.worry || youthDetails?.lastWorry || WorryMap[0]}
								onChange={({ target: { value } }) => {
									updateFormTreatment({
										...selectedTreatment,
										worry: value as Worry
									});
								}}
							>
								{
									WorryMap.map((worry) => {
										return (
											<MenuItem value={worry} key={`${worry}_worry_item`}>
												{worry}
											</MenuItem>
										);
									})
								}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} mt={2}>
						<TextField
							multiline
							value={selectedTreatment?.treatmentContinuous}
							placeholder={t('youthDetails.treatmentContinuous')}
							label={t('youthDetails.treatmentContinuous')}
							fullWidth
							rows={2}
							onChange={({ target: { value } }) => {
								updateFormTreatment({
									...selectedTreatment,
									treatmentContinuous: value
								});
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
