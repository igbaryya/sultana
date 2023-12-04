import { createSelector } from '@reduxjs/toolkit';
import { ApplicationSDKState } from 'sdk/interfaces/sdkInterface';
import { sliceName } from './usersConfig';
import { UsersState } from './usersInterface';

export const sliceSelector = (state: ApplicationSDKState) => {
	return state[sliceName];
};
export const usersSelector = createSelector(sliceSelector, (slice: UsersState) => {
	return slice.users;
});
