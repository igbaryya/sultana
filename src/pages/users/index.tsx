import Layout from 'components/common-components/Layout';
import React, { useEffect } from 'react';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getInstance } from 'sdk';
import { isEmpty } from 'lodash';
import AllUsersTable from './components/AllUsersTable';
import { usersSelector } from 'sdk/modules/users/usersSelector';
import Loading from 'components/Loading';

const { usersApi: { registerUsers } } = getInstance();
export default function Users() {
	const currentUser = useSelector(currentUserSelector);
	const navigate = useNavigate();
	if (!currentUser?.isAdmin) {
		navigate('/');
		return null;
	}
	useEffect(registerUsers, []);
	const users = useSelector(usersSelector);
	return (
		<Layout screen="users">
			{
				isEmpty(users) ? (
					<Loading />
				) : <AllUsersTable users={users} />
			}
		</Layout>
	);
}
