/* eslint-disable max-lines-per-function */
/* eslint-disable react/jsx-indent */
/* eslint-disable space-infix-ops */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable padded-blocks */
/* eslint-disable  max-lines */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable */
import React, { useState } from 'react';
import {
	Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Paper, Select, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Text from 'components/common-components/Text';
import { WithTranslation, withTranslation } from 'react-i18next';
import YouthSearchResult from './YouthSearchResult';
import { EMPTY_STRING, WorryMap, ALL_HEB, SDEROT_HEB, OTHER_HEB, ReturnedToStudyArr, ReturnedToStudyMapObj } from 'consts';
import { getInstance } from 'sdk';
import { YouthDetails } from 'interfaces/YouthObject';
import { isEmpty } from 'lodash';
import LoaderButton from 'utils/loaderButton';
import Lottie, { APP_LOTTIES } from 'components/common-components/Lottie';
import { SearchYouthForm } from 'interfaces/SearchYouth';
import { useSelector } from 'react-redux';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
type Props = WithTranslation;
import './search-styles.scss';
import SchoolsDropDown from 'components/common-components/SchoolDropdown';
import SchoolGradesDropDown from 'components/common-components/ClassDropdown';
const defaultSearch: SearchYouthForm = {
	id: EMPTY_STRING,
	firstName: EMPTY_STRING,
	lastName: EMPTY_STRING,
	phoneNumber: EMPTY_STRING,
	gender: 'ALL',
	lastWorryStart: '0',
	lastWorryEnd: '6',
	city: 'אילת',
	date: undefined,
	dateEnd: undefined,
	age: 'ALL',
	responsibleInstructor: 'ALL',
	class: ALL_HEB,
	referrer: 'ALL',
	returnedToStudy: 'N'
};
const {
	youthApi: { searchYouth, searchYouthAdvanced, getUsers },
} = getInstance();

function SearchYouth({ t }: Props) {
	const currentUser = useSelector(currentUserSelector);
	const [searchText, setSearchText] = useState(EMPTY_STRING);
	const [advancedSearch, setAdvanceSearch] = useState(true);
	const [userList, setUserList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchResult, setSearchResult] = useState<Record<string, YouthDetails> | null>(null);
	defaultSearch.city = currentUser?.handleCity !== ALL_HEB ? currentUser?.handleCity : '';
	defaultSearch.school = currentUser?.isGuide && currentUser?.school?.name ? currentUser?.school?.name : ALL_HEB;
	const [searchForm, setSearchForm] = useState<SearchYouthForm>(defaultSearch);
	const navigate = useNavigate();


	const [formLoaded, setFormLoaded] = React.useState(false); // New state variable
	const handleSearch = async () => {
		const txt = (searchText || EMPTY_STRING)?.trim();
		if (advancedSearch) {
			setLoading(true);

			const res = await searchYouthAdvanced(searchForm);
			setLoading(false);
			setSearchResult(res);
		} else if (txt) {
			setLoading(true);
			const res = await searchYouth(searchText);
			setLoading(false);
			setSearchResult(res);
		} else {
			setSearchResult(null);
		}
	};

	const handleClearAll = () => {
		setSearchForm(() => ({
			...defaultSearch,
			date: undefined,
		}));
		setSearchResult(null);
	};
	React.useEffect(() => {

	}, []);
	const [systemAvailableCities, setAvailableCities] = useState<Record<string, boolean>>(() => {
		const savedForm = JSON.parse(localStorage.getItem('searchForm') || '{}')?.city || searchForm.city;
		if (typeof savedForm === 'object') {
			return savedForm;
		}
		return {
			[`${SDEROT_HEB}`]: true,
			[`${OTHER_HEB}`]: true
		}
	})


	React.useEffect(() => {
		getUsers().then((data) => {
			setUserList(Object.values(data));
		});
		const savedForm = localStorage.getItem('searchForm');
		if (savedForm) {
			setSearchForm((prevSearchForm) => {
				const parsedForm = JSON.parse(savedForm);
				setFormLoaded(true); // Set formLoaded to true when loaded from localStorage
				// Merge the parsed form with the previous form
				return { ...prevSearchForm, ...parsedForm };
			});
		}
	}, []);

	React.useEffect(() => {
		// Call handleSearch only when formLoaded is true
		if (formLoaded) {
			handleSearch();
		}
	}, [formLoaded]); // Dependency on formLoaded

	// Save form data to localStorage whenever the form changes
	React.useEffect(() => {
		localStorage.setItem('searchForm', JSON.stringify(searchForm));
	}, [searchForm]);

	return (
		<Grid container sx={{ padding: { xs: 2, md: 5 } }}>
			<Grid xs={12}>
				<Paper>
					<Grid container>

						<Grid item xs={12} padding={3}>
							<Grid container xs={12} padding={3}>
								<Grid item lg={11} xs={8}>
									<Text translation={t('dashboard.searchForYouth')} pb={5} />
								</Grid>
								{currentUser?.isAdmin || currentUser?.isGuide ? (
									<Grid item lg={1} xs={4}>
										<Button variant="contained" onClick={() => navigate('/newYouth')}>
											{t('dashboard.addNewYouth')}
										</Button>
									</Grid>
								) : null}

							</Grid>
							{!advancedSearch ? (
								<TextField
									fullWidth
									focused
									size="small"
									placeholder={t('dashboard.searchForYoutPlaceHolder')}
									onChange={({ target: { value } }) => setSearchText(value)}
									value={searchText}
								/>
							) : (
								<>
									<Grid container>
										<Grid item xs={12} md={6}>
											{/* <Grid item xs={12} p={1}>
												<TextField
													fullWidth
													value={searchForm.id}
													size="small"
													placeholder={t('dashboard.ID')}
													label={t('dashboard.ID')}
													onChange={({ target: { value } }) => {
														setSearchForm({ ...searchForm, id: value });
													}}
												/>
											</Grid> */}
											<Grid item xs={12} p={1}>
												<TextField
													fullWidth
													value={searchForm.firstName}
													size="small"
													placeholder={t('dashboard.FirstName')}
													label={t('dashboard.FirstName')}
													onChange={({ target: { value } }) => {
														setSearchForm({ ...searchForm, firstName: value });
													}}
												/>
											</Grid>
											<Grid item xs={12} p={1}>
												<TextField
													fullWidth
													value={searchForm.lastName}
													size="small"
													placeholder={t('dashboard.LastName')}
													label={t('dashboard.LastName')}
													onChange={({ target: { value } }) => {
														setSearchForm({ ...searchForm, lastName: value });
													}}
												/>
											</Grid>
											<Grid item xs={12} p={1}>
												<TextField
													fullWidth
													value={searchForm.phoneNumber}
													size="small"
													placeholder={t('dashboard.PhoneNumber')}
													label={t('dashboard.PhoneNumber')}
													onChange={({ target: { value } }) => {
														const formattedValue = value.replace(/\D/g, '').slice(0, 10);
														setSearchForm({ ...searchForm, phoneNumber: formattedValue });
													}}
												/>
											</Grid>
											<Grid item xs={12} p={1}>
												<SchoolsDropDown
													value={searchForm?.school || ALL_HEB}
													isDisabled={currentUser?.isGuide && currentUser?.school?.name && currentUser?.school?.name !== ALL_HEB ? true : false}
													additionalInput={{
														name: ALL_HEB
													}}
													onChange={(school) => {
														setSearchForm({ ...searchForm, school });
													}}
												/>
											</Grid>
											<Grid item xs={12} p={1}>
												<SchoolGradesDropDown
													value={searchForm?.class || ALL_HEB}
													additionalInput={ALL_HEB}
													onChange={(classGrade) => {
														setSearchForm({ ...searchForm, class: classGrade });
													}}
												/>
											</Grid>
											<Grid item xs={12} p={1}>
												<FormLabel>{t('youthDetails.City')}</FormLabel>
												{
													Object.keys(systemAvailableCities).map((city) => {
														return (
															<FormControlLabel
																style={{ margin: 0 }}
																control={
																	<Checkbox
																		value={city}
																		checked={!!systemAvailableCities[city]}
																		onChange={({ target: { checked } }) => {
																			const updated = { ...systemAvailableCities, [city]: checked };

																			setAvailableCities(updated)
																			setSearchForm({ ...searchForm, city: { ...systemAvailableCities, [city]: checked } });
																		}}
																	/>
																}
																label={`${city}`}
															/>
														)
													})
												}

												{/* <Autosuggest
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
												/> */}
											</Grid>
											<Grid item xs={12} p={1}>
												<Grid container>
													<Grid item xs={6}>
														<FormControl fullWidth>
															<InputLabel id={t('dashboard.lastWorryStart')}>{t('dashboard.lastWorryStart')}</InputLabel>
															<Select
																sx={{
																	borderRadius: '4px',
																	borderTopLeftRadius: 0,
																	borderBottomLeftRadius: 0,
																}}
																fullWidth
																labelId={t('dashboard.lastWorryStart')}
																size="small"
																id={t('dashboard.lastWorryStart')}
																label={t('dashboard.lastWorryStart')}
																value={!searchForm.lastWorryStart ? '0' : searchForm.lastWorryStart}
																onChange={({ target: { value } }) => {
																	setSearchForm({ ...searchForm, lastWorryStart: value });
																}}
															>
																{[...WorryMap].map((v: any) => (
																	<MenuItem value={v} key={v}>
																		{v}
																	</MenuItem>
																))}
															</Select>
														</FormControl>
													</Grid>
													<Grid item xs={6}>
														<FormControl fullWidth>
															<InputLabel id={t('dashboard.lastWorryEnd')}>{t('dashboard.lastWorryEnd')}</InputLabel>
															<Select
																sx={{
																	borderRadius: '4px',
																	borderTopRightRadius: 0,
																	borderBottomRightRadius: 0,
																}}
																fullWidth
																labelId={t('dashboard.lastWorryEnd')}
																size="small"
																id={t('dashboard.lastWorryEnd')}
																label={t('dashboard.lastWorryEnd')}
																value={!searchForm.lastWorryEnd ? '6' : searchForm.lastWorryEnd}
																onChange={({ target: { value } }) => {
																	setSearchForm({ ...searchForm, lastWorryEnd: value });
																}}
															>
																{
																	[...WorryMap].map((v: any) => {

																		return (
																			<MenuItem value={v} key={v}>
																				{v}
																			</MenuItem>
																		);
																	})
																}
															</Select>
														</FormControl>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										<Grid item xs={12} md={6}>
											<Grid item xs={12} p={1}>
												<FormControl fullWidth>
													<InputLabel id="rowTypeDropDown"
													>{t('youthDetails.responsibleInstructor')}</InputLabel>
													<Select
														labelId="rateDropDown"
														size="small"
														id="rowTypeDropDown_dropdown"
														label={t('youthDetails.responsibleInstructor')}
														value={searchForm.responsibleInstructor}
														onChange={({ target: { value } }) => {
															setSearchForm({ ...searchForm, responsibleInstructor: value });
														}}
													>
														{
															userList && userList.length > 0 && ['ALL', 'AnyGuide', 'WithoutGuide', ...userList].filter((item: any) => item === 'ALL' || item === 'AnyGuide' || item === 'WithoutGuide' || item.isGuide).sort((a: any, b: any) => a?.name?.localeCompare(b.name)).map((u: any) => {
																let msg;
																if (u === 'ALL') {
																	msg = t('dashboard.allResponsibleInstructor')
																} else if (u === 'AnyGuide') {
																	msg = t('dashboard.anyGuide')
																} else if (u === 'WithoutGuide') {
																	msg = t('dashboard.withoutGuide')
																} else {
																	msg = u.name
																}

																return (
																	<MenuItem value={u === 'ALL' || u === 'AnyGuide' || u === 'WithoutGuide' ? u : u.name} key={`${u?.name}_rate_item`}>
																		{msg}
																	</MenuItem>
																);
															})
														}
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={12} p={1}>
												<TextField
													fullWidth
													label={t('dashboard.dateStart')}
													value={searchForm.date}
													size="small"
													type="date"
													onChange={({ target: { value } }) => {
														setSearchForm({ ...searchForm, date: value });
													}}
													InputLabelProps={{
														shrink: true,
													}}
													inputRef={(input) => {
														if (input && searchForm.date === undefined) {
															// eslint-disable-next-line no-param-reassign
															input.value = '';
														}
													}}
												/>

											</Grid>
											<Grid item xs={12} p={1}>

												<TextField
													fullWidth
													label={t('dashboard.dateEnd')}
													value={searchForm.dateEnd}
													size="small"
													type="date"
													onChange={({ target: { value } }) => {
														setSearchForm({ ...searchForm, dateEnd: value });
													}}
													InputLabelProps={{
														shrink: true,
													}}
													inputRef={(input) => {
														if (input && searchForm.dateEnd === undefined) {
															// eslint-disable-next-line no-param-reassign
															input.value = '';
														}
													}}
												/>
											</Grid>
											<Grid item xs={12} p={1}>
												<FormControl fullWidth>
													<InputLabel
														shrink
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
														value={searchForm.referrer}
														onChange={({ target: { value } }) => {
															setSearchForm({ ...searchForm, referrer: value });
														}}
													>
														{
															userList && userList.length > 0 && ['ALL', ...userList].map((u: any) => {
																let msg;
																if (u === 'ALL') {
																	msg = t('users.all')
																} else {
																	msg = u.name
																}

																return (
																	<MenuItem value={u === 'ALL' ? 'ALL' : u.name} key={`${u.name}_rate_item`}>
																		{msg}
																	</MenuItem>
																);
															})
														}
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={12} p={1}>
												<FormControl fullWidth>
													<InputLabel
														shrink
														style={{
															left: '10px',
															top: '5px',
															position: 'absolute',
														}}
														id="genderLabel">{t('youthDetails.returnedToStudy')}</InputLabel>
													<Select
														labelId="genderLabel"
														size="small"
														id="gender-select"
														value={searchForm.returnedToStudy || 'Y'}
														label={t('youthDetails.Gender')}
														onChange={({ target: { value } }) => {
															setSearchForm({ ...searchForm, returnedToStudy: value });
														}}
													>
														{
															ReturnedToStudyArr.map((isReturn) => {
																return (
																	<MenuItem value={isReturn === 'Y' ? 'Y' : isReturn} key={isReturn}>
																		{ReturnedToStudyMapObj[isReturn]}
																	</MenuItem>
																);
															})
														}
													</Select>
												</FormControl>
											</Grid>
										</Grid>
										<Grid item xs={12} p={1}>

											<Button onClick={handleClearAll}>
												{t('dashboard.clear')}
											</Button>

										</Grid>
									</Grid>

								</>

							)}
							<Grid xs={6} alignItems="flex-end" hidden>
								<Button
									type="button"
									style={{
										marginTop: '5px',
										backgroundColor: 'black',
										color: 'white',
									}}
									variant="text"
									onClick={() => setAdvanceSearch(!advancedSearch)}
								>
									{!advancedSearch
										? t('dashboard.AdvancedSearch')
										: t('dashboard.Cancel')}
								</Button>
							</Grid>
						</Grid>
						<Grid container justifyContent="center">
							<Grid xs={8} padding={2} alignSelf="center">
								<Button
									type="button"
									fullWidth
									variant="contained"
									style={{
										marginTop: '5px',
										backgroundColor: 'black',
										color: 'white',
									}}
									disabled={loading}
									onClick={handleSearch}
								>
									{loading ? (
										<LoaderButton />
									) : (
										t('dashboard.search')
									)}
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
			{searchResult !== null && isEmpty(searchResult) ? (
				<Grid xs={12} item mt={4}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							height: '100vh',
							width: '100%',
						}}
					>
						<Grid container justifyContent="flex-start">
							<Grid item xs={12}>
								<Text bold>{`${t('dashboard.noResultHeader')} ${searchText}`}</Text>
							</Grid>
							<Grid item xs={12} pt={1}>
								<Text translation="dashboard.suggestions" />
								<ul>
									<li>{t('dashboard.noResultMsg1')}</li>
									<li>{t('dashboard.noResultMsg2')}</li>
									<li>{t('dashboard.noResultMsg3')}</li>
								</ul>
							</Grid>
						</Grid>
						<Lottie
							loop
							size={80}
							src={APP_LOTTIES.NOT_FOUND}
						/>

					</Box>

				</Grid>
			) : (!isEmpty(searchResult) && (
				<Grid item xs={12} mt={4}>
					<YouthSearchResult searchResult={searchResult} />
				</Grid>
			)
			)}
		</Grid>
	);
}

export default withTranslation()(SearchYouth);
