import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import './style.scss';
import Recaptcha from './components/RecaptchaVerifier';
import { isMobile } from 'mobile-device-detect';

import PassCode from './components/PassCode';
import { getInstance } from 'sdk';
import {
	PhoneAuthProvider,
	RecaptchaVerifier,
	UserCredential,
	signInWithCredential,
	signInWithPhoneNumber,
} from 'firebase/auth';
import {
	Grid, Paper, Typography, Divider
} from '@mui/material';
import { COUNTRY_CODE, EMPTY_STRING, OTP_LENGTH } from 'consts';
import { t } from 'i18next';
import { User } from 'interfaces/User';

declare global {
	interface Window {
		recaptchaVerifier: RecaptchaVerifier;
		signInByPhone: (verificationCode: string) => Promise<UserCredential>;
	}
}
declare module 'react-autosuggest';

type Props = {
	setIsLoggedIn?: (flag: boolean) => void;
};
const {
	firebaseApi: { getAuthRef },
	loginApi: { isAuthorizedEmail, initLoggedInUser },
} = getInstance();
export default function Login({ setIsLoggedIn }: Props) {
	const [step, setStep] = useState(1);
	const [verificationId, setVerificationId] = useState(EMPTY_STRING);
	const handleSendOTP = async (email: string) => {
		let res;
		try {
			const user: User | null = await isAuthorizedEmail(email);
			if (!user?.phoneNumber) {
				return -1;
			}
			const auth = getAuthRef();
			res = await signInWithPhoneNumber(
				auth,
				`${COUNTRY_CODE}${user?.phoneNumber}`,
				window.recaptchaVerifier,
			);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.warn(err);
		}
		if (!res?.verificationId) {
			return 0;
		}
		setVerificationId(res.verificationId);
		window.signInByPhone = res.confirm;
		setStep(step + 1);
		return 1;
	};
	const handleLoginByPhone = async (otpCode: string) => {
		if (!verificationId || !otpCode || otpCode?.length !== OTP_LENGTH) {
			return -1;
		}
		const credential = PhoneAuthProvider.credential(verificationId, otpCode);
		try {
			const auth = getAuthRef();
			const res = await signInWithCredential(auth, credential);
			if (res?.user?.uid) {
				// console.log(res?.user);
				setTimeout(initLoggedInUser);
				return 1;
			}
			return 0;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn(error);
			return -1;
		}
	};
	const renderView = () => {
		if (step === 2) {
			return <PassCode handleLoginByPhone={handleLoginByPhone} />;
		}
		return <LoginForm handleSendOTP={handleSendOTP} setIsLoggedIn={setIsLoggedIn} />;
	};
	return (
		<div
			className="login-container"
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				overflow: 'hidden',
			}}
		>
			<Grid container justifyContent="center">
				{/* Desktop View */}
				{!isMobile ? (
					<Grid style={{ width: '100%' }}>
						<Paper
							elevation={0}
							style={{ display: 'flex', alignItems: 'center' }}
						>
							{/* Left Section (Image) */}
							<div style={{ flex: 1 }}>
								<img
									src="/assets/images/intro.png"
									alt="Login"
									style={{ width: '100%', height: 'auto' }}
								/>
							</div>

							{/* Divider to create a separation line */}
							<Divider orientation="vertical" flexItem />

							{/* Right Section (Login Form) */}
							<div style={{ flex: 1, marginLeft: 20 }}>
								<div style={{ textAlign: 'center' }}>
									<img src="/assets/images/logo-sderot.png" alt="Login" />
								</div>
								<Typography variant="h4" align="center" gutterBottom>
									{t('login.centerTitle')}
								</Typography>

								<Typography variant="h6" align="center" gutterBottom>
									{step === 1
										? t('login.enterMailLabel')
										: t('login.EnterTheOPT')}
								</Typography>
								{renderView()}
								<Typography variant="body2" align="center" gutterBottom>
									&copy; Powered by Amdocs Negev - Classic Digital UI
								</Typography>
							</div>
						
						</Paper>
					</Grid>
				) : (
					<Grid item xs={12} md={8}>
						<Paper
							elevation={0}
							style={{ display: 'flex', flexDirection: 'column' }}
						>
							<div style={{ textAlign: 'center' }}>
								<img src="/assets/images/logo-sderot.png" alt="Login" />
							</div>
							{/* Top Section (Image) */}
							<Typography variant="h4" align="center" gutterBottom>
								{t('login.centerTitle')}
							</Typography>
							{/* Divider to create a separation line */}
							<Divider style={{ marginBottom: 20 }} />

							{/* Bottom Section (Login Form) */}
							<div>
								<Typography variant="h6" align="center" gutterBottom>
									{step === 1
										? t('login.enterMailLabel')
										: t('login.EnterTheOPT')}
								</Typography>
								{renderView()}
								<Typography variant="body2" align="center" gutterBottom>
									&copy; Powered by Amdocs Negev - Classic Digital UI
								</Typography>
							</div>
						
						</Paper>
					</Grid>
				)}

				<Grid item xs={12} md={8}>
					<Recaptcha />
				</Grid>
				
			</Grid>
			
		</div>
	);
}
