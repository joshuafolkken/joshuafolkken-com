const LOCALHOST_HOSTNAMES: ReadonlySet<string> = new Set(['localhost', '127.0.0.1'])

const HSTS_VALUE = 'max-age=31536000; includeSubDomains'

const PERMISSIONS_POLICY_VALUE = 'camera=(), microphone=(), geolocation=(), payment=()'

const CSP_DIRECTIVES: ReadonlyArray<string> = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googlesyndication.com https://*.doubleclick.net",
	"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
	"font-src 'self' https://fonts.gstatic.com",
	"img-src 'self' data: https://*.opencollective.com https://*.google-analytics.com https://*.googlesyndication.com https://*.doubleclick.net https://ssl.gstatic.com",
	"connect-src 'self' https://*.google-analytics.com https://api.opencollective.com https://www.googletagmanager.com https://*.doubleclick.net https://region1.analytics.google.com",
	'frame-src https://*.googlesyndication.com https://*.doubleclick.net https://www.youtube-nocookie.com',
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'self'",
]

const CSP_VALUE = CSP_DIRECTIVES.join('; ')

export { LOCALHOST_HOSTNAMES, HSTS_VALUE, PERMISSIONS_POLICY_VALUE, CSP_VALUE }
