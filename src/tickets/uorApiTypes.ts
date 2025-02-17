export type uorApiResponseOidcConnectToken = {
	access_token: string
	expires_in: number
	token_type: string
	scopes: string
}
export type uorApiRequestDataEvent = {
	endDate: string
	partNumber: string
	quantity: string | null
	startDate: string
}
export type uorApiRequestDataInventoryEvent = {
	eventId: string
	availableUnits: string
	resourceId: string
	endDate: string
	showTime: string
	available: string
	showEventKey: string
	tableIds: string[] | null
	showDate: string
	totalCapacity: string
	eventName: string
	showType: string
	partNumber: string
	startDate: string
	ada: string
}
export type uorApiRequestShopPriceAndInventoryV2 = {
	contractId: string
	currency: string
	events: uorApiRequestDataEvent[]
}
export type uorApiResponseShopPriceAndInventoryV2 = {
	messages: string[],
	eventAvailability: {
		[key: string]: {
			[key: string]: {
				inventoryEvents: uorApiRequestDataInventoryEvent[],
				paymentPlans: any[]
				pricing: {
					amount: number
					quantity: number
					currency: string
				}[],
			}
		}
	}
}
