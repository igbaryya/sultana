import { PayloadAction } from '@reduxjs/toolkit';
import { ActionTypes } from './youthConfig';
import { YouthState } from './youthInterface';

const initialState: YouthState = {
	error: undefined,
	rateText: {
		1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6'
	}
};
const reducer = (state: YouthState, action: PayloadAction<any>): YouthState => {
	const { type, payload } = action;
	switch (type) {
		case ActionTypes.CLEAR_API_ERROR:
			return {
				...state,
				error: undefined
			};
		case ActionTypes.UPDATE_TREATMENT:
			return {
				...state,
				treatments: payload
			};
		case ActionTypes.UPDATE_PRESENCE:
			return {
				...state,
				presence: payload
			};
		case ActionTypes.SELECT_YOUTH_ID:
			return {
				...state,
				selectedYouthId: payload
			};
		case ActionTypes.UPDATE_RATE_TEXT:
			return {
				...state,
				rateText: payload
			};
		case ActionTypes.UPDATE_API_ERROR:
			return {
				...state,
				error: payload
			};
		case ActionTypes.UPDATE_YOUTHS:
			return {
				...state,
				youths: payload
			};
		case ActionTypes.UPDATE_TREATMENTS_DATA:
			return {
				...state,
				youthsTreatments: payload
			};
		default:
			return { ...initialState, ...state };
	}
};

export default reducer;
