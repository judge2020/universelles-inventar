export default class Cache {
	kv_cache: KVNamespace;

	constructor(private readonly cache: KVNamespace) {
		this.kv_cache = cache;
	}

	async get(key: string): Promise<string | null> {
		return this.kv_cache.get(key);
	}

	async setWithExp(key: string, value: any, expirationTtl: number): Promise<void> {
		return this.kv_cache.put(key, value, {
			// 60 minutes
			expirationTtl: expirationTtl,
		});
	}
}
