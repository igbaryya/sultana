import { createActionTypes } from 'sdk/reduxBase';

export const sliceName = 'loginApi';
export const ActionTypes = createActionTypes([
	'UPDATE_CURRENT_USER',
	'CLEAR_API_ERROR',
	'UPDATE_API_ERROR',
	'UPDATE_OTP_TARGET_TO_SMS',
	'UPDATE_LOGIN_BY_GOOGLE'
]);

const config = {
	sliceName
};

export default config;
