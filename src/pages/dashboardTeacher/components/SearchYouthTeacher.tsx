/* eslint-disable */
import React, { useState } from 'react';
import {
	Box,
	Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, TextField,
} from '@mui/material';
import Text from 'components/common-components/Text';
import SchoolsDropDown from 'components/common-components/SchoolDropdown';
import { t } from 'i18next';
import { getInstance } from 'sdk';
import Lottie, { APP_LOTTIES } from 'components/common-components/Lottie';
import { isEmpty } from 'lodash';
import LoaderButton from 'utils/loaderButton';
import { toast } from 'react-toastify';

interface YouthSearch {
	date: string ;
	class: string;
	school: string;
	classNumber: string;
}

const {
	youthApi: {
		updatePresence,
		searchYouth,
		getPresence
	}
} = getInstance();
export const SearchYouthTeacher = () => {
	const defaultFieldsSearch = {
	  date: new Date().toISOString().split('T')[0],
	  class: '',
	  school: '',
	  classNumber: ''
	};
	const [youthSearch, setYouthSearch] = useState<YouthSearch>(defaultFieldsSearch);
	const [searchResult, setSearchResult] = useState<any>();
	const [dataClassesInSchool, setDataClassesInSchool] = useState<any>();
	const [presenceData, setPresenceData] = useState<any>();
	const [mergeData, setMergeData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
  
	const handleSearch = async () => {
	  setLoading(true);
	  const fetchData = async () => {
		try {
		  const response = await searchYouth('');
		  const responseFilter: Record<string, any> = Object.keys(response).reduce(
			(filtered, key) => {
			  const item = response[key];
  
			  if (item.class === youthSearch.class && item.school === youthSearch.school) {
				return { ...filtered, [key]: item };
			  }
			  return filtered;
			},
			{}
		  );
		  setSearchResult(responseFilter);
		} catch (error) {
		  console.error('Error fetching data:', error);
		}
	  };
	  fetchData();
	  const presenceResponse = await getPresence(
		youthSearch.school,
		youthSearch.class,
		youthSearch.classNumber,
		youthSearch.date.replace(/\//g, '-')
	  );
	  setPresenceData(presenceResponse);
	};
  
	const fetchAllData = async () => {
	  try {
		const response = await searchYouth('');
		const result: any = {};
		Object.values(response).forEach((student: any) => {
		  const schoolName = student?.school;
		  if (schoolName) {
			if (!result[schoolName]) {
			  result[schoolName] = {
				school: schoolName,
				classes: [],
				classNumbers: {}
			  };
			}
			const className = student?.class;
			const classNumber = student?.classNumber;
			if (className && !result[schoolName].classes.includes(className)) {
			  result[schoolName].classes.push(className);
			  if (!result[schoolName].classNumbers[className]) {
				  result[schoolName].classNumbers[className] = [];
			  }
			}
			if(classNumber) {
				
				if (!result[schoolName].classNumbers[className].includes(classNumber.toString())) {
					result[schoolName].classNumbers[className].push(classNumber.toString());
				}
			}
		  }
		});
		Object.values(result).forEach((school: any) => {
		  school.classes.sort((a: any, b: any) => parseInt(a) - parseInt(b));
		});
  
		const finalResult = Object.values(result).sort((a: any, b: any) =>
		  a.school.localeCompare(b.school)
		);
		setDataClassesInSchool(finalResult);
	  } catch (error) {
		console.error('Error fetching data:', error);
	  }
	};
  
	React.useEffect(() => {
	  fetchAllData();
	}, []);
  
	React.useEffect(() => {
	  const mergeResponses = () => {
		const mergedResponse: any = {};
		Object.keys(presenceData || {}).forEach((key) => {
		  if (searchResult && searchResult[key]) {
			mergedResponse[key] = {
			  ...presenceData[key],
			  firstName: searchResult[key].firstName,
			  lastName: searchResult[key].lastName,
			};
		  } else {
			mergedResponse[key] = {
			  arrived: presenceData[key].arrived,
			  firstName: '',
			  lastName: '',
			};
		  }
		});
		Object.keys(searchResult || {}).forEach((key) => {
		  if (!mergedResponse[key]) {
			mergedResponse[key] = {
			  arrived: searchResult[key].arrived || false,
			  firstName: searchResult[key].firstName,
			  lastName: searchResult[key].lastName,
			};
		  }
		});
		setMergeData(mergedResponse);
	  };
	  setLoading(false);
	  if (presenceData && searchResult) {
		mergeResponses();
	  }
	}, [presenceData, searchResult]);
  
	const handleClearAll = () => {
	  setYouthSearch(defaultFieldsSearch);
	  setMergeData(null)
	};
  
	const handleSave = () => {
  if (!mergeData) {
    // Handle the case where mergeData is undefined or null
    return;
  }

  const cleanObject: any = Object.fromEntries(
    Object.entries(mergeData).map(([key, value]: any) => [
      key,
      { arrived: value?.arrived || false }, 
    ])
  );

  toast(t('dashboardTeacher.savePresence'), { type: 'success' ,position: toast.POSITION.TOP_LEFT });

  if (youthSearch && youthSearch.school && youthSearch.class && youthSearch.classNumber && youthSearch.date) {
    updatePresence(youthSearch.school, youthSearch.class, youthSearch.classNumber, youthSearch.date, cleanObject);
  } else {
    console.error('Incomplete youthSearch data');
  }
};
  dataClassesInSchool
    ?.find((school: any) => school.school === youthSearch.school)
    ?.classes?.find((classItem: any) => classItem === youthSearch.class)
    ?.classNumbers?.[youthSearch.class]?.map((classNumber: any) => {
	});
	return (
	  <Grid container sx={{ padding: { xs: 2, md: 5 } }}>
		<Grid xs={12}>
		  <Paper>
			<Grid container>
			  <Grid item xs={12} padding={3}>
				<Text translation={t('dashboardTeacher.searchForClass')} pb={5} />
				<Grid container spacing={2}>
				  <Grid item xs={12}>
					<TextField
					  fullWidth
					  label={t('dashboardTeacher.date')}
					  value={youthSearch.date}
					  margin="normal"
					  size="small"
					  type="date"
					  onChange={({ target: { value } }) => {
						setYouthSearch({ ...youthSearch, date: value });
					  }}
					  InputLabelProps={{
						shrink: true,
					  }}
					/>
				  </Grid>
				  <Grid item xs={12}>
					<SchoolsDropDown
					  value={youthSearch.school}
					  onChange={(value) => {
						setYouthSearch({ ...youthSearch, school: value });
					  }}
					/>
				  </Grid>
				  <Grid item xs={12}>
					<FormControl fullWidth>
					  <InputLabel
						id="classLabel"
						shrink
						style={{
						  left: '10px',
						  top: '5px',
						  position: 'absolute',
						}}
					  >
						{t('dashboardTeacher.class')}
					  </InputLabel>
					  <Select
						labelId="classLabel"
						size="small"
						id="class-select"
						placeholder={t('dashboardTeacher.class')}
						value={youthSearch.class}
						label={t('youthDetails.Class')}
						onChange={({ target: { value } }) => {
						  setYouthSearch({ ...youthSearch, class: value });
						}}
					  >
						{dataClassesInSchool
						  ?.find((school: any) => school.school === youthSearch.school)
						  ?.classes?.map((classItem: any) => (
							<MenuItem value={classItem} key={classItem}>
							  {t(`youthDetails.${classItem}`)}
							</MenuItem>
						  ))}
					  </Select>
					</FormControl>
					<FormControl fullWidth style={{marginTop: '5px'}}>
					  <InputLabel
						id="classNumberLabel"
						shrink
						style={{
						  left: '10px',
						  top: '5px',
						  position: 'absolute',
						}}
					  >
						{t('youthDetails.ClassNumber')}
					  </InputLabel>
					  <Select
						labelId="classLabel"
						size="small"
						id="class-select"
						placeholder={t('youthDetails.ClassNumber')}
						value={youthSearch.classNumber}
						label={t('youthDetails.ClassNumber')}
						onChange={({ target: { value } }) => {
						  setYouthSearch({ ...youthSearch, classNumber: value });
						}}
					  >
						{dataClassesInSchool
							?.find((school: any) => school.school === youthSearch.school)
							?.classNumbers?.[youthSearch.class]?.sort().map((classNumber: any) => (
							<MenuItem value={classNumber} key={classNumber}>
								{classNumber}
							</MenuItem>
						))}
					  </Select>
					</FormControl>
				  </Grid>
				  <Grid item xs={12} p={1}>
					<Button
					  variant="contained"
					  disabled={loading}
					  onClick={() => handleSearch()}
					>
					  {loading ? <LoaderButton /> : t('dashboardTeacher.search')}
					</Button>
					<Button onClick={() => handleClearAll()}>
					  {t('dashboardTeacher.clear')}
					</Button>
				  </Grid>
				</Grid>
			  </Grid>
			</Grid>
		  </Paper>
		</Grid>
		{mergeData !== null && isEmpty(mergeData) ? (
		  <Grid xs={12} item mt={4}>
			<Box
			  sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				height: '100vh',
				width: '100%',
			  }}
			>
			  <Grid container justifyContent="flex-start">
				<Grid item xs={12}>
				  <Text bold>{`${t('dashboardTeacher.noResultHeader')}`}</Text>
				</Grid>
			  </Grid>
			  <Lottie loop size={80} src={APP_LOTTIES.NOT_FOUND} />
			</Box>
		  </Grid>
		) : (
		  !isEmpty(mergeData) && (
			<>
			  <Grid item xs={12}>
				{Object.keys(mergeData)
				  ?.sort((a, b) => mergeData[a]?.lastName.localeCompare(mergeData[b]?.lastName))
				  ?.map((key) => {
					const youth = mergeData[key];
					return (
					  <Grid item xs={12} key={key}>
						<FormControlLabel
						  style={{ margin: 0 }}
						  control={
							<Checkbox
							  value={key}
							  checked={youth.arrived}
							  onChange={() => {
								setMergeData({
								  ...mergeData,
								  [key]: {
									...mergeData[key],
									arrived: !mergeData[key]?.arrived,
								  },
								});
							  }}
							/>
						  }
						  label={`${youth?.lastName} ${youth.firstName}`}
						/>
					  </Grid>
					);
				  })}
			  </Grid>
			  <Grid xs={12} padding={2} alignSelf="center">
				<Button
				  type="button"
				  fullWidth
				  variant="contained"
				  style={{
					marginTop: '5px',
					backgroundColor: 'black',
					color: 'white',
				  }}
				  onClick={handleSave}
				>
				  {t('dashboard.save')}
				</Button>
			  </Grid>
			</>
		  )
		)}
	  </Grid>
	);
  };