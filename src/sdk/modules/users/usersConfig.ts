import { createActionTypes } from 'sdk/reduxBase';

export const sliceName = 'usersApi';
export const ActionTypes = createActionTypes([
	'UPDATE_USERS',
	'CLEAR_API_ERROR',
	'UPDATE_API_ERROR'
]);

const config = {
	sliceName
};

export default config;
