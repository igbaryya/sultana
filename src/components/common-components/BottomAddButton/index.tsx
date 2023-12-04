import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import './style.scss';
import { Button } from '@mui/material';

type Props = {
	onClick: () => void;
};
export default function BottomAddButton({ onClick }: Props) {
	return (
		<Button type="button" className="bottom-add" variant="text" onClick={onClick}>
			<AddIcon />
		</Button>
	);
}
