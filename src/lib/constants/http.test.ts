import { expect, test } from 'vitest'
import { HTTP_STATUS } from './http'

test('HTTP_STATUS.PERMANENT_REDIRECT is 308', () => {
	expect(HTTP_STATUS.PERMANENT_REDIRECT).toBe(308)
})
