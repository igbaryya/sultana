import Layout from 'components/common-components/Layout';
import React from 'react';
import SearchYouth from './components/SearchYouth';
import DashboardTeacher from '../dashboardTeacher';
import { useSelector } from 'react-redux';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';

export default function Dashboard() {
	const userDetails = useSelector(currentUserSelector);
	// console.log(userDetails, 'shohma manyak');
	if (userDetails && Object.keys(userDetails).length === 0) {
		return (
			<Layout screen="dashboard">
				Loading
			</Layout>
		);
	}
	return (
		<Layout screen="dashboard">
			{
				userDetails?.isAdmin || userDetails?.isGuide ? <SearchYouth /> : <DashboardTeacher />
			}
		</Layout>
	);
}
