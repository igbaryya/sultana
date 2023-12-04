import React, { useRef, useState } from 'react';
import {
	Checkbox, FormControlLabel, FormGroup, TextField
} from '@mui/material';
import { EMPTY_STRING } from 'consts';

type Props = {
	value?: string;
	label?: string;
	placeholder?: string;
	size?: 'small';
	onChange?: ((value: string | undefined) => void) | undefined;
};

export default function CheckboxField({
	value,
	placeholder,
	label,
	size,
	onChange,
}: Props) {
	const [isChecked, setChecked] = useState(!!value);
	const [fieldVal, setFieldVal] = useState(value);
	const inputRef = useRef<any>(null);

	const handleCheck = () => {
		inputRef.current?.focus?.();
		const newValue = !isChecked ? fieldVal : EMPTY_STRING;
		onChange?.(newValue);
		setChecked(!isChecked);
	};

	const handleTextFieldChange = (newVal: string) => {
		setFieldVal(newVal);
		if (isChecked) {
			onChange?.(newVal);
		}
	};

	return (
		<FormGroup>
			<FormControlLabel
				style={{ margin: 0 }}
				control={<Checkbox onChange={handleCheck} defaultChecked={!!value} />}
				label={label}
			/>
			<TextField
				size={size}
				inputRef={inputRef}
				fullWidth
				disabled={!isChecked}
				onChange={(event) => handleTextFieldChange(event.target.value)}
				value={fieldVal}
				placeholder={placeholder || label}
			/>
		</FormGroup>
	);
}
