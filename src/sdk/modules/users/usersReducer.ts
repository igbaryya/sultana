import { PayloadAction } from '@reduxjs/toolkit';
import { ActionTypes } from './usersConfig';
import { UsersState } from './usersInterface';

const initialState: UsersState = {
	users: {},
	error: undefined
};
const reducer = (state: UsersState, action: PayloadAction<any>): UsersState => {
	const { type, payload } = action;
	switch (type) {
		case ActionTypes.UPDATE_USERS:
			return {
				...state,
				users: payload
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
		default:
			return { ...initialState, ...state };
	}
};

export default reducer;
