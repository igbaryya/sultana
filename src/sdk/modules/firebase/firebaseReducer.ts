import { PayloadAction } from '@reduxjs/toolkit';
import { ActionTypes } from './firebaseConfig';
import { FirebaseState } from './firebaseInterface';

const initialState: FirebaseState = {
	helloWorldMsg: 'Hello World from module Firebase',
	error: undefined
};
const reducer = (state: FirebaseState, action: PayloadAction<any>): FirebaseState => {
	const { type, payload } = action;
	switch (type) {
		case ActionTypes.UPDATE_HELLO_WORLD:
			return {
				...state,
				helloWorldMsg: payload
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
