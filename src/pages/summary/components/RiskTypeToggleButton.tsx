import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { filterFactorsSelector } from 'sdk/modules/dashboard/dashboardSelector';
import { getInstance } from 'sdk';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	margin: theme.spacing(0, 0),
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
	'&.Mui-selected': {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
	margin: theme.spacing(0, 0),
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
	textTransform: 'none',
}));

const {dashboardApi: {updateFilterFactors}} = getInstance()

const RiskTypeToggleButton: React.FC<{}> = () => {
	const value = useSelector(filterFactorsSelector);
	const setValue = (val: string) => val !== value && updateFilterFactors(val)
	const { t } = useTranslation();

	const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
		if (newValue !== null) {
			setValue(newValue);
		}
	};

	return (
		<StyledToggleButtonGroup
			value={value}
			exclusive
			sx={{
				display: 'flex',
				flexDirection: 'row-reverse',
				justifyContent: 'flex-end'
			}}
			onChange={handleChange}
			aria-label="risk type selection"
		>
			<StyledToggleButton value="noActions" aria-label="no actions">
				{t('summary.noActions')}
			</StyledToggleButton>
			<StyledToggleButton value="riskFactors" aria-label="risk factors">
				{t('summary.riskFactors')}
			</StyledToggleButton>
		</StyledToggleButtonGroup>
	);
};

export default RiskTypeToggleButton;