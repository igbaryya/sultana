/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { t } from 'i18next';
import Text from 'components/common-components/Text';
import {
	FormControl,
	Grid, IconButton, InputLabel, MenuItem, Select, TableHead, TextField, Typography
} from '@mui/material';
import { User } from 'interfaces/User';
import EditIcon from '@mui/icons-material/Edit';
import Modal from 'components/Modal';
import { ALL_HEB, EMPTY_STRING } from 'consts';
import { getInstance } from 'sdk';
import SchoolsDropDown from 'components/common-components/SchoolDropdown';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import { useSelector } from 'react-redux';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

type Props = {
	users: Record<string, User>;
};
const { usersApi: { updateUserInFB } } = getInstance();
export default function AllUsersTable({ users }: Props) {
	const asKeys = Object.keys(users);
	const [selectedUserID, setSelectedUserId] = React.useState(EMPTY_STRING);
	const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
	const [isLoading, setLoading] = React.useState(false);
	const currentUser: any = useSelector(currentUserSelector);
	const userTypes: any = {
		admin: t('dashboard.Admin'),
		guide: t('users.guide'),
		teacher: t('users.teacher'),
		schoolCounselor: t('dashboard.SchoolCounselor'),
		wellfare: t('dashboard.Wellfare')
	};
	const getType = (isAdmin: boolean, isGuide: boolean, isTeacher: boolean, isCounselor?: boolean, isWellfare?: boolean) => {
		if (isAdmin) {
			return t('users.admin');
		}

		if (isCounselor) {
			return t('dashboard.SchoolCounselor');
		}
		if (isWellfare) {
			return t('dashboard.Wellfare');
		}
		if (isGuide) {
			return t('users.guide');
		}
		
		if (isTeacher) {
			return t('users.teacher');
		}
		return t('users.unknown');
	};
	const handleChangeType = (userId: string) => {
		setSelectedUserId(userId);
		setSelectedUser(users[userId]);
	};
	let total = 0;
	return (
		<Grid xs={12}>
			<Modal
				title={t('users.changeUser')}
				closeModal={() => setSelectedUserId(EMPTY_STRING)}
				isOpened={!!selectedUserID}
				primaryButton={{
					onClick: () => {
						setLoading(true);
						if (selectedUser) {
							updateUserInFB(selectedUserID, selectedUser).then(() => {
								setLoading(false);
								setSelectedUserId(EMPTY_STRING);
							});
						}
					},
					text: t('users.save'),
					loading: isLoading,
					validateFields: true
				}}
			>
				<Grid container>
					<Grid item xs={12} p={1}>
						<TextField
							fullWidth
							value={selectedUser?.name}
							size="small"
							placeholder={selectedUser?.name || t('users.name')}
							label={t('users.name')}
							onChange={({ target: { value } }) => {
								if (selectedUser) {
									setSelectedUser({
										...selectedUser,
										name: value
									});
								}
							}}
						/>
					</Grid>
					<Grid item xs={12} p={1}>
						<TextField
							fullWidth
							value={selectedUser?.phoneNumber}
							size="small"
							placeholder={selectedUser?.phoneNumber || t('users.phoneNumber')}
							label={t('users.phoneNumber')}
							type="tel"
							onChange={({ target: { value } }) => {
								if (selectedUser) {
									setSelectedUser({
										...selectedUser,
										phoneNumber: value
									});
								}
							}}
						/>
					</Grid>
					<Grid item xs={12} p={1}>
						<TextField
							fullWidth
							value={selectedUser?.email}
							size="small"
							placeholder={selectedUser?.email || t('users.email')}
							label={t('users.email')}
							type="email"
							onChange={({ target: { value } }) => {
								if (selectedUser) {
									setSelectedUser({
										...selectedUser,
										email: value
									});
								}
							}}
						/>
					</Grid>
					<Grid item xs={12} p={1}>
						<FormControl fullWidth>
							<InputLabel>{t('users.selectType')}</InputLabel>
							<Select
								fullWidth
								size="small"
								disabled={currentUser?.isAdmin && currentUser?.email === selectedUser?.email}
								label={t('users.selectType')}
								value={(() => {
									if (!selectedUser) {
										return EMPTY_STRING;
									}
									const {
										isAdmin,
										isGuide,
										isCounselor,
										isWellfare
									} = selectedUser;
									
									if (isAdmin) {
										return 'admin';
									}
									if (isCounselor) {
										return 'schoolCounselor';
									}
									if (isWellfare) {
										return 'wellfare';
									}
									return isGuide ? 'guide' : 'teacher';
								})()}
								onChange={({ target: { value } }) => {
									if (!selectedUser) {
										return;
									}
									selectedUser.isAdmin = false;
									selectedUser.isGuide = false;
									selectedUser.isTeacher = false;
									selectedUser.isCounselor = false;
									selectedUser.isWellfare = false;
									if (value === 'admin') {
										selectedUser.isAdmin = true;
									} else if (value === 'schoolCounselor') {
										selectedUser.isCounselor = true;
										selectedUser.isGuide = true;
									} else if (value === 'wellfare') {
										selectedUser.isWellfare = true;
										selectedUser.isGuide = true;
									} else if (value === 'guide') {
										selectedUser.isGuide = true;
									} else {
										selectedUser.isTeacher = true;
									}
									setSelectedUser({ ...selectedUser });
								}}
							>
								{
									Object.keys(userTypes).map((type) => {
										const typeStr: string = userTypes[type];
										return (
											<MenuItem value={type} key={type}>
												{typeStr}
											</MenuItem>
										);
									})
								}
							</Select>
						</FormControl>
						<Grid item xs={12} mt={1}>
							<SchoolsDropDown
								additionalInput={{
									name: ALL_HEB
								}}
								value={selectedUser?.school?.name || ALL_HEB}
								onChange={(school) => {
									if (!selectedUser) {
										return;
									}
									setSelectedUser({ ...selectedUser, school: { name: school } });
								}}
							/>
						</Grid>
					</Grid>
					{
						selectedUser?.userLastUpdateBy && selectedUser?.userLastUpdateDate && (
							<Grid item xs={12} mx={2} p={0}>
								<Grid item xs={12}>
									<Typography variant="caption">
										{t('users.userLastUpdate')} {new Date(selectedUser.userLastUpdateDate as any).toLocaleString()}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="caption">
										{t('users.userLastUpdatedBy')} <b>{users[selectedUser.userLastUpdateBy]?.name}</b>
									</Typography>
								</Grid>
							</Grid>
						)
					}
				</Grid>
			</Modal>
			<Paper sx={{ padding: 2 }}>
				<Text bold translation="users.systemUsers" textAlign="center" pb={10} />
				<TableContainer component={Paper}>
					<Table aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell align="right">{t('users.name')}</StyledTableCell>
								<StyledTableCell align="center">{t('users.phoneNumber')}</StyledTableCell>
								<StyledTableCell align="center">{t('users.email')}</StyledTableCell>
								<StyledTableCell align="center">{t('users.lastLogin')}</StyledTableCell>
								<StyledTableCell align="center">{t('users.type')}</StyledTableCell>
								<StyledTableCell align="center" />
							</TableRow>
						</TableHead>
						<TableBody>
							{asKeys.sort((a, b) => {
								const aDate = new Date(users[a].currentAuthDate as any || '12-12-1970').getTime();
								const bDate = new Date(users[b].currentAuthDate as any || '12-12-1970').getTime();
								if (aDate > bDate) {
									return -1;
								}
								if (bDate < aDate) {
									return 1;
								}
								return 0;
							}).map((row) => {
								const {
									name,
									email,
									phoneNumber,
									currentAuthDate,
									isAdmin,
									isGuide,
									isTeacher,
									isHidden,
									isCounselor,
									isWellfare
								} = users[row];
								const isCurrentUser = window.localStorage.getItem('fbUID') === row;
								if (isHidden && !isCurrentUser) {
									return null;
								}
								total += 1;
								return (
									<StyledTableRow
										key={row}
										style={{
											background: isCurrentUser ? '#bee5eb' : ''
										}}
								
									>
										<StyledTableCell component="th" scope="row" align="right">
											{`${name}`}
										</StyledTableCell>
										<StyledTableCell align="center">
											<a style={{ color: '#000', textDecoration: 'none' }} href={`tel://${phoneNumber}`}>
												{phoneNumber}
											</a>
										</StyledTableCell>
										<StyledTableCell align="center">
											<a style={{ color: '#000', textDecoration: 'none' }} href={`mailto://${email}`}>
												{email}
											</a>
										</StyledTableCell>
										<StyledTableCell align="center" sx={{ textAlign: 'center', direction: 'ltr' }}>
											{currentAuthDate ? new Date(currentAuthDate).toLocaleString() : '--'}
										</StyledTableCell>
										<StyledTableCell align="center">{getType(!!isAdmin, !!isGuide, !!isTeacher, !!isCounselor, !!isWellfare)}</StyledTableCell>
										<StyledTableCell align="center">
											<IconButton color="info" onClick={() => handleChangeType(row)}>
												<EditIcon fontSize="small" />
											</IconButton>
										</StyledTableCell>
									</StyledTableRow>
								);
							})}
						</TableBody>
					</Table>
				
				</TableContainer>
				<Grid container pt={2}>
					<Grid xs={6}>
						<Text translation="statistics.total" bold fontSize={15} />
					</Grid>
					<Grid item xs={6} pl={2}>
						<Text bold textAlign="left">
							{total}
						</Text>
					</Grid>
				</Grid>
			</Paper>
		</Grid>

	);
}
