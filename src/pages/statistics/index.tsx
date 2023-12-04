import Layout from 'components/common-components/Layout';
import React from 'react';
import { getInstance } from 'sdk';
import MainView from './components/MainViewController';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { youthApi: { retrieveAllYouth, retrieveAllYouthTreatments } } = getInstance();
export default function Statistics() {
	const currentUser = useSelector(currentUserSelector);
	const navigate = useNavigate();
	if (!currentUser?.isAdmin) {
		return null;
	}
	React.useEffect(() => {
		let unSub = () => {};
		let unSubB = () => {};
		if (currentUser?.isAdmin) {
			unSub = retrieveAllYouth();
			unSubB = retrieveAllYouthTreatments();
		} else {
			navigate('/');
		}
		return () => {
			unSub();
			unSubB();
		};
	}, []);
	return (
		<Layout screen="statistics">
			<MainView />
		</Layout>
	);
}
