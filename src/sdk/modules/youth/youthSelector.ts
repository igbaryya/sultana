import { ApplicationSDKState } from 'sdk/interfaces/sdkInterface';
import { sliceName } from './youthConfig';
import { createSelector } from '@reduxjs/toolkit';
import { YouthState } from './youthInterface';

export const sliceSelector = (state: ApplicationSDKState) => {
	return state[sliceName];
};

export const selectedYouthIdSelector = createSelector(sliceSelector, (slice: YouthState) => {
	return slice.selectedYouthId;
});

export const treatmentsSelector = createSelector(sliceSelector, (slice: YouthState) => {
	return slice.treatments;
});
export const presenceSelector = createSelector(sliceSelector, (slice: YouthState) => {
	return slice.presence;
});
export const rateTextSelector = createSelector(sliceSelector, (slice: YouthState) => {
	return slice.rateText;
});
export const youthsSelector = createSelector(sliceSelector, (slice: YouthState) => {
	return slice.youths;
});
export const youthsTreatmentsSelector = createSelector(sliceSelector, (slice: YouthState) => {
	return slice.youthsTreatments;
});
