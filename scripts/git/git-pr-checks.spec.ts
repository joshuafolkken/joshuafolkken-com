import { describe, expect, it } from 'vitest'
import { git_pr_checks, parse_repo_name_from_package, type RollupCheck } from './git-pr-checks'

const REPO_NAME = 'joshuafolkken-com'
const WORKERS_BUILDS_FOR_THIS_REPO = `Workers Builds: ${REPO_NAME}`
const CODE_RABBIT = 'CodeRabbit'
const SONAR_QUBE = 'SonarQube'
const WORKERS_BUILDS_NAME_PATTERN = /Workers Builds: joshuafolkken-com/u
const CODE_RABBIT_NAME_PATTERN = /CodeRabbit/u

const PASSING_ROLLUP: ReadonlyArray<RollupCheck> = [
	{ name: WORKERS_BUILDS_FOR_THIS_REPO, status: 'pass' },
	{ name: CODE_RABBIT, status: 'pass' },
	{ name: SONAR_QUBE, status: 'pass' },
]

describe('parse_repo_name_from_package', () => {
	it('returns the name field from package.json content', () => {
		expect(parse_repo_name_from_package('{"name":"joshuafolkken-com"}')).toBe(REPO_NAME)
	})

	it('throws when the name field is missing', () => {
		expect(() => parse_repo_name_from_package('{}')).toThrow()
	})

	it('throws when the name field is not a non-empty string', () => {
		expect(() => parse_repo_name_from_package('{"name":""}')).toThrow()
	})
})

describe('git_pr_checks.assert_required_checks_passed', () => {
	it('does not throw when all required checks pass for this repo', () => {
		expect(() => {
			git_pr_checks.assert_required_checks_passed(PASSING_ROLLUP)
		}).not.toThrow()
	})

	it('throws when the Workers Builds check carries a stale project suffix', () => {
		const stale_rollup: ReadonlyArray<RollupCheck> = [
			{ name: 'Workers Builds: tasks', status: 'pass' },
			{ name: CODE_RABBIT, status: 'pass' },
			{ name: SONAR_QUBE, status: 'pass' },
		]

		expect(() => {
			git_pr_checks.assert_required_checks_passed(stale_rollup)
		}).toThrow(WORKERS_BUILDS_NAME_PATTERN)
	})

	it('throws when a required check has not passed', () => {
		const pending_rollup: ReadonlyArray<RollupCheck> = [
			{ name: WORKERS_BUILDS_FOR_THIS_REPO, status: 'pass' },
			{ name: CODE_RABBIT, status: 'pending' },
			{ name: SONAR_QUBE, status: 'pass' },
		]

		expect(() => {
			git_pr_checks.assert_required_checks_passed(pending_rollup)
		}).toThrow(CODE_RABBIT_NAME_PATTERN)
	})
})
