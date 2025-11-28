import type { Category } from '$lib/types/tech-stack'
import { CODE_QUALITY_AND_TESTING } from './tech-stack/code-quality-and-testing'
import { DATABASES_AND_CLOUD } from './tech-stack/databases-and-cloud'
import { DESKTOP_DEVELOPMENT } from './tech-stack/desktop-development'
import { DEVELOPMENT_TOOLS } from './tech-stack/development-tools'
import { GAME_DEVELOPMENT } from './tech-stack/game-development'
import { IDES_AND_EDITORS } from './tech-stack/ides-and-editors'
import { INFRASTRUCTURE_AND_SERVERS } from './tech-stack/infrastructure-and-servers'
import { LEARNING_AND_DOCUMENTATION } from './tech-stack/learning-and-documentation'
import { MOBILE_DEVELOPMENT } from './tech-stack/mobile-development'
import { PROGRAMMING_LANGUAGES } from './tech-stack/programming-languages'
import { WEB_SERVERS_AND_PROXIES } from './tech-stack/web-servers-and-proxies'
import { WEB_TECHNOLOGIES } from './tech-stack/web-technologies'

export const TECH_STACK: Array<Category> = [
	PROGRAMMING_LANGUAGES,
	WEB_TECHNOLOGIES,
	DATABASES_AND_CLOUD,
	GAME_DEVELOPMENT,
	MOBILE_DEVELOPMENT,
	DESKTOP_DEVELOPMENT,
	INFRASTRUCTURE_AND_SERVERS,
	WEB_SERVERS_AND_PROXIES,
	DEVELOPMENT_TOOLS,
	CODE_QUALITY_AND_TESTING,
	IDES_AND_EDITORS,
	LEARNING_AND_DOCUMENTATION,
]
