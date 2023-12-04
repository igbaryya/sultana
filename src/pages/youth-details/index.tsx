/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable */
import Layout from 'components/common-components/Layout';
import React, { useEffect, useState } from 'react';
import PersonalDetails from './components/PersonalDetails';
import { useNavigate, useParams } from 'react-router-dom';
import { getInstance } from 'sdk';
import { YouthDetails } from 'interfaces/YouthObject';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Tab, Tabs } from '@mui/material';
import TreatmentSheets from './components/TreatmentSheets';
import { t } from 'i18next';
import InformationDetails from './components/InformationDetails';

const { youthApi: { retrieveYouth, updateSelectedYouthId, updateTreatmentStore, updateYouth } } = getInstance();
export default function YouthDetailsComponent() {
	const { id } = useParams() || {};
	const [currentTab, setCurrentTab] = useState(0);
	const [youthDetails, setYouthDetails] = useState<YouthDetails | null>();
	const navigations = useNavigate();
	if (!id) {
		navigations('/dashboard');
		return null;
	}
	useEffect(() => {
		updateTreatmentStore(null);
		updateSelectedYouthId(id);
		retrieveYouth(id).then((res) => {
			if (!res?.id) {
				navigations('/dashboard');
			} else {
				setYouthDetails(res);
			}
		});
	}, []);
	const refrehYouthDetails = () => {
		retrieveYouth(id).then((res) => {
			if (!res?.id) {
				navigations('/dashboard');
			} else {
				setYouthDetails(res);
			}
		});
	}
	const getYouthDetails = async () => {
		const res = await retrieveYouth(id);
		if (!res?.id) {
			navigations('/dashboard');
		}
		return res;
	}
	
	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		event.preventDefault();
		setCurrentTab(newValue);
	};

	const a11yProps = (index: number) => {
		return {
			id: `youth-tab-${index}`,
			'aria-controls': `youth-tabpanel-${index}`,
		};
	};
  
	return (
		<Layout screen="youthDetails">
			{
				!youthDetails ? (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '100vh',
							width: '100%',
						}}
					>
						<CircularProgress size={80} thickness={4} />
					</Box>
				) : (
					<>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<Tabs value={currentTab} onChange={handleChangeTab}>
								<Tab label={t('youthDetails.PersonalDetails')} {...a11yProps(0)} />
								<Tab label={t('youthDetails.TepolSheets')} {...a11yProps(1)} />
								<Tab label={t('youthDetails.InformationDetails')} {...a11yProps(2)} />
							</Tabs>
						</Box>
						{
							currentTab === 0 ? (
								<PersonalDetails id={id} youthDetails={youthDetails} refrehYouthDetails={refrehYouthDetails} getYouthDetails={getYouthDetails} />
							) : currentTab === 1 ? (
								<TreatmentSheets setYouthDetails={setYouthDetails} youthDetails={youthDetails} updateYouth={updateYouth} youthId={id} refrehYouthDetails={refrehYouthDetails} />
							) : <InformationDetails id={id} youthDetails={youthDetails} />

						}
						
					</>
				)
			}
			
		</Layout>
		
	);
}
