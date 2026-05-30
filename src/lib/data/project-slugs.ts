// Dependency-free slug list (no Svelte/asset imports) so Playwright e2e tests can
// import it directly. The unit test in projects.test.ts keeps it in sync with PROJECTS.
export const PROJECT_SLUGS = [
	'mnemecha',
	'game-kit',
	'kit',
	'joshuafolkken-com',
	'tasks',
	'talk',
	'godot-2d-platformer',
	'tic-tac-toe',
	'pong',
	'godot-project-template',
	'godot-multiplayer',
] as const
