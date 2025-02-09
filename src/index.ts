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

import {Handler} from "./handler";
import {ExecutionContext, MessageBatch} from "@cloudflare/workers-types/2023-07-01/index";
import {Env} from "../worker-configuration";
import {uor_3_park_3_day_one_day_epic_base_ad, uor_uoap_epic_addon_ad} from "./data";

let handler = new Handler;

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
		let url = new URL(request.url);
		if (url.pathname == "/yay") {
			await handler.handleKickoffUniversalEpicBatch(env, uor_uoap_epic_addon_ad);
			return new Response("yay");
		} else if (url.pathname == "/one") {
			await env.uor_queue.send(handler.getDatesArray(uor_uoap_epic_addon_ad)[0]);
			return new Response("did one");
		}
		return new Response("hello");
	},
	async scheduled(
		controller: ScheduledController,
		env: Env,
		ctx: ExecutionContext,
	) {
		await handler.handleKickoffUniversalEpicBatch(env, uor_3_park_3_day_one_day_epic_base_ad);
		await handler.handleKickoffUniversalEpicBatch(env, uor_uoap_epic_addon_ad);
	},
	async queue(
		batch: MessageBatch,
		env: Env,
		ctx: ExecutionContext
	) {
		for (let {body} of batch.messages) {
			// @ts-ignore
			await handler.handleUniversalEpic(env, body);
		}
	}
} satisfies ExportedHandler<Env>;
