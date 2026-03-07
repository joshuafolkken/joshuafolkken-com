const TECH_COLOR_ENTRIES = [
	['TypeScript', '#3178c6'],
	['JavaScript', '#f7df1e'],
	['SvelteKit', '#ff3e00'],
	['TailwindCSS', '#06b6d4'],
	['Tailwind CSS', '#06b6d4'],
	['CSS', '#1572b6'],
	['Node.js', '#68a063'],
	['Drizzle', '#4ade80'],
	['Drizzle ORM', '#4ade80'],
	['Turso', '#4fbc84'],
	['PostgreSQL', '#4a90c4'],
	['Better Auth', '#38bdf8'],
	['Cloudflare Workers / D1 / KV / R2', '#f97316'],
	['Cloudflare Workers', '#f97316'],
	['Cloudflare D1', '#fb923c'],
	['Cloudflare KV', '#fdba74'],
	['Cloudflare R2', '#fcd34d'],
	['GDScript', '#7c3aed'],
	['Godot', '#478cbf'],
	['Godot / GDScript', '#478cbf'],
	['GDShader', '#7c3aed'],
	['GDUnit4', '#478cbf'],
	['GL Compatibility', '#10b981'],
	['Web Export', '#6366f1'],
	['WebSockets', '#22c55e'],
	['WebSocket', '#22c55e'],
	['Rust', '#ce422b'],
	['Teaching & Mentoring', '#38bdf8'],
	['Community Building', '#fb7185'],
	['Game Design', '#e879f9'],
	['UI / UX Design', '#34d399'],
] as const satisfies ReadonlyArray<readonly [string, string]>

const TECH_COLORS = new Map<string, string>(TECH_COLOR_ENTRIES)

const FALLBACK_COLOR = '#64748b'

export type TechColorKey = (typeof TECH_COLOR_ENTRIES)[number][0]

export const tech_colors = {
	get(name: string, fallback = FALLBACK_COLOR): string {
		return TECH_COLORS.get(name) ?? fallback
	},
}
