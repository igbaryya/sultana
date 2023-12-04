import { createActionTypes } from 'sdk/reduxBase';

export const sliceName = 'dashboardApi';
export const ActionTypes = createActionTypes([
	'DASHBOARD_UPDATE_COLS',
	'DASHBOARD_UPDATE_ROWS',
	'DASHBOARD_UPDATE_RESULT',
	'SET_YOUTHS_DATA',
	'UPDATE_FILTER_FACTORS',
	'SET_SCHOOL_FILTER_BY',
	'SET_FILTER_BY',
	'CLEAR_API_ERROR',
	'UPDATE_API_ERROR',
	'SET_TREATMENTS_DATA_DASHBOARD'
]);

const config = {
	sliceName
};

export const RISK_FACTORS = 'riskFactors'
export const FILTER_BY_SCHOOL = 'school'
export const FILTER_BY_GRADE = 'grade'
export const SCHOOL_FILTER_BY_SCHOOL = 'school'
export const SCHOOL_FILTER_BY_GENERAL_URBAN = 'general'

export default config;
