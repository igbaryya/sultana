import React, { useEffect } from 'react';
import {
	FormControl, InputLabel, MenuItem, Select
} from '@mui/material';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { hotelsSelector } from 'sdk/modules/globalConfig/globalConfigSelector';
import { getInstance } from 'sdk';
import { Hotel } from 'sdk/modules/globalConfig/globalConfigInterface';

type Props = {
	onChange: (hotel: string) => void;
	value?: string;
	additionalInput?: Hotel;
};
const { globalConfigApi: { loadHotels } } = getInstance();
export default function HotelsDropDown({ onChange, value, additionalInput }: Props) {
	const fbHotels = useSelector(hotelsSelector);
	useEffect(loadHotels, []);
	let allHotels;
	if (additionalInput) {
		allHotels = [additionalInput, ...fbHotels];
	} else {
		allHotels = fbHotels;
	}
	return (
		<FormControl fullWidth>
			<InputLabel id={t('dashboard.HotelName')}>{t('dashboard.HotelName')}</InputLabel>
			<Select
				fullWidth
				labelId={t('dashboard.HotelName')}
				size="small"
				value={value}
				id={t('dashboard.HotelName')}
				label={t('dashboard.HotelName')}
				onChange={({ target: { value: newHotel } }) => onChange(newHotel as string)}
			>
				{
					allHotels.map((item) => {
						return (
							<MenuItem value={`${item.name}_${item.address}`} key={`${item.name}_${item.address}_hotel`}>
								{item.name} ({item.address})
							</MenuItem>
						);
					})
				}
			</Select>
		</FormControl>
	);
}
