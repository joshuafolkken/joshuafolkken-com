#!/usr/bin/env tsx
/**
 * Shared GitHub raw-content URL helpers, single-sourced across scripts.
 */

const RAW_HOST = 'https://raw.githubusercontent.com'

function encode_url_path(path: string): string {
	return path
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/')
}

const github_url = {
	RAW_HOST,
	encode_url_path,
}

export { github_url }
