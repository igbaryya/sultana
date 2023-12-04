/* eslint-disable no-mixed-spaces-and-tabs */
import {
	Box,
	Button,
	Grid,
	Modal as MUIModal,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './style.scss';
import { isMobile, isTablet } from 'mobile-device-detect';
import LoaderButton from 'utils/loaderButton';
import { t } from 'i18next';
  
  type Props = {
  	children: any;
  	title: string;
  	isOpened: boolean;
	  isNewUser?: boolean;
  	closeModal: () => void;
	  primaryButton?: {
  		text: string;
  		onClick: () => void;
  		loading?: boolean;
  		validateFields: boolean;
  	};

  };
  
export default function Modal({
	title,
	children,
	closeModal,
	isOpened,
	primaryButton
}: Props) {
	const [, setIsPrimaryButtonDisabled] = useState(false);
  
	useEffect(() => {
		if (primaryButton && primaryButton.validateFields) {
			setIsPrimaryButtonDisabled(!primaryButton.validateFields);
		}
	}, [primaryButton]);
  
	return (
		<MUIModal
			open={isOpened}
			onClose={closeModal}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box
				className="modal-container"
				sx={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: isMobile ? '95%' : '80%',
					minHeight: isMobile ? '100%' : 400,
					bgcolor: 'background.paper',
					border: '1px solid #ccc',
					boxShadow: 24,
					borderRadius: isMobile ? 0 : 5,
					p: 1,
				}}
			>
	
				<Grid item xs={12} mt={2}>
					<Grid mb={1} item xs={12} style={{ maxHeight: 140 }} borderBottom="1px solid #ccc" className="modal-header-view">
						<div className="modal-header">
							<div>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									{title}
								</Typography>
							</div>
							<div>
								<Button onClick={closeModal}>
									<CloseIcon />
								</Button>
							</div>
						</div>
					</Grid>
					<Grid
						xs={12}
						item
						sx={{
							maxHeight: (isMobile || isTablet) ? window.innerHeight - 140 : 700,
							overflowY: 'auto',
							overflowX: 'hidden'
						}}
					>
						{children}
					</Grid>
					
				</Grid>
				<div className="modal-footer">
					{primaryButton && (
						<Button
							fullWidth
							variant="contained"
							disabled={!primaryButton.validateFields}
							onClick={primaryButton.onClick}
						>
							{primaryButton.loading ? <LoaderButton /> : primaryButton.text}
						</Button>
					)}
					<Button fullWidth variant="outlined" onClick={closeModal}>
						{t('general.close')}
					</Button>
				</div>
			</Box>
		</MUIModal>
	);
}
  
