/* eslint-disable no-plusplus */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-multi-spaces */
/* eslint-disable key-spacing */
/* eslint-disable object-curly-spacing */
/* eslint-disable */
import {
	Button,
	Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, TextField, 
} from '@mui/material';
import CheckboxField from 'components/common-components/CheckboxField';
import Text from 'components/common-components/Text';
import {
	israeliCities, RateMap, WorryMap, EMPTY_STRING, GenderArr, ClassArr, ClassArrNames, ClassNumbersArr,  RISK_CHARACTERISTICS_ORDER, TypeOfRisksArr
} from 'consts';
import { Gender, YouthDetails, Class } from 'interfaces/YouthObject';
import React, {  useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { getInstance } from 'sdk';
import { t } from 'i18next';
import RBA from 'components/RBA';
import BottomAddButton from 'components/common-components/BottomAddButton';
import { isEmpty } from 'lodash';
import Modal from 'components/Modal';
import { toast } from 'react-toastify';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash/debounce';
import { Treatment } from 'interfaces/Treatments';
import TreatmentForm from './TreatmentForm';
import {Worry} from 'interfaces/Treatments';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import SchoolsDropDown from 'components/common-components/SchoolDropdown';
import AttendanceDropDown from 'components/common-components/AttendanceDropdown';
import { AddUserComponent } from 'pages/dashboard/components/AddUserComponent';

interface Props extends WithTranslation {
	youthDetails: YouthDetails;
	setNewYoutDetails?: (newYouth: YouthDetails) => void;
	id?: string;
	isNewYouth?: boolean;
	refrehYouthDetails?: any;
	getYouthDetails?: any;
}

const { youthApi: { updateYouth, addTreatment, updateTreatment,getUsers, searchYouthByPersonalId } } = getInstance();
function PersonalDetails({
	youthDetails: fromFB, id, isNewYouth, setNewYoutDetails, refrehYouthDetails, getYouthDetails
}: Props) {
	const [youthDetails, updateYoutDetails] = useState<YouthDetails>({ ...fromFB });
	// const [rerender, setRerender] = useState(false);
	const { id: dbId } = useParams() || {};

	const [loading, setLoading] = useState<boolean>(false);
	const [notesOnly, setNotesOnly] = useState(false);
	const [valid, setValid] = React.useState(false);
	const [selectedTreatment, selectTreatment] = React.useState<Treatment>({});
	const [viewOnlySummary, setViewOnlySummary] = React.useState(false);
	const [isModalNewUserOpened, setIsModalNewUserOpened] = React.useState(false);
	const [newReferrer, setNewReferrer] = React.useState<string | null>(null);
	const [userList, setUserList] = useState([]);
	const [idExists, setIdExists] = useState(false);
	const [isModalOpened, setOpenModal] = React.useState(false);
	const [isCheckboxCheckedHosen, setIsCheckboxCheckedHosen] = useState(!!youthDetails.continueTreatmentHosen);
	const [isCheckboxCheckedShapach, setIsCheckboxCheckedShapach] = useState(!!youthDetails.continueTreatmentShapach);
	const [isCheckboxCheckedEmotionalTherapy, setIsCheckboxCheckedEmotionalTherapy] = useState(!!youthDetails.continueTreatmentEmotionalTherapy);
	const currentUser = useSelector(currentUserSelector);
	const { previousTreatmentHistory, riskCharacteristics } = youthDetails;
		const [suggestions, setSuggestions] = useState<string[]>([]);
  	const [selectedCity, setSelectedCity] = useState<string>('');
 const getSuggestions = debounce((value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;


    setSuggestions(
      inputLength === 0
        ? []
        : israeliCities.filter(
            (city: any) =>
              city.toLowerCase().slice(0, inputLength) === inputValue
          )
    );
  }, 300);

  const onSuggestionsFetchRequested = ({ value }: any) => {
    getSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const renderSuggestion = (suggestion: any) => <div>{suggestion}</div>;

  const onSuggestionSelected = (_: any, { suggestion }: any) => {
    setSelectedCity(suggestion);
    setYouthDetails({ ...youthDetails, city: suggestion });
  };

  const inputProps = {
    placeholder: t('youthDetails.City'),
	label: t('youthDetails.City'),
    value: youthDetails.city || selectedCity,
    onChange: (_: any, { newValue }: any) => {
      setSelectedCity(newValue);
      setYouthDetails({ ...youthDetails, city: newValue });
    },
  };
	const setYouthDetails = (youth: YouthDetails) => {
		updateYoutDetails(youth);
		if (isNewYouth && setNewYoutDetails) {
			setNewYoutDetails(youth);
		}
	};
	const handleChangeLang = ({ target: { value, checked } }: any) => {
		if (!youthDetails.languages) {
			youthDetails.languages = [];
		}
		const index = youthDetails.languages.findIndex((l) => l === value);
		if (index !== -1) {
			youthDetails.languages.splice(index, 1);
		}
		if (checked) {
			youthDetails.languages.push(value);
		}
		setYouthDetails({ ...youthDetails });
	};
	const handleSave = async () => {
		if (id) {
			setLoading(true);
			// null check for instructor
			if (youthDetails.responsibleInstructor === '') {
				youthDetails.responsibleInstructor = 'NA';
			}
			if (idExists) {
				toast(t('youthDetails.youthAlreadyExists'), { type: 'error',position: toast.POSITION.TOP_LEFT, });
				setLoading(false);
				return;
			}
			await updateYouth(id, youthDetails);
			
			if (refrehYouthDetails) {
				refrehYouthDetails();
			}
			setLoading(false);
			toast(t('youthDetails.youthUpdatedSuccessfully'), { type: 'success',position: toast.POSITION.TOP_LEFT  });
		}
	};

	const handleNewTreatment = () => {
		selectTreatment({});
		setViewOnlySummary(false);
		setOpenModal(true);
	};

	const handleAddOrUpdateTreatment = async () => {
		// if(id){
		// 	await updateYouth(id, youthDetails);
		// }
		if (!selectedTreatment || isEmpty(selectedTreatment)) {
			return;
		}
		setLoading(true);
		let result: number;
		let isUpdate = false;
		if (selectedTreatment.date) {
			const currentDate = new Date();
			const selectedDate = new Date(selectedTreatment?.date);
			if (selectedDate > currentDate) {
				toast(t('youthDetails.youSelectedFutureDateMessage'), { type: 'error',position: toast.POSITION.TOP_LEFT, });
				return;
			}
		}
		if (id) {
			// in case for updates in Hosen and Shapach
			await updateYouth(id, youthDetails);
			setYouthDetails({ ...youthDetails });
		}
		if (selectedTreatment?.treatmentId) {
			isUpdate = true;
			result = await updateTreatment(selectedTreatment.treatmentId, selectedTreatment);
		} else {
			if (!selectedTreatment.date || selectedTreatment.date === 'Invalid Date') {
				selectedTreatment.date = new Date().toString();
			}
			if (!selectedTreatment.worry) {
				// eslint-disable-next-line
				selectedTreatment.worry = (youthDetails?.lastWorry as Worry) || WorryMap[0];
			}
			if (!selectedTreatment.rate) {
				// eslint-disable-next-line
				selectedTreatment.rate = RateMap[0];
			}
			result = await addTreatment(selectedTreatment);
		}
		if (result !== 1) {
			toast(t(`youthDetails.failedTo${isUpdate ? 'Update' : 'Add'}`), { type: 'error',position: toast.POSITION.TOP_LEFT, });
		} else {
			toast(t(`youthDetails.treatment${isUpdate ? 'Update' : 'Added'}`), { type: 'success',position: toast.POSITION.TOP_LEFT, });
			if (getYouthDetails && refrehYouthDetails) {
				// handle a case that treatment was updated so need to re-render the component to load the new worry
				const d = await getYouthDetails();
				setYouthDetails({...(d as YouthDetails)});
				refrehYouthDetails();
				//setRerender(!rerender); 
			}
		}
		setOpenModal(false);
		setLoading(false);
	};

	const areDatesPastSevenDays = (lastAvailablityAtZoomValue: any, lastAvailabilityAtVentureValue: any): any => {
		const today = new Date();
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(today.getDate() - 7);

		const lastAvailablityAtZoom = new Date(lastAvailablityAtZoomValue);
		const lastAvailabilityAtVenture = new Date(lastAvailabilityAtVentureValue);

		return lastAvailablityAtZoom < sevenDaysAgo && lastAvailabilityAtVenture < sevenDaysAgo;
	};
	const ageCalculator = (g: any) => {
		const birthDate = new Date(g);
		const currentDate = new Date();
		let age = currentDate.getFullYear() - birthDate.getFullYear();
		if (
			currentDate.getMonth() < birthDate.getMonth()
  || (currentDate.getMonth() === birthDate.getMonth()
    && currentDate.getDate() < birthDate.getDate())
		) {
			age--;
		}
		return Number.isNaN(age) ? 'NA' : age.toString();
	};
	React.useEffect(() => {
		getUsers().then((data) => {
			setUserList(Object.values(data));
		});
  	}, []);

	if (notesOnly) {
		return (
			<Grid container mb={2}>
				<Grid item xs={12} mt={2}>
					<TextField
						multiline
						label={t('youthDetails.notes')}
						fullWidth
						value={youthDetails?.notes}
						rows={20}
						onChange={({ target: { value } }) => {
							setYouthDetails({
								...youthDetails,
								notes: value
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
						setNotesOnly(false);
					}}
				>
					{t('youthDetails.updateAll')}
				</Button>
			</Grid>
		);
	}
	
	return (
		<>
		{	isModalNewUserOpened && 
				<AddUserComponent
					isModalOpened={isModalNewUserOpened}
					setOpenModal={setIsModalNewUserOpened}
					fromPersonalDetails={true}
								addedNewReferrer={(name: string) => {
								setNewReferrer(name)
								youthDetails.referrer = name;
								setYouthDetails({ ...youthDetails });
								}}
							/>
					}
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
			<Grid container justifyContent="center">
				<Grid item xs={12} md={5} lg={3} mx={1} padding={2}>
					<TextField
						fullWidth
						value={youthDetails.id}
						placeholder={t('youthDetails.ID')}
						label={t('youthDetails.ID')}
						margin="normal"
						size="small"
						error={!/^\d{9}$/.test(youthDetails.id || EMPTY_STRING) || idExists}
						InputProps={{
							readOnly: !currentUser?.isAdmin && (isNewYouth && !currentUser?.isGuide),

						}}
						onChange={ ({ target: { value } }) => {
							// console.log(value);
							if (currentUser?.isAdmin || (currentUser?.isGuide)) {
								searchYouthByPersonalId(value).then((data) => {
									// console.log('found', data);
									// console.log('from FB', fromFB);
									// console.log('db Id', dbId);
									if (data && Object.keys(data).length > 0) {
										if (Object.keys(data).length === 1 && Object.keys(data)[0] !== dbId) {
											const firstName = dbId && data[Object.keys(data)[0]]?.firstName;
											const lastName = dbId && data[Object.keys(data)[0]]?.lastName;
											const phoneNumber = dbId && data[Object.keys(data)[0]]?.phoneNumber;

											const personalDetails = firstName || lastName ? 
											`${t('youthDetails.PersonalDetails')}: ${firstName || ''} ${lastName || ''}<br/>` : '';

											const phoneDetails = phoneNumber ? 
											`${t('youthDetails.PhoneNumber')}: ${phoneNumber}<br/>` : '';

											toast(
											<div dangerouslySetInnerHTML={{ __html: `
												${t('youthDetails.youthAlreadyExists')}<br/><br/>
												${personalDetails}
												${phoneDetails}
											` }} />, 
											{ 
												type: 'error', 
												position: toast.POSITION.TOP_LEFT 
											}
											);
											setIdExists(true);
										}
									} else {
										setIdExists(false);
									}

								});
								youthDetails.id = value;
								setYouthDetails({ ...youthDetails });
							}
						}}
					/>
					<TextField
						fullWidth
						value={youthDetails.firstName}
						placeholder={t('youthDetails.FirstName')}
						label={t('youthDetails.FirstName')}
						margin="normal"
						size="small"
						InputProps={{
							readOnly: !currentUser?.isAdmin && (isNewYouth && !currentUser?.isGuide),

						}}
						onChange={({ target: { value } }) => {
							if (currentUser?.isAdmin || (currentUser?.isGuide && isNewYouth)) {
								youthDetails.firstName = value;
								setYouthDetails({ ...youthDetails });
							}
						}}
					/>
					<TextField
						fullWidth
						value={youthDetails.lastName}
						placeholder={t('youthDetails.LastName')}
						label={t('youthDetails.LastName')}
						size="small"
						margin="normal"
						InputProps={{
							readOnly: !currentUser?.isAdmin && (isNewYouth && !currentUser?.isGuide),

						}}
						onChange={({ target: { value } }) => {
							if (currentUser?.isAdmin || (currentUser?.isGuide && isNewYouth)) {
								youthDetails.lastName = value;
								setYouthDetails({ ...youthDetails });
							}
						}}
						
					/>
					
					<Autosuggest
							suggestions={suggestions}
							onSuggestionsFetchRequested={onSuggestionsFetchRequested}
							onSuggestionsClearRequested={onSuggestionsClearRequested}
							getSuggestionValue={(suggestion: any) => suggestion.display_name}
							renderSuggestion={renderSuggestion}
							onSuggestionSelected={onSuggestionSelected}
							inputProps={inputProps}
							renderInputComponent={(inputProps: any) => {
								return (
									<TextField
							fullWidth
							value={inputProps.value}
							size="small"
								{...inputProps}
						/>
								)
							}}
						/>
					<Grid container>
						<Grid item xs={8}>
							<TextField
								fullWidth
								value={youthDetails.dateOfbirth}
								placeholder={t('youthDetails.DateOfbirth')}
								label={t('youthDetails.DateOfbirth')}
								margin="normal"
								size="small"
								type="date"
								InputProps={{
									readOnly: !currentUser?.isAdmin && (isNewYouth && !currentUser?.isGuide),

								}}
								onChange={({ target: { value } }) => {
									if (currentUser?.isAdmin || (currentUser?.isGuide && isNewYouth)) {
										youthDetails.dateOfbirth = value;
										setYouthDetails({ ...youthDetails });
									}
								}}
								InputLabelProps={{
									shrink: true,
								}}
								
							/>
						</Grid>
						<Grid item xs={4}>
							<TextField
								fullWidth
								value={(youthDetails.dateOfbirth && ageCalculator(youthDetails.dateOfbirth)) || youthDetails.age}
								placeholder={t('youthDetails.age')}
								label={t('youthDetails.age')}
								margin="normal"
								size="small"
								InputProps={{
									readOnly: !currentUser?.isAdmin && (isNewYouth && !currentUser?.isGuide),
								}}
								onChange={({ target: { value } }) => {
									if (currentUser?.isAdmin || (currentUser?.isGuide && isNewYouth)) {
										youthDetails.age = value;
										setYouthDetails({ ...youthDetails });
									}
								}}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</Grid>
					</Grid>
					<TextField
						size="small"
						fullWidth
						value={youthDetails.phoneNumber}
						placeholder={t('youthDetails.PhoneNumber')}
						label={t('youthDetails.PhoneNumber')}
						margin="normal"
						onChange={({ target: { value } }) => {
							const formattedValue = value.replace(/\D/g, '').slice(0, 10);
							youthDetails.phoneNumber = formattedValue;

							setYouthDetails({ ...youthDetails });
						}}
					/>
					<FormControl fullWidth>
						<InputLabel id="genderLabel">{t('youthDetails.Gender')}</InputLabel>
						<Select
							labelId="genderLabel"
							size="small"
							id="gender-select"
							value={youthDetails.gender}
							label={t('youthDetails.Gender')}
							onChange={({ target: { value } }) => {
								youthDetails.gender = value as Gender;
								setYouthDetails({ ...youthDetails });
							}}
						>
							{
								GenderArr.map((gender) => {
									return (
										<MenuItem value={gender} key={gender}>{gender === 'M' ? t('youthDetails.Mail') : t('youthDetails.Femail') }</MenuItem>
									);
								})
							}
						</Select>
					</FormControl>
					<Grid xs={12} mt={2} mb={2}>
						<AttendanceDropDown 
							value={youthDetails.attendance || EMPTY_STRING}
							additionalValue=''
							onChange={(attendance) => {
								youthDetails.attendance = attendance;
								setYouthDetails({ ...youthDetails });
							}}
						/>
					</Grid>
					<Grid container>
					<Grid xs={currentUser?.isAdmin ? 9 : 12} >
					<FormControl fullWidth>
						<InputLabel shrink 
						style={{
								left: '10px',
								top: '5px',
								position: 'absolute',
							}}
						 id="rowTypeDropDown">{t('youthDetails.referrer')}</InputLabel>
					<Select
						labelId="rateDropDown"
						size="small"
						id="rowTypeDropDown_dropdown"
						label={t('youthDetails.referrer')}
						value={newReferrer || youthDetails.referrer}
						onChange={({ target: { value } }) => {
							setNewReferrer(null)
							youthDetails.referrer = value;
							setYouthDetails({ ...youthDetails });
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
						{newReferrer && <MenuItem value={newReferrer} key={`${newReferrer}_rate_item`}>{newReferrer}</MenuItem>}
					</Select>
					</FormControl>
					</Grid>
					<RBA>
					<Grid xs={3}>
						<Button
							variant="contained" 
							onClick={()=>setIsModalNewUserOpened(true)}
						>
						{t('youthDetails.createNewOne')}
						</Button>
						</Grid>
						</RBA>
						</Grid>
					<Grid xs={12} mt={2} mb={2}>
						<SchoolsDropDown
							value={youthDetails.school}
							onChange={(value) => {
								youthDetails.school = value;
								setYouthDetails({ ...youthDetails });
							}}
						/>
					</Grid>
					<FormControl fullWidth>
						<InputLabel
							id="classLabel"
							shrink
							style={{
								left: '10px',
								top: '5px',
								position: 'absolute',
							}}
						>
							{t('youthDetails.Class')}
						</InputLabel>
						<Select
							labelId="classLabel"
							size="small"
							id="class-select"
							placeholder={t('youthDetails.Class')}
							value={youthDetails.class && ClassArrNames[youthDetails.class] ? ClassArrNames[youthDetails.class] : youthDetails.class}
							label={t('youthDetails.Class')}
							onChange={({ target: { value } }) => {
								youthDetails.class = value as Class;
								setYouthDetails({ ...youthDetails });
							}}
						>
							{ClassArr.map((classItem) => (
								<MenuItem value={classItem} key={classItem}>
									{t(`youthDetails.${classItem}`)}
								</MenuItem>
							))}
						</Select>
						
					</FormControl>
					<FormControl>
						<InputLabel
							id="classNumberLabel"
							shrink
							style={{
								left: '10px',
								top: '10px',
								position: 'absolute',
							}}
						>
							{t('youthDetails.ClassNumber')}
						</InputLabel>
						<Select
							labelId="classNumberLabel"
							size="small"
							style={{marginTop:'5px', width:'150px'}}
							id="class-select"
							placeholder={t('youthDetails.Class')}
							value={youthDetails.classNumber}
							label={t('youthDetails.Class')}
							onChange={({ target: { value } }) => {
								youthDetails.classNumber = value as any;
								setYouthDetails({ ...youthDetails });
							}}
						>
							{ClassNumbersArr.map((classItem) => (
								<MenuItem value={classItem} key={classItem}>
									{classItem}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						fullWidth
						value={youthDetails.teacherName}
						placeholder={t('dashboard.teacherName')}
						label={t('dashboard.teacherName')}
						size="small"
						margin="normal"
						onChange={({ target: { value } }) => {
								youthDetails.teacherName = value;
								setYouthDetails({ ...youthDetails });
							}
						}
					/>
					<TextField
						fullWidth
						value={youthDetails.counselorName}
						placeholder={t('dashboard.counselorName')}
						label={t('dashboard.counselorName')}
						size="small"
						margin="normal"
						onChange={({ target: { value } }) => {
								youthDetails.counselorName = value;
								setYouthDetails({ ...youthDetails });
							}
						}
					/>
					<FormGroup>
						<Text>{t('youthDetails.Language')}</Text>
						<FormControlLabel
							style={{ margin: 0 }}
							control={(
								<Checkbox
									value="he"
									checked={youthDetails.languages?.includes('he')}
									onChange={handleChangeLang}
								/>
							)}
							label={t('youthDetails.HE')}
						/>
						<FormControlLabel
							style={{ margin: 0 }}
							control={(
								<Checkbox
									value="ru"
									checked={youthDetails.languages?.includes('ru')}
									onChange={handleChangeLang}
								/>
							)}
							label={t('youthDetails.RU')}
						/>
						<FormControlLabel
							style={{ margin: 0 }}
							control={(
								<Checkbox
									value="am"
									checked={youthDetails.languages?.includes('am')}
									onChange={handleChangeLang}
								/>
							)}
							label={t('youthDetails.AM')}
						/>
					</FormGroup>
				</Grid>
				<Grid item xs={12} md={5} lg={3} mx={1} padding={2}>
				<FormControl fullWidth>
						<InputLabel id="rowTypeDropDown">{t('youthDetails.responsibleInstructor')}</InputLabel>
						<Select
							labelId="rateDropDown"
							size="small"
							id="rowTypeDropDown_dropdown"
							label={t('youthDetails.responsibleInstructor')}
							value={youthDetails.responsibleInstructor || 'NA'}
							onChange={({ target: { value } }) => {
								setYouthDetails({
									...youthDetails,
									responsibleInstructor: value
									});
							}}
						>
							
							<MenuItem value={'NA'} key={`${''}_rate_item`}>
								{t(`youthDetails.noInstructor`)}
							</MenuItem>
							
							{
								userList && userList.length > 0 && userList.filter((item: any) => item.isGuide).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((u: any) => {
									return (
										<MenuItem value={u.name} key={`${u.name}_rate_item`}>
											{u.name}
										</MenuItem>
									);
								})
							}
						</Select>
					
					</FormControl>
					
					{
						youthDetails.parents.map((parent, idx) => {
							return (
								<>
									<TextField
										fullWidth
										// eslint-disable-next-line react/no-array-index-key
										key={`parent_${idx}`}
										value={parent.name}
										placeholder={`${t('youthDetails.ParentName')} ${idx + 1}`}
										label={`${t('youthDetails.ParentName')} ${idx + 1}`}
										margin="normal"
										size="small"
										onChange={({ target: { value } }) => {
											youthDetails.parents[idx].name = value;
											setYouthDetails({ ...youthDetails });
										}}
									/>
									<TextField
										fullWidth
										// eslint-disable-next-line react/no-array-index-key
										key={`parent_${idx}`}
										value={parent.phoneNumber}
										placeholder={`${t('youthDetails.ParentNumber')} ${idx + 1}`}
										label={`${t('youthDetails.ParentNumber')} ${idx + 1}`}
										margin="normal"
										size="small"
										type="tel"
										onChange={({ target: { value } }) => {
											youthDetails.parents[idx].phoneNumber = value;
											setYouthDetails({ ...youthDetails });
										}}
									/>
								</>

							);
						})
					}
						<TextField
						multiline
						label={t('youthDetails.notes')}
						fullWidth
						value={youthDetails?.notes}
						rows={2}
						onChange={({ target: { value } }) => {
							setYouthDetails({
								...youthDetails,
								notes: value
							});
						}}
					/>
					<Button
					style={{
						color: '#007aff',
						fontSize: 13
					}}
					type="button"
					variant="text"
					onClick={() => {
						setNotesOnly(true);
					}}
				>
					{t('youthDetails.expand')}
				</Button> 
					<Grid item xs={12} mt={2}>
					{t('youthDetails.askForContinue')}
					</Grid>
					<Grid item xs={12} mt={2}>
					<FormControlLabel
						control={(
							<Checkbox
							checked={youthDetails.continueTreatmentShapach || isCheckboxCheckedShapach}
							onChange={(event) => {
								setIsCheckboxCheckedShapach(event.target.checked);
								setYouthDetails({
								...youthDetails,
								continueTreatmentShapach: event.target.checked
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
								checked={youthDetails.continueTreatmentHosen || isCheckboxCheckedHosen}
								onChange={(event) => {
									setIsCheckboxCheckedHosen(event.target.checked);
									setYouthDetails({
									...youthDetails,
									continueTreatmentHosen: event.target.checked
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
								}}
								color="primary"
							/>
						)}
						label={t('youthDetails.emotionalTherapy')}
					/>
				</Grid>
					<RBA>
						<InputLabel>{t('youthDetails.previousTreatmentHistory')}</InputLabel>
						{
							Object.keys(previousTreatmentHistory).map((hist: '') => {
								if (hist in previousTreatmentHistory) {
									const labelForPresent = t(`youthDetails.${hist}`);
									const val = previousTreatmentHistory[hist] as string;
									return (
										<CheckboxField
											key={hist}
											size="small"
											label={labelForPresent}
											placeholder={labelForPresent}
											value={val}
											onChange={(v?: string) => {
												if (hist in youthDetails.previousTreatmentHistory) {
													youthDetails.previousTreatmentHistory[hist] = v;
													setYouthDetails({ ...youthDetails });
												}
											}}
										/>
									);
								}
								return null;
							})
						}
					</RBA>
		
				</Grid>
			
				<Grid
					item
					xs={12}
					md={12}
					lg={3}
					mx={1}
					gridRow="auto"
					padding={2}
				>
						<FormControlLabel
						style={{ marginLeft: 0, marginRight: 0, marginBottom: 5 }}
						control={(
							<Checkbox
								value="am"
								checked={youthDetails.returnedToStudy || false}
								onChange={({ target: { checked } }: any) => {
									youthDetails.returnedToStudy = !!checked;
									setYouthDetails({ ...youthDetails });
								}}
							/>
						)}
						label={t('youthDetails.returnedToStudy')}
					/>
					<TextField
						fullWidth
						label={t('youthDetails.lastAvailablityAtZoom')}
						value={youthDetails.lastAvailablityAtZoom}
						placeholder={t('youthDetails.lastAvailablityAtZoom')}
						margin="normal"
						size="small"
						type="date"
						onChange={({ target: { value } }) => {
							setYouthDetails({ ...youthDetails, lastAvailablityAtZoom: value });
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						fullWidth
						value={youthDetails.lastAvailabilityAtVenture}
						placeholder={t('youthDetails.lastAvailabilityAtVenture')}
						label={t('youthDetails.lastAvailabilityAtVenture')}
						margin="normal"
						size="small"
						type="date"
						onChange={({ target: { value } }) => {
							youthDetails.lastAvailabilityAtVenture = value;
							setYouthDetails({ ...youthDetails });
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<FormControlLabel
						style={{ marginLeft: 0, marginRight: 0, marginBottom: 5 }}
						control={(
							<Checkbox
								value="am"
								checked={youthDetails.disconnected || areDatesPastSevenDays(youthDetails.lastAvailablityAtZoom, youthDetails.lastAvailabilityAtVenture)}
								onChange={({ target: { checked } }: any) => {
									youthDetails.disconnected = !!checked;
									setYouthDetails({ ...youthDetails });
								}}
							/>
						)}
						label={t('youthDetails.Disconnected')}
					/>
					<TextField
						fullWidth
						value={youthDetails.lastWorry}
						placeholder={t('youthDetails.worryLevel')}
						label={t('youthDetails.worryLevel')}
						size="small"
						disabled
						margin="normal"
						InputProps={{
							readOnly: true
						}}
						
					/>
					<InputLabel>{t('youthDetails.riskCharacteristics')}</InputLabel>
					{
						Object.keys(RISK_CHARACTERISTICS_ORDER).sort((a, b) => {
							const aOrder = RISK_CHARACTERISTICS_ORDER[a] || 999;
							const bOrder = RISK_CHARACTERISTICS_ORDER[b] || 999;
							if (aOrder < bOrder) {
								return -1;
							}
							if (bOrder < aOrder) {
								return 1;
							}
							return 0;
						}).map((field: '') => {
							
							const labelForPresent = t(`youthDetails.${field}`);
							const element = field in riskCharacteristics ? riskCharacteristics[field] as string : 'No';
							const elementToPresent = element ===  'No' ? 'No' : 'Yes';
							
								return (
									<Grid container my={2} alignItems="center" key={field}>
										<Grid xs={12}>
											<FormControl fullWidth>
												<InputLabel id={`${field}_field`}>{labelForPresent}</InputLabel>
												<Select
													labelId={`${field}_field`}
													size="small"
													id={`${field}_select`}
													value={elementToPresent}
													label={labelForPresent}
													onChange={({ target: { value } }) => {
														
														if (field !== '') {
															
															(youthDetails.riskCharacteristics as any)[field] = value;
															setYouthDetails({ ...youthDetails });
														}
													}}
												>
													{
														
														TypeOfRisksArr.map((risk) => {
															const showRisk = t(`youthDetails.${risk}`);
															return (
																<MenuItem value={risk} key={risk}>{showRisk}</MenuItem>
															);
														})
													}
												</Select>
											</FormControl>
										</Grid>
									</Grid>
								);
						})
					}
				</Grid>
				{
					!isNewYouth && (
						<>
							<Grid container justifyContent="center" mt={4}>
								<Grid item xs={12} padding={5} md={5} lg={4}>
									<Button variant="contained" fullWidth onClick={handleSave} disabled={loading}>
										{t('youthDetails.save')}
									</Button>
								</Grid>
							</Grid>
							<BottomAddButton onClick={handleNewTreatment} />
						</>
					)
				}
			</Grid>
			{
				!isNewYouth && (
					<BottomAddButton onClick={handleNewTreatment} />
				)
			}
			
		</>
	);
}

export default withTranslation()(PersonalDetails);
