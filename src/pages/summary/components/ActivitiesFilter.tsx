import React, { useState, useEffect } from 'react';
import {
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RiskFactorsState } from './RiskFactorsFilter';
import { getInstance } from 'sdk';

const {dashboardApi: {updateResultRows}} = getInstance();

const initialActivities: RiskFactorsState = {
	allReturned: { isSelected: true, displayValue: "summary.allReturned" },
	activeOnly: { isSelected: true, displayValue: "summary.activeOnly" },
	returnedToStudy: { isSelected: true, displayValue: "summary.returnedOnly" }
};

const ActivitiesFilters: React.FC = () => {
	const { t } = useTranslation();
	const [riskFactors, setActivities] = useState<RiskFactorsState>(initialActivities);
	useEffect(() => {
		updateResultRows(initialActivities)
	}, [])
	const handleActivitiesChange = (key: string) => {
		setActivities((prev) => {
			const newActivities = { ...prev, [key]: { ...prev[key], isSelected: !prev[key].isSelected } };
			if (key === 'allReturned') {
				const isSelected = newActivities[key].isSelected;
				Object.keys(newActivities).forEach((subKey) => {
					newActivities[subKey].isSelected = isSelected;
				});
			} else {
				const allSelected = Object.keys(newActivities).every(
					(subKey) => subKey === 'allReturned' || newActivities[subKey].isSelected
				);
				newActivities.allReturned.isSelected = allSelected;
			}
			// console.log('newActivities', newActivities);
			updateResultRows(newActivities);
			return newActivities;
		});
	};

	return (
		<>
			<FormLabel component="legend">{t('summary.riskFactors')}</FormLabel>
			<FormGroup>
				{Object.keys(riskFactors).map((key) => (
					<FormControlLabel
						key={key}
						control={
							<Checkbox
								checked={riskFactors[key].isSelected}
								onChange={() => handleActivitiesChange(key)}
							/>
						}
						label={t(riskFactors[key].displayValue)}
					/>
				))}
			</FormGroup>
		</>
	);
};

export default ActivitiesFilters;