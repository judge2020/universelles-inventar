import Cache from "./Cache";
import UniversalOrlandoApi from "./UniversalOrlandoApi";
import {uor_3_park_3_day_one_day_epic_base_ad} from "./data";
import {uorApiResponseShopPriceAndInventoryV2, uorDateBoundary} from "./types";
import {Extractor} from "./extractor";
import {Env} from "../worker-configuration";

function formatDate(date: Date, time: string) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day} ${time}`;
}

export class Handler {
	async handleUniversalEpic(env: Env, dates: uorDateBoundary) {
		console.log("dates", dates)
		let cache = new Cache(env.cache);
		let uor = new UniversalOrlandoApi();
		await uor.ensureToken(cache);

		let res = await uor.getV2({
			contractId: "4000000000000000003",
			currency: "USD",
			events: [
				{
					partNumber: uor_3_park_3_day_one_day_epic_base_ad,
					startDate: dates.start_date,
					endDate: dates.end_date,
					quantity: "1"
				}
			]
		});
		console.log("UOR getV2", res.status);
		if ([401, 403].includes(res.status)) {
			await uor.ensureToken(cache, true);
			console.log("got 401, forcing new token and dying");
			return new Response("401, refreshed token and hoping it works next time");
		} else if (res.status < 200 || res.status > 299) {
			let error = await res.text();
			console.log("error", error);
			return new Response(error);
		}
		let myjson: uorApiResponseShopPriceAndInventoryV2 = await res.json();
		let extractor = new Extractor;
		extractor.extractInventoryEvents(myjson, env.tickets);
	}

	async handleKickoffUniversalEpicBatch(env: Env) {
		// Ensure access token first, so sent messages don't hit it
		let uor = new UniversalOrlandoApi;
		await uor.ensureToken(new Cache(env.cache));

		for (let date of this.getDatesArray()) {
			await env.uor_queue.send(date)
		}
	}

	getDatesArray(): uorDateBoundary[] {
		const startDate = new Date("2025-05-20 00:00:01");
		const endDate = new Date("2025-12-31 23:59:59");
		const segmentDays = 24; // Fixed 24-day period
		let segments: uorDateBoundary[] = [];

		let currentStartDate = new Date(startDate);

		while (currentStartDate <= endDate) {
			let currentEndDate = new Date(currentStartDate);
			currentEndDate.setDate(currentEndDate.getDate() + segmentDays - 1);

			// Adjust if end date exceeds the limit
			if (currentEndDate > endDate) {
				currentEndDate = new Date(endDate);
			}

			segments.push({
				start_date: formatDate(currentStartDate, "00:00:01"),
				end_date: formatDate(currentEndDate, "23:59:59")
			});

			// Move to the next segment
			currentStartDate.setDate(currentStartDate.getDate() + segmentDays);
		}
		return segments;
	}
}
