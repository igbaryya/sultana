import Layout from 'components/common-components/Layout';
import React, { useEffect } from 'react';
import { MainView } from './components/MainView';
import './styles.scss'
import { getInstance } from 'sdk';
import { useSelector } from 'react-redux';
import { youthsSelector } from 'sdk/modules/dashboard/dashboardSelector';
import Loading from 'components/Loading';
export default function Summary() {
	const {dashboardApi: {loadAllYouth}} = getInstance();
	useEffect(() => {
		const fetchData = async () => {
			// await loadTreatments();
			await loadAllYouth();

		};
		fetchData();
	}, [])
	const youths = useSelector(youthsSelector)
	return (
		<Layout screen="summary">
			{
				(!youths || !Object.keys(youths).length) ? (
					<Loading />
				) : (
					<MainView />
				)
			}
		</Layout>
	);
}