import React from 'react';
import { useSelector } from 'react-redux';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';

type Props = {
	children: any;
};
export default function RBA({ children }: Props) {
	const currentUser = useSelector(currentUserSelector);
	if (!currentUser?.isAdmin) {
		return <></>;
	}
	return children;
}
