import { generateUUID } from 'sdk/common/uuid';
import { ApplicationInstances } from 'sdk/interfaces/sdkInterface';
import { config } from './config';

let queue: any = {};
let setSpinnerVisibility: Function | undefined;
let isSpinnerVisible = () => false;
export class GlobalSpinner {
	static instance: GlobalSpinner;
	constructor() {
		if (!GlobalSpinner.instance) {
			GlobalSpinner.instance = this;
		}
		return GlobalSpinner.instance;
	}
	static getInstance() {
		if (!GlobalSpinner.instance) {
			GlobalSpinner.instance = new GlobalSpinner();
		}
		return GlobalSpinner.instance;
	}

	init(instance: ApplicationInstances) {
		const { globalConfigApi: { isGlobalSpinnerVisible, setGlobalSpinnerVisibility } } = instance;
		setSpinnerVisibility = setGlobalSpinnerVisibility;
		isSpinnerVisible = isGlobalSpinnerVisible;
	}
	
	add(key: string) {
		const uuid = generateUUID();
		queue[uuid] = { key };
		setTimeout(() => this.remove(uuid), config.spinnerTimeout);
		if (isSpinnerVisible()) {
			setSpinnerVisibility?.(true);
		}
		return uuid;
	}
	remove(uuid?: string) {
		if (uuid && queue[uuid]) {
			delete queue[uuid];
		}
		setSpinnerVisibility?.(this.shouldAppear());
	}
	clear() {
		queue = {};
	}
	shouldAppear() {
		return this.size() > 0;
	}
	size() {
		return Object.keys(queue).length;
	}
	queue: Record<string, Record<'key', string>> | {};
	instance?: GlobalSpinner;
}

export default GlobalSpinner.getInstance();
