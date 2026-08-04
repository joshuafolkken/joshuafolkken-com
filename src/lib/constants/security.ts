const LOCALHOST_HOSTNAMES: ReadonlySet<string> = new Set(['localhost', '127.0.0.1'])

const HSTS_VALUE = 'max-age=31536000; includeSubDomains'

const PERMISSIONS_POLICY_VALUE = 'camera=(), microphone=(), geolocation=(), payment=()'

// What this site layers on top of app-kit's baseline, in the shape `apply_security_headers` takes.
// It lives here, rather than inline in the server hook, so the hook and the security-headers E2E
// read the same array: one drives the headers actually served, the other drives what the spec
// expects. Passing it to both is what makes the stronger Permissions-Policy above read as the
// deliberate override it is instead of a departure from the baseline, and it puts the added HSTS
// header under the same assertion (app-kit#154).
const SECURITY_HEADERS_EXTRA = [
	['Permissions-Policy', PERMISSIONS_POLICY_VALUE],
	['Strict-Transport-Security', HSTS_VALUE],
] as const satisfies ReadonlyArray<readonly [string, string]>

// No CSP constant here on purpose: the policy is single-sourced in `kit.csp` (svelte.config.js)
// so SvelteKit can stamp a per-request nonce onto its own inline hydration script. See the
// comment there before adding a CSP header back to `src/lib/server/security.ts`.

export { LOCALHOST_HOSTNAMES, HSTS_VALUE, PERMISSIONS_POLICY_VALUE, SECURITY_HEADERS_EXTRA }
