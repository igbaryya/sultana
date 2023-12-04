import { createSelector } from '@reduxjs/toolkit';
import { ApplicationSDKState } from 'sdk/interfaces/sdkInterface';
import { sliceName } from './loginConfig';
import { LoginState } from './loginInterface';

export const sliceSelector = (state: ApplicationSDKState) => {
	return state[sliceName];
};
export const currentUserSelector = createSelector(sliceSelector, (slice: LoginState) => {
	return slice.currentUser;
});
export const sendToSMSSelector = createSelector(sliceSelector, (slice: LoginState) => {
	return slice.sendSMS;
});
export const byGoogleLoginSelector = createSelector(sliceSelector, (slice: LoginState) => {
	return slice.isByGoogle;
});
