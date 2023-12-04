import React from 'react';
import {
	FormControl, InputLabel, MenuItem, Select
} from '@mui/material';
import { t } from 'i18next';

type Props = {
	onChange: (attendance: string) => void;
	value?: string;
	additionalValue?: string;
};

export const attendanceOptions = [
	'לומד סדיר',
	'נשירה גלויה/סמויה',
	'מחוץ לעיר לומדים',
	'מחוץ לעיר לא לומדים'
];

export default function AttendanceDropDown({ onChange, value, additionalValue }: Props) {
	let toDisplay = attendanceOptions;
	if (typeof additionalValue !== 'undefined') {
		toDisplay = [additionalValue, ...attendanceOptions];
	}
	return (
		<FormControl fullWidth>
			<InputLabel
				id="attendance-label"
				shrink
				style={{
					left: '10px',
					top: '5px',
					position: 'absolute',
				}}
			>{t('youthDetails.attendance')}
			</InputLabel>
			<Select
				fullWidth
				labelId="attendance-label"
				size="small"
				value={value}
				id="attendance-select"
				label={t('youthDetails.attendance')}
				onChange={({ target: { value: newValue } }) => onChange(newValue)}
			>
				{toDisplay.map((option) => (
					<MenuItem value={option} key={option}>
						{option}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
