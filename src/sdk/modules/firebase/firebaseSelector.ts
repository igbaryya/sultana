import { createSelector } from '@reduxjs/toolkit';
import { ApplicationSDKState } from 'sdk/interfaces/sdkInterface';
import { sliceName } from './firebaseConfig';
import { FirebaseState } from './firebaseInterface';

export const sliceSelector = (state: ApplicationSDKState) => {
	return state[sliceName];
};
export const hellowWorldSlice = createSelector(sliceSelector, (slice: FirebaseState) => {
	return slice.helloWorldMsg;
});
