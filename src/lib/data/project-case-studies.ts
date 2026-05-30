import type { CaseStudy } from '$lib/types/project'

const CHALLENGE = 'The Challenge'
const APPROACH = 'The Approach'
const TECH_CHOICES = 'Tech Choices'
const LEARNINGS = 'What I Learned'

const mnemecha: CaseStudy = {
	overview:
		'Mnemecha reinvents the classic Simon memory toy as a 3D first-person experience that runs smoothly in the browser, even on mobile. The goal was to keep the rules instantly understandable for a three-year-old while making the presentation feel modern and alive.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'The original Simon format is a flat panel of four colored buttons. Translating that into a first-person 3D space risked making the game harder to read, not more fun. I needed the color sequences to stay perfectly legible as they sped up, while the camera, lighting and audio carried the sense of tension that makes the toy addictive.',
		},
		{
			heading: APPROACH,
			body: 'I built the scene in real time with Threlte so every panel, glow and sound reacts immediately to player input. Sequences grow one step longer each round and accelerate, satisfying audio feedback confirms every press, and an optional cyber visual mode changes the whole mood without touching the rules. Everything is tuned to stay smooth at a steady frame rate on a phone.',
		},
		{
			heading: TECH_CHOICES,
			body: 'SvelteKit and Threlte gave me a reactive component model on top of Three.js, so game state and 3D rendering share the same source of truth. Cloudflare Workers host the build at the edge for fast loads worldwide. I leaned on Claude Code to move quickly from prototype to polished release.',
		},
		{
			heading: LEARNINGS,
			body: 'The biggest lesson was that restraint beats spectacle: the moment the sequence reading felt even slightly ambiguous, the fun evaporated. Shipping a 3D game that performs on mobile forced disciplined budgeting of draw calls and audio, and that discipline became the foundation for the reusable game kit that followed.',
		},
	],
}

const game_kit: CaseStudy = {
	overview:
		'@joshuafolkken/game-kit is the reusable foundation extracted from Mnemecha. Instead of letting a one-off game rot in a single repository, I distilled the parts worth keeping into a package that bootstraps the next game in minutes.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Mnemecha contained dozens of small but hard-won solutions: a heads-up display, settings toggles, a splash screen, input controls and a retro rendering pipeline. Copying those by hand into a new project would be slow and error-prone, and improvements made in one game would never flow back to the others.',
		},
		{
			heading: APPROACH,
			body: 'I separated the genuinely reusable building blocks from the game-specific logic and packaged the shared Svelte and Threlte components together. A CRT/RETRO rendering pipeline with a VGA 3-3-2 palette and Bayer dithering gives every game a consistent look. The jgame CLI then installs and syncs the kit into a fresh project, keeping each game up to date with the latest fixes.',
		},
		{
			heading: TECH_CHOICES,
			body: 'TypeScript and Node.js power the CLI, while SvelteKit, Three.js and Threlte provide the runtime building blocks. pnpm manages the workspace, and Cloudflare Workers serve the demos. Claude Code helped automate the repetitive extraction and documentation work.',
		},
		{
			heading: LEARNINGS,
			body: 'Extracting a kit clarified which abstractions actually earned their place — anything that resisted reuse was usually too coupled to a single game. Designing the sync command taught me to treat generated projects as living things that need ongoing updates, not snapshots frozen at creation time.',
		},
	],
}

