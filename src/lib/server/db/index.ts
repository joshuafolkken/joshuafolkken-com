/* eslint-disable @typescript-eslint/triple-slash-reference -- tsgo needs explicit reference for Cloudflare types */
/// <reference path="../../../../worker-configuration.d.ts" />
import { drizzle } from 'drizzle-orm/d1'
import { schema } from './schema'

function get(d1: D1Database): ReturnType<typeof drizzle> {
	return drizzle(d1, { schema })
}

export const database = {
	get,
}
