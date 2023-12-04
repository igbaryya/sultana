import { createActionTypes } from 'sdk/reduxBase';

export const sliceName = 'firebaseApi';
export const ActionTypes = createActionTypes([
	'FB_IS_updateIndicator',
	'UPDATE_MESSAGES',
	'UPDATE_LANG'
]);

const config = {
	sliceName
};

// Firebase configuration is provided at build time through environment
// variables so that no project-specific credentials are committed to source
// control. See `.env.example` for the list of required values.
export const firebaseAuthentication = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DATABASE_URL,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
export default config;
