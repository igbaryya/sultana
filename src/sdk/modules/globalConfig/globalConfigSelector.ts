import { createSelector } from '@reduxjs/toolkit';
import { ApplicationSDKState } from 'sdk/interfaces/sdkInterface';
import { sliceName } from './globalConfigConfig';
import { GlobalConfigState } from './globalConfigInterface';

export const sliceSelector = (state: ApplicationSDKState) => {
	return state[sliceName];
};
export const baseUrlSelector = createSelector(sliceSelector, (slice: GlobalConfigState) => {
	return slice.baseUrl;
});
export const isSpinnerVisible = createSelector(sliceSelector, (slice: GlobalConfigState) => {
	return slice.isSpinnerVisible;
});
export const sessionAuthSelector = createSelector(sliceSelector, (slice: GlobalConfigState) => {
	return slice.auth;
});
export const hotelsSelector = createSelector(sliceSelector, (slice: GlobalConfigState) => {
	return slice.hotels;
});
export const schoolsSelector = createSelector(sliceSelector, (slice: GlobalConfigState) => {
	return slice.schools;
});
