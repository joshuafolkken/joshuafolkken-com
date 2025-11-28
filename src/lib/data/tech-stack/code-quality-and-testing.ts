import { category_utilities } from './utilities'

export const CODE_QUALITY_AND_TESTING = category_utilities.create_category(
	'🔍 Code Quality & Testing',
	[
		{
			name: 'Prettier',
			url: 'https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black',
		},
		{
			name: 'ESLint',
			url: 'https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white',
		},
		{
			name: 'Vitest',
			url: 'https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white',
		},
		{
			name: 'Playwright',
			url: 'https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white',
		},
		{
			name: 'SonarCloud',
			url: 'https://img.shields.io/badge/SonarCloud-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white',
		},
	],
)
