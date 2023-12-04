/* eslint-disable quote-props */
/* eslint-disable */
import { Rate, Worry, Roll } from 'interfaces/Treatments';
import { Age, Class, Gender, ReturnedToStudy, TypeOfRisks } from 'interfaces/YouthObject';

export const RollArr: Roll[] = ['Teacher', 'Admin', 'Guide', 'SchoolCounselor', 'Wellfare'];
export const EMPTY_STRING = '';
export const COUNTRY_CODE = '+972';
export const OTP_LENGTH = 6;
export const TypeOfRisksArr: TypeOfRisks[] = ['No', 'Yes'];
export const GenderArr: Gender[] = ['F', 'M'];
export const ReturnedToStudyArr: ReturnedToStudy[] = ['Y', 'N', 'ALL'];
export const AgeArr: Age[] = ['12', '13', '14', '15', '16', '17','18'];
export const GenderMapArr = {
	'נ': 'F',
	'ז': 'M'
};
export const ReturnedToStudyMapObj = {
	'Y':'כן',
	'N':'לא',
  'ALL':'הכל'
};
export const hotelToFilterOut = 'לא נמצא באילת';
export const ClassArr: Class[] = ['1', '2', '3', '4', '5', '6', '7', '7m', '7a', '8', '8m', '8a', '9', '10', '11', '12'];
export const ClassNumbersArr = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const israeliCities = [
  "ירושלים",
  "תל אביב",
  "חיפה",
  "ראשון לציון",
  "פתח תקווה",
  "אשדוד",
  "נתניה",
  "באר שבע",
  "בני ברק",
  "חולון",
  "רמת גן",
  "אשקלון",
  "רחובות",
  "בית שמש",
  "בת ים",
  "כפר סבא",
  "הרצליה",
  "חדרה",
  "מודיעין- מכבים- רעות",
  "לוד",
  "מודיעין עילית",
  "נצרת",
  "רמלה",
  "רעננה",
  "רהט",
  "ראש העין",
  "הוד השרון",
  "ביתר עילית",
  "גבעתיים",
  "קריית אתא",
  "נהריה",
  "קריית גת",
  "אום אל-פחם",
  "עפולה",
  "אילת",
  "נס ציונה",
  "עכו",
  "יבנה",
  "אלעד",
  "רמת השרון",
  "כרמיאל",
  "טבריה",
  "קריית מוצקין",
  "טייבה",
  "שפרעם",
  "נוף הגליל",
  "קריית ביאליק",
  "קריית אונו",
  "קריית ים",
  "נתיבות",
  "מעלה אדומים",
  "אור יהודה",
  "צפת",
  "דימונה",
  "טמרה",
  "אופקים",
  "סח'נין",
  "באקה אל-גרבייה",
  "יהוד-מונוסון",
  "שדרות",
  "באר יעקב",
  "גבעת שמואל",
  "ערד",
  "טירה",
  "עראבה",
  "כפר יונה",
  "מגדל העמק",
  "קריית מלאכי",
  "כפר קאסם",
  "טירת כרמל",
  "יקנעם עילית",
  "נשר",
  "קלנסווה",
  "קריית שמונה",
  "מעלות- תרשיחא",
  "אריאל",
  "אור עקיבא",
  "בית שאן"
];
export const ClassArrNamesMaps: any = {
	'1': 'א',
	'2': 'ב',
	'3': 'ג',
	'4': 'ד',
	'5': 'ה',
	'6': 'ו',
	'7': 'ז',
	'7m': 'ז מופת',
	'7a': 'ז עמט',
	'8': 'ח',
	'8m': 'ח מופת',
	'8a': 'ח עמט',
	'9': 'ט',
	'10': 'י',
	'11': 'יא',
	'12': 'יב'
};

// Create a new object with swapped keys and values
// eslint-disable-next-line
const ClassArrNamesSWP: any = {};
// eslint-disable-next-line
for (const key in ClassArrNamesMaps) {
	// eslint-disable-next-line
	if (ClassArrNamesMaps.hasOwnProperty(key)) {
		ClassArrNamesSWP[ClassArrNamesMaps[key]] = key;
	}
}
export const ClassArrNames = ClassArrNamesSWP;
export const RateMap: Rate[] = ['1', '2', '3', '4', '5', '6'];
export const WorryMap: Worry[] = ['0', '1', '2', '3', '4', '5', '6'];

export const RISK_CHARACTERISTICS_ORDER: Record<string, number> = {
	drugs: 1,
	violenceInFamily: 2,
	involvedInViolentIncident: 3,
	securityAnxieties: 4,
	//victimOfSexualViolence: 5,
	alcohol: 6,
	mental: 7,
	suicide: 8,
	socialAnxieties: 9,
  criminalInvolvementRisk: 10,
  selfHarm: 11,
  seclusion: 12,
  eatingDisorders: 13,
};



export const INACTIVITY_DURATION_MINUTES = 30;
export const ALL_HEB = 'הכל';
export const EILAT_HEB = 'אילת';
export const OTHER_HEB = 'אחר';
export const TEL_AVIV_HEB = 'תל אביב';
export const SDEROT_HEB = 'שדרות';
