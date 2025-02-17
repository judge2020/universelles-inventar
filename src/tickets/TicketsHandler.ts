import Cache from "../Cache";
import UniversalOrlandoApi from "./UniversalOrlandoApi";
import {analyticsTables, uorApiResponseShopPriceAndInventoryV2, uorDateBoundary} from "../types";
import {UorApiExtractor} from "./UorApiExtractor";
import {emitErrorDp} from "../helpers";
import {Env} from "../worker-configuration";

export class TicketsHandler {
	async handleUniversalEpic(env: Env, dates: uorDateBoundary) {
		console.log("dates", dates)
		let cache = new Cache(env.cache);
		let uor = new UniversalOrlandoApi;
		await uor.ensureToken(cache);

		let res = await uor.getV2({
			contractId: "4000000000000000003",
			currency: "USD",
			events: [
				{
					partNumber: dates.partNumber,
					startDate: dates.start_date,
					endDate: dates.end_date,
					quantity: "1"
				}
			]
		});
		console.log("UOR getV2", res.status);
		if ([401, 403].includes(res.status)) {
			await uor.ensureToken(cache, true);
			emitErrorDp(env, "getv2:badauth", res.status, res.statusText);
			console.log("got 401, forcing new token and dying");
			return new Response("401, refreshed token and hoping it works next time");
		} else if (res.status < 200 || res.status > 299) {
			let error = await res.text();
			emitErrorDp(env, "getv2:not2xx", res.status, error);
			console.log("error", error);
			return new Response(error);
		}
		let myjson: uorApiResponseShopPriceAndInventoryV2 = await res.json();
		let extractor = new UorApiExtractor;
		let events = extractor.extractInventoryEvents(myjson, env);
		for (let event of events) {
			await env.analytics_queue.send({dp: event, name: analyticsTables.tickets});
		}
	}


}
