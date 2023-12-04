import {
	FormControl, Grid, InputLabel, MenuItem, Select, TextField
} from '@mui/material';
import SchoolsDropDown from 'components/common-components/SchoolDropdown';
import { ALL_HEB, EMPTY_STRING, RollArr } from 'consts';
import { t } from 'i18next';
import { AddNewUserForm } from 'interfaces/AddNewUser';
import { Roll } from 'interfaces/Treatments';
import React, { useEffect } from 'react';

interface Props{
	searchForm: AddNewUserForm;
	setSearchForm: React.Dispatch<React.SetStateAction<AddNewUserForm>>;
	setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddUserForm = (props: Props) => {
	const { searchForm, setSearchForm, setIsValid } = props;

	useEffect(() => {
		const isValidForm = Object.values(searchForm).every((value) => value !== EMPTY_STRING);
		setIsValid(isValidForm);
	}, [searchForm]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextField
					fullWidth
					value={searchForm.name}
					size="small"
					placeholder={t('dashboard.FullName')}
					label={t('dashboard.FullName')}
					onChange={({ target: { value } }) => {
						setSearchForm({ ...searchForm, name: value });
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					value={searchForm.email}
					size="small"
					placeholder={t('dashboard.email')}
					label={t('dashboard.email')}
					onChange={({ target: { value } }) => {
						setSearchForm({ ...searchForm, email: `${value || EMPTY_STRING}`.toLowerCase() });
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					value={searchForm.phoneNumber}
					size="small"
					placeholder={t('dashboard.PhoneNumber')}
					label={t('dashboard.PhoneNumber')}
					onChange={({ target: { value } }) => {
						setSearchForm({ ...searchForm, phoneNumber: value });
					}}
					type="tel"
					inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
				/>
			</Grid>
			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel
						shrink
						style={{
							left: '10px',
							top: '5px',
							position: 'absolute',
						}}
						id={t('dashboard.role')}
					>{t('dashboard.role')}
					</InputLabel>
					<Select
						fullWidth
						labelId={t('dashboard.role')}
						size="small"
						value={searchForm.roll}
						id={t('dashboard.HotelName')}
						label={t('dashboard.HotelName')}
						onChange={({ target: { value } }) => {
							setSearchForm({ ...searchForm, roll: value as Roll });
						}}
					>
						{
							RollArr.map((item) => {
								return (
									<MenuItem value={item} key={`${item}_roll`}>
										{t(`dashboard.${item}`)}
									</MenuItem>
								);
							})
						}
					</Select>
				</FormControl>
			</Grid>
			
			<Grid item xs={12}>
				<SchoolsDropDown
					additionalInput={{
						name: ALL_HEB
					}}
					value={searchForm.school?.name || ALL_HEB}
					onChange={(school) => {
						setSearchForm({ ...searchForm, school: { name: school } });
					}}
				/>
			</Grid>
	
		</Grid>
	);
};
