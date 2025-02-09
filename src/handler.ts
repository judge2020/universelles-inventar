import Cache from "./Cache";
import UniversalOrlandoApi from "./UniversalOrlandoApi";
import {uor_3_park_3_day_one_day_epic_base_ad} from "./data";
import {uorApiResponseShopPriceAndInventoryV2} from "./types";
import {Extractor} from "./extractor";

function formatDate(date: Date, time: string) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day} ${time}`;
}

export class Handler {
	async handleUniversalEpic(env: Env) {
		let cache = new Cache(env.cache);
		let uor = new UniversalOrlandoApi();
		await uor.ensureToken(cache);

		const currentMinute = new Date().getMinutes();
		if (currentMinute % 2 == 1) {
			return;
		}

		let dates = this.getDates(currentMinute / 2);
		if (dates[0] == "") {
			console.log("Not running, already pulled");
			return;
		}
		console.log(dates);
		let res = await uor.getV2({
			contractId: "4000000000000000003",
			currency: "USD",
			events: [
				{
					partNumber: uor_3_park_3_day_one_day_epic_base_ad,
					startDate: this.getDates(currentMinute)[0],
					endDate: this.getDates(currentMinute)[1],
					quantity: "1"
				}
			]
		});
		console.log(res.status);
		if (res.status < 200 || res.status > 299) {
			let error = await res.text();
			console.log(error);
			return new Response(error);
		}
		let myjson: uorApiResponseShopPriceAndInventoryV2 = await res.json();
		let extractor = new Extractor;
		extractor.extractInventoryEvents(myjson, env.tickets);
	}

	getDates(input_time: number): [string, string] {
		const startDate = new Date("2025-05-20 00:00:01");
		const endDate = new Date("2025-12-31 23:59:59");
		const segmentDays = 24; // Fixed 25-day period

		// Calculate the starting day of the given segment
		let segmentStartDate = new Date(startDate);
		segmentStartDate.setDate(startDate.getDate() + (input_time - 1) * segmentDays);

		// Calculate the segment's end date
		let segmentEndDate = new Date(segmentStartDate);
		segmentEndDate.setDate(segmentEndDate.getDate() + segmentDays - 1);

		// If segment starts beyond the end date, return empty strings
		if (segmentStartDate > endDate) {
			return ["", ""];
		}

		// If segment end exceeds endDate, adjust it to endDate
		if (segmentEndDate > endDate) {
			segmentEndDate = new Date(endDate);
		}

		return [
			formatDate(segmentStartDate, "00:00:01"),
			formatDate(segmentEndDate, "23:59:59")
		];
	}
}
