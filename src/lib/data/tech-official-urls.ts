const GODOT_URL = 'https://godotengine.org'
const DOTNET_URL = 'https://dotnet.microsoft.com'
const DRIZZLE_URL = 'https://orm.drizzle.team'
const CLOUDFLARE_DEV_URL = 'https://developers.cloudflare.com'
const ANDROID_DEV_URL = 'https://developer.android.com'
const MDN_URL = 'https://developer.mozilla.org/en-US/docs'

const TECH_URL_ENTRIES: ReadonlyArray<readonly [string, string]> = [
	// AI Coding
	['Claude Code', 'https://claude.ai'],
	['CodeRabbit', 'https://coderabbit.ai'],
	['Cursor', 'https://cursor.com'],
	['Antigravity', 'https://antigravity.dev'],
	// Code Quality & Testing
	['SonarCloud', 'https://sonarcloud.io'],
	['Prettier', 'https://prettier.io'],
	['ESLint', 'https://eslint.org'],
	['Vitest', 'https://vitest.dev'],
	['Playwright', 'https://playwright.dev'],
	// Cloud & Edge
	['Cloudflare Workers', 'https://workers.cloudflare.com'],
	['Cloudflare KV', `${CLOUDFLARE_DEV_URL}/kv`],
	['Cloudflare D1', `${CLOUDFLARE_DEV_URL}/d1`],
	['Cloudflare R2', `${CLOUDFLARE_DEV_URL}/r2`],
	['AWS', 'https://aws.amazon.com'],
	['Vercel', 'https://vercel.com'],
	// Web Technologies
	['Better Auth', 'https://better-auth.com'],
	['Svelte', 'https://svelte.dev'],
	['HTML5', 'https://html.spec.whatwg.org'],
	['CSS3', 'https://www.w3.org/Style/CSS'],
	['Tailwind CSS', 'https://tailwindcss.com'],
	['Node.js', 'https://nodejs.org'],
	['Vue.js', 'https://vuejs.org'],
	['.NET', DOTNET_URL],
	['Angular', 'https://angular.dev'],
	['Bootstrap', 'https://getbootstrap.com'],
	['Vite', 'https://vite.dev'],
	// Development Tools
	['Lefthook', 'https://github.com/evilmartians/lefthook'],
	['pnpm', 'https://pnpm.io'],
	['GitHub', 'https://github.com'],
	['npm', 'https://www.npmjs.com'],
	['Git', 'https://git-scm.com'],
	['tsx', 'https://github.com/privatenumber/tsx'],
	['Sharp', 'https://sharp.pixelplumbing.com'],
	['Markdown', 'https://commonmark.org'],
	['mdsvex', 'https://mdsvex.com'],
	// Programming Languages
	['TypeScript', 'https://www.typescriptlang.org'],
	['JavaScript', `${MDN_URL}/Web/JavaScript`],
	['Rust', 'https://www.rust-lang.org'],
	['Dart', 'https://dart.dev'],
	['Kotlin', 'https://kotlinlang.org'],
	['Swift', 'https://swift.org'],
	['Java', 'https://openjdk.org'],
	['C#', `${DOTNET_URL}/languages/csharp`],
	['VB.NET', `${DOTNET_URL}/languages/vb`],
	['PHP', 'https://www.php.net'],
	['Python', 'https://www.python.org'],
	['C', 'https://www.iso.org/standard/74528.html'],
	// Databases & ORM
	['TURSO', 'https://turso.tech'],
	['Drizzle', DRIZZLE_URL],
	['LibSQL', 'https://libsql.org'],
	['SQLite', 'https://sqlite.org'],
	['PostgreSQL', 'https://www.postgresql.org'],
	['MySQL', 'https://www.mysql.com'],
	['Redis', 'https://redis.io'],
	// Game Development
	['Godot', GODOT_URL],
	['GDScript', GODOT_URL],
	['Unity', 'https://unity.com'],
	// Mobile Development
	['Android', ANDROID_DEV_URL],
	['iOS', 'https://developer.apple.com/ios'],
	['Flutter', 'https://flutter.dev'],
	['Android Studio', `${ANDROID_DEV_URL}/studio`],
	['Xcode', 'https://developer.apple.com/xcode'],
	// Desktop Development
	['Windows', 'https://www.microsoft.com/windows'],
	['macOS', 'https://www.apple.com/macos'],
	['Linux', 'https://www.linux.org'],
	// IDEs & Editors
	['VS Code', 'https://code.visualstudio.com'],
	['Visual Studio', 'https://visualstudio.microsoft.com'],
	['IntelliJ IDEA', 'https://www.jetbrains.com/idea'],
	['PhpStorm', 'https://www.jetbrains.com/phpstorm'],
	['Eclipse', 'https://www.eclipse.org'],
	// Infrastructure
	['PM2', 'https://pm2.keymetrics.io'],
	['VPS', 'https://en.wikipedia.org/wiki/Virtual_private_server'],
	['Ubuntu', 'https://ubuntu.com'],
	['CentOS', 'https://www.centos.org'],
	['Nginx', 'https://nginx.org'],
	['Apache', 'https://httpd.apache.org'],
	['AWS EC2', 'https://aws.amazon.com/ec2'],
	['Caddy', 'https://caddyserver.com'],
	['ngrok', 'https://ngrok.com'],
	["Let's Encrypt", 'https://letsencrypt.org'],
	// Skills (additional mappings)
	['SvelteKit', 'https://kit.svelte.dev'],
	['Cloudflare Workers / D1 / KV / R2', CLOUDFLARE_DEV_URL],
	['Drizzle ORM', DRIZZLE_URL],
	['WebSocket', `${MDN_URL}/Web/API/WebSocket`],
	['Godot / GDScript', GODOT_URL],
]

const TECH_URL_MAP = new Map<string, string>(TECH_URL_ENTRIES)

function get_official_url(name: string): string | undefined {
	return TECH_URL_MAP.get(name)
}

export const tech_official_urls = { get_official_url }
