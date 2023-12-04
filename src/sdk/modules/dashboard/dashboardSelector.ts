import { createSelector } from '@reduxjs/toolkit';
import { ApplicationSDKState } from 'sdk/interfaces/sdkInterface';
import { sliceName } from './dashboardConfig';
import { DashboardState } from './dashboardInterface';

export const sliceSelector = (state: ApplicationSDKState) => {
	return state[sliceName];
};
export const rowsSelector = createSelector(sliceSelector, (slice: DashboardState) => {
	return slice.rows;
});
export const colsSelector = createSelector(sliceSelector, (slice: DashboardState) => {
	return slice.cols;
});
export const resultSelector = createSelector(sliceSelector, (slice: DashboardState) => {
	return slice.result;
});
export const youthsSelector = createSelector(sliceSelector, (slice: DashboardState) => {
	return slice.youthsData;
});
export const treamentsSelector = createSelector(sliceSelector, (slice: DashboardState) => {
	return slice.treatmentsData;
});
export const filterFactorsSelector = createSelector(sliceSelector, (slice: DashboardState) => {
	return slice.filterFactors;
});
export const filterBySelector = createSelector(sliceSelector, (slice: DashboardState) => {
	return slice.filterBy;
});
export const schoolFilterBySelector = createSelector(sliceSelector, (slice: DashboardState) => {
	return slice.schoolFilterBy;
});
