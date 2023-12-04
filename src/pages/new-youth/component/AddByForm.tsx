import { YouthDetails } from 'interfaces/YouthObject';
import PersonalDetails from 'pages/youth-details/components/PersonalDetails';
import React from 'react';

type Props = {
	youthDetails: YouthDetails;
	setNewYoutDetails?: (newYouth: YouthDetails) => void;
};
export default function AddByForm({ youthDetails, setNewYoutDetails }: Props) {
	return (
		<>
			<PersonalDetails
				youthDetails={youthDetails}
				isNewYouth
				setNewYoutDetails={setNewYoutDetails}
			/>
		</>
	);
}
