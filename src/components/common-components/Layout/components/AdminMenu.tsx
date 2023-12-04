/* eslint-disable */
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { t } from 'i18next';
import { AddUserComponent } from 'pages/dashboard/components/AddUserComponent';
import { useNavigate } from 'react-router-dom';

type Props = {
	handleSignout: () => void;
};
export default function AdminMenu({ handleSignout }: Props) {
	const [open, setOpen] = React.useState(false);
	const [isModalOpened, setOpenModal] = React.useState(false);
	const navigate = useNavigate();
	const toggleDrawer = (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
			return;
		}

		setOpen(isOpen);
	};

	const list = () => (
		<Box
			sx={{ width: 'auto' }}
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
		>
			<List>
			<ListItem disablePadding>
					<ListItemButton onClick={() => navigate('/dashboard')}>
						<ListItemText sx={{ textAlign: 'right' }} primary={t('navbar.home')} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate('/statistics')}>
						<ListItemText sx={{ textAlign: 'right' }} primary={t('navbar.statistics')} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate('/summary')}>
						<ListItemText sx={{ textAlign: 'right' }} primary={t('navbar.summaryDashboard')} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate('/newYouth')}>
						<ListItemText sx={{ textAlign: 'right' }} primary={t('navbar.addNewYouth')} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => setOpenModal(true)}>
						<ListItemText sx={{ textAlign: 'right' }} primary={t('navbar.addNewUser')} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate('/users')}>
						<ListItemText sx={{ textAlign: 'right' }} primary={t('navbar.users')} />
					</ListItemButton>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={handleSignout} color="warning">
						<ListItemText sx={{ textAlign: 'right', color: '#e74c3c' }} primary={t('navbar.logout')} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	return (
		<>
			<Button
				style={{
					paddingLeft: 0
				}}
				onClick={toggleDrawer(true)}
				color="inherit"
			>
				<MenuIcon />
			</Button>
			<Drawer
				anchor="bottom"
				open={open}
				onClose={toggleDrawer(false)}
			>
				{list()}
			</Drawer>
			{isModalOpened && (
				<AddUserComponent
					isModalOpened={isModalOpened}
					setOpenModal={setOpenModal}
				/>
				
			)}
		</>
	);
}
