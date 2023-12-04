import axios from 'axios';
import globalSpinner from 'sdk/connector/globalSpinner';
import { sdkInstance } from 'sdk';
import { Logger } from 'sdk/logger';
import { GQL_CONTENT_TYPE, GQL_METHOD, HEADERS } from './constants';
import { CallOptions, GrapqlData } from './interface';
import { isSuccessStatusCode } from './utility';

class Fetcher {
	static async call(gqlData: GrapqlData, options?: CallOptions) {
		const { globalConfigApi: { getBaseURL, updateSessionAuth, getSesssionAuth } } = sdkInstance();
		const { skipSpinner, skipError } = options || {};
		const { graphqlUrl: endpoint } = getBaseURL() || {};
		let response = null;
		let callUUID;
		try {
			const requestHeaders = {
				[HEADERS.contentType]: GQL_CONTENT_TYPE,
				Authorization: getSesssionAuth()
			};
			if (!skipSpinner) {
				callUUID = globalSpinner.add(gqlData.operationName || endpoint);
			}
			response = await axios({
				url: endpoint,
				method: GQL_METHOD,
				headers: requestHeaders,
				data: gqlData
			});
			updateSessionAuth(response.headers[HEADERS.auth]);
			if (!isSuccessStatusCode(response.status)) {
				return null;
			}
		} catch (err) {
			Logger.log(`Failed to Fetch query with error code: ${response?.status || '(failed)'}`, err, 'error');
			if (!skipError) {
				Logger.log('skipping error', `Skip Error for below exception ${err}`, 'warn');
			}
			return null;
		} finally {
			if (!skipSpinner) {
				globalSpinner.remove(callUUID);
			}
		}
		return response.data;
	}
}

export default Fetcher;
