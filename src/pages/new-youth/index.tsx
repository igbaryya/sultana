import Layout from 'components/common-components/Layout';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import AddByCSV from './component/AddByCSV';
import {
	Button, Grid, Paper, Typography
} from '@mui/material';
import { t } from 'i18next';
import Loading from 'components/Loading';
import Modal from 'components/Modal';
import AddByForm from './component/AddByForm';
import { EMPTY_YOUTH, YouthDetails } from 'interfaces/YouthObject';
import { getInstance } from 'sdk';

const { youthApi: { createYouth } } = getInstance();
export default function NewYouth() {
	const userDetails = useSelector(currentUserSelector);
	const [youthDetails, setNewYoutDetails] = useState<YouthDetails>(EMPTY_YOUTH);
	const [loading, setLoading] = useState(false);
	const [isNewYouthModal, setNewYouthModal] = useState(false);
	const navigations = useNavigate();
	if (!userDetails?.isAdmin && !userDetails?.isGuide) {
		navigations('/dashboard');
		return null;
	}
	const addNewYouth = async () => {
		setLoading(true);
		const result = await createYouth(youthDetails);
		if (result === 1) {
			setNewYouthModal(false);
			setNewYoutDetails(EMPTY_YOUTH);
		}
		setLoading(false);
	};

	return (
		<Layout screen="newYouth">
			<>
				{(loading && !isNewYouthModal) && <Loading />}
			</>
			{
				isNewYouthModal && (
					<Modal
						title={t('newYouth.addYouth')}
						isOpened={isNewYouthModal}
						closeModal={() => setNewYouthModal(false)}
						primaryButton={{
							onClick: addNewYouth,
							text: t('newYouth.addYouth'),
							validateFields: true,
							loading
						}}
					>
						<AddByForm setNewYoutDetails={setNewYoutDetails} youthDetails={youthDetails} />
					</Modal>
				)
			}
			<Grid container justifyContent="center">
				<Paper style={{ padding: 50 }}>
					<Grid item xs={12}>
						<AddByCSV setLoading={setLoading} loading={loading} />
					</Grid>
					<Grid item xs={12} textAlign="center" my={5}>
						<Typography fontSize={16}>
							{t('newYouth.or')}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Button fullWidth variant="outlined" onClick={() => setNewYouthModal(true)}>
							{t('newYouth.addManually')}
						</Button>
					</Grid>
				</Paper>
			</Grid>
            
		</Layout>
	);
}
