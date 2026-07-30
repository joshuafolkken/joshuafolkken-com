const LOCALHOST_HOSTNAMES: ReadonlySet<string> = new Set(['localhost', '127.0.0.1'])

const HSTS_VALUE = 'max-age=31536000; includeSubDomains'

const PERMISSIONS_POLICY_VALUE = 'camera=(), microphone=(), geolocation=(), payment=()'

// No CSP constant here on purpose: the policy is single-sourced in `kit.csp` (svelte.config.js)
// so SvelteKit can stamp a per-request nonce onto its own inline hydration script. See the
// comment there before adding a CSP header back to `src/lib/server/security.ts`.

export { LOCALHOST_HOSTNAMES, HSTS_VALUE, PERMISSIONS_POLICY_VALUE }
