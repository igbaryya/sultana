/* eslint-disable */
import {
	FormControl, InputLabel, MenuItem, Select
} from '@mui/material';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import { useSelector } from 'react-redux';

type Props = {
	onChange: (newVal: string) => void;
	value?: string;
	customLabel? : string;
};
export default function CityHandlerSelect({ onChange, value, customLabel = t('users.cityHandler') }: Props) {
	const currentUser: any= useSelector(currentUserSelector);

	useEffect(() => {
		if (!value) {
			onChange('all');
		}
	}, []);

	let cityHandlers: any = {};
	if (currentUser) {
		// const userCityHandle = currentUser.handleCity;
		cityHandlers = {
			all: t('users.all'),
			eilat: t('users.eilat'),
			telAviv: t('users.telAviv')
		  };
	}
	
	const asKeys = Object.keys(cityHandlers);
	return (
		
		<FormControl fullWidth>
			<InputLabel>{customLabel}</InputLabel>
			<Select
				fullWidth
				size="small"
				label={customLabel}
				value={(() => {
					if (asKeys.find((v) => v === value)) {
						return value;
					}
					return asKeys.find((c) => cityHandlers[c] === value) || 'all';
				})()}
				onChange={({ target: { value: newVal } }) => onChange(cityHandlers[newVal])}
			>
				{
					asKeys.map((city) => {
						const cityStr: string = cityHandlers[city];
						return (
							<MenuItem value={city} key={city}>
								{cityStr}
							</MenuItem>
						);
					})
				}
			</Select>
		</FormControl>
	);
}