const kit: CaseStudy = {
	overview:
		'@joshuafolkken/kit is a single npm package that bootstraps an entire development and AI workflow setup. One command lays down the configuration that used to take a full day of copy-pasting across every new repository.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Every new project needed the same tedious scaffolding: linting, formatting, spell-checking, testing, CI/CD, git hooks and AI workflow rules. Maintaining all of that by hand meant the configurations slowly drifted apart, and fixing one repository never benefited the rest.',
		},
		{
			heading: APPROACH,
			body: 'I consolidated more than twenty-five configuration files behind a single deploy command, and exposed more than twenty-five CLI subcommands covering code quality, CI/CD, git hooks and spell-checking. AI-assisted workflows such as kickoff and fullrun turn an issue into a planned, implemented and reviewed pull request with one invocation.',
		},
		{
			heading: TECH_CHOICES,
			body: 'The package is written in TypeScript on Node.js and ships with Prettier, ESLint, CSpell, Vitest, Playwright and Lefthook preconfigured. GitHub Actions, SonarQube Cloud and CodeRabbit cover the CI side, while the AI workflow layer is designed to run identically under Claude Code, Cursor and Gemini.',
		},
		{
			heading: LEARNINGS,
			body: 'Centralizing configuration revealed how much quality work is really just consistency work. Making the same standards portable across multiple AI assistants forced the workflow to be explicit and tool-agnostic, which made it far more reliable than instructions living only in my head.',
		},
	],
}

const joshuafolkken_com: CaseStudy = {
	overview:
		'joshuafolkken.com is this portfolio site: a place to showcase projects and publish a technical blog, and equally a sandbox for exploring how far I can push modern web tooling on Cloudflare.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'A portfolio has to load fast, read well and stay cheap to run, while still being interesting enough to justify experimenting on. I wanted a site that doubled as a laboratory for edge rendering, data storage and content tooling without becoming fragile.',
		},
		{
			heading: APPROACH,
			body: 'I built project showcases and a markdown-driven blog on top of SvelteKit, then layered in features like a generated sitemap, engagement buttons and adaptive ad visibility. The same codebase is where I try new patterns before they graduate into the shared kit, so the site is constantly evolving.',
		},
		{
			heading: TECH_CHOICES,
			body: 'SvelteKit and TypeScript drive the front end. Cloudflare Workers run the application at the edge, KV caches expensive lookups, D1 stores relational data through Drizzle, and TailwindCSS keeps the styling consistent. Everything is chosen to stay fast and inexpensive at the edge.',
		},
		{
			heading: LEARNINGS,
			body: 'Running my own site on the edge stack taught me the real trade-offs between caching, cold starts and data access that no tutorial conveys. Treating the portfolio as a sandbox means every improvement here is battle-tested before I recommend it elsewhere.',
		},
	],
}

const tasks: CaseStudy = {
	overview:
		'Tasks is a task-management web app in early development. Its current focus is a fast, self-hosted authentication layer that explores whether the Cloudflare stack can replace a managed auth provider.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Authentication is the part of any app where convenience and security pull hardest against each other. I wanted to understand the real cost of owning that layer instead of renting it, and whether an edge-native database could keep sessions fast without a dedicated auth service.',
		},
		{
			heading: APPROACH,
			body: 'I started by implementing authentication end to end before building task features, so the foundation is solid first. Better Auth provides the session and account primitives, Cloudflare D1 stores the user data at the edge, and the flow is structured so the task-management features can grow on top without reworking the security model.',
		},
		{
			heading: TECH_CHOICES,
			body: 'SvelteKit and TypeScript form the application shell, Better Auth handles credentials and sessions, and Cloudflare D1 with Drizzle provides relational storage. The whole point is to compare this combination against Supabase Auth as a performant, lower-cost alternative.',
		},
		{
			heading: LEARNINGS,
			body: 'Building auth first made it obvious how many product decisions hang off the session model. Working with D1 at the edge showed both its speed and its current limitations, and that honest comparison is more valuable to me than assuming a managed service is always the right answer.',
		},
	],
}

