import React, { useEffect } from 'react';
import {
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getInstance } from 'sdk';
import { useSelector } from 'react-redux';
import { rowsSelector } from 'sdk/modules/dashboard/dashboardSelector';

export type RiskFactor = {
	isSelected: boolean;
	displayValue: string;
};

export type RiskFactorsState = {
	[key: string]: RiskFactor;
};
const {dashboardApi: {updateResultRows}} = getInstance();
const initialRiskFactors: RiskFactorsState = {
	allRisks: { isSelected: true, displayValue: "summary.allRiskFactors" },
	suicide: { isSelected: true, displayValue: "summary.suicide" },
	//violence: { isSelected: true, displayValue: "summary.violence" },
	//victimOfViolence: { isSelected: true, displayValue: "summary.violenceInjury" },
	//sexualViolence: { isSelected: true, displayValue: "summary.sexualViolence" },
	// victimOfSexualViolence: { isSelected: true, displayValue: "summary.sexualViolenceInjury" },
	alcohol: { isSelected: true, displayValue: "summary.alcohol" },
	seclusion: { isSelected: true, displayValue: "summary.isolation" },
	socialAnxieties: { isSelected: true, displayValue: "summary.socialAnxiety" },
	criminalInvolvementRisk: { isSelected: true, displayValue: "summary.criminalInvolvement" },
	mental: { isSelected: true, displayValue: "summary.mental" },
	drugs: { isSelected: true, displayValue: "summary.drugs" },
	selfHarm: { isSelected: true, displayValue: "summary.selfHarm" },
};

const RiskFactorsFilter: React.FC = () => {
	const { t } = useTranslation();
	useEffect(() => {
		updateResultRows(initialRiskFactors)
	}, [])
	const riskFactors = useSelector(rowsSelector) as RiskFactorsState
	
	const handleRiskFactorChange = (key: string) => {
		updateResultRows(((prev) => {
			const newRiskFactors = { ...prev, [key]: { ...prev[key], isSelected: !prev[key].isSelected } };
			if (key === 'allRisks') {
				const isSelected = newRiskFactors[key].isSelected;
				Object.keys(newRiskFactors).forEach((subKey) => {
					newRiskFactors[subKey].isSelected = isSelected;
				});
			} else {
				const allSelected = Object.keys(newRiskFactors).every(
					(subKey) => subKey === 'allRisks' || newRiskFactors[subKey].isSelected
				);
				newRiskFactors.allRisks.isSelected = allSelected;
			}

			return newRiskFactors;
		})(riskFactors as RiskFactorsState));
	};
	if (!riskFactors) {
		return null;
	}
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
								onChange={() => handleRiskFactorChange(key)}
							/>
						}
						label={t(riskFactors[key].displayValue)}
					/>
				))}
			</FormGroup>
		</>
	);
};

export default RiskFactorsFilter;