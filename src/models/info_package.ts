export default class InfoPackage {
	constructor(
		public conversationId: string,
		public message: string,
		public response: string,
		public timeStamp: number,
		public ownerId: string,
		public phoneNumber: string,
		public conversationName: string,
	) {}
}
