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

import {TicketsHandler} from "./tickets/TicketsHandler";
import {ExecutionContext, MessageBatch} from "@cloudflare/workers-types/2023-07-01/index";
import {uor_3_park_3_day_one_day_epic_base_ad, uor_uoap_epic_addon_ad} from "./tickets/data";
import {analyticsTables, queueDatapointMessage} from "./types";
import {Env} from "./worker-configuration";

let handler = new TicketsHandler;

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		let url = new URL(request.url);
		if (url.pathname == "/yay") {
			await handler.handleUniversalEpic(env, {
				start_date: "2025-05-20 00:00:01",
				end_date: "2025-12-31 23:59:59",
				partNumber: uor_uoap_epic_addon_ad,
			});
			return new Response("yay");
		}

		return new Response("hello");
	},
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext,
	) {
		await handler.handleUniversalEpic(env, {
			start_date: "2025-05-20 00:00:01",
			end_date: "2025-12-31 23:59:59",
			partNumber: uor_3_park_3_day_one_day_epic_base_ad,
		});
		await handler.handleUniversalEpic(env, {
			start_date: "2025-05-20 00:00:01",
			end_date: "2025-12-31 23:59:59",
			partNumber: uor_uoap_epic_addon_ad,
		});
	},
	async queue(
		batch: MessageBatch<queueDatapointMessage>,
		env: Env,
		ctx: ExecutionContext
	) {
		for (let {body} of batch.messages) {
			switch (body.name) {
				case analyticsTables.tickets:
					env.tickets.writeDataPoint(body.dp);
					break;
				case analyticsTables.videos:
					env.videos.writeDataPoint(body.dp);
					break;
				case analyticsTables.errors:
					env.errors.writeDataPoint(body.dp);
					break;
				default:
					console.log("Bad table name!", body.name);
					throw new Error("Bad table name");
			}
		}
	}
} satisfies ExportedHandler<Env, queueDatapointMessage>;
