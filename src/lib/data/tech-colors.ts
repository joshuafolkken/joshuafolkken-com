const TECH_COLOR_ENTRIES = [
	// Skills
	['TypeScript', '#3178c6'],
	['SvelteKit', '#ff3e00'],
	['Cloudflare Workers / D1 / KV / R2', '#f97316'],
	['Tailwind CSS', '#06b6d4'],
	['Drizzle ORM', '#4ade80'],
	['WebSocket', '#22c55e'],
	['Rust', '#ce422b'],
	['Teaching & Mentoring', '#38bdf8'],
	['UI / UX Design', '#34d399'],
	['Godot / GDScript', '#478cbf'],
	['Community Building', '#fb7185'],
	['Game Design', '#e879f9'],
	// Programming Languages
	['JavaScript', '#f7df1e'],
	['Dart', '#0175c2'],
	['Kotlin', '#7f52ff'],
	['Swift', '#fa7343'],
	['Java', '#ed8b00'],
	['C#', '#239120'],
	['VB.NET', '#512bd4'],
	['PHP', '#8892bf'],
	['Python', '#3776ab'],
	['C', '#a8b9cc'],
	// Web Technologies
	['Better Auth', '#38bdf8'],
	['Svelte', '#ff3e00'],
	['HTML5', '#e34f26'],
	['CSS3', '#1572b6'],
	['CSS', '#1572b6'],
	['TailwindCSS', '#06b6d4'],
	['Node.js', '#68a063'],
	['Vue.js', '#4fc08d'],
	['.NET', '#512bd4'],
	['Angular', '#dd0031'],
	['Bootstrap', '#7952b3'],
	['Vite', '#646cff'],
	// Databases & ORM
	['TURSO', '#4fbc84'],
	['Turso', '#4fbc84'],
	['Drizzle', '#4ade80'],
	['LibSQL', '#5bc4b4'],
	['SQLite', '#003b57'],
	['PostgreSQL', '#4a90c4'],
	['MySQL', '#4479a1'],
	['Redis', '#dc382d'],
	// Cloud & Edge
	['Cloudflare Workers', '#f97316'],
	['Cloudflare KV', '#fdba74'],
	['Cloudflare D1', '#fb923c'],
	['Cloudflare R2', '#fcd34d'],
	['AWS', '#ff9900'],
	['Vercel', '#000000'],
	// Game Development
	['Godot', '#478cbf'],
	['GDScript', '#7c3aed'],
	['GDShader', '#7c3aed'],
	['GDUnit4', '#478cbf'],
	['Unity', '#000000'],
	// Mobile Development
	['Android', '#3ddc84'],
	['iOS', '#007aff'],
	['Flutter', '#54c5f8'],
	// Desktop Development
	['Windows', '#0078d6'],
	['macOS', '#94a3b8'],
	['Linux', '#fcc624'],
	// Infrastructure
	['PM2', '#2b037a'],
	['VPS', '#0078d6'],
	['Ubuntu', '#e95420'],
	['CentOS', '#262577'],
	['Nginx', '#009639'],
	['Apache', '#d22128'],
	['AWS EC2', '#ff9900'],
	['Caddy', '#22d3ee'],
	['ngrok', '#1f1e1e'],
	["Let's Encrypt", '#003a70'],
	// Development Tools
	['Git', '#f05032'],
	['GitHub', '#181717'],
	['npm', '#cb3837'],
	['pnpm', '#F9AD00'],
	['Lefthook', '#ff6b6b'],
	['tsx', '#3178c6'],
	['Sharp', '#99cc00'],
	['Markdown', '#000000'],
	['mdsvex', '#000000'],
	['Web Export', '#6366f1'],
	['WebSockets', '#22c55e'],
	// Code Quality & Testing
	['CodeRabbit', '#FF570A'],
	['Prettier', '#f7b93e'],
	['ESLint', '#4b32c3'],
	['Vitest', '#6e9f18'],
	['Playwright', '#2ead33'],
	['SonarCloud', '#f3702a'],
	// IDEs & Editors
	['Antigravity', '#4285F4'],
	['Claude Code', '#d97757'],
	['Cursor', '#6366f1'],
	['VS Code', '#007acc'],
	['Android Studio', '#3ddc84'],
	['Xcode', '#147efb'],
	['Visual Studio', '#5c2d91'],
	['IntelliJ IDEA', '#fe315d'],
	['PhpStorm', '#8c4ec3'],
	['Eclipse', '#2c2255'],
] as const satisfies ReadonlyArray<readonly [string, string]>

const TECH_COLORS = new Map<string, string>(TECH_COLOR_ENTRIES)

const FALLBACK_COLOR = '#64748b'
const DARK_BRAND_BORDER = 'rgba(255,255,255,0.25)'
const DARK_BRAND_TEXT = 'rgba(255,255,255,0.8)'
const HEX_RED_END = 3
const HEX_GREEN_START = 3
const HEX_GREEN_END = 5
const HEX_BLUE_START = 5
const HEX_BLUE_END = 7
const LUMINANCE_RED_WEIGHT = 0.299
const LUMINANCE_GREEN_WEIGHT = 0.587
const LUMINANCE_BLUE_WEIGHT = 0.114
const MAX_COLOR_CHANNEL = 255
const DARK_LUMINANCE_THRESHOLD = 0.35
const HEX_RADIX = 16

type TechColorKey = (typeof TECH_COLOR_ENTRIES)[number][0]

function get(name: string, fallback = FALLBACK_COLOR): string {
	return TECH_COLORS.get(name) ?? fallback
}

function is_dark(hex: string): boolean {
	const red = Number.parseInt(hex.slice(1, HEX_RED_END), HEX_RADIX)
	const green = Number.parseInt(hex.slice(HEX_GREEN_START, HEX_GREEN_END), HEX_RADIX)
	const blue = Number.parseInt(hex.slice(HEX_BLUE_START, HEX_BLUE_END), HEX_RADIX)
	const luminance =
		(LUMINANCE_RED_WEIGHT * red + LUMINANCE_GREEN_WEIGHT * green + LUMINANCE_BLUE_WEIGHT * blue) /
		MAX_COLOR_CHANNEL

	return luminance < DARK_LUMINANCE_THRESHOLD
}

export type { TechColorKey }
export const tech_colors = {
	get,
	is_dark,
	DARK_BRAND_BORDER,
	DARK_BRAND_TEXT,
}
