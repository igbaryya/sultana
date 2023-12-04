import Modal from 'components/Modal';
import { EMPTY_STRING } from 'consts';
import { t } from 'i18next';
import { AddNewUserForm } from 'interfaces/AddNewUser';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getInstance } from 'sdk';
import { AddUserForm } from './AddUserForm';

interface Props{
	isModalOpened: boolean;
	setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
	fromPersonalDetails?: boolean;
	addedNewReferrer?: (name: string) => void;

}

export const AddUserComponent = (props: Props) => {
	const defaultSearch: AddNewUserForm = {
		name: EMPTY_STRING,
		phoneNumber: EMPTY_STRING,
		roll: EMPTY_STRING,
		email: EMPTY_STRING
	};
	const { youthApi: { addUser } } = getInstance();
	const [isValid, setIsValid] = useState<boolean>(false);
	const [searchForm, setSearchForm] = useState<AddNewUserForm>(defaultSearch);
	const [isfromPersonalDetails] = useState<boolean>(props.fromPersonalDetails || false);

	const { isModalOpened, setOpenModal } = props;
	const handleSubmit = () => {
		addUser(searchForm);
		setOpenModal(false);
		if (isfromPersonalDetails && props.addedNewReferrer) {
			props.addedNewReferrer(searchForm.name);
		}
		toast(t('dashboard.userAddedSuccess'), { type: 'success', position: toast.POSITION.TOP_LEFT });
	};
	return (
		<Modal
			title={t('dashboard.addNewUser')}
			isOpened={isModalOpened}
			closeModal={() => setOpenModal(false)}
			isNewUser
			primaryButton={{
				validateFields: isValid,
				text: t('dashboard.addNewUser'),
				onClick: () => handleSubmit(),
			}}
		>
			<AddUserForm searchForm={searchForm} setSearchForm={setSearchForm} setIsValid={setIsValid} />
		</Modal>
	);
};
