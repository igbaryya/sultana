import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HEB from './he.json';

i18n
	.use(initReactI18next)
	.init({
		resources: {
			he: {
				translation: HEB
			}
		},
		lng: window.sessionStorage.getItem('lang') || 'he',
		fallbackLng: 'he',
		interpolation: {
			escapeValue: false
		}
	});
