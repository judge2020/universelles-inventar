import {Env} from "./worker-configuration";

export function emitErrorDp(env: Env, error_location: string, error_code: number, error_string: string) {
	env.errors.writeDataPoint({
		blobs: ["uor", error_location, error_string],
		doubles: [error_code],
		indexes: [error_location],
	})
}
