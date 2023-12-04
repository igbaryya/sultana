import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { withTranslation, WithTranslation } from 'react-i18next';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';

interface Props extends WithTranslation {
	children: any;
	screen: string;
}
function Layout({ children, screen, t }: Props) {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};
	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static" color="inherit">
					<Toolbar
						sx={{
							display: 'flex',
							alignContent: 'space-around',
							justifyContent: 'center',
						}}
					>
						{screen !== 'dashboard' && (
							<Button onClick={handleGoBack} style={{ minWidth: 20, paddingRight: 0 }}>
								<ArrowForwardIcon />
							</Button>
						)}

						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							{t(`screensTitle.${screen}`)}
						</Typography>

						<Grid position="absolute" left={10} top={10}>
							<UserMenu />
						</Grid>
					</Toolbar>
				</AppBar>
			</Box>
			<Grid container mt={1.5}>
				{children}
			</Grid>
		</>
	);
}

export default withTranslation()(Layout);
