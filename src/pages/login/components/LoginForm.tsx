import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { Button, TextField } from '@mui/material';
import { EMPTY_STRING } from 'consts';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import LoaderButton from 'utils/loaderButton';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getInstance } from 'sdk';
import { User } from 'interfaces/User';
import Text from 'components/common-components/Text';

type Props = {
	handleSendOTP: Function;
	setIsLoggedIn?: (flag: boolean) => void;
};
const { firebaseApi: { getAuthRef }, loginApi: { isAuthorizedEmail, initLoggedInUser, setByGoogleSignIn } } = getInstance();
export default function LoginForm({ handleSendOTP, setIsLoggedIn }: Props) {
	const [email, setEmail] = useState(EMPTY_STRING);
	const [hasError, setHasError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [googleSigningIn, setGSigninIn] = useState(false);
	const handleLogin = async () => {
		setByGoogleSignIn(false);
		if (!email) {
			toast(t('login.WrongEmail'), { type: 'error', position: toast.POSITION.TOP_LEFT });
			setHasError(true);
			return;
		}
		setLoading(true);
		const res = await handleSendOTP(email);
		setLoading(false);
		if (res !== 1) {
			toast(res === 0 ? t('login.FailedToSendSMS') : t('login.unauthorized'), {
				type: 'error'
			});
		} else {
			toast(t('login.OTPSent'), { type: 'success', position: toast.POSITION.TOP_LEFT });
		}
	};
	const handleGoogleSignin = async () => {
		setGSigninIn(true);
		setByGoogleSignIn(true);
		localStorage.clear();
		sessionStorage.clear();
		const auth = getAuthRef();
		try {
			const { user: { email: authEmail } } = await signInWithPopup(
				auth,
				new GoogleAuthProvider()
			);
			if (!authEmail) {
				throw new Error('no email');
			}
			const isAuth: User | null = await isAuthorizedEmail(authEmail);
			if (!isAuth) {
				throw new Error('not auth');
			}
			initLoggedInUser();
			setIsLoggedIn?.(true);
		} catch (err) {
			toast(t('login.notAuth'), { type: 'error', position: toast.POSITION.TOP_LEFT });
			auth.signOut().then(() => {
				localStorage.clear();
				sessionStorage.clear();
			});
			// eslint-disable-next-line no-console
			console.warn(err);
		}
		setGSigninIn(false);
	};
	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { value } = event.target;
		const v = `${value || EMPTY_STRING}`.trim();
		setEmail(v);
	};
	const handleKeyPress = (event: any) => {
		if (event.key === 'Enter') {
			handleLogin();
		}
	};
	return (
		<Grid container padding={2} justifyContent="center">
			<Grid item xs={12} md={8}>
				<TextField
					maxRows={10}
					type="email"
					fullWidth
					focused
					value={email}
					error={!email && hasError}
					id="outlined-basic"
					label={t('login.email')}
					variant="outlined"
					onChange={handleChange}
					onKeyDown={(e) => handleKeyPress(e)}
					helperText=""
				/>
			</Grid>
			<Grid container pt={1} justifyContent="center">
				<Grid item xs={12} md={7} pt={3}>
					<Button
						fullWidth
						variant="contained"
						onClick={handleLogin}
						disabled={loading}
						style={{ backgroundColor: 'black', color: 'white' }}
					>
						{loading ? (
							<LoaderButton />
						) : (
							t('login.sendSMS')
						)}
					</Button>
				</Grid>
				<Grid item xs={12} md={7} pt={1}>
					<Text translation="login.or" textAlign="center" />
				</Grid>
				<Grid item xs={12} md={7} pt={1}>
					<Button
						fullWidth
						variant="contained"
						onClick={handleGoogleSignin}
						disabled={googleSigningIn}
						style={{ backgroundColor: '#4285F4', color: 'white' }}
					>
						{googleSigningIn ? (
							<LoaderButton />
						) : (
							t('login.google')
						)}
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}
