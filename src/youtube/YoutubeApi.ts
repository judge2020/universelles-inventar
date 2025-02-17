import {Env} from "../worker-configuration";

function buildQueryParams(params: any) {
    return new URLSearchParams(params).toString();
}

export class YoutubeApi {
	private YT_API_KEY: string;

	constructor(env: Env) {
		this.YT_API_KEY = env.YT_API_KEY
	}

	async getViews(video_id: string): Promise<Response> {
		let params = {
			id: video_id,
			part: "statistics,snippet",
			key: this.YT_API_KEY,
		}
		const queryString = buildQueryParams(params);

		return fetch(`https://www.googleapis.com/youtube/v3/videos?${queryString}`);
	}
}
