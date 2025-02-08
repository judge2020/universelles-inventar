/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.json`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import Cache from "./Cache";
import UniversalOrlandoApi from "./UniversalOrlandoApi";
import {uor_3_park_3_day_one_day_epic_base_ad} from "./data";
import {uorApiRequestDataInventoryEvent, uorApiResponseShopPriceAndInventoryV2} from "./types";
import {Extractor} from "./extractor";
import {Handler} from "./handler";

let handler = new Handler();

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		if (new URL(request.url).pathname !== "/yay") {
			return new Response("hello");
		}
		await handler.handleUniversalEpic(env);
		return new Response("yay");
	},
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext,
	) {
		await handler.handleUniversalEpic(env);
	},
} satisfies ExportedHandler<Env>;
