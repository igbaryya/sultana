import React from 'react';
import {
	FormControl, InputLabel, MenuItem, Select
} from '@mui/material';
import { t } from 'i18next';

type Props = {
	onChange: (grade: string) => void;
	value?: string;
	additionalInput: string;
};

export const gradeLevels = [
	{ label: 'א', value: '1' },
	{ label: 'ב', value: '2' },
	{ label: 'ג', value: '3' },
	{ label: 'ד', value: '4' },
	{ label: 'ה', value: '5' },
	{ label: 'ו', value: '6' },
	{ label: 'ז', value: '7' },
	{ label: 'ח', value: '8' },
	{ label: 'ט', value: '9' },
	{ label: 'י', value: '10' },
	{ label: 'יא', value: '11' },
	{ label: 'יב', value: '12' }
];

export default function SchoolGradesDropDown({ onChange, value, additionalInput }: Props) {
	let toDisplay = gradeLevels;
	if (additionalInput) {
		toDisplay = [{ label: additionalInput, value: additionalInput }, ...gradeLevels];
	}
	return (
		<FormControl fullWidth>
			<InputLabel
				id="school-grade-label"
				shrink
				style={{
					left: '10px',
					top: '5px',
					position: 'absolute',
				}}
			>{t('dashboard.schoolGrade')}
			</InputLabel>
			<Select
				fullWidth
				labelId="school-grade-label"
				size="small"
				value={value}
				id="school-grade-select"
				label={t('dashboard.schoolGrade')}
				onChange={({ target: { value: newValue } }) => onChange(newValue)}
			>
				{toDisplay.map((grade) => (
					<MenuItem value={grade.value} key={grade.value}>
						{grade.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
