import Cache from "../Cache";
import {
	uorApiRequestDataEvent,
	uorApiRequestShopPriceAndInventoryV2,
	uorApiResponseOidcConnectToken
} from "./uorApiTypes";

const CLIENT_ID = "e7c945ba-eeec-4384-b03d-601650677987";
const CLIENT_SECRET = "L6sJ5hC5aP2iD0gX7yI1dV0lS7pX0hN1jK8mK8pK7lV2uE3hD8";

export default class UniversalOrlandoApi {
	private _access_token: string | null = null;

	_getHeaders(extra_headers: HeadersInit, is_init: boolean = false): HeadersInit {
		let auth = is_init ? "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`) : "Bearer " + this._access_token;
		return {
			...{
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
				"Origin": "https://www.universalorlando.com",
				"accept": "application/json",
				"accept-language": "en-US,en;q=0.9",
				"referer": "https://www.universalorlando.com/",
				"sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "Windows",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",
				"authorization": auth,
			}, ...extra_headers
		};
	}

	async ensureToken(cache: Cache, forceObtain: boolean = false): Promise<boolean> {
		let CACHE_KEY = "uor:api:access_token";
		try {
			let potential = await cache.get(CACHE_KEY);
			if (potential && !forceObtain) {
				this._access_token = potential;
				return true;
			}
			// refresh

			let resp = await fetch("https://api.universalparks.com/oidc/connect/token", {
				method: "POST",
				body: "grant_type=client_credentials&scope=default",
				headers: this._getHeaders({"Content-Type": "application/x-www-form-urlencoded"}, true)
			})
			let response: uorApiResponseOidcConnectToken = await resp.json();
			this._access_token = response.access_token;
			cache.setWithExp("uor:api:access_token", this._access_token, response.expires_in - 30);
			return true;

		} catch (e) {
			console.error(e);
			return false
		}
	}

	async getV2(data: uorApiRequestShopPriceAndInventoryV2): Promise<Response> {
		return fetch("https://api.universalparks.com/shop/wcs/resources/store/10101/event/priceAndInventory/v2", {
			method: "POST",
			body: JSON.stringify(data),
			headers: this._getHeaders({"Content-Type": "application/json"})
		})
	}
}
