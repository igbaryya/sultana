/* eslint-disable */
import React, { useEffect } from 'react';
import RiskFactors, { RiskFactorsState } from './RiskFactorsFilter';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup } from '@mui/material';
import { t } from 'i18next';
import ActivitiesFilters from './ActivitiesFilter';
import { useSelector } from 'react-redux';
import { colsSelector, filterBySelector, filterFactorsSelector, schoolFilterBySelector } from 'sdk/modules/dashboard/dashboardSelector';
import { FILTER_BY_SCHOOL, FILTER_BY_GRADE, RISK_FACTORS, SCHOOL_FILTER_BY_SCHOOL, SCHOOL_FILTER_BY_GENERAL_URBAN } from 'sdk/modules/dashboard/dashboardConfig';
import { getInstance } from 'sdk';
const {dashboardApi: {setFilterBy, updateColumns, setSchoolFilterBy}} = getInstance();
export default function Filter() {

	const initialSchools: RiskFactorsState = {
		allSchools: { isSelected: true, displayValue: "summary.allSchools" },
		ulpana: { isSelected: true, displayValue: "summary.ulpana" },
		ulpanaBari: { isSelected: true, displayValue: "summary.ulpanaBari" },
		ulpanaAdi: { isSelected: true, displayValue: "summary.ulpanaAdi" },
		ulpanaTehilatIsrael: { isSelected: true, displayValue: "summary.ulpanaTehilatIsrael" },
		amitBarIlan: { isSelected: true, displayValue: "summary.amitBarIlan" },
		vocationalAshkelon: { isSelected: true, displayValue: "summary.vocationalAshkelon" },
		vocationalKiryatGat: { isSelected: true, displayValue: "summary.vocationalKiryatGat" },
		beitEkstein: { isSelected: true, displayValue: "summary.beitEkstein" },
		yeshivaTichonit: { isSelected: true, displayValue: "summary.yeshivaTichonit" },
		yeshivaBneiAkiva: { isSelected: true, displayValue: "summary.yeshivaBneiAkiva" },
		religiousMekif: { isSelected: true, displayValue: "summary.religiousMekif" },
		generalMekif: { isSelected: true, displayValue: "summary.generalMekif" },
		urbanMekifA: { isSelected: true, displayValue: "summary.urbanMekifA" },
		boardingSchool: { isSelected: true, displayValue: "summary.boardingSchool" },
		youthPromotion: { isSelected: true, displayValue: "summary.youthPromotion" },
		boysHighSchool: { isSelected: true, displayValue: "summary.boysHighSchool" },
		biyarHighSchool: { isSelected: true, displayValue: "summary.biyarHighSchool" },
	};
	const initGrades: RiskFactorsState = {
		allGrades: { isSelected: true, displayValue: "summary.allGrades" },
		grade1: { isSelected: true, displayValue: 'summary.grade1' },
		grade2: { isSelected: true, displayValue: 'summary.grade2' },
		grade3: { isSelected: true, displayValue: 'summary.grade3' },
		grade4: { isSelected: true, displayValue: 'summary.grade4' },
		grade5: { isSelected: true, displayValue: 'summary.grade5' },
		grade6: { isSelected: true, displayValue: 'summary.grade6' },
		grade7: { isSelected: true, displayValue: 'summary.grade7' },
		grade8: { isSelected: true, displayValue: 'summary.grade8' },
		grade9: { isSelected: true, displayValue: 'summary.grade9' },
		grade10: { isSelected: true, displayValue: 'summary.grade10' },
		grade11: { isSelected: true, displayValue: 'summary.grade11' },
		grade12: { isSelected: true, displayValue: 'summary.grade12' }
	};
	const filterBy = useSelector(filterBySelector);
	const selectedFilter = useSelector(schoolFilterBySelector) ?? SCHOOL_FILTER_BY_SCHOOL
	useEffect(() => {
		if (selectedFilter === SCHOOL_FILTER_BY_GENERAL_URBAN) {
			updateColumns({
				generalUrban: {
					isSelected: true,
					displayValue: 'summary.generalUrban'
				}
			})
		} else {
			updateColumns(filterBy === FILTER_BY_GRADE ? initGrades : initialSchools)
		}
	}, [])
	const allSchoolsOrGrades =( useSelector(colsSelector)) as RiskFactorsState
	
	const isRiskFactors = useSelector(filterFactorsSelector) === RISK_FACTORS;
	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {target: {value}} = event; 
		setSchoolFilterBy(value);
		if (value === SCHOOL_FILTER_BY_GENERAL_URBAN) {
			updateColumns({
				generalUrban: {
					isSelected: true,
					displayValue: 'summary.generalUrban'
				}
			})
		} else {
			updateColumns(initialSchools)
		}
	};
	if (!allSchoolsOrGrades) {
		return null;
	}

	const handleFilterByChange = (value?: string) => {
		setFilterBy(value ?? FILTER_BY_SCHOOL)
		if (value === FILTER_BY_GRADE) {
			updateColumns(initGrades)
		} else {
			updateColumns(initialSchools)
		}
	}
	const handleSchoolChange = (key: string) => {
		updateColumns(((prev) => {
			const newSchoolFactors = { ...prev, [key]: { ...prev[key], isSelected: !prev[key].isSelected } };
			if (key === 'allSchools') {
				const isSelected = newSchoolFactors[key].isSelected;
				Object.keys(newSchoolFactors).forEach((subKey) => {
					newSchoolFactors[subKey].isSelected = isSelected;
				});
			} else {
				const allSelected = Object.keys(newSchoolFactors).every(
					(subKey) => subKey === 'allSchools' || newSchoolFactors[subKey].isSelected
				);
				newSchoolFactors.allSchools.isSelected = allSelected;
			}
			return newSchoolFactors;
		})(allSchoolsOrGrades));
	}
	const handleGradeChange = (key: string) => {
		updateColumns(((prev) => {
			const newGradesFactor = { ...prev, [key]: { ...prev[key], isSelected: !prev[key].isSelected } };
			if (key === 'allGrades') {
				const isSelected = newGradesFactor[key].isSelected;
				Object.keys(newGradesFactor).forEach((subKey) => {
					newGradesFactor[subKey].isSelected = isSelected;
				});
			} else {
				const allSelected = Object.keys(newGradesFactor).every(
					(subKey) => subKey === 'allGrades' || newGradesFactor[subKey].isSelected
				);
				newGradesFactor.allGrades.isSelected = allSelected;
			}

			return newGradesFactor;
		})(allSchoolsOrGrades));
	}
	return (
		<FormControl component="fieldset">
			<Box sx={{ padding: 2 }}>
				{
					isRiskFactors ? (
						<RiskFactors />
					) : (
						<ActivitiesFilters />
					)
				}
				<Box sx={{ marginTop: 2 }}>
					<RadioGroup value={filterBy} onChange={({target: {value}}) => handleFilterByChange(value)}>
						<FormControlLabel value={FILTER_BY_SCHOOL} control={<Radio />} label={t('summary.bySchools')} />
						{filterBy === FILTER_BY_SCHOOL && (
							<RadioGroup value={selectedFilter} onChange={handleRadioChange} sx={{
								marginRight: 2
							}}>
								<FormControlLabel value="general" control={<Radio />} label={t('summary.generalUrban')} />
								<FormControlLabel value="school" control={<Radio />} label={t('summary.schools')} />
								{selectedFilter === 'school' && (
									<Box sx={{ marginRight: 3}}>
										<FormGroup>
											{Object.keys(allSchoolsOrGrades).map((key) => (
												<FormControlLabel
													key={key}
													onChange={() => handleSchoolChange(key)}
													control={<Checkbox checked={allSchoolsOrGrades[key].isSelected} />}
													label={t(allSchoolsOrGrades[key].displayValue)}
												/>
											))}
										</FormGroup>
									</Box>
								)}
							</RadioGroup>
						)}
						<FormControlLabel value={FILTER_BY_GRADE} control={<Radio />} label={t('summary.byGrade')} />
						{filterBy === FILTER_BY_GRADE && (
							<Box sx={{ marginRight: 3}}>
								<FormGroup>
									{Object.keys(allSchoolsOrGrades).map((key) => (
										<FormControlLabel
											key={key}
											onChange={() => handleGradeChange(key)}
											control={<Checkbox checked={allSchoolsOrGrades[key].isSelected} />}
											label={t(allSchoolsOrGrades[key].displayValue)}
										/>
									))}
								</FormGroup>
							</Box>
						)}
					</RadioGroup>
				</Box>
			</Box>
		</FormControl>
	)
}