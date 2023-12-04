import { createActionTypes } from 'sdk/reduxBase';

export const sliceName = 'youthApi';
export const ActionTypes = createActionTypes([
	'SELECT_YOUTH_ID',
	'UPDATE_TREATMENT',
	'UPDATE_RATE_TEXT',
	'UPDATE_YOUTHS',
	'UPDATE_TREATMENTS_DATA'
]);

const config = {
	sliceName
};

export default config;
