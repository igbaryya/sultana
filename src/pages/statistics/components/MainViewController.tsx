/* eslint-disable */
import { Grid } from '@mui/material';
// import Loading from 'components/Loading';
import { isEmpty } from 'lodash';
import React from 'react';
import { getInstance } from 'sdk';
import { useSelector } from 'react-redux';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import { youthsSelector, youthsTreatmentsSelector } from 'sdk/modules/youth/youthSelector';
import TotalYouths from './TotalYouths';
import WorriesTable from './WorryLevelTable';
import { ContactWithOthers } from './ContactWithOthersGraph';
import { DOBGraph } from './DOBGraph';
import SchoolStatistics from './SchoolStatistics';
import HotelStatistics from './HotelsGraph';
import { WorryLevelGraph } from './WorryLevelGraph';
import CumulativeTreatment from './CumulativeTreatment';
import CountTreatment from './CountTreatment';
import {Paper, Tooltip, CardContent, Typography, Container} from '@mui/material';
import { TreatmentRequestGraph } from './TreatmentRequestGraph';
import LinearProgress from '@mui/material/LinearProgress';
import AppColors from 'consts/colors';
import Text from 'components/common-components/Text';
import CityHandlerSelect from 'components/common-components/CityHandlerSelect';

import {
	ALL_HEB
} from 'consts';
import { t } from 'i18next';
import { AttendanceGraph } from './AttendanceGraph';
import { attendanceOptions } from 'components/common-components/AttendanceDropdown';

// export const CITY_VAR = 'אילת';
// const HOTEL_FILTER_VAR = 'לא נמצא באילת';

