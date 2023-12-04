/* eslint-disable */
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import BaseApi from 'sdk/reduxBase/baseApi';
import { ActionTypes, FILTER_BY_SCHOOL, RISK_FACTORS, SCHOOL_FILTER_BY_GENERAL_URBAN, SCHOOL_FILTER_BY_SCHOOL, sliceName } from './dashboardConfig';
import * as selectors from './dashboardSelector';
import { RiskFactorsState } from 'pages/summary/components/RiskFactorsFilter';
import { DashboardFilterResult, YouthData, YouthKeys } from './dashboardInterface';
import FirebaseRefrenceApi from '../firebase/firebaseApi';
import { YOUTHS_TABLE } from 'consts/firebase';
import { KeyOf, RiskCharacteristics, Youth } from 'interfaces/YouthObject';
import { EMPTY_STRING } from 'consts';
import { t } from 'i18next';
import { gradeLevels } from 'components/common-components/ClassDropdown';
import { getInstance } from 'sdk';


export default class DashboardApi extends BaseApi {
	constructor(store: ToolkitStore) {
		super(store, ActionTypes, sliceName);
		this.firebaseApi = FirebaseRefrenceApi.instance;
	}
	loadTreatments = async () => {
		const { youthApi: { getUserTreatments } } = getInstance();
		return await getUserTreatments();
		// this.store.dispatch({ type: ActionTypes.SET_TREATMENTS_DATA_DASHBOARD, payload: treatments});
		// Replace this with the actual call to fetch additional data
		
	}
	loadAllYouth = async () => {

		return this.firebaseApi.registerCall(YOUTHS_TABLE, async (data) => {
			const youthData: Record<string, YouthData> = {};
			
			const youths: Youth = data.val();
			// const treatments = await this.loadTreatments();

			for (const youthId of Object.keys(youths)) {
				const {riskCharacteristics, school, class: youthClass, returnedToStudy} = youths[youthId];
				const final: any = {}
				Object.keys(riskCharacteristics).forEach((risk: KeyOf<RiskCharacteristics>) => {
					const val = riskCharacteristics[risk]; 
					
					if (val === 'No') {
						final[risk] = false
					} else {
						final[risk] = true
					}
				})
				youthData[youthId] = {
					...final,
					school: school ?? EMPTY_STRING,
					class: youthClass ?? EMPTY_STRING,
					returnedToStudy: returnedToStudy ?? EMPTY_STRING,
					activeOnly: !returnedToStudy // lastAvailabilityAtVenture !== '' || lastAvailablityAtZoom !== '' || (treatments &&  (treatments as any)[youthId] && Object.values((treatments as any)[youthId]).length > 0)
					
				}
			}
			this.store.dispatch({ type: ActionTypes.SET_YOUTHS_DATA, payload: youthData});
		})
	}
	updateResultRows = (rows: RiskFactorsState) => {
		this.store.dispatch({ type: ActionTypes.DASHBOARD_UPDATE_ROWS, payload: rows });
		this.updateResult();
	}
	updateColumns = (columns: RiskFactorsState) => {
		this.store.dispatch({ type: ActionTypes.DASHBOARD_UPDATE_COLS, payload: columns });
		this.updateResult();
	}

	updateFilterFactors = (filterFactors: string) => {
		this.store.dispatch({ type: ActionTypes.UPDATE_FILTER_FACTORS, payload: filterFactors});
	}

	updateResult = () => {
		const columns = selectors.colsSelector(this.store.getState()) || {};
		const rows = selectors.rowsSelector(this.store.getState()) || {};
		// console.log('RISK_FACTORS', RISK_FACTORS);
		const isRisk = selectors.filterFactorsSelector(this.store.getState()) === RISK_FACTORS;

		const isActivity = selectors.filterFactorsSelector(this.store.getState()) !== RISK_FACTORS;
		// console.log('isActivity', isActivity, 'isRisk', isRisk);
		const isInGeneralSchoolFilterBy = selectors.schoolFilterBySelector(this.store.getState()) === SCHOOL_FILTER_BY_GENERAL_URBAN;
		const filterBySchool = selectors.filterBySelector(this.store.getState()) === FILTER_BY_SCHOOL;
		const result: DashboardFilterResult = {}

		const youths = selectors.youthsSelector(this.store.getState()) || {};
		// const treatments = selectors.treamentsSelector(this.store.getState()) || {};
		// console.log(treatments);
		// console.log(youths);

		const getTotal = (key: YouthKeys, value: any, alognWithKey: YouthKeys, alongWithValue: any) => {
			// console.log(key, value, alognWithKey, alongWithValue);
			let count = 0; 
			Object.keys(youths).forEach((youthId) => {
				
				if (!!youths[youthId][key] || (value === SCHOOL_FILTER_BY_GENERAL_URBAN && key === 'school')) {
					// console.log('youths[youthId][key]', key, youths[youthId][key]);
					// console.log('youths[youthId][alognWithKey]', alognWithKey, youths[youthId][alognWithKey]);
					count += ((value === SCHOOL_FILTER_BY_GENERAL_URBAN ? true : youths[youthId][key] === value ) && youths[youthId][alognWithKey] === alongWithValue)? 1 : 0
				}
			})
			// console.log('COUNT', count);
			return count
		}
		// console.log('updateResult', rows);
		Object.keys(columns).forEach((col) => {
			// console.log('COL', col);
			const skipCount = !columns[col].isSelected || col === 'allSchools' || col === 'allGrades';
			if (!skipCount) {
				Object.keys(rows).forEach((row) => {
					// console.log('row', row);
					const skipCount = !rows[row].isSelected || row === 'allRisks' || row === 'allReturned';
					if (!skipCount) {
						const asDisplayVal = t(columns[col].displayValue);
						const count = getTotal(
							filterBySchool ? 'school' : 'class', 
							filterBySchool ? isInGeneralSchoolFilterBy ? SCHOOL_FILTER_BY_GENERAL_URBAN : asDisplayVal : gradeLevels.find((g) => g.label === asDisplayVal)?.value, 
							row as YouthKeys, !!isRisk || !!isActivity)
						const asRowValue = t(rows[row].displayValue);
						if (!result[asRowValue]) {
							result[asRowValue] = []; 
						}
						result[asRowValue].push({
							displayValue: asDisplayVal,
							key: col,
							total: count
						})
					}
				})
				
			}
		})
		this.store.dispatch({ type: ActionTypes.DASHBOARD_UPDATE_RESULT, payload: result });
	}

	setFilterBy = (filterBy: string) => {
		this.store.dispatch({ type: ActionTypes.SET_FILTER_BY, payload: filterBy });
	}

	setSchoolFilterBy = (filter: string) => {
		this.store.dispatch({ type: ActionTypes.SET_SCHOOL_FILTER_BY, payload: filter ?? SCHOOL_FILTER_BY_SCHOOL });
	}
	firebaseApi: FirebaseRefrenceApi
}
