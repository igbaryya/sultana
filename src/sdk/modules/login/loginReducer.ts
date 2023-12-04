import { PayloadAction } from '@reduxjs/toolkit';
import { ActionTypes } from './loginConfig';
import { LoginState } from './loginInterface';

const initialState: LoginState = {
	currentUser: null,
	error: undefined,
	sendSMS: true
};
const reducer = (state: LoginState, action: PayloadAction<any>): LoginState => {
	const { type, payload } = action;
	switch (type) {
		case ActionTypes.UPDATE_CURRENT_USER:
			return {
				...state,
				currentUser: payload
			};
		case ActionTypes.CLEAR_API_ERROR:
			return {
				...state,
				error: undefined
			};
		case ActionTypes.UPDATE_API_ERROR:
			return {
				...state,
				error: payload
			};
		case ActionTypes.UPDATE_OTP_TARGET_TO_SMS:
			return {
				...state,
				sendSMS: !!payload
			};
		case ActionTypes.UPDATE_LOGIN_BY_GOOGLE:
			return {
				...state,
				isByGoogle: !!payload
			};
		default:
			return { ...initialState, ...state };
	}
};

export default reducer;
