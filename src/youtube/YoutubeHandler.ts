import {Env} from "../worker-configuration";
import {YoutubeApi} from "./YoutubeApi";
import {youtubeApiResponseVideosStatisticsSnippet} from "./youtubeApiTypes";
import {analyticsTables, monitoredYtVideo} from "../types";

export class YoutubeHandler {
	async handleYoutubeVideo(env: Env, video: monitoredYtVideo) {
		let yt = new YoutubeApi(env);
		let stats: youtubeApiResponseVideosStatisticsSnippet = await (await yt.getViews(video.id)).json();

		await env.analytics_queue.send({
			dp: {
				blobs: [video.id, video.category, video.friendly, stats.items[0].snippet.title],
				doubles: [Number(stats.items[0].statistics.viewCount), Number(stats.items[0].statistics.likeCount)],
				indexes: [video.id]
			}, name: analyticsTables.videos
		})
	}
}
