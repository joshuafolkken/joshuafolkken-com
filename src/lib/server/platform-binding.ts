import { database } from './db/index.js'

/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters -- Generic K required for type-safe return */
function get_platform_binding<K>(
	platform: App.Platform | undefined,
	key: string,
	error_message: string,
): K {
	const environment = platform?.env as Record<string, K> | undefined
	const binding = environment?.[key]

	if (binding === undefined) {
		throw new Error(error_message)
	}

	return binding
}

function get_d1(platform: App.Platform | undefined): D1Database {
	return get_platform_binding<D1Database>(platform, 'DB', 'D1 database not available')
}

function get_kv(platform: App.Platform | undefined): KVNamespace {
	return get_platform_binding<KVNamespace>(platform, 'CACHE', 'KV cache not available')
}

function get_database(platform: App.Platform | undefined): ReturnType<typeof database.get> {
	return database.get(get_d1(platform))
}

const platform_binding = {
	get_d1,
	get_kv,
	get_database,
}

export { platform_binding }