const talk: CaseStudy = {
	overview:
		'Talk is a language-learning game built around the two skills textbooks neglect most: listening and speaking. The aim is to make daily speaking practice feel like play rather than study.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Most language apps drill reading and vocabulary because they are easy to grade automatically. Listening and speaking are far harder to make fun and to evaluate, yet they are exactly the skills learners struggle to practice alone without feeling self-conscious.',
		},
		{
			heading: APPROACH,
			body: 'I framed practice as a game loop where the player listens, responds out loud and gets immediate feedback, so progress feels like winning rather than revising. Audio assets are streamed efficiently so sessions stay responsive, and the experience is designed to be picked up for a few minutes at a time.',
		},
		{
			heading: TECH_CHOICES,
			body: 'SvelteKit and TypeScript provide a reactive front end that can react to speech and audio in real time. Cloudflare Workers serve the app at the edge, and Cloudflare R2 stores the audio assets cheaply and delivers them quickly to learners anywhere.',
		},
		{
			heading: LEARNINGS,
			body: 'Designing for speaking taught me that motivation, not content, is the real bottleneck in language learning. Storing and streaming audio at the edge with R2 highlighted how much perceived quality depends on latency, and how a game frame can lower the embarrassment that stops people practicing.',
		},
	],
}

const godot_2d_platformer: CaseStudy = {
	overview:
		'Godot 2D Platformer is a study in tight, expressive movement. It layers dash mechanics, high jumps and double jumps into a control scheme that feels closer to a polished Mario game than a tutorial project.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Platformers live or die on the feel of movement. Getting dashes, high jumps and double jumps to coexist without feeling floaty or unfair means tuning acceleration, gravity and input timing until the character responds exactly the way the player expects.',
		},
		{
			heading: APPROACH,
			body: 'I built each movement ability as a focused, testable piece of behavior and tuned them together by feel, iterating on jump arcs and dash distances until traversal became satisfying on its own. The level design then exists to show off that movement rather than to hide weak controls behind difficulty.',
		},
		{
			heading: TECH_CHOICES,
			body: 'Godot and GDScript provide a fast iteration loop for 2D physics and input handling, which is essential when you are tuning movement frame by frame. A web export makes the result instantly playable in the browser, lowering the barrier for anyone who wants to try it.',
		},
		{
			heading: LEARNINGS,
			body: 'This project reinforced that game feel is engineering, not luck — every satisfying jump is a stack of small, deliberate numbers. Exporting to the web also taught me how to keep a real-time game responsive inside a browser sandbox.',
		},
	],
}

const tic_tac_toe: CaseStudy = {
	overview:
		'Tic-Tac-Toe reinvents the simplest of board games through the lens of the 1983 film WarGames, where a computer learns that some games are best not played at all.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Everyone already knows tic-tac-toe, and a perfectly played game always ends in a draw. The challenge was to make something familiar feel fresh and atmospheric, turning a solved game into an experience worth opening rather than a mechanical exercise.',
		},
		{
			heading: APPROACH,
			body: 'I leaned into the WarGames theme to give the board a retro-computer mood, treating the match less as a contest to win and more as a moment to enjoy. The presentation, pacing and feedback carry the nostalgia while the rules stay reassuringly simple for anyone to pick up.',
		},
		{
			heading: TECH_CHOICES,
			body: 'Godot and GDScript made it quick to build the grid logic and turn handling, and a web export means the game runs directly in the browser with no install. That combination kept the focus on mood and polish instead of plumbing.',
		},
		{
			heading: LEARNINGS,
			body: 'Reworking a solved game showed me how much of a play experience lives in framing and atmosphere rather than mechanics. A strong reference like WarGames gave the project a clear aesthetic compass, which made every small presentation decision easier.',
		},
	],
}

