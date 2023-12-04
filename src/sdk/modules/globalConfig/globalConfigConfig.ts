import { createActionTypes } from 'sdk/reduxBase';

export const sliceName = 'globalConfigApi';
export const BE_PREFIX = 'graphql';
export const TESTING_ENDPOINTS_RGX = /^((https?:\/\/)?(ilcepoc|inlnqw|illnqw|localhost))/;
export const ActionTypes = createActionTypes([
	'UPDATE_BASE_URL',
	'CLEAR_API_ERROR',
	'UPDATE_API_ERROR',
	'SET_SPINNER_VISIBILITY',
	'UPDATE_SESSION_AUTH',
	'UPDATE_HOTELS',
	'UPDATE_SCHOOLS'
]);

const config = {
	sliceName
};

export default config;
