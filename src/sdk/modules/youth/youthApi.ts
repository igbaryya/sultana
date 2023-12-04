/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable indent */
/* eslint-disable max-lines */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable */
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import BaseApi from 'sdk/reduxBase/baseApi';
import { ActionTypes, sliceName } from './youthConfig';
import FirebaseRefrenceApi from '../firebase/firebaseApi';
import { utils as XLSXUtils, writeFile } from 'xlsx';

import {
	APP_SETTINGS_TABLE, TREATMENT_TABLE, YOUTHS_TABLE, PRESENCE_TABLE, AUTHENTICATED_OSS_TABLE
} from 'consts/firebase';
import {
	ALL_HEB,
	ClassArrNames,
	ClassArrNamesMaps,
	EILAT_HEB,
	GenderMapArr,
	SDEROT_HEB
	// hotelToFilterOut
} from 'consts';
import { Gender, HotelCSV, Youth, YouthCSV, YouthDetails } from 'interfaces/YouthObject';
import * as selectors from './youthSelector';
import { Treatment } from 'interfaces/Treatments';
import { Presence } from 'interfaces/Presence';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { AddNewUserForm } from 'interfaces/AddNewUser';
import LoginApi from '../login/loginApi';
import { Hotel } from '../globalConfig/globalConfigInterface';


export default class YouthApi extends BaseApi {
	firebaseApi: FirebaseRefrenceApi;
	loginApi: LoginApi;
	constructor(store: ToolkitStore) {
		super(store, ActionTypes, sliceName);
		this.firebaseApi = FirebaseRefrenceApi.instance;
		this.loginApi = new LoginApi(store)
	}
	searchYouthByPersonalId = async (id: string) => {
		const result = await this.firebaseApi.searchOnceExact(YOUTHS_TABLE, 'id', id);
		return result || null;
	};

	searchYouth = async (freeText: string) => {
		const promises = [
			this.firebaseApi.searchOnce(YOUTHS_TABLE, 'phoneNumber', freeText),
			this.firebaseApi.searchOnce(YOUTHS_TABLE, 'firstName', freeText),
			this.firebaseApi.searchOnce(YOUTHS_TABLE, 'lastName', freeText),
			this.firebaseApi.searchOnce(YOUTHS_TABLE, 'id', freeText),
		];
		const results = await Promise.all(promises);
		let toReturn: Record<string, YouthDetails> | null = {};
		results.forEach((result) => {
			if (result) {
				if (!toReturn) {
					toReturn = {};
				}
				toReturn = {
					...toReturn,
					...result
				};
			}
		});
		return toReturn;
	};
	getUserTreatments = async (): Promise<any> => {
		const treatmentData: any = await this.firebaseApi.asyncRead(`${TREATMENT_TABLE}`);
		return treatmentData;
	};
	getUsers = async () => {
		const promises = [
			this.firebaseApi.asyncRead(`${AUTHENTICATED_OSS_TABLE}`),
		];
		const results = await Promise.all(promises);
		let toReturn: any | null = {};
		results.forEach((result) => {
			if (result) {
				if (!toReturn) {
					toReturn = {};
				}
				toReturn = {
					...toReturn,
					...result
				};
			}
		});
		const allUsers = { ...toReturn };
		Object.keys(toReturn).forEach((uid) => {
			if (toReturn[uid]?.isHidden) {
				delete allUsers[uid]
			}
		})
		return allUsers
	};
	getPresence = async (school: string, classLabel: string, classNumber: string, date: string) => {
		// const school = "0";
		// const class = "1";
		// const date = "11-12-2023";
		const promises = [
			this.firebaseApi.asyncRead(`${PRESENCE_TABLE}/${school}/${classLabel}/${classNumber}/${date}`),
		];
		const results = await Promise.all(promises);
		let toReturn: Record<string, YouthDetails> | null = {};
		results.forEach((result) => {
			if (result) {
				if (!toReturn) {
					toReturn = {};
				}
				toReturn = {
					...toReturn,
					...result
				};
			}
		});
		// console.log(toReturn);
		return toReturn;
	};
	// eslint-disable-next-line
	getArrivalStatusForUID = async (school: string | undefined, classLabel: string | undefined, classNumber: string | number | undefined, uid: string): Promise<{ date: string, arrived: boolean }[]> => {
		const presenceData: any = await this.firebaseApi.asyncRead(`${PRESENCE_TABLE}/${school}/${classLabel}/${classNumber}`);
		const arrivalStatus: { date: string, arrived: boolean }[] = [];
		if (!presenceData) {
			return [];
		}
		for (const [date, students] of Object.entries(presenceData)) {
			for (const [studentUID, data] of Object.entries(students as any)) {
				if (studentUID === uid) {
					arrivalStatus.push({ date, arrived: (data as any)?.arrived });
					break; // Assuming a student UID is unique for a date, stop checking once found
				}
			}
		}
		// console.log(arrivalStatus);
		return arrivalStatus;
	};

