export enum analyticsTables {
	tickets,
	videos,
	errors
}

export type queueDatapointMessage = {
	name: analyticsTables
	dp: AnalyticsEngineDataPoint
}

export type uorDateBoundary = {
	start_date: string
	end_date: string
	partNumber: string
}

export type monitoredYtVideo = {
	id: string
	friendly: string
	category: string
}

