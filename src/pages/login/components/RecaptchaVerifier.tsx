import { RecaptchaVerifier } from 'firebase/auth';
import React, { useEffect } from 'react';
import { getInstance } from 'sdk';

const { firebaseApi: { getAuthRef } } = getInstance();
export default function Recaptcha() {
	useEffect(() => {
		const auth = getAuthRef();
		auth.languageCode = 'he';
		window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
			size: 'invisible'
		});
	}, []);
	return (
		<div id="recaptcha-container" />
	);
}