const { youthApi: { getTreatmentReportForLastWorkingWeek } } = getInstance();
export default function MainView() {
	const [boxClicked, setBoxClicked] = React.useState('');
	const [selectedCity, setSelectedCity] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const currentUser: any= useSelector(currentUserSelector);
	const userCityHandle = currentUser.handleCity;

	let youths = useSelector(youthsSelector);
	// if (youths) {
	// 	const isNotAll = userCityHandle && userCityHandle !== ALL_HEB;
	// 	let filteredYouths = Object.fromEntries(
	// 		Object.entries(youths)
	// 		.filter(([key, value]) => {
	// 			const isEligibleCity = userCityHandle?.trim() === EILAT_HEB ? value.city === EILAT_HEB : value.city !== EILAT_HEB;
	// 			return (value.city && ((isNotAll && isEligibleCity) || (userCityHandle && userCityHandle.trim() === ALL_HEB))) && value.id !== '999999999'
	// 		})
	// 	);
	// 	if(selectedCity !== ALL_HEB && selectedCity !== '') {
	// 		filteredYouths = Object.fromEntries(
	// 			Object.entries(youths)
	// 			.filter(([key, value]) => {
	// 				return (selectedCity === EILAT_HEB ? value.city === EILAT_HEB : (!!value.city && value.city !== EILAT_HEB) ) && value.id !== '999999999'
	// 			})
	// 		);
	// 	}
		
	// 	youths = filteredYouths;
	// }
	if (!youths) {
		youths = {};
	}
	
	const youthsTreatments = useSelector(youthsTreatmentsSelector);
	let treatmentListGraphData: any = {};
	
	if (isEmpty(youths)) {
		return (
			<Container maxWidth="lg" style={{marginTop: '5px'}}>
				<Paper style={{ padding: 20, textAlign:'center' }}>
					<Grid container xs={12}>
						<Grid item xs={12} >
							<Text textAlign="center" fontSize={40} color={AppColors.gray30}>אין מידע זמין כרגע</Text>
						</Grid>
					</Grid>
				</Paper>
			</Container>
		)
	}
	
	const youthsIds = Object.keys(youths);
	const allWorriesLevels: Record<string, number> = {};
	const allWorriesLevelsPercent: Record<string, string> = {};
	const dobData: Record<string, number> = {};
	const schoolsResult: Record<string, number> = {};
	const hotelsResult: Record<string, number> = {};
	const attendances: Record<string, number> = {};
	attendanceOptions.forEach((att) => {
		attendances[att] = 0
	})
	const totalContact = {
		Y: 0,
		N: 0
	};
	const totalTreatmentRequests = {
		Y: 0,
		N: 0
	};
	const totalYouthsGender = {
		female: 0,
		male: 0
	};

	youthsIds.forEach((id) => {
		if (youths && youths[id]) {
			const {
				lastWorry, dateOfBirth, dateOfbirth,
				school, hotel, continueTreatmentShapach, continueTreatmentHosen, gender, attendance
			} = youths[id];
			if (lastWorry) {
				if (!allWorriesLevels[`${lastWorry}`]) {
					allWorriesLevels[`${lastWorry}`] = 0;
				}
				allWorriesLevels[`${lastWorry}`] += 1;
			}
			totalYouthsGender[gender === 'M' ? 'male' : 'female'] += 1;
			const treatmentList = youthsTreatments && youthsTreatments[id] || {};
			treatmentListGraphData[id] = treatmentList;
			const hasMissingDiffContact = Object.values((treatmentList as any)).some((treatment: any) => !treatment.hasOwnProperty('diffContact'));

			if (hasMissingDiffContact) {
				totalContact.Y += 1;
			} else {
				totalContact.N += 1;
			}
			const hotelKey = hotel?.name || t('statistics.hotelNotDefined');
			if (!hotelsResult[hotelKey]) {
				hotelsResult[hotelKey] = 0;
			}
			hotelsResult[hotelKey] += 1;
			const schoolKey = school || t('statistics.schoolNotDefined');
			if (!schoolsResult[schoolKey]) {
				schoolsResult[schoolKey] = 0;
			}
			schoolsResult[schoolKey] += 1;
			if (attendance && typeof attendances[attendance] !== 'undefined') {
				attendances[attendance] += 1;
			}
			try {
				if (dateOfBirth || dateOfbirth) {
					const date = new Date(dateOfBirth || dateOfbirth || new Date());
					const year = date.getFullYear();
					if (!dobData[year]) {
						dobData[year] = 0;
					}
					dobData[year] += 1;
				}
			} catch (err) {
				// eslint-disable-next-line no-console
				console.warn(err);
			}
			if (continueTreatmentHosen || continueTreatmentShapach) {
				totalTreatmentRequests.Y += 1;
			} else {
				totalTreatmentRequests.N += 1;
			}
		}
		
	});
	let malePercentage = ((totalYouthsGender.male / (totalYouthsGender.male + totalYouthsGender.female)) * 100).toFixed(2);
	let femalePercentage = ((totalYouthsGender.female / (totalYouthsGender.male + totalYouthsGender.female)) * 100).toFixed(2);
	Object.keys(allWorriesLevels).forEach((worryKey) => {
		const percent = (allWorriesLevels[worryKey] / youthsIds.length) * 100;
		allWorriesLevelsPercent[worryKey] = Number(`${percent}`).toFixed(2);
	});
	const highlightBox = {
		border: '', // Set initial border to be transparent
		className:'gradient-box'
	  };
	return (
		<Container maxWidth="lg" style={{marginTop: '5px'}}>
			<Grid item xs={3} m={3} style={{display:'none'}}>
				{userCityHandle && userCityHandle.trim() === ALL_HEB ? (
					<CityHandlerSelect
						customLabel={t('statistics.filterByCity')}
						value={selectedCity || ALL_HEB}
						onChange={(newVal) => {
							setSelectedCity(newVal)
						}}
					/>
				) : null}
			</Grid>
			<Grid container spacing={2} >
			
			<Grid item xs={12} m={12}>
					<TotalYouths total={youthsIds.length} male={malePercentage} female={femalePercentage} />
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`day-activity-view-guide ${boxClicked === 'day-activity-view' ? highlightBox.className : ''}`}>
				<Tooltip title="הצגת פעילות היומית של המדריכים" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('day-activity-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					פעילות יומית
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`sum-activity-view-guide ${boxClicked === 'sum-activity-view' ? highlightBox.className : ''}`}>
				<Tooltip title="הצגה של סהכ פעילות בחודש האחרון" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('sum-activity-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					סהכ פעילות בחודש האחרון
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: isLoading ? '28px' : '30px'}} className={`last-week-report-guide ${boxClicked === 'last-week-report' ? highlightBox.className : ''}`}>
				<Tooltip title="דוח התערבות שבועי - על פי השבוע הקודם" arrow placement="top">
				<>
				{isLoading ? <LinearProgress /> : null }
				<CardContent 
					style={{cursor: 'pointer'}}
					onClick={async () => {
						setIsLoading(true);
						await getTreatmentReportForLastWorkingWeek(userCityHandle && userCityHandle.trim() === ALL_HEB && selectedCity !== ALL_HEB && selectedCity !== "" ? selectedCity : userCityHandle);
						setIsLoading(false);
						setBoxClicked('last-week-report');
					}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					דוח התערבות שבועי
					
					</Typography>
					
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={2}>
						
						
						
						</Grid>
					</Grid>
				</CardContent>
				</>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`worry-level-view-guide ${boxClicked === 'worry-level-view' ? highlightBox.className : ''}`}>
				<Tooltip title="הצגה של כמות רמות הדאגה" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('worry-level-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					רמת דאגה לנער\ה
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`ask-for-help-view-guide ${boxClicked === 'ask-for-help-view' ? highlightBox.className : ''}`}>
				<Tooltip title="גרף כמות הנוער אשר מבקש טיפול נפשי" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('ask-for-help-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					ביקש טיפול נפשי
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			
			
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`connection-view-guide ${boxClicked === 'connection-view' ? highlightBox.className : ''}`}>
				<Tooltip title="הצגה כללית של כמות הנערים שנוצר עימם קשר" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('connection-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					קשר עם הנער
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`birth-view-guide ${boxClicked === 'birth-view' ? highlightBox.className : ''}`}>
				<Tooltip title="הצגה של שנתוני לידה במערכת" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('birth-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					פילוח שנתוני לידה
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`school-view-guide ${boxClicked === 'school-view' ? highlightBox.className : ''}`}>
				<Tooltip title="תצוגה כללית של בתי הספר" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('school-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					פילוח בתי ספר
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`hotel-view-guide ${boxClicked === 'hotel-view' ? highlightBox.className : ''}`}>
				<Tooltip title="תצוגה כללית של המלונות" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('hotel-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					פילוח מלונות
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			<Grid item xs={12} md={4}>
				<Paper style={{padding: '30px'}} className={`attendance-view ${boxClicked === 'attendance-view' ? highlightBox.className : ''}`}>
				<Tooltip title="נוכחות" arrow placement="top">
				<CardContent style={{cursor: 'pointer'}} onClick={() => {setBoxClicked('attendance-view');}}>
					<Typography
					sx={{fontSize: 14}}
					color="text.secondary"
					gutterBottom
					>
					נוכחות
					</Typography>
					<Grid container xs={12} md={12}  alignItems="center" style={{marginLeft: '-25px'}}>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography variant="h6" component="div">
						
						</Typography>
						</Grid>
					</Grid>
				</CardContent>
				</Tooltip>
				{/* Content for another section */}
				</Paper>
			</Grid>
			{boxClicked === 'worry-level-view' && (
				<Grid item xs={12} md={12}>
					<WorryLevelGraph worryLevels={allWorriesLevelsPercent} />
					<WorriesTable worriesData={allWorriesLevels} />
				</Grid>
			)}
			{boxClicked === 'connection-view' && (
				<Grid item xs={12} md={12}>
					<ContactWithOthers totalContact={totalContact} />
				</Grid>
			)}
			{boxClicked === 'birth-view' && (
				<Grid item xs={12} md={12}>
					<DOBGraph dobData={dobData} />
				</Grid>
			)}
			{boxClicked === 'ask-for-help-view' && (
				<Grid item xs={12} md={12}>
					<TreatmentRequestGraph totalTreatmentRequests={totalTreatmentRequests} />
				</Grid>
			)}
			{boxClicked === 'sum-activity-view' && (
				<Grid item xs={12} md={12}>
					
					<CountTreatment treatmentList={treatmentListGraphData} />
				</Grid>
			)}
			{boxClicked === 'day-activity-view' && (
				<Grid item xs={12} md={12}>
					<CumulativeTreatment treatmentList={treatmentListGraphData} />
				</Grid>
			)}
			{boxClicked === 'school-view' && (
				<Grid item xs={12} md={12}>
					<SchoolStatistics schoolsResult={schoolsResult} />
				</Grid>
			)}
			{boxClicked === 'hotel-view' && (
				<Grid item xs={12} md={12}>
					<HotelStatistics hotelsResult={hotelsResult} />
				</Grid>
			)}
			{boxClicked === 'attendance-view' && (
				<Grid item xs={12} md={12}>
					<AttendanceGraph attendance={attendances} />
				</Grid>
			)}
		</Grid>
		
		
		</Container>
	);
}
