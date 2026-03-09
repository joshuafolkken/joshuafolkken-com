import type { TechColorKey } from '$lib/data/tech-colors'

export interface Skill {
	name: TechColorKey
	percent: number
}

export const SKILLS: Array<Skill> = [
	{ name: 'Teaching & Mentoring', percent: 85 },
	{ name: 'SvelteKit', percent: 85 },
	{ name: 'TypeScript', percent: 85 },
	{ name: 'Cloudflare Workers / D1 / KV / R2', percent: 80 },
	{ name: 'UI / UX Design', percent: 80 },
	{ name: 'Godot / GDScript', percent: 80 },
	{ name: 'Tailwind CSS', percent: 80 },
	{ name: 'Drizzle ORM', percent: 70 },
	{ name: 'WebSocket', percent: 70 },
	{ name: 'Community Building', percent: 60 },
	{ name: 'Rust', percent: 50 },
	{ name: 'Game Design', percent: 30 },
]
