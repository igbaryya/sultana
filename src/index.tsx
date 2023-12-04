import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import AppRouter from 'routes';
import { getInstance, getStore } from 'sdk';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../public/assets/sass/index.scss';
import './translations/i18n';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { INACTIVITY_DURATION_MINUTES } from 'consts';

const {
	firebaseApi: { getAuthRef }, loginApi: { isLogInByGoogle },
} = getInstance();
export default function AppBase() {
	const auth = getAuthRef();
	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('uid'));
	let inactivityTimer: NodeJS.Timeout | undefined;

	useEffect(() => {
		const unsub = auth.onAuthStateChanged(handleAuthChanged);
		window.addEventListener('focus', resetInactivityTimer);
		window.addEventListener('blur', startInactivityTimer);
		return () => {
			unsub();
			window.removeEventListener('focus', resetInactivityTimer);
			window.removeEventListener('blur', startInactivityTimer);
			clearTimeout(inactivityTimer);
		};
	}, []);
	const handleAuthChanged = (user: User) => {
		const isFBLoggedIn = !!user?.uid;
		localStorage.setItem('uid', `${isFBLoggedIn}`);
		const isByGoogle = isLogInByGoogle();
		if (isByGoogle) {
			const fbId = window.localStorage.getItem('fbUID');
			setIsLoggedIn(!!fbId && isFBLoggedIn);
		} else {
			setIsLoggedIn(isFBLoggedIn);
		}
	};
	const startInactivityTimer = () => {
		inactivityTimer = setTimeout(() => {
			auth.signOut().then(() => {
				window.sessionStorage.clear();
				window.localStorage.clear();
			});
		}, INACTIVITY_DURATION_MINUTES * 60 * 1000);
	};

	const resetInactivityTimer = () => {
		clearTimeout(inactivityTimer);
	};

	const theme = createTheme({
		palette: {
			primary: {
				main: '#000'
			}
		},
		typography: {
			fontFamily: 'Noto Sans Hebrew',
		},
		components: {
			MuiInputLabel: {
				styleOverrides: {
					root: {
						right: '1.75rem',
						transformOrigin: 'right',
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					notchedOutline: {
						textAlign: 'right',
					},
				},
			},
		},
	});
	return (
		<Provider store={getStore()}>
			<ThemeProvider theme={theme}>
				<ToastContainer />
				<AppRouter isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
			</ThemeProvider>
		</Provider>
	);
}