	getTreatmentDataForUID = async (uid: string): Promise<{ date: string; rate: number }[]> => {
		const treatmentData: any = await this.firebaseApi.asyncRead(`${TREATMENT_TABLE}/${uid}`);
		const meetingData: { date: string; rate: number }[] = [];
		if (treatmentData) {
			// eslint-disable-next-line
			Object.entries(treatmentData).forEach(([meetingUID, meeting]: any) => {
				// console.log((meeting as any).worry);
				/* eslint-disable-next-line */
				meetingData.push({ date: (meeting as any).date, rate: parseInt((meeting as any).worry) });
			});
		}
		// console.log(meetingData);
		return meetingData;
	};
	getTreatmentReportForLastWorkingWeek = async (selectedCity: any) => {
		const handleExportToExcel = async (filteredResults: any) => {
			const formattedRows: any = [];

			// Iterate over the filtered results and format the data
			Object.keys(filteredResults).forEach((youthId) => {
				const youthData = filteredResults[youthId];

				// Add youth details to the formatted rows
				formattedRows.push({
					"שם": youthData.youthDetails.firstName,
					"בית ספר": youthData.youthDetails.school,
					"כיתה": `${ClassArrNamesMaps[youthData.youthDetails.class]} ${youthData.youthDetails.classNumber}` || '',
					"מדריך אחראי": youthData.youthDetails.responsibleInstructor || 'לא מוגדר',
					"הערות": youthData.youthDetails.summary || 'אין הערות',
				});
				formattedRows.push({
					"הערות": "סיכום פגישות"
				});
				// Add treatments to the formatted rows
				youthData.treatments.forEach((treatment: any) => {
					formattedRows.push({
						"תאריך": new Date(treatment.date).toLocaleDateString(),
						"סוג פגישה": treatment.rowType,
						"סיכום פגישה": treatment.summary,
						"רמת דאגה": treatment.worry,
						"מדריך": treatment.contactPerson,
					});
				});

				// Add an empty row for spacing between youths
				formattedRows.push({});
			});

			const sheet = XLSXUtils.json_to_sheet(formattedRows);
			const wb = XLSXUtils.book_new();
			XLSXUtils.book_append_sheet(wb, sheet, 'YouthData');
			writeFile(wb, 'youth_data.xlsx');
			return;
		};
		const allResults = await this.firebaseApi.asyncRead(YOUTHS_TABLE);
		const allResultsTreatment = await this.firebaseApi.asyncRead(TREATMENT_TABLE);

		const filteredResults: any = {};

		Object.keys(allResults).forEach((youthId) => {
			let keepYouth = true;
			const youth = allResults[youthId];
			if (youth.city !== selectedCity && selectedCity !== ALL_HEB) {
				keepYouth = false;
			}
			const userTreatmentDates = Object.values(allResultsTreatment[youthId] || {})
				.map((treatment: any) => {
					const treatmentDate = new Date(treatment.date);
					// Get the current date
					const currentDate = new Date();

					// Calculate the start of the current week (assuming Sunday is the first day of the week)
					const startOfCurrentWeek = new Date(currentDate);
					startOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay());

					// Calculate the start and end of the last week before the current week
					const startOfLastWeek = new Date(startOfCurrentWeek);
					startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);

					const endOfLastWeek = new Date(startOfLastWeek);
					endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
					const formDate = startOfLastWeek;
					const endDate = endOfLastWeek;
					formDate.setHours(0, 0, 0, 0);
					endDate.setHours(0, 0, 0, 0);

					treatmentDate.setHours(0, 0, 0, 0);
					return (
						treatmentDate.toString() !== 'Invalid Date' &&
						treatmentDate >= formDate &&
						treatmentDate <= endDate
					) ? treatment : null;

				})
				.filter((date: Date | null) => date !== null);

			if (userTreatmentDates.length === 0) {
				keepYouth = false;
			}

			if (keepYouth) {
				if (!filteredResults[youthId]) {
					filteredResults[youthId] = {};
				}
				filteredResults[youthId].youthDetails = youth;
				filteredResults[youthId].treatments = userTreatmentDates;
			}
		});

		console.log(filteredResults);
		await handleExportToExcel(filteredResults);

	}
	searchYouthAdvanced = async (form: any) => {
		console.log(form);

		const allResults = await this.firebaseApi.asyncRead(YOUTHS_TABLE);
		const allResultsTreatment = await this.firebaseApi.asyncRead(TREATMENT_TABLE);

		const filteredResults: any = {};
		const hasCity = typeof form.city === 'string' ? !!form.city : Object.values(form.city || {}).some((selected) => !!selected)

		Object.keys(allResults).forEach((youthId) => {
			const youth = allResults[youthId];
			let keepYouth = true
			Object.keys(form).forEach((field) => {
				if (field !== 'class' && field !== 'school' && field !== 'city' && field !== 'responsibleInstructor' && field !== 'lastWorryEnd' && field !== 'lastWorryStart' && field !== 'dateEnd' && field !== 'date' && field !== 'age' && field !== 'referrer' && field !== 'returnedToStudy' && !((field === 'hotel' || field === 'gender') && form[field] === 'ALL')) {
					const srcYouth = form[field];
					const trgYouth = youth[field];
					if (typeof trgYouth === 'object' && 'name' in trgYouth) {
						if (trgYouth.name !== srcYouth) {
							keepYouth = false;
						}
					} else if (!!srcYouth && !(`${trgYouth}`.toLowerCase().includes(srcYouth?.toLowerCase()))) {
						keepYouth = false;
					}
				}
			});
			if (keepYouth && form.age !== 'ALL') {

				const ageCalculator = (g: any) => {
					const birthDate = new Date(g);
					const currentDate = new Date();
					let age = currentDate.getFullYear() - birthDate.getFullYear();
					if (
						currentDate.getMonth() < birthDate.getMonth()
						|| (currentDate.getMonth() === birthDate.getMonth()
							&& currentDate.getDate() < birthDate.getDate())
					) {
						age--;
					}
					return Number.isNaN(age) ? 'NA' : age.toString();
				};


				if (form.age !== ageCalculator(youth.dateOfbirth)) {
					keepYouth = false;
				}
			}

			if (form.lastWorryStart && form.lastWorryEnd && keepYouth) {


				const youthLastWorryStr = youth.lastWorry;
				if (
					youthLastWorryStr &&
					(!(youthLastWorryStr <= form.lastWorryEnd && youthLastWorryStr >= form.lastWorryStart))
				) {
					keepYouth = false;
				}
				if (
					youthLastWorryStr && form.lastWorryEnd === form.lastWorryStart &&
					(youthLastWorryStr !== form.lastWorryEnd)
				) {
					keepYouth = false;
				}
			}

			if (keepYouth && form.date && !form.dateEnd) {
				// console.log(allResultsTreatment[youthId]);
				const userTreatmentDates = Object.values(allResultsTreatment[youthId] || {})
					.map((treatment: any) => {
						const treatmentDate = new Date(treatment.date);
						treatmentDate.setHours(0, 0, 0, 0);
						const formDate = new Date(form.date);
						formDate.setHours(0, 0, 0, 0);
						return (
							treatmentDate.toString() !== 'Invalid Date' &&
							treatmentDate >= formDate
						) ? treatmentDate.toISOString().split('T')[0] : null;
					})
					.filter((date: string | null) => date !== null);

				if (userTreatmentDates.length === 0) {
					keepYouth = false;
				}
			}

			if (keepYouth && form.date && form.dateEnd) {
				const userTreatmentDates = Object.values(allResultsTreatment[youthId] || {})
					.map((treatment: any) => {
						const treatmentDate = new Date(treatment.date);
						const formDate = new Date(form.date);
						const endDate = new Date(form.dateEnd);
						formDate.setHours(0, 0, 0, 0);
						endDate.setHours(0, 0, 0, 0);

						treatmentDate.setHours(0, 0, 0, 0);
						// console.log('treatment date', treatmentDate);
						// console.log('from date', new Date(form.date));
						// console.log('end date', new Date(form.dateEnd));
						if (formDate === endDate) {
							return (
								treatmentDate.toString() !== 'Invalid Date' &&
								treatmentDate == formDate
							) ? treatmentDate : null;
						} else {
							return (
								treatmentDate.toString() !== 'Invalid Date' &&
								treatmentDate >= formDate &&
								treatmentDate <= endDate
							) ? treatmentDate : null;
						}
					})
					.filter((date: Date | null) => date !== null);

				if (userTreatmentDates.length === 0) {
					keepYouth = false;
				}
			}

			if (form?.responsibleInstructor) {
				if (form.responsibleInstructor === 'WithoutGuide') {
					if (youth.responsibleInstructor !== undefined) {
						keepYouth = false;
					}
				} else if (form.responsibleInstructor === 'AnyGuide') {
					if (youth.responsibleInstructor === undefined) {
						keepYouth = false;
					}
				} else if (form.responsibleInstructor !== 'ALL' && youth.responsibleInstructor !== form.responsibleInstructor) {
					keepYouth = false;
				}
			}

			const isMatchCity = (city: string) => {
				if (city === SDEROT_HEB) {
					return youth.city === SDEROT_HEB;
				}
				return youth.city !== SDEROT_HEB;
			}
			if (keepYouth && hasCity && youth.city) {
				if (typeof form.city === 'string') {
					keepYouth = form.city === 'all' || form.city === ALL_HEB || isMatchCity(form.city);
				} else {
					keepYouth = Object.keys(form.city).some((city) => {
						const isSelected = !!form.city[city]
						return isMatchCity(city) && isSelected
					})
				}
			}

			if (keepYouth && form.referrer !== 'ALL' && form.referrer !== youth.referrer) {
				keepYouth = false;
			}
			let returnedToStudyFilter = youth.returnedToStudy === undefined ? false : youth.returnedToStudy;
			let returnedToStudyStatus = form.returnedToStudy === 'Y' ? true : false;
			if (keepYouth && form.returnedToStudy !== 'ALL' && returnedToStudyStatus !== returnedToStudyFilter) {
				keepYouth = false;
			}


			// console.log("hasCity: ", hasCity,"youth city:", youth.city, "SDEROT SELECTED", form.city[SDEROT_HEB]);
			if (hasCity && !(typeof form.city === 'string') && (!youth.city || youth.city === '') && form.city[SDEROT_HEB] === true) {
				keepYouth = false;
			}
			if (form.school && form.school !== ALL_HEB) {
				keepYouth = youth.school === form.school;
			}
			if (form.class && form.class !== ALL_HEB) {
				keepYouth = youth.class == form.class || `${youth.class}`.startsWith(`${form.class}`);
			}
			if (keepYouth) {
				filteredResults[youthId] = youth;
			}
		});
		const userCityHandler = this.loginApi.getCurrentUser()?.handleCity || EILAT_HEB;
		const toReturn = { ...filteredResults };
		if (userCityHandler === ALL_HEB) {
			return toReturn;
		}

		Object.keys(filteredResults).forEach((uthId) => {
			if (userCityHandler === EILAT_HEB && filteredResults[uthId].city !== EILAT_HEB) {
				delete toReturn[uthId];
			}
		})

		return toReturn;
	};

	retrieveAllYouth = () => {
		const unSub = this.firebaseApi.registerCall(YOUTHS_TABLE, (snapshot) => {
			this.dispatchAction(ActionTypes.UPDATE_YOUTHS, snapshot.val());
		});
		return unSub;
	}
	retrieveAllYouthTreatments = () => {
		const unSub = this.firebaseApi.registerCall(TREATMENT_TABLE, (snapshot) => {
			this.dispatchAction(ActionTypes.UPDATE_TREATMENTS_DATA, snapshot.val());
		});
		return unSub;
	}
	getLastTreatment = async (id: string): Promise<any | null> => {
		const result = await this.firebaseApi.asyncRead(`${TREATMENT_TABLE}/${id}`);
		if (result && Object.keys(result).length > 0) {
			const treatmentsArray = Object.values(result);

			treatmentsArray.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

			const lastTreatment = treatmentsArray[0];
			// console.log(lastTreatment);

			return lastTreatment;
		}
		return null;
	};
	retrieveYouth = async (id: string): Promise<YouthDetails | null> => {
		const result = await this.firebaseApi.asyncRead(`${YOUTHS_TABLE}/${id}`);
		if (result) {
			return {
				id,
				...result
			};
		}
		return null;
	};
	updateYouth = async (id: string, details: YouthDetails) => {
		// console.log('updaet youth', details, id);
		await this.firebaseApi.asyncUpdate(`${YOUTHS_TABLE}/${id}`, { ...details });
	};
	updatePresence = async (school: string, classLabel: string, classNumber: string, date: string, details: any) => {
		await this.firebaseApi.asyncUpdate(`${PRESENCE_TABLE}/${school}/${classLabel}/${classNumber}/${date}`, { ...details });
	};
	updateLastWorryOnYouth = async (youthId: string) => {
		try {
			const tr = await this.getLastTreatment(youthId);
			const youth = await this.retrieveYouth(youthId);
			if (youth) {
				// console.log('update last worry', tr.worry);
				youth.lastWorry = tr.worry;
				await this.updateYouth(youthId, youth);
			}
		} catch {
			console.warn('');
		}
	};
	updateTreatment = async (treatmentId: string, treatment: Treatment) => {
		const youthId = this.getSelectedYouthId();
		if (!youthId) {
			return -1;
		}
		try {
			await this.firebaseApi.asyncUpdate(`${TREATMENT_TABLE}/${youthId}/${treatmentId}`, { ...treatment });
			await this.updateLastWorryOnYouth(youthId);
		} catch (err) {
			console.warn(err);
			return 0;
		}
		return 1;
	};

	deleteTreatment = async (treatmentId: string) => {
		const youthId = this.getSelectedYouthId();
		if (!youthId) {
			return -1;
		}
		try {
			await this.firebaseApi.asyncDelete(`${TREATMENT_TABLE}/${youthId}/${treatmentId}`);

		} catch (err) {
			console.warn(err);
			return 0;
		}
		return 1;
	};

	deleteYouth = async (youthId: string) => {
		if (!youthId) {
			return -1;
		}
		try {
			await this.firebaseApi.asyncDelete(`${YOUTHS_TABLE}/${youthId}`);

		} catch (err) {
			console.warn(err);
			return 0;
		}
		return 1;
	};

	getSelectedYouthId = () => {
		return selectors.selectedYouthIdSelector(this.store.getState());
	};
	addTreatment = async (treatment: Treatment) => {
		const youthId = this.getSelectedYouthId();
		if (!youthId) {
			return -1;
		}
		try {
			await this.firebaseApi.asyncPush(`${TREATMENT_TABLE}/${youthId}`, { ...treatment });
			await this.updateLastWorryOnYouth(youthId);
		} catch (err) {
			console.warn(err);
			return 0;
		}
		return 1;
	};
	addUser = async (newUser: AddNewUserForm) => {
		// console.log(newUser);
		let newUserUpdate: AddNewUserForm = {
			name: newUser.name,
			email: newUser.email,
			phoneNumber: newUser.phoneNumber
		};
		if (newUser.roll === 'Teacher') {
			newUserUpdate = { ...newUserUpdate, isTeacher: true };
		} else if (newUser.roll === 'Admin') {
			newUserUpdate = { ...newUserUpdate, isAdmin: true };
		} else if (newUser.roll === 'SchoolCounselor') {
			newUserUpdate = { ...newUserUpdate, isCounselor: true, isGuide: true };
		} else {
			newUserUpdate = { ...newUserUpdate, isGuide: true };
		}
		this.firebaseApi.asyncPush(`${AUTHENTICATED_OSS_TABLE}`, { ...newUserUpdate });
	};

	registerTreatments = () => {
		const youthId = this.getSelectedYouthId();
		if (!youthId) {
			this.updateTreatmentStore({});
			return () => { };
		}
		return this.firebaseApi.registerCall(`${TREATMENT_TABLE}/${youthId}`, (snapshot) => {
			const result: Record<string, Treatment> | null = snapshot.val();
			this.updateTreatmentStore(result || {});
		});
	};
	registerPresence = () => {
		/* const youthId = this.getSelectedYouthId();
		if (!youthId) {
			this.updatePresenceStore({});
			return () => {};
		} */
		return this.firebaseApi.registerCall(`${PRESENCE_TABLE}/0/1/11-12-2023`, (snapshot) => {
			const result: Record<string, Presence> | null = snapshot.val();
			// console.log(snapshot.val());
			this.updatePresenceStore(result || {});
		});
	};
	addMultiYouths = async (data: YouthCSV[]) => {
		let counter = 0;
		function generateUniqueId() {
			const currentMilliseconds = new Date().getTime();
			const lastNineDigits = currentMilliseconds % 1000000000;
			const uniqueId = lastNineDigits.toString() + counter;
			counter++;
			return uniqueId;
		}
		const promises: any = [];
		const currentYouths = await this.firebaseApi.asyncRead(YOUTHS_TABLE);
		const ids = Object.keys(currentYouths).map((fbId) => { return { id: currentYouths[fbId].id, fbId } });
		function extractNameAndAddress(str: string) {
			const matches = str.match(/^(.*?)\s*\(([^)]+)\)$/);

			if (matches && matches.length === 3) {
				return {
					name: matches[1].trim(),
					address: matches[2].trim()
				};
			}
			return undefined;
		}
		const map = (srcElement: YouthCSV): YouthDetails => {
			let isValidDate = false;
			let parsedDate = new Date();
			if (srcElement.dateOfBirth) {
				// Assuming srcElement.dateOfBirth is a string representing a date in the format DD/MM/YYYY
				const parts = srcElement.dateOfBirth.split('/');
				const day = parseInt(parts[0], 10);
				const month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript
				const year = parseInt(parts[2], 10);

				// Create a new Date object using the parsed components
				parsedDate = new Date(year, month, day);

				// Check if the parsed date is valid and if the input matches the formatted output
				// eslint-disable-next-line
				isValidDate =
					!Number.isNaN(parsedDate.getTime()) &&
					parsedDate.getDate() === day &&
					parsedDate.getMonth() === month &&
					parsedDate.getFullYear() === year;
			}
			// If the date is valid, set it as yyyy-mm-dd; otherwise, set it to an empty string
			const dateOfBirth = isValidDate ? formatDate(parsedDate) : '';

			// Function to format date as yyyy-mm-dd
			function formatDate(date: Date): string {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to get the correct month
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			}

			if (!srcElement.id || srcElement.id === '') {
				srcElement.id = generateUniqueId();
			}
			const hotel = extractNameAndAddress(srcElement.hotel)
			console.info(hotel, srcElement.id);
			return {
				id: srcElement.id,
				firstName: srcElement.firstName,
				lastName: srcElement.lastName,
				dateOfbirth: dateOfBirth,
				phoneNumber: srcElement.phoneNumber,
				gender: (GenderMapArr as any)[srcElement.gender as any] || '',
				hotel: {
					name: hotel?.name || srcElement.hotel || '',
					address: hotel?.address || ''
				},
				school: srcElement.school,
				class: ClassArrNames[srcElement.class] || '',
				classNumber: srcElement.classNumber.toString(),
				languages: srcElement.languages?.toLowerCase?.()?.split?.(',') || 'he',
				parents: [
					{
						name: srcElement.parentName1,
						phoneNumber: srcElement.parentPhoneNumber1
					},
					{
						name: srcElement.parentName2 || '',
						phoneNumber: srcElement.parentPhoneNumber2 || ''
					}
				],
				notes: srcElement.notes || '',
				city: srcElement.city || '',
				lastAvailablityAtZoom: '',
				lastAvailabilityAtVenture: '',
				riskCharacteristics: {
					drugs: 'No',
					violenceInFamily: 'No',
					involvedInViolentIncident: 'No',
					securityAnxieties: 'No',


					/*victimOfSexualViolence: 'No',
					sexualViolence: 'No',
					violence: 'No',
					victimOfViolence: 'No',*/

					alcohol: 'No',
					mental: 'No',
					suicide: 'No',
					socialAnxieties: 'No',
					criminalInvolvementRisk: 'No',
					selfHarm: 'No',
					seclusion: 'No',
					eatingDisorders: 'No'
				},
				previousTreatmentHistory: {
					advisory: '',
					welfare: '',
					criminalInvolvement: '',
					educationalPsychologist: ''
				},
				lastWorry: srcElement.lastWorry || '0'
			};
		};
		data.forEach((newYouth) => {
			const existingYouth = ids.find((exId) => exId.id === newYouth.id);
			if (existingYouth?.fbId) {
				promises.push(this.firebaseApi.asyncUpdate(`${YOUTHS_TABLE}/${existingYouth?.fbId}`, map(newYouth)));
				toast(`${newYouth.id} - updated !`, { type: 'warning', position: toast.POSITION.TOP_LEFT });
			} else {
				// console.log(map(newYouth));
				promises.push(this.firebaseApi.asyncPush(`${YOUTHS_TABLE}`, map(newYouth)));
			}
		});
		try {
			await Promise.all(promises);
		} catch (err) {
			console.log(err);
			toast(t('newYouth.somethingWentWrong'), { type: 'error', position: toast.POSITION.TOP_LEFT });
			return 0;
		}
		if (promises?.length) {
			toast(t('newYouth.youthsAddedSuccssfully'), { type: 'success', position: toast.POSITION.TOP_LEFT });
		}
		return 1;
	};

	migrationHotels = async (data: HotelCSV[]) => {
		const allHotels: Hotel[] = await this.firebaseApi.asyncRead(`${APP_SETTINGS_TABLE}/hotels`);

		const isExists = (hotel: HotelCSV) => {
			let r = false
			allHotels.forEach((fbHotel: Hotel) => {
				if (fbHotel.name === hotel.name && fbHotel.address === hotel.address) {
					r = true;
					toast(`${hotel.name} (${hotel.address}) - קיים  !`, { type: 'error', position: toast.POSITION.TOP_LEFT });
				}
			})
			return r
		}

		data.forEach((hotel) => {
			if (!isExists(hotel)) {
				allHotels.push({ name: hotel.name, address: hotel.address })
			}
		})
		try {
			await this.firebaseApi.asyncUpdate(`${APP_SETTINGS_TABLE}`, { hotels: allHotels })
			toast('Updated successfully!', { type: 'success', position: toast.POSITION.TOP_LEFT });
		} catch (err) {
			console.warn(err)
			toast('Failed to update', { type: 'error', position: toast.POSITION.TOP_LEFT });
		}
	}
	updateYouthsMigration = async (data: { id: string | number, gender: Gender }[]) => {
		const currentYouths: Youth = await this.firebaseApi.asyncRead(YOUTHS_TABLE);

		const getId = (id: string | number) => {
			return Object.keys(currentYouths).find((youth) => {
				return currentYouths[youth].id === `${id}`
			})
		}
		for (let i = 0; i < data.length; i++) {
			try {
				const { id, gender } = data[i]
				const fbId = getId(id);
				if (fbId && (gender === 'F' || gender === 'M')) {
					await this.firebaseApi.asyncUpdate(`${YOUTHS_TABLE}/${fbId}`, { gender });
					toast(`Youth ${id} updated successfully!`, { type: 'success', position: toast.POSITION.TOP_LEFT });
				} else {
					toast(`Youth ${id} not found (${fbId})`, { type: 'warning', position: toast.POSITION.TOP_LEFT });
				}
			} catch (err) {
				console.warn(err)
				toast('Failed to update', { type: 'error', position: toast.POSITION.TOP_LEFT });
			}
		}

	}
	createYouth = async (newYouth: YouthDetails) => {
		const currentYouths = await this.firebaseApi.asyncRead(YOUTHS_TABLE);
		const ids = Object.keys(currentYouths).map((fbId) => currentYouths[fbId].id);

		if (!newYouth.id || newYouth.id === '') {
			const currentMilliseconds = new Date().getTime();
			const firstNineDigits = currentMilliseconds.toString().slice(0, 9);
			newYouth.id = firstNineDigits.toString();
		}
		if (!newYouth.lastWorry) {
			newYouth.lastWorry = '1';
		}
		if (ids.find((exId) => exId === newYouth.id)) {
			toast(`${newYouth.id} - ${t('newYouth.youthExists')} !`, { type: 'error', position: toast.POSITION.TOP_LEFT });
			return -1;
		}

		try {
			await this.firebaseApi.asyncPush(`${YOUTHS_TABLE}`, newYouth);
		} catch (err) {
			toast(t('newYouth.somethingWentWrong'), { type: 'error', position: toast.POSITION.TOP_LEFT });
			return 0;
		}
		toast(t('newYouth.youthAddedSuccssfully'), { type: 'success', position: toast.POSITION.TOP_LEFT });
		return 1;
	};
	prepareRateTextMap = () => {
		return this.firebaseApi.registerCall(`${APP_SETTINGS_TABLE}/ratingMap`, (snapshot) => {
			const result: Record<string | number, string> = snapshot.val();
			this.updateRateText(result);
		});
	};

	updateRateText = (data: Record<string | number, string> | null) => {
		this.dispatchAction(ActionTypes.UPDATE_RATE_TEXT, data);
	};

	updateTreatmentStore = (data: Record<string, Treatment> | null) => {
		this.dispatchAction(ActionTypes.UPDATE_TREATMENT, data);
	};

	updatePresenceStore = (data: Record<string, Presence> | null) => {
		// console.log(data);
		this.dispatchAction(ActionTypes.UPDATE_PRESENCE, data);
	};

	updateSelectedYouthId = (id?: string) => {
		this.dispatchAction(ActionTypes.SELECT_YOUTH_ID, id);
	};
}
