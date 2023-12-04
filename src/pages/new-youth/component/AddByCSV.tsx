import React from 'react';
import Papa from 'papaparse';
import { Grid } from '@mui/material';
import { FileUploader } from 'react-drag-drop-files';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { getInstance } from 'sdk';

type Props = {
	setLoading: (flag: boolean) => void;
	loading: boolean;
};
const isInvalidCSV = (data: any[]) => {
	const validFieldsHotel = ['name', 'address'];
	const validUpdateYouth = ['id', 'gender'];
	const validFields = [
		'id',
		'firstName',
		'lastName',
		// 'dateOfBirth',
		'phoneNumber',
		// 'gender',
		'hotel',
		'school',
		'class',
		'classNumber',
		// 'languages',
		'parentName1',
		'parentPhoneNumber1',
		// 'parentName2',
		// 'parentPhoneNumber2',
		'city',
		'notes',
		// 'lastAvailablityAtZoom',
		// 'lastAvailabilityAtVenture'
	];
	const inputFields = Object.keys(data[0]);
	const isHotel = !validFieldsHotel.filter((field) => !inputFields.find((f) => f === field)).length;
	if (isHotel) {
		return 2;
	}
	const isUpdate = !validUpdateYouth.filter((field) => !inputFields.find((f) => f === field)).length;
	if (isUpdate) {
		return 3;
	}
	const missing = validFields.filter((field) => !inputFields.find((f) => f === field));
	if (missing.length) {
		return 0;
	}
	return 1;
};
const { youthApi: { addMultiYouths, migrationHotels, updateYouthsMigration } } = getInstance();
const AddByCSV = (props: Props) => {
	const { setLoading } = props;
	const handleFileChange = (file: File) => {
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = e?.target?.result;
				if (text) {
					parseCsvToJson(text);
				}
			};
			reader.readAsText(file);
		}
	};

	const parseCsvToJson = (csvText: any) => {
		Papa.parse(csvText, {
			header: true,
			complete: (result: any) => {
				const { data } = result || {};
				const isInvalid = isInvalidCSV(data);
				if (!Array.isArray(data) || !data.length || isInvalid === 0) {
					toast(t('newYouth.invalidYouth'), { type: 'error' });
				} else {
					setLoading(true);
					if (isInvalid === 1) {
						addMultiYouths(data).then(() => setLoading(false)).catch(() => setLoading(false));
					} else if (isInvalid === 3) {
						updateYouthsMigration(data).then(() => setLoading(false)).catch(() => setLoading(false));
					} else if (isInvalid === 2) {
						migrationHotels(data).then(() => setLoading(false)).catch(() => setLoading(false));
					}
				}
			}
		});
	};

	return (
		<>
			<Grid container justifyContent="center">
				<Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
					<FileUploader
						handleChange={handleFileChange}
						name="file"
						types={['csv']}
						label={t('newYouth.uploadCSV')}
					/>
				</Grid>
			</Grid>
		</>

	);
};

export default AddByCSV;
