import type InfoPackage from './models/info_package';

export default async function processMessage(data: InfoPackage): Promise<void> {
	throw new Error('Not implemented: ' + JSON.stringify(data));
}

