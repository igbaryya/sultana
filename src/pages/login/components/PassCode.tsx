/* eslint-disable react/jsx-props-no-spreading */
import { Button, Grid } from '@mui/material';
import { EMPTY_STRING, OTP_LENGTH } from 'consts';
import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import LoaderButton from 'utils/loaderButton';

type Props = {
	handleLoginByPhone: (smsCode: string) => Promise<number>;
};
export default function PassCode({ handleLoginByPhone }: Props) {
	const [otp, setOtp] = useState(EMPTY_STRING);
	const [loading, setLoading] = useState(false);
	
	useEffect(() => {
		if (otp.length === OTP_LENGTH) {
			handleLogin();
		}
	}, [otp]);

	const handleLogin = async () => {
		setLoading(true);
		const res = await handleLoginByPhone(otp);
		setLoading(false);
		if (res === 1) {
			toast(t('login.SignedInSuccessfully'), { type: 'success', position: toast.POSITION.TOP_LEFT });
		} else {
			toast(t('login.invalidOTP'), { type: 'error', position: toast.POSITION.TOP_LEFT });
			setOtp(EMPTY_STRING);
		}
	};
	const handleKeyPress = (event: any) => {
		if (event.key === 'Enter') {
			handleLogin();
		}
	};

	return (
		<Grid
			container
			padding={2}
			justifyContent="center"
			style={{ direction: 'ltr' }}
		>
			<Grid container justifyContent="center">
				<OtpInput
					value={otp}
					onChange={setOtp}
					numInputs={6}
					shouldAutoFocus
					renderSeparator={<span>-</span>}
					renderInput={(props) => (
						<input
							{...props}
							className="login-passcode-input"
							onKeyDown={(e) => handleKeyPress(e)}
							inputMode="numeric"
							pattern="[0-9]*"
						/>
					)}
				/>
			</Grid>
			<Grid container pt={1} justifyContent="center">
				<Grid item xs={12} md={8} pt={3}>
					<Button
						fullWidth
						variant="contained"
						disabled={otp.length !== OTP_LENGTH || loading}
						onClick={handleLogin}
						style={{ backgroundColor: 'black', color: 'white' }}
					>
						{loading ? (
							<LoaderButton />
						) : (
							t('login.enterToSystem')
						)}
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}
