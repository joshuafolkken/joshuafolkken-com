import type { Category } from '$lib/types/tech-stack'

const BADGE_BASE_URL = 'https://img.shields.io/badge'
const BADGE_STYLE = 'for-the-badge'
const LOGO_COLOR_WHITE = 'white'
const LOGO_COLOR_BLACK = 'black'
const COLOR_BLACK = '000000'
const COLOR_GODOT = '478CBF'
const COLOR_WINDOWS = '0078D6'
const COLOR_AWS = 'FF9900'
const LOGO_DOT_NET = '.net'
const LOGO_AMAZON_AWS = 'amazon-aws'
const LOGO_GODOT_ENGINE = 'godot-engine'

type BadgeParameters = [name: string, color: string, logo: string, logo_color: string]
type CategoryData = [title: string, badges: Array<BadgeParameters>]

interface BadgeConfig {
	name: string
	color: string
	logo: string
	logo_color: string
}

function create_badge_url(config: BadgeConfig): string {
	const label = encodeURIComponent(config.name)
	const message = config.color
	const parameters = new URLSearchParams({
		style: BADGE_STYLE,
		logo: config.logo,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		logoColor: config.logo_color,
	})
	return `${BADGE_BASE_URL}/${label}-${message}?${parameters.toString()}`
}