const pong: CaseStudy = {
	overview:
		'KAWAII PONG is a love letter to the 1976 Super Pong, rebuilt with a soft, kawaii twist that keeps the timeless gameplay while swapping severe geometry for charm.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Pong is almost perfect already, so any remake risks either breaking what works or adding nothing. The challenge was to honor the original arcade feel while giving it a distinct personality that makes it worth playing in a world that has seen Pong a thousand times.',
		},
		{
			heading: APPROACH,
			body: 'I kept the core paddle-and-ball loop faithful to Super Pong and reworked the presentation around a kawaii aesthetic, softening the visuals and feedback so the game feels welcoming rather than austere. The result stays instantly familiar while feeling like its own thing.',
		},
		{
			heading: TECH_CHOICES,
			body: 'Godot and GDScript handle the deterministic physics and scoring that classic Pong depends on, and a web export puts the game one click away in any browser. The lightweight stack suits a game that should load and play instantly.',
		},
		{
			heading: LEARNINGS,
			body: 'Remaking a classic taught me to separate the mechanics that must not change from the surface that is free to change. A clear aesthetic direction turned a simple clone into something with character, and reinforced how much tone shapes a player first impression.',
		},
	],
}

const godot_project_template: CaseStudy = {
	overview:
		'Godot Project Template is a minimalist starting point for rapid Godot 4 development — the opinionated skeleton I reach for so a new game begins with structure instead of a blank project.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Starting a Godot project from scratch means re-deciding the same folder structure, settings and conventions every time. That repeated setup is friction that drains momentum exactly when an idea is most fragile, before any actual gameplay exists.',
		},
		{
			heading: APPROACH,
			body: 'I distilled the choices I keep making into a deliberately minimal template: enough structure to stay organized, but nothing that dictates what the game will become. The goal is to clone it and be building gameplay within minutes, not untangling someone else’s opinions.',
		},
		{
			heading: TECH_CHOICES,
			body: 'The template targets Godot 4 with GDScript and is set up so a web export works out of the box. Keeping it lean was a design constraint in itself, because every extra default is something a future project would have to question or remove.',
		},
		{
			heading: LEARNINGS,
			body: 'Maintaining a template sharpened my sense of which conventions are genuinely universal versus merely habitual. The hardest part was resisting the urge to add features; a starter kit earns its value by staying small enough to trust. Every default I removed was one less decision a future project would have to second-guess, and that deliberate subtraction turned out to be the real feature worth maintaining.',
		},
	],
}

const godot_multiplayer: CaseStudy = {
	overview:
		'Godot Multiplayer is an exploration of real-time multiplayer game development in Godot, focused on understanding the networking model before committing it to a full game.',
	sections: [
		{
			heading: CHALLENGE,
			body: 'Multiplayer adds an entire dimension of difficulty: state has to stay consistent across machines despite latency, disconnects and the absence of a single source of truth. Before building a real game on top, I needed to understand how Godot handles synchronization and where the sharp edges are.',
		},
		{
			heading: APPROACH,
			body: 'I built focused experiments that connect clients, share state and react to players joining and leaving, treating the project as a sandbox for learning rather than a finished product. Each experiment isolates one networking concern so the lessons stay clear and transferable.',
		},
		{
			heading: TECH_CHOICES,
			body: 'Godot and GDScript provide the game runtime, while WebSockets carry real-time messages between clients in a way that also works for browser builds via web export. That combination keeps the networking approachable and broadly deployable.',
		},
		{
			heading: LEARNINGS,
			body: 'Prototyping multiplayer made the cost of every networked feature tangible — synchronizing state is never free, and good design hides that cost from players. Isolating one concern per experiment proved far more instructive than trying to build a complete networked game at once. Watching latency and disconnects break naive assumptions early saved me from baking those mistakes into a larger project later on.',
		},
	],
}

const CASE_STUDY_ENTRIES: ReadonlyArray<[string, CaseStudy]> = [
	['mnemecha', mnemecha],
	['game-kit', game_kit],
	['kit', kit],
	['joshuafolkken-com', joshuafolkken_com],
	['tasks', tasks],
	['talk', talk],
	['godot-2d-platformer', godot_2d_platformer],
	['tic-tac-toe', tic_tac_toe],
	['pong', pong],
	['godot-project-template', godot_project_template],
	['godot-multiplayer', godot_multiplayer],
]

export const PROJECT_CASE_STUDIES: Record<string, CaseStudy> =
	Object.fromEntries(CASE_STUDY_ENTRIES)
