// Generated by Wrangler
// After adding bindings to `wrangler.json`, regenerate this interface via `npm run cf-typegen`
import {uorDateBoundary} from "./src/types";

interface Env {
	cache: KVNamespace,
	tickets: AnalyticsEngineDataset,
	errors: AnalyticsEngineDataset,
	uor_queue: Queue<AnalyticsEngineDataPoint>;
}
