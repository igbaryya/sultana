import { PayloadAction } from '@reduxjs/toolkit';
import { ActionTypes, FILTER_BY_SCHOOL, RISK_FACTORS, SCHOOL_FILTER_BY_SCHOOL } from './dashboardConfig';
import { DashboardState } from './dashboardInterface';

const initialState: DashboardState = {
	error: undefined,
	filterFactors: RISK_FACTORS,
	filterBy: FILTER_BY_SCHOOL,
	schoolFilterBy: SCHOOL_FILTER_BY_SCHOOL
};
const reducer = (state: DashboardState, action: PayloadAction<any>): DashboardState => {
	const { type, payload } = action;
	switch (type) {
		case ActionTypes.DASHBOARD_UPDATE_ROWS:
			return {
				...state,
				rows: payload
			};
		case ActionTypes.DASHBOARD_UPDATE_COLS:
			return {
				...state,
				cols: payload
			};
		case ActionTypes.DASHBOARD_UPDATE_RESULT:
			return {
				...state,
				result: payload
			};
		case ActionTypes.SET_YOUTHS_DATA:
			return {
				...state,
				youthsData: payload
			};
		case ActionTypes.SET_TREATMENTS_DATA_DASHBOARD:
			return {
				...state,
				treatmentsData: payload
			};
			
		case ActionTypes.UPDATE_API_ERROR:
			return {
				...state,
				error: payload
			};
		case ActionTypes.UPDATE_FILTER_FACTORS:
			return {
				...state,
				filterFactors: payload
			};
		case ActionTypes.SET_FILTER_BY:
			return {
				...state,
				filterBy: payload
			};
		case ActionTypes.SET_SCHOOL_FILTER_BY:
			return {
				...state,
				schoolFilterBy: payload
			};
		default:
			return { ...initialState, ...state };
	}
};

export default reducer;
