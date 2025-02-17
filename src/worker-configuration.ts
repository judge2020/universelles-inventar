import {queueDatapointMessage} from "./types";

export interface Env {
	cache: KVNamespace,
	tickets: AnalyticsEngineDataset,
	videos: AnalyticsEngineDataset,
	errors: AnalyticsEngineDataset,
	uor_queue: Queue<queueDatapointMessage>,
	YT_API_KEY: string,
}
