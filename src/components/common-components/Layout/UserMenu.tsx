import * as React from 'react';
import Button from '@mui/material/Button';
import { getInstance } from 'sdk';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import { Grid, Typography } from '@mui/material';
import AdminMenu from './components/AdminMenu';

const { firebaseApi: { getAuthRef }, loginApi: { userHook, clearUser } } = getInstance();
export default function UserMenu() {
	React.useEffect(userHook, []);
	const currentUser = useSelector(currentUserSelector);
	const handleSignout = () => {
		getAuthRef().signOut().then(() => {
			window.localStorage.clear();
			window.sessionStorage.clear();
			clearUser();
		});
	};
	const getLoginDate = (d?: string) => {
		const date = new Date(d || new Date());
		return `${date.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})}`;
	};
	return (
		<Grid container flexDirection="row">
			<Grid item xs="auto" display="flex" alignItems="center" borderLeft="1px solid #ccc" paddingLeft={1} flexDirection="column">
				{
					currentUser && (
						<>
							<Grid xs={12}>
								<Typography fontSize={18} color="GrayText">
									{currentUser.name}
								</Typography>
							</Grid>
							<Grid xs={12}>
								<Typography fontSize={11} color="GrayText">
									{t('navbar.lastLoginDate')}
									{`  ${getLoginDate(currentUser.lastAuthDate)} `}
								</Typography>
							</Grid>
						</>
					)
				}
				
			</Grid>
			{
				currentUser?.isAdmin ? (
					<AdminMenu handleSignout={handleSignout} />
				) : (
					<Button
						id="user-menu"
						style={{
							paddingLeft: 0
						}}
						onClick={handleSignout}
						color="warning"
					>
						{t('login.Logout')}
					</Button>
				)
			}
	
		</Grid>
	);
}