const tech_stack_data: Array<CategoryData> = [
	[
		'💻 Programming Languages',
		[
			['TypeScript', '007ACC', 'typescript', LOGO_COLOR_WHITE],
			['JavaScript', 'F7DF1E', 'javascript', LOGO_COLOR_BLACK],
			['Rust', COLOR_BLACK, 'rust', LOGO_COLOR_WHITE],
			['Dart', '0175C2', 'dart', LOGO_COLOR_WHITE],
			['Kotlin', '7F52FF', 'kotlin', LOGO_COLOR_WHITE],
			['Swift', 'FA7343', 'swift', LOGO_COLOR_WHITE],
			['Java', 'ED8B00', 'openjdk', LOGO_COLOR_WHITE],
			['C#', '239120', 'c-sharp', LOGO_COLOR_WHITE],
			['VB.NET', '512BD4', LOGO_DOT_NET, LOGO_COLOR_WHITE],
			['PHP', '777BB4', 'php', LOGO_COLOR_WHITE],
			['Python', '3776AB', 'python', LOGO_COLOR_WHITE],
			['C', 'A8B9CC', 'c', LOGO_COLOR_BLACK],
		],
	],
	[
		'🌐 Web Technologies',
		[
			['Svelte', 'FF3E00', 'svelte', LOGO_COLOR_WHITE],
			['HTML5', 'E34F26', 'html5', LOGO_COLOR_WHITE],
			['CSS3', '1572B6', 'css3', LOGO_COLOR_WHITE],
			['Tailwind CSS', '38B2AC', 'tailwind-css', LOGO_COLOR_WHITE],
			['Node.js', '43853D', 'node.js', LOGO_COLOR_WHITE],
			['Vue.js', '4FC08D', 'vue.js', LOGO_COLOR_WHITE],
			['.NET', '512BD4', LOGO_DOT_NET, LOGO_COLOR_WHITE],
			['Angular', 'DD0031', 'angular', LOGO_COLOR_WHITE],
			['Bootstrap', '563D7C', 'bootstrap', LOGO_COLOR_WHITE],
			['Vite', '646CFF', 'vite', LOGO_COLOR_WHITE],
		],
	],
	[
		'🗄️ Databases & Cloud',
		[
			['TURSO', '444444', 'turso', LOGO_COLOR_WHITE],
			['LibSQL', '444444', 'sqlite', LOGO_COLOR_WHITE],
			['SQLite', '003B57', 'sqlite', LOGO_COLOR_WHITE],
			['Drizzle', 'C5F74F', 'drizzle', LOGO_COLOR_BLACK],
			['PostgreSQL', '316192', 'postgresql', LOGO_COLOR_WHITE],
			['MySQL', '4479A1', 'mysql', LOGO_COLOR_WHITE],
			['Redis', 'DC382D', 'redis', LOGO_COLOR_WHITE],
			['AWS', COLOR_AWS, LOGO_AMAZON_AWS, LOGO_COLOR_WHITE],
			['Vercel', COLOR_BLACK, 'vercel', LOGO_COLOR_WHITE],
		],
	],
	[
		'🎮 Game Development',
		[
			['Godot', COLOR_GODOT, LOGO_GODOT_ENGINE, LOGO_COLOR_WHITE],
			['GDScript', COLOR_GODOT, LOGO_GODOT_ENGINE, LOGO_COLOR_WHITE],
			['Unity', COLOR_BLACK, 'unity', LOGO_COLOR_WHITE],
		],
	],
	[
		'📱 Mobile Development',
		[
			['Android', '3DDC84', 'android', LOGO_COLOR_WHITE],
			['iOS', COLOR_BLACK, 'ios', LOGO_COLOR_WHITE],
			['Flutter', '02569B', 'flutter', LOGO_COLOR_WHITE],
		],
	],
	[
		'🖥️ Desktop Development',
		[
			['Windows', COLOR_WINDOWS, 'windows', LOGO_COLOR_WHITE],
			['macOS', COLOR_BLACK, 'macos', LOGO_COLOR_WHITE],
			['Linux', 'FCC624', 'linux', LOGO_COLOR_BLACK],
		],
	],
	[
		'☁️ Infrastructure & Servers',
		[
			['PM2', '2B037A', 'pm2', LOGO_COLOR_WHITE],
			['VPS', COLOR_WINDOWS, 'windows', LOGO_COLOR_WHITE],
			['Ubuntu', 'E95420', 'ubuntu', LOGO_COLOR_WHITE],
			['CentOS', '262577', 'centos', LOGO_COLOR_WHITE],
			['Nginx', '009639', 'nginx', LOGO_COLOR_WHITE],
			['Apache', 'D22128', 'apache', LOGO_COLOR_WHITE],
			['AWS EC2', COLOR_AWS, LOGO_AMAZON_AWS, LOGO_COLOR_WHITE],
		],
	],
	[
		'📡 Web Servers & Proxies',
		[
			['Caddy', COLOR_BLACK, 'caddy', LOGO_COLOR_WHITE],
			['ngrok', '1F1E1E', 'ngrok', LOGO_COLOR_WHITE],
			["Let's Encrypt", '003A70', 'lets-encrypt', LOGO_COLOR_WHITE],
		],
	],
	[
		'🔧 Development Tools',
		[
			['Git', 'F05032', 'git', LOGO_COLOR_WHITE],
			['GitHub', '100000', 'github', LOGO_COLOR_WHITE],
			['npm', 'CB3837', 'npm', LOGO_COLOR_WHITE],
			['Lefthook', 'FF0000', 'git', LOGO_COLOR_WHITE],
			['tsx', '3178C6', 'typescript', LOGO_COLOR_WHITE],
			['Sharp', '99CC00', 'sharp', LOGO_COLOR_WHITE],
		],
	],
	[
		'🔍 Code Quality & Testing',
		[
			['Prettier', 'F7B93E', 'prettier', LOGO_COLOR_BLACK],
			['ESLint', '4B32C3', 'eslint', LOGO_COLOR_WHITE],
			['Vitest', '6E9F18', 'vitest', LOGO_COLOR_WHITE],
			['Playwright', '2EAD33', 'playwright', LOGO_COLOR_WHITE],
			['SonarCloud', 'F3702A', 'sonarcloud', LOGO_COLOR_WHITE],
		],
	],
	[
		'⌨️ IDEs & Editors',
		[
			['Cursor', COLOR_BLACK, 'cursor', LOGO_COLOR_WHITE],
			['VS Code', '007ACC', 'visual-studio-code', LOGO_COLOR_WHITE],
			['Android Studio', '3DDC84', 'android-studio', LOGO_COLOR_WHITE],
			['Xcode', '147EFB', 'xcode', LOGO_COLOR_WHITE],
			['Visual Studio', '5C2D91', 'visual-studio', LOGO_COLOR_WHITE],
			['IntelliJ IDEA', COLOR_BLACK, 'intellij-idea', LOGO_COLOR_WHITE],
			['PhpStorm', COLOR_BLACK, 'phpstorm', LOGO_COLOR_WHITE],
			['Eclipse', '2C2255', 'eclipse', LOGO_COLOR_WHITE],
		],
	],
	[
		'📚 Learning & Documentation',
		[
			['Markdown', COLOR_BLACK, 'markdown', LOGO_COLOR_WHITE],
			['mdsvex', COLOR_BLACK, 'markdown', LOGO_COLOR_WHITE],
		],
	],
]

function transform_to_categories(data: Array<CategoryData>): Array<Category> {
	return data.map(([title, badges]) => ({
		title,
		badges: badges.map(([name, color, logo, logo_color]) => ({
			name,
			url: create_badge_url({ name, color, logo, logo_color }),
		})),
	}))
}

export const TECH_STACK: Array<Category> = transform_to_categories(tech_stack_data)
