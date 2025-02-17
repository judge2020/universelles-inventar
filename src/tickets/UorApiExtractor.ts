import {emitErrorDp} from "../helpers";
import {Env} from "../worker-configuration";
import {uorApiRequestDataInventoryEvent, uorApiResponseShopPriceAndInventoryV2} from "./uorApiTypes";

export class UorApiExtractor {
	extractInventoryEvents(my_json: uorApiResponseShopPriceAndInventoryV2, env: Env): AnalyticsEngineDataPoint[] {
		let out_datapoints: AnalyticsEngineDataPoint[] = [];
		for (const product in my_json.eventAvailability) {
			let datesLogged = 0;
			console.log("Extracting from product...");
			for (const date in my_json.eventAvailability[product]) {
				datesLogged++;
				if (!date.includes("2025") || date.includes("2025-04")) {
					// @ts-ignore
					emitErrorDp(env, "extract:baddate", 999, JSON.stringify(my_json.eventAvailability[product][date]));
					console.log("what");
					continue;
				}
				let eventData = my_json.eventAvailability[product][date];

				let totalCapacity = 0;
				let availableUnits = 0;
				let quantityAvailable = 0;
				let totallySoldOut = 0;
				let price_usd = 0;

				if (eventData.inventoryEvents && eventData.inventoryEvents.length > 0) {
					const event: uorApiRequestDataInventoryEvent = eventData.inventoryEvents[0]; // Assuming one event per date

					totalCapacity = parseInt(event.totalCapacity, 10);
					availableUnits = parseInt(event.availableUnits, 10);
					quantityAvailable = totalCapacity - availableUnits;

				}

				// Get Pricing
				if (eventData.pricing && eventData.pricing.length > 0) {
					price_usd = eventData.pricing[0].amount;
				}

				// check if totally sold out... it seems we sometimes get empty arrays, so this is redundant, but we can't swap the data fields we're pumping in after they're in the db.
				if (eventData.inventoryEvents.length == 0) {
					totallySoldOut = 1;
				}

				let sampling_index = `${product}:${date}:v1`;
				out_datapoints.push({
					'blobs': [product, date],
					'doubles': [totalCapacity, quantityAvailable, availableUnits, totallySoldOut, price_usd],
					'indexes': [sampling_index]
				});
			}
			console.log("emitted date count", datesLogged);
		}
		return out_datapoints;
	}
}
