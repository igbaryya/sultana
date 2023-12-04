import React, { useEffect } from 'react';
import {
	FormControl, InputLabel, MenuItem, Select
} from '@mui/material';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { schoolsSelector } from 'sdk/modules/globalConfig/globalConfigSelector';
import { getInstance } from 'sdk';
import { Hotel } from 'sdk/modules/globalConfig/globalConfigInterface';

type Props = {
	onChange: (school: string) => void;
	value?: string;
	additionalInput?: Hotel;
	isDisabled?: boolean;
};
const { globalConfigApi: { loadSchools } } = getInstance();
export default function SchoolsDropDown({
	onChange, value, additionalInput, isDisabled = false
}: Props) {
	const fbSchools = useSelector(schoolsSelector);
	useEffect(loadSchools, []);
	let allSchools;
	if (additionalInput) {
		allSchools = [additionalInput, ...fbSchools];
	} else {
		allSchools = fbSchools;
	}
	return (
		<FormControl fullWidth>
			<InputLabel
				id={t('dashboard.school')}
				shrink
				style={{
					left: '10px',
					top: '5px',
					position: 'absolute',
				}}
			>{t('dashboard.school')}
			</InputLabel>
			<Select
				fullWidth
				labelId={t('dashboard.school')}
				size="small"
				disabled={isDisabled}
				value={value}
				id={t('dashboard.school')}
				label={t('dashboard.school')}
				onChange={({ target: { value: newHotel } }) => onChange(newHotel as string)}
			>
				{
					allSchools.map(({ name }) => {
						return (
							<MenuItem value={name} key={`${name}_school`}>
								{name}
							</MenuItem>
						);
					})
				}
			</Select>
		</FormControl>
	);
}
