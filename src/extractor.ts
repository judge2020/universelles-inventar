import {uorApiRequestDataInventoryEvent, uorApiResponseShopPriceAndInventoryV2} from "./types";
import {uor_3_park_3_day_one_day_epic_base_ad} from "./data";

export class Extractor {
	extractInventoryEvents(my_json: uorApiResponseShopPriceAndInventoryV2, tickets: AnalyticsEngineDataset) {
		for (const product in my_json.eventAvailability) {
			for (const date in my_json.eventAvailability[product]) {
				if (!date.includes("2025")) {
					continue;
				}
				// @ts-ignore
				let eventData = my_json.eventAvailability[product][date];

				let totalCapacity = 0;
				let availableUnits = 0;
				let quantityAvailable = 0;

				if (eventData.inventoryEvents && eventData.inventoryEvents.length > 0) {
					const event: uorApiRequestDataInventoryEvent = eventData.inventoryEvents[0]; // Assuming one event per date

					totalCapacity = parseInt(event.totalCapacity, 10);
					availableUnits = parseInt(event.availableUnits, 10);
					quantityAvailable = totalCapacity - availableUnits;
				}
				//console.log(`Extractor totalCapacity: ${totalCapacity}`);
				tickets.writeDataPoint({
					'blobs': [product, date],
					'doubles': [totalCapacity, quantityAvailable, availableUnits],
					'indexes': ["tickets"]
				});
			}
		}

	}
}
